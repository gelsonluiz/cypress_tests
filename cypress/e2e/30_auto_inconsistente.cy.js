import { gerarAutoInfracao, gerarPlaca, dataHoje } from '../support/utils';
const agenteAutuador = Cypress.env('agente');

Cypress.Commands.add('cadastrarInfracaoManual', () => {
  context('Preencher campos do cadastro de autos inconsistentes manualmente', () => {
    cy.get('input[ng-model="data.entidade.veiculoPlaca"]').type('ADE0091');
    cy.get('input[ng-model="data.entidade.veiculoRenavam"]').type('600038823');

    cy.get('input[ng-model="data.descricaoMarca"]').type('DODGE DART COUPE{enter}');
    cy.contains('h3','Marca Modelo').should('be.visible')
    cy.contains('td', 'DODGE/DART COUPE').click();
    cy.wait(500)
    cy.get('select[ng-model="data.descricaoEspecie"]').select('PASSAGEIRO');
    cy.get('select[ng-model="data.entidade.veiculoUFEmplacamento"]').select('PR');
    cy.get('input[ng-model="dataModal.municipioVeiculoDescricao"]').clear().type('MARING{enter}');
    cy.wait(500)
    
    // Verifica se retornou a cidade correta
    cy.get('input[ng-model="dataModal.municipioVeiculoDescricao"]')
    .should('not.have.value', '') // garante que não está vazio
    .then(($input) => {
      const valor = $input.val();
      cy.log('Município:', valor);
      expect(valor).to.equal('MARINGA'); 
    });
  });
});

Cypress.Commands.add('cadastrarInfracaoAutomatico', () => {
  context('Preencher campos do cadastro de autos inconsistentes manualmente', () => {
    cy.get('input[ng-model="data.entidade.veiculoPlaca"]').type('ADE0091');
    cy.contains('a', 'Buscar na Base Nacional').click();
    cy.wait(3000);

  // Verifica se retornou o Renavan
  cy.get('input[ng-model="data.entidade.veiculoRenavam"]')
  .should('not.have.value', '') // garante que não está vazio
  .then(($input) => {
    const valor = $input.val();
    cy.log('Renavan:', valor);
    expect(valor).to.equal('675444594'); 
  });

  // Verifica se retornou o Descrição da Marca
  cy.get('input[ng-model="data.descricaoMarca"]')
  .should('not.have.value', '') // garante que não está vazio
  .then(($input) => {
    const valor = $input.val().trim();
    cy.log('Renavan:', valor);
    expect(valor).to.equal('IMP/ASIA TOWNER SDX'); 
  });

  // Verifica se retornou o tipo do automovel
  cy.get('select[ng-model="data.descricaoEspecie"]')
  .should('not.have.value', '') // garante que não está vazio
  .then(($select) => {
    const valor = $select.val().replace('string:', '').trim();
    cy.log('Tipo:', valor);
    expect(valor).to.equal('PASSAGEIRO'); 
  });

  // Verifica se retornou a UF
  cy.get('select[ng-model="data.entidade.veiculoUFEmplacamento"]')
  .should('not.have.value', '') // garante que não está vazio
  .then(($select) => {
    const valor = $select.val().replace('string:', '').trim();
    cy.log('UF:', valor);
    expect(valor).to.equal('PR'); 
  });

  // Verifica se retornou o município
  cy.get('input[ng-model="dataModal.municipioVeiculoDescricao"]')
  .should('not.have.value', '') // garante que não está vazio
  .then(($select) => {
    const valor = $select.val().replace('string:', '').trim();
    cy.log('Municpípio:', valor);
    expect(valor).to.equal('MARINGA'); 
  });
});
});

