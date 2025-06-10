const tipoTeste = Cypress.env('tipoTeste') || 'parcial';


Cypress.Commands.add('acessarAgenteDeTransito', () => {
  context('Acessar a tela de agente de trânsito', () => {
    cy.log(tipoTeste);
    cy.url().should('include', '/site/index');
    cy.wait(1000);

    // Etapa 1: Clicar no menu "INFRAÇÃO"
    cy.contains('a', 'INFRAÇÃO', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Etapa 2: Clicar no submenu "FISCALIZAÇÃO"
    cy.get('[ng-click*="showHide"]').contains('FISCALIZAÇÃO').click();

    // Etapa 3: Clicar no item "AGENTE TRÂNSITO"
    cy.contains('a', 'AGENTE TRÂNSITO', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Etapa 4: Validar redirecionamento
    cy.url().should('include', '/agenteautuador');
  });
});


describe('Testes de cadastro de Agente de trânsito', () => {
  beforeEach(() => {
    cy.login(Cypress.env('usuario'), Cypress.env('senha'));
  })

  it('Testes de cadastro de Agente de trânsito', () => {
    context('Pesquisa agente de trânsito', () => {
      cy.acessarAgenteDeTransito();
      cy.get('input[ng-model="filtros.data.cpf"]').type('89419120163', { delay: 100 });
      cy.get('select[ng-model="filtros.data.ativo"]').select('Ativo');
      // Etapa 5: Abrir filtro
      cy.contains('button', 'Pesquisar').should('be.visible').click();
      cy.wait(1500);
    });

    context('Cancela agente de trânsito localizado)', () => {
      cy.contains('td', 'WANIA OLIVEIRA TAVEIRA DIOGO') // localiza a célula com o nome
        .parent('tr') // sobe para a linha da tabela
        .within(() => {
          cy.get('button[title="Desativar Registro"]').click();
        });
      cy.wait(1000);
      cy.contains('button', 'Sim').click();
      cy.get('[ng-switch="message.enableHtml"] > .ng-binding').should('contain', 'Desativação realizada com sucesso.');
      cy.wait(500);
    });

    context('Tenta cadastrar novo agente de trânsito com data errada', () => {
      // Acessa a tela de cadastro de agente de trânsito
      cy.contains('button', 'Novo').should('be.visible').click();
      cy.wait(1500);
      cy.get('input[ng-model="dataModal.consultaPessoaCpfCnpj"]').type('89419120163{enter}', { delay: 100 });
      cy.get('input[ng-model="dataModal.orgaoAutuador"]').type('DETRAN{enter}', { delay: 100 });
      cy.get('input[ng-model="data.entidade.email"]').type('noemail@inovvati.com.br');
      cy.get('input[ng-model="data.entidade.matricula"]').type('123456');
      cy.get('input[ng-model="data.entidade.dataInicio"]').type('05/06/2026');
      cy.get('input[ng-model="data.entidade.dataValidadeCurso"]').type('30/06/2025');
      cy.get('select[ng-model="data.entidade.tipoAgente"]').select('Detran');
      cy.get('input[ng-model="data.entidade.publicacaoDoe"]').type('111222333');
      cy.get('a.btn.btn-success')
        .contains('Gravar')
        .should('not.be.disabled')
        .should('be.visible')
        .click();
      // espera o loader aparecer e depois sumir
      cy.get('[ng-switch="message.enableHtml"] > .ng-binding').should('contain', 'Data de Início do Curso deve ser inferior a Data Atual');
      cy.wait(500);
      //cy.screenshot('Mensagem_data_inicio_maior_que_final');
    });

    context('Cadastrar novo agente de trânsito incompleto', () => {
      cy.get('a[ng-click="new()"]').click();
      cy.get('input[ng-model="dataModal.consultaPessoaCpfCnpj"]').type('89419120163{enter}', { delay: 100 });
      cy.get('input[ng-model="dataModal.orgaoAutuador"]').type('DETRAN{enter}', { delay: 100 });
      cy.get('input[ng-model="data.entidade.matricula"]').type('123456');
      cy.get('input[ng-model="data.entidade.matricula"]').clear();
      cy.get('input[ng-model="data.entidade.dataInicio"]').type('05/06/2026');
      cy.get('input[ng-model="data.entidade.dataValidadeCurso"]').type('30/06/2025');
      cy.get('select[ng-model="data.entidade.tipoAgente"]').select('Detran');
      cy.get('input[ng-model="data.entidade.publicacaoDoe"]').type('111222333');
      cy.get('a.btn.btn-success')
        .contains('Gravar')
        .should('not.be.disabled')
        .should('be.visible')
        .click();
      // espera o loader aparecer e depois sumir
      cy.get('[ng-switch="message.enableHtml"] > .ng-binding').should('contain', 'Matrícula é obrigatório.');
      cy.wait(500);
      //cy.screenshot('Mensagem_data_inicio_maior_que_final');
    });


    if (tipoTeste === 'completo') {
      context('Cadastrar novo agente de trânsito', () => {
        cy.get('a[ng-click="new()"]').click();
        cy.get('input[ng-model="dataModal.consultaPessoaCpfCnpj"]').type('89419120163{enter}', { delay: 100 });
        cy.get('input[ng-model="dataModal.orgaoAutuador"]').type('DETRAN{enter}', { delay: 100 });
        cy.get('input[ng-model="data.entidade.email"]').type('noemail@inovvati.com.br');
        cy.get('input[ng-model="data.entidade.matricula"]').type('123456');
        cy.get('input[ng-model="data.entidade.dataInicio"]').type('05/06/2026');
        cy.get('input[ng-model="data.entidade.dataValidadeCurso"]').type('30/06/2025');
        cy.get('select[ng-model="data.entidade.tipoAgente"]').select('Detran');
        cy.get('input[ng-model="data.entidade.publicacaoDoe"]').type('111222333');
        cy.get('a.btn.btn-success')
          .contains('Gravar')
          .should('not.be.disabled')
          .should('be.visible')
          .click();
        // espera o loader aparecer e depois sumir
        cy.get('[ng-switch="message.enableHtml"] > .ng-binding').should('contain', 'Operação realizada com sucesso.');
        cy.wait(500);
        cy.screenshot('Gravação_com_sucesso');
      })
    } else {
      cy.acessarAgenteDeTransito();
      cy.get('a.btn.btn-info')
        .contains('Voltar')
        .should('not.be.disabled')
        .should('be.visible')
        .click();

      cy.get('input[ng-model="filtros.data.cpf"]').type('89419120163', { delay: 100 });
      cy.get('input[ng-model="filtros.data.dataValidade"]').type('15/09/2050');
      cy.get('select[ng-model="filtros.data.ativo"]').select('Desativado');

      cy.contains('button', 'Pesquisar').should('be.visible').click();
      cy.wait(500);
      
      cy.contains('td', 'WANIA OLIVEIRA TAVEIRA DIOGO') // localiza a célula com o nome
        .parent('tr') // sobe para a linha da tabela
        .within(() => {
          cy.get('button[title="Reativar Registro"]').click();
        });
      cy.wait(1000);
      cy.contains('button', 'Sim').click();
      cy.get('[ng-switch="message.enableHtml"] > .ng-binding').should('contain', 'Desativação realizada com sucesso.');
      cy.wait(500);

    }
  });
});
