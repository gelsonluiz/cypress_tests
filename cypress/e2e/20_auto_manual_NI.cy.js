import { gerarAutoInfracao } from '../support/utils';
const tipoTeste = Cypress.env('tipoTeste') || 'completo';
const ambiente = Cypress.env('ambiente') || 'dev';

Cypress.Commands.add('cadastrarInfracao_NI', () => {
    cy.get('input[ng-model="data.entidade.codigoInfracao"]').type('76331');
    cy.wait(1000)
    cy.get('input[ng-model="data.entidade.tipificacaoInfracao"]').click();
    cy.wait(2000)

    // Verifica se retornou a multa correta
    cy.get('input[ng-model="data.entidade.tipificacaoInfracao"]')
    .should('not.have.value', '') // garante que não está vazio
    .then(($input) => {
      const valor = $input.val();
      cy.log('Multa:', valor);
      expect(valor).to.equal('Dirigir veículo segurando telefone celular'); 
    });

    cy.get('select[ng-model="data.entidade.condutorIdentificado"]').select('Não'); 
    cy.get('select[ng-model="data.entidade.indicativoAssinatura"]').should('be.disabled');
    cy.get('textarea[ng-model="data.entidade.observacao"]').type('Veículo = MS (Proprietário PJ) - Condutor não identificado');
});

describe('Condutor não identificado', () => {

  beforeEach(() => {
    cy.fixture('automoveis.json').as('automoveis');
    cy.login(Cypress.env('usuario'), Cypress.env('senha'));
  })

  it('01_auto_manual_NI.cy', () => {
    context('Veículo == MS / Proprietário PJ', () => {
      cy.log(tipoTeste)
      const autoInfracao = gerarAutoInfracao();
      cy.get('@automoveis').then((dados) => {
      const automovel = dados.automoveis[1]; 
      cy.acessarCadastroAtendimento()
      cy.InformarDadosInfracao(autoInfracao, automovel.placa, automovel.cpfCnpj)
      cy.cadastrarInfracao_NI();
      cy.incluirAgenteAutuador();
      cy.GravarAutoInfracao();
      })
    });
    
    if (tipoTeste === 'completo') {
      context('Veículo == MS / Proprietário PF', () => {
        cy.log('entrou');
        const autoInfracao = gerarAutoInfracao();
        cy.get('@automoveis').then((dados) => {
        const automovel = dados.automoveis[0]; 
        cy.get('#btnBack').should('be.visible').and('contain', 'Voltar').click();
        cy.wait(500);
        cy.contains('button', 'Novo').should('be.visible').click({ force: true });
        cy.wait(1500);
        cy.InformarDadosInfracao(autoInfracao, automovel.placa, automovel.cpfCnpj)
        cy.cadastrarInfracao_NI();
        cy.incluirAgenteAutuador();
        cy.GravarAutoInfracao();
        })
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
        cy.cadastrarInfracao_NI();
        cy.incluirAgenteAutuador();
        cy.GravarAutoInfracao();
        })
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
        cy.cadastrarInfracao_NI();
        cy.incluirAgenteAutuador();
        cy.GravarAutoInfracao();
        })
      });      
    };
   });
});