Cypress.Commands.add('cadastrarDadosInfracao', (autoInfracao, codigoInfracao) => {
  context('Preencher campos do cadastro de infracao', () => {
    cy.get('input[ng-model="data.entidade.numeroAutoInfracao"]').type(autoInfracao);
    cy.get('input[ng-model="data.entidade.dataInfracao"]').type('20/05/2025');
    cy.get('input[ng-model="data.entidade.horaInfracao"]').type('10:30');
    cy.get('input[ng-model="data.entidade.codigoMunicipioInfracao"]').type('9051');

    // Verifica se retornou o município correto
    cy.get('input[ng-model="dataModal.municipioDescricao"]')
    .should('not.have.value', '') // garante que não está vazio
    .then(($input) => {
      const valor = $input.val();
      cy.log('Município:', valor);
      expect(valor).to.equal('CAMPO GRANDE'); // opcional: verifica se é CAMPO GRANDE
    });

    cy.get('input[ng-model="data.entidade.matriculaAgenteAutuador"]').type(agenteAutuador);
    cy.get('input[ng-model="data.entidade.nomeAgenteAutuador"]').click();
    cy.wait(500);
    cy.get('select[ng-model="data.processoInfracaoTipoAutuador"]').select('112100 - DETRAN - MS');
    cy.informarInfracao(codigoInfracao);
    cy.get('select[ng-model="data.entidade.motivoInconsistente"]').eq(0).select('Rasurado');
    cy.get('textarea[ng-model="data.entidade.observacao"]').type('Lançamento de auto de infração inconsistente - Preenchimento de todos os campos.');
  });
});

Cypress.Commands.add('cadastrarDadosInfracaoApenasObrigatorios', (autoInfracao, codigoInfracao) => {
  context('Preencher campos do cadastro de infracao', () => {
    cy.get('input[ng-model="data.entidade.numeroAutoInfracao"]').type(autoInfracao);
    cy.get('input[ng-model="data.entidade.matriculaAgenteAutuador"]').type(agenteAutuador);
    cy.get('input[ng-model="data.entidade.nomeAgenteAutuador"]').click();
    cy.wait(500);
    cy.get('select[ng-model="data.entidade.motivoInconsistente"]').eq(0).select('Rasurado');
    cy.get('textarea[ng-model="data.entidade.observacao"]').type('Lançamento de auto de infração inconsistente - Preenchimento dos campos obrigatorios.');
  });
});


describe('Auto Inconsistente', () => {

  beforeEach(() => {
    cy.fixture('automoveis.json').as('automoveis');
    cy.login(Cypress.env('usuario'),Cypress.env('senha'));
  });

  it('Auto Inconsistente', () => {
    context('Preenchimento de todos os campos da tela - Veículo manual com anexo', () => {
      const autoInfracao = gerarAutoInfracao();
      cy.get('@automoveis').then((dados) => {
      const automovel = dados.automoveis[0]; 
      cy.acessarAutoInfracaoInconsistente();
        cy.cadastrarInfracaoManual()
        cy.cadastrarDadosInfracao(autoInfracao);      
        context('Deve anexar um arquivo', () => {
           cy.contains('div.btn-success', 'Anexar').should('be.visible');        
           cy.get('input[type="file"]').selectFile('./cypress/Resolucao 262.pdf', { force: true });
           cy.get('[ng-switch="message.enableHtml"] > .ng-binding').should('contain', 'Arquivo anexado com sucesso');
        });
        cy.gravarAuto();
      });
    });        

    context('Preencher apenas campos obrigatórios - veículo da base nacional', () => {
      const autoInfracao = gerarAutoInfracao();
      cy.get('a[href="#/inf/autoinconsistente"]').eq(0).should('have.text', 'CADASTRO').click();
      cy.url().should('include', '/autoinconsistente'); 
      cy.contains('button', 'Filtro').should('be.visible');
      cy.contains('button', 'Novo').click();
      cy.wait(1500);
      cy.cadastrarInfracaoAutomatico()
      cy.cadastrarDadosInfracaoApenasObrigatorios(autoInfracao, '76331');      
      cy.gravarAuto();
    });
  })
});