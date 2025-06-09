import { gerarAutoInfracao, gerarPlaca, dataHoje } from '../support/utils';

Cypress.Commands.add('acessarAgenteDeTransito', () => {
  context('Acessar a tela de agente de trânsito', () => {
    cy.url().should('include', '/site/index');
    cy.wait(1000);

    // Etapa 1: Clicar no menu "INFRAÇÃO"
    cy.contains('a', 'INFRAÇÃO', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Etapa 2: Clicar no submenu "FISCALIZAÇÃO"
    cy.get('a[ng-click*="showHide"]').contains('FISCALIZAÇÃO').click();

    // Etapa 3: Clicar no item "AGENTE TRÂNSITO"
    cy.contains('a', 'AGENTE TRÂNSITO', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Etapa 4: Validar redirecionamento
    cy.url().should('include', '/agenteautuador');

    cy.get('input[ng-model="filtros.data.cpf"]')
  .type('89419120163', { delay: 100 });


    // Etapa 5: Abrir filtro
    cy.contains('button', 'Pesquisar').should('be.visible').click();
    cy.wait(1500);
  });
});

Cypress.Commands.add('editaRegistroExistente', () => {
  cy.contains('td', 'WANIA OLIVEIRA TAVEIRA DIOGO').and('contain', 'Ativo') // localiza a célula com o nome e CPF
    .parent('tr') // sobe para a linha da tabela
    .within(() => {
       cy.get('button[title="Desativar Registro"]').click();
    });  
  cy.wait(1000);

  // Confirma a exclusão do registro
  cy.contains('button', 'Sim').click();

  cy.contains('button', 'Pesquisar').should('be.visible').click();
  cy.wait(1500);
  cy.contains('td', 'WANIA OLIVEIRA TAVEIRA DIOGO').should('not.exist');
});


Cypress.Commands.add('excluiRegistroExistente', () => {
  cy.contains('td', 'WANIA OLIVEIRA TAVEIRA DIOGO') // localiza a célula com o nome
    .parent('tr') // sobe para a linha da tabela
    .within(() => {
       cy.get('button[title="Desativar Registro"]').click();
    });  
  cy.wait(1000);

  // Confirma a exclusão do registro
  cy.contains('button', 'Sim').click();

  cy.contains('button', 'Pesquisar').should('be.visible').click();
  cy.wait(1500);
  cy.contains('td', 'WANIA OLIVEIRA TAVEIRA DIOGO').should('not.exist');
});


describe('Pesquisa pelo Agente', () => {

  beforeEach(() => {
    cy.login(Cypress.env('usuario'), Cypress.env('senha'));
  })

  it('01_auto_manual_NI.cy', () => {
    context('Agente de Transito Pesquisa', () => {
      cy.acessarAgenteDeTransito();
      cy.excluiRegistroExistente();
    });
   });
});
