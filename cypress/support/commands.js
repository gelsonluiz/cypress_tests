import 'cypress-file-upload';


Cypress.Commands.add('login', (usuario, senha) => {
    cy.visit('https://dev.detran.ms.gov.br/detran/public/login/index.html');
    cy.get('#usuario').type(usuario);
    cy.get('#password').type(senha, { sensitive: true });
    cy.get('#btnAcessar').click();
    cy.wait(2000); 
});


//cy.loginViaUi({name: Cypress.env('usuario'),password: Cypress.env('senha')});
Cypress.Commands.add('loginViaUi', (user) => {
  cy.session(user,() => {
      cy.visit('public/login/index.html')
      cy.get('#usuario').type(user.name);
      cy.get('#password').type(user.password, { sensitive: true });
      cy.get('#btnAcessar').click();
      cy.getCookies().then(cookies => {
         console.log(cookies); // veja os cookies criados
      });
  })
})


Cypress.Commands.add('validaTelaPesquisaAutoInfracaoManual', () => {
  cy.contains('a', 'FILTRO', { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')
    .click();
} );


Cypress.Commands.add('validaTelaServicosAtendimento', () => {
    // Valida se o auto foi cadastrado corretamente.
    // Verificando e se avançou para a próxima etapa
    // e se o campo Atendimento foi preenchido com um número.
    cy.url().should('include', 'servicosatendimento');
    cy.get('input[ng-model="data.entidade.atendimento"]')
    .invoke('val')
    .should('match', /^\d+$/); 
});

Cypress.Commands.add('acessarCadastroAtendimento', () => {
  context('Acessar a tela de auto de infração manual', () => {
    cy.url().should('include', '/site/index'); // valida que a URL contém '/login'
    cy.wait(3000); // espera 2 segundos para garantir que a página carregou

    cy.contains('a', 'INFRAÇÃO', { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')
    .click();

    cy.contains('a', 'AUTO INFRAÇÃO', { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')
    .click();

    // Acessa a tela de Auto de Infração Manual
    // cy.contains('a', 'AUTO DE INFRAÇÃO MANUAL', { timeout: 10000 })
    // .scrollIntoView()
    //  .should('be.visible')
    //  .click();
    //cy.url().should('include', '/autoinfracaomanual'); 

    // Acessa a tela de Auto de Infração Manual pelo atendimento
    cy.get('a[href="#/atd/inf/atendimento"]').eq(0).should('have.text', 'ATENDIMENTO').click();
    cy.url().should('include', '/atendimento'); 

    cy.contains('button', 'Filtro').should('be.visible');

    cy.contains('button', 'Novo').click();
    cy.wait(1500);
  })
});

Cypress.Commands.add('acessarAutoInfracaoInconsistente', () => {
    context('Acessar a tela de auto de infração inconsitente', () => {
      cy.url().should('include', '/site/index'); // valida que a URL contém '/login'
      cy.wait(3000); // espera 2 segundos para garantir que a página carregou

      cy.contains('a', 'INFRAÇÃO', { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .click();
      cy.contains('a', 'AUTO INFRAÇÃO INCONSISTENTE', { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .click();
      cy.get('a[href="#/inf/autoinconsistente"]').eq(0).should('have.text', 'CADASTRO').click();
      cy.url().should('include', '/autoinconsistente'); 
      cy.contains('button', 'Filtro').should('be.visible');
      cy.contains('button', 'Novo').click();
      cy.wait(1500);
    })
});


Cypress.Commands.add('InformarDadosInfracao', (autoInfracao, placa, cpfCnpj) => {
  context('Informar placa do veículo', () => {
    cy.get('input[ng-model="data.entidade.veiculoPlaca"]').type(placa);
    cy.get('input[ng-model="data.entidade.numeroAutoInfracao"]').click();
    cy.wait(3000); 

    // Verifica se o RENAVAM foi preenchido
    cy.get('input[ng-model="data.entidade.veiculoRenavam"]')
    .should('not.have.value', '') // garante que não está vazio
    .then(($input) => {
      const valor = $input.val();
      cy.log('RENAVAM preenchido:', valor);
      expect(valor).to.match(/^\d+$/); // opcional: verifica se é numérico
    });

    cy.get('input[ng-model="data.entidade.numeroAutoInfracao"]').type(autoInfracao);
    cy.get('select[ng-model="data.entidade.tipoAutoInfracao"]').select('Manual');
    cy.get('input[ng-model="data.entidade.localInfracao"]').type('Avenida Brasil');
    cy.get('input[ng-model="data.entidade.dataInfracao"]').type('20/05/2025');
    cy.get('input[ng-model="data.entidade.horaInfracao"]').type('14:30');    
    cy.get('input[ng-model="data.entidade.codigoMunicipioInfracao"]').type('9051');
    cy.get('input[ng-model="dataModal.municipioDescricao"]').click();
  });
});

Cypress.Commands.add('incluirAgenteAutuador', () => {
  cy.get('input[ng-model="data.entidade.matriculaAgenteAutuador"]').type('651611312');
  cy.get('input[ng-model="data.entidade.nomeAgenteAutuador"]').click();
  cy.wait(500);
  cy.get('select[ng-model="data.processoInfracaoTipoAutuador"]').select('112100 - DETRAN - MS');
  cy.wait(500);
});

Cypress.Commands.add('gravarAuto', () => {
  cy.get('a.btn.btn-success')
  .contains('Gravar')
  .should('not.be.disabled')
  .should('be.visible')
  .click();

  // espera o loader aparecer e depois sumir
  cy.get('.loading').should('exist');
  cy.get('.loading', { timeout: 30000 }).should('not.exist');
  cy.get('[ng-switch="message.enableHtml"] > .ng-binding').should('contain', 'Operação realizada com sucesso.');
  cy.wait(500); 
  cy.screenshot('auto_infracao_gravado');
});

Cypress.Commands.add('GravarAutoInfracao', () => {
  cy.gravarAuto();
  //Verifica se o auto foi cadastrado corretamente e se avançou para a próxima etapa
  cy.url().should('include', 'servicosatendimento');
  cy.get('input[ng-model="data.entidade.atendimento"]')
  .invoke('val')
  .should('match', /^\d+$/); 
});

Cypress.Commands.add('informarInfracao', (codigoInfracao) => {
  cy.log('Informar Infracao: ' + codigoInfracao);
  if (codigoInfracao === undefined || codigoInfracao === null) {
    cy.get('input[ng-model="data.entidade.tipificacaoInfracao"]').type('celular{enter}');
    cy.contains('h3','Infração').should('be.visible')
    cy.contains('td', 'Dirigir veículo segurando telefone celular').click();
    cy.wait(500)
  } else {
    cy.get('input[ng-model="data.entidade.codigoInfracao"]').type(codigoInfracao);
    cy.wait(500)
    cy.get('input[ng-model="data.entidade.tipificacaoInfracao"]').click();
    cy.wait(500);
  }
});


