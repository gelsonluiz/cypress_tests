import { gerarAutoInfracao, gerarPlaca, dataHoje } from '../support/utils';
const agenteAutuador = Cypress.env('agente');

Cypress.Commands.add('cadastrarInfracaoManual', () => {
  context('Preencher campos do cadastro de autos inconsistentes manualmente', () => {
    cy.get('input[ng-model="data.entidade.veiculoPlaca"]').type('REP5665');
    cy.get('input[ng-model="data.entidade.veiculoRenavam"]').type('600038823');

    cy.get('input[ng-model="data.descricaoMarca"]').type('DODGE DART COUPE{enter}');
    cy.contains('h3','Marca Modelo').should('be.visible')
    cy.contains('td', 'DODGE/DART COUPE').click();
    cy.wait(500)
    cy.get('select[ng-model="data.descricaoEspecie"]').select('PASSAGEIRO');
    cy.get('input[ng-model="dataModal.municipioVeiculoDescricao"]').clear().type('BATAG{enter}');
  });
});

Cypress.Commands.add('cadastrarInfracaoAutomatico', () => {
  context('Preencher campos do cadastro de autos inconsistentes manualmente', () => {
    cy.get('input[ng-model="data.entidade.veiculoPlaca"]').type('ADE0091');
    cy.contains('span', 'Buscar na Base Nacional').click();
    cy.wait(3000);
  });
});

Cypress.Commands.add('cadastrarDadosInfracao', (autoInfracao, codigoInfracao) => {
  context('Preencher campos do cadastro de infracao', () => {
    cy.get('input[ng-model="data.entidade.numeroAutoInfracao"]').type(autoInfracao);
    cy.get('input[ng-model="data.entidade.dataInfracao"]').type('20/05/2025');
    cy.get('input[ng-model="data.entidade.horaInfracao"]').type('10:30');
    cy.get('input[ng-model="data.entidade.codigoMunicipioInfracao"]').type('9051');
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