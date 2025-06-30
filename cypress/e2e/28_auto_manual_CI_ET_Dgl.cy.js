import { gerarAutoInfracao, gerarPlaca, dataHoje } from '../support/utils';
const tipoTeste = Cypress.env('tipoTeste') || 'completo';

Cypress.Commands.add('cadastrarInfracao_CI_ET_Dlg', () => {
  cy.get('input[ng-model="data.entidade.codigoInfracao"]').type('51691');
  cy.wait(1000)
  cy.get('input[ng-model="data.entidade.tipificacaoInfracao"]').click();
  cy.wait(1000)

  // Verifica se retornou a multa correta
  cy.get('input[ng-model="data.entidade.tipificacaoInfracao"]')
  .should('not.have.value', '') // garante que não está vazio
  .then(($input) => {
    const valor = $input.val();
    cy.log('Multa:', valor);
    expect(valor).to.equal('Dirigir sob a influência de álcool'); 
  });

  cy.contains('h3', 'Unidade de medida da infração').should('be.visible')
  cy.contains('td', 'Dg/l').click();
  cy.wait(500)
  cy.get('input[ng-model="data.entidade.equipamentoInstrumentoAfericaoUtilizado"]').type('ETILOMETRO');
  cy.get('input[ng-model="data.entidade.medicaoRealizada"]').type('6.75');
  cy.get('input[ng-model="data.entidade.limiteRegulamentado"]').type('6.00');
  cy.get('input[ng-model="data.entidade.valorConsiderado"]').should('have.value', '6,75');
  cy.get('select[ng-model="data.entidade.condutorIdentificado"]').should('have.value', 'string:SIM');
  cy.get('select[ng-model="data.entidade.tipoCondutor"]').select('Habilitado');
  cy.get('input[ng-model="data.entidade.numeroDocumentoInfrator"]').type('02346318485');
  cy.wait(500);
  cy.get('select[ng-model="data.entidade.indicativoAssinatura"]').select('Não');
  cy.get('textarea[ng-model="data.entidade.observacao"]').type('Veículo MS (Proprietário PF) - Infrações que utilizam equipamentos eletrônicos - etilômetro.');
});

describe('Cadastro de auto - Teste alcoolemia Exame de sangue dl', () => {

  beforeEach(() => {
    cy.fixture('automoveis.json').as('automoveis');
    cy.login(Cypress.env('usuario'), Cypress.env('senha'));
  })

  it('09_auto_manual_CI_ET_Dgl.cy', () => {
    context('Veículo == MS / Proprietário PF', () => {
      const autoInfracao = gerarAutoInfracao();
      cy.get('@automoveis').then((dados) => {
        const automovel = dados.automoveis[0];
        cy.acessarCadastroAtendimento();
        cy.InformarDadosInfracao(autoInfracao, automovel.placa, automovel.cpfCnpj)
        cy.cadastrarInfracao_CI_ET_Dlg();
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
          cy.cadastrarInfracao_CI_ET_Dlg();
          cy.incluirAgenteAutuador();
          cy.GravarAutoInfracao();
        });
      });
      context('Veículo <> MS / Proprietário PF', () => {
        const autoInfracao = gerarAutoInfracao();
        cy.get('@automoveis').then((dados) => {
          const automovel = dados.automoveis[2];
          cy.get('#btnBack').should('be.visible').and('contain', 'Voltar').click();
          cy.wait(500);
          cy.contains('button', 'Novo').should('be.visible').click({ force: true });
          cy.wait(1500);
          cy.InformarDadosInfracao(autoInfracao, automovel.placa, automovel.cpfCnpj)
          cy.cadastrarInfracao_CI_ET_Dlg();
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
          cy.cadastrarInfracao_CI_ET_Dlg();
          cy.incluirAgenteAutuador();
          cy.GravarAutoInfracao();
        });
      });
    }
  });
});