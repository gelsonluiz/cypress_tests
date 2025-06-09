import { gerarAutoInfracao, gerarPlaca, dataHoje } from '../support/utils';

Cypress.Commands.add('cadastrarInfracao_CI_ET_Mlg', () => {
  cy.get('input[ng-model="data.entidade.codigoInfracao"]').type('51691');
    cy.wait(1000)
    cy.get('input[ng-model="data.entidade.tipificacaoInfracao"]').click();
    cy.wait(1000)
  cy.contains('h3','Unidade de medida da infração').should('be.visible')
  cy.contains('td', 'Mg/l').click();
  cy.wait(500)
  cy.get('input[ng-model="data.entidade.equipamentoInstrumentoAfericaoUtilizado"]').type('ETILOMETRO');
  cy.get('input[ng-model="data.entidade.medicaoRealizada"]').type('1.75'); 
  cy.get('input[ng-model="data.entidade.limiteRegulamentado"]').type('0.75');
  cy.get('input[ng-model="data.entidade.valorConsiderado"]').should('have.value', '1,75');
  cy.get('select[ng-model="data.entidade.condutorIdentificado"]').should('have.value','string:SIM');
  cy.get('select[ng-model="data.entidade.tipoCondutor"]').select('Habilitado');
  cy.get('input[ng-model="data.entidade.numeroDocumentoInfrator"]').type('00330851101');
  cy.wait(500);
  cy.get('select[ng-model="data.entidade.indicativoAssinatura"]').select('Não');
  cy.get('textarea[ng-model="data.entidade.observacao"]').type('Veículo MS (Proprietário PF) - Infrações que utilizam equipamentos eletrônicos - etilômetro.');
});

describe('Cadastro de auto - Veículo = MS (Proprietário PJ) - Condutor não identificado', () => {
      
  beforeEach(() => {
    cy.fixture('automoveis.json').as('automoveis');
    cy.login(Cypress.env('usuario'), Cypress.env('senha'));
  })

  it('08_auto_manual_CI_EL_Mgl.cy', () => {
    context('Veículo == MS / Proprietário PF', () => {
    const autoInfracao = gerarAutoInfracao();
    cy.get('@automoveis').then((dados) => {
      const automovel = dados.automoveis[0]; 
      cy.acessarCadastroAtendimento();
      cy.InformarDadosInfracao(autoInfracao, automovel.placa, automovel.cpfCnpj)
      cy.cadastrarInfracao_CI_ET_Mlg();
      cy.incluirAgenteAutuador();
      cy.GravarAutoInfracao();
    });
    }); 
    context('Veículo == MS / Proprietário PJ', () => {
    const autoInfracao = gerarAutoInfracao();
    cy.get('@automoveis').then((dados) => {
      const automovel = dados.automoveis[1]; 
      cy.get('#btnBack').should('be.visible').and('contain', 'Voltar').click();
      cy.wait(500);
      cy.contains('button', 'Novo').should('be.visible').click({ force: true });
      cy.wait(1500);
      cy.InformarDadosInfracao(autoInfracao, automovel.placa, automovel.cpfCnpj)
      cy.cadastrarInfracao_CI_ET_Mlg();
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
      cy.cadastrarInfracao_CI_ET_Mlg();
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
      cy.cadastrarInfracao_CI_ET_Mlg();
      cy.incluirAgenteAutuador();
      cy.GravarAutoInfracao();
    });
  }); 
});  
});