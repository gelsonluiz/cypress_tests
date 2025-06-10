const { defineConfig } = require("cypress");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://dev.detran.ms.gov.br/detran/", 
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      reporterEnabled: "cypress-mochawesome-reporter, mocha-junit-reporter",
      mochaJunitReporterReporterOptions: {
        mochaFile: "cypress/reports/junit/results-[hash].xml", // onde os arquivos XML vão
        toConsole: true, // exibe os resultados no console
      },
      cypressMochawesomeReporterReporterOptions: {
        charts: true,
        reportPageTitle: "Relatório de Testes Cypress",
        embeddedScreenshots: true,
        inlineAssets: true,
        saveAllAttempts: true, // salva todas as tentativas de teste
        overwrite: true,
        html: true,
        json: true
      },
    },
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on); // plugin do Mochawesome
      allureWriter(on, config); // plugin do Allure
      return config;
    },
    // Configuração do Cypress
  },

  // Diretórios de artefatos
  screenshotsFolder: "cypress/screenshots/",
  videosFolder: "cypress/videos/",
  // grava vídeo dos testes
  video: true,
  // aumenta o timeout se necessário
  defaultCommandTimeout: 8000,
  pageLoadTimeout: 60000,
});
