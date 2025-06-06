import { gerarAutoInfracao, gerarPlaca, dataHoje } from '../support/utils';

Cypress.Commands.add('cadastrarInfracao_NI_Anexo', () => {
    cy.get('input[ng-model="data.entidade.codigoInfracao"]').type('76331');
    cy.wait(1000)
    cy.get('input[ng-model="data.entidade.tipificacaoInfracao"]').click();
    cy.wait(1000)
    cy.get('select[ng-model="data.entidade.condutorIdentificado"]').select('Não'); 
    cy.get('select[ng-model="data.entidade.indicativoAssinatura"]').select('Não');
    cy.get('textarea[ng-model="data.entidade.observacao"]').type('Veículo = MS (Proprietário PF) - Condutor não identificado');
});

describe('Cadastro de auto - Condutor não identificado com Anexo', () => {
      
  beforeEach(() => {
    cy.fixture('automoveis.json').as('automoveis');
    cy.login(Cypress.env('usuario'), Cypress.env('senha'));
  })

  it('02_auto_manual_NI_Anexo.cy', () => {
    context('Veículo == MS / Proprietário PF', () => {
    const autoInfracao = gerarAutoInfracao();
    cy.get('@automoveis').then((dados) => {
      const automovel = dados.automoveis[0]; 
      cy.acessarCadastroAtendimento();
      cy.InformarDadosInfracao(autoInfracao, automovel.placa, automovel.cpfCnpj)
      cy.cadastrarInfracao_NI_Anexo();
      cy.incluirAgenteAutuador();
      context('Deve anexar um arquivo', () => {
        cy.contains('div.btn-success', 'Anexar').should('be.visible');        
        cy.get('input[type="file"]').selectFile('./cypress/Resolucao 262.pdf', { force: true });
        cy.get('[ng-switch="message.enableHtml"] > .ng-binding').should('contain', 'Arquivo anexado com sucesso');
      });
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
      cy.cadastrarInfracao_NI_Anexo();
      cy.incluirAgenteAutuador();
      context('Deve anexar um arquivo', () => {
        cy.contains('div.btn-success', 'Anexar').should('be.visible');        
        cy.get('input[type="file"]').selectFile('./cypress/Resolucao 262.pdf', { force: true });
        cy.get('[ng-switch="message.enableHtml"] > .ng-binding').should('contain', 'Arquivo anexado com sucesso');
      });
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
      cy.cadastrarInfracao_NI_Anexo();
      cy.incluirAgenteAutuador();
      context('Deve anexar um arquivo', () => {
        cy.contains('div.btn-success', 'Anexar').should('be.visible');        
        cy.get('input[type="file"]').selectFile('./cypress/Resolucao 262.pdf', { force: true });
        cy.get('[ng-switch="message.enableHtml"] > .ng-binding').should('contain', 'Arquivo anexado com sucesso');
      });
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
      cy.cadastrarInfracao_NI_Anexo();
      cy.incluirAgenteAutuador();
      context('Deve anexar um arquivo', () => {
       cy.contains('div.btn-success', 'Anexar').should('be.visible');        
       cy.get('input[type="file"]').selectFile('./cypress/Resolucao 262.pdf', { force: true });
       cy.get('[ng-switch="message.enableHtml"] > .ng-binding').should('contain', 'Arquivo anexado com sucesso');
       });
      cy.GravarAutoInfracao();
    });
  }); 
}); 
});
