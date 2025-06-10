import { gerarAutoInfracao, gerarPlaca, dataHoje } from '../support/utils';

const tipoTeste = Cypress.env('tipoTeste') || 'parcial';

Cypress.Commands.add('cadastrarInfracao_CI_NH_RG', () => {
  cy.get('input[ng-model="data.entidade.codigoInfracao"]').type('76331');
  cy.wait(1000)
  cy.get('input[ng-model="data.entidade.tipificacaoInfracao"]').click();
  cy.wait(1000)
  cy.get('select[ng-model="data.entidade.condutorIdentificado"]').select('Sim'); // ou 'NAO' conforme opções visíveis
  cy.get('select[ng-model="data.entidade.tipoCondutor"]').select('Não Habilitado');
  cy.get('select[ng-model="data.entidade.tipoDocumento"]').select('Carteira Identidade');
  cy.get('input[ng-model="data.entidade.numeroDocumentoInfrator"]').type('36647829172');
  cy.get('input[ng-model="data.entidade.nomeCondutor"]').type('Joao da Silva');
  cy.get('select[ng-model="data.entidade.indicativoAssinatura"]').select('Não');
  cy.get('textarea[ng-model="data.entidade.observacao"]').type('Condutor identificado - Não Habilitado com documento RG');
});

describe('Cadastro de auto - Veículo = MS (Proprietário PF) - Condutor identificado - RG', () => {

  beforeEach(() => {
    cy.fixture('automoveis.json').as('automoveis');
    cy.login(Cypress.env('usuario'), Cypress.env('senha'));
  })

  it('06_auto_manual_CI_NH_RG.cy', () => {
    context('Veículo == MS / Proprietário PF', () => {
      const autoInfracao = gerarAutoInfracao();
      cy.get('@automoveis').then((dados) => {
        const automovel = dados.automoveis[0];
        cy.acessarCadastroAtendimento();
        cy.InformarDadosInfracao(autoInfracao, automovel.placa, automovel.cpfCnpj)
        cy.cadastrarInfracao_CI_NH_RG();
        cy.incluirAgenteAutuador();
        cy.GravarAutoInfracao();
      });
    });
    if (tipoTeste === 'completo') {
      context('Veículo == MS / Proprietário PJ', () => {
        const autoInfracao = gerarAutoInfracao();
        cy.get('@automoveis').then((dados) => {
          const automovel = dados.automoveis[1];
          cy.get('#btnBack').should('be.visible').and('contain', 'Voltar').click();
          cy.wait(500);
          cy.contains('button', 'Novo').should('be.visible').click({ force: true });
          cy.wait(1500);
          cy.InformarDadosInfracao(autoInfracao, automovel.placa, automovel.cpfCnpj)
          cy.cadastrarInfracao_CI_NH_RG();
          cy.incluirAgenteAutuador();
          cy.GravarAutoInfracao();
        });
      });
      context('Veículo <> MS / Proprietário PJ', () => {
        const autoInfracao = gerarAutoInfracao();
        cy.get('@automoveis').then((dados) => {
          const automovel = dados.automoveis[2];
          cy.get('#btnBack').should('be.visible').and('contain', 'Voltar').click();
          cy.wait(500);
          cy.contains('button', 'Novo').should('be.visible').click({ force: true });
          cy.wait(1500);
          cy.InformarDadosInfracao(autoInfracao, automovel.placa, automovel.cpfCnpj)
          cy.cadastrarInfracao_CI_NH_RG();
          cy.incluirAgenteAutuador();
          cy.GravarAutoInfracao();
        });
      });
      context('Veículo <> MS / Proprietário PJ', () => {
        const autoInfracao = gerarAutoInfracao();
        cy.get('@automoveis').then((dados) => {
          const automovel = dados.automoveis[3];
          cy.get('#btnBack').should('be.visible').and('contain', 'Voltar').click();
          cy.wait(500);
          cy.contains('button', 'Novo').should('be.visible').click({ force: true });
          cy.wait(1500);
          cy.InformarDadosInfracao(autoInfracao, automovel.placa, automovel.cpfCnpj)
          cy.cadastrarInfracao_CI_NH_RG();
          cy.incluirAgenteAutuador();
          cy.GravarAutoInfracao();
        });
      });
    }
  });
});