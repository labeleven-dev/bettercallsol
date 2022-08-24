// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

import AUTWindow = Cypress.AUTWindow;
import {
  DEVNET,
  initWalletMockProvider,
} from "../utils/mock-wallet/phantom/phan-wallet-mock";

Cypress.on("window:before:load", (win: AUTWindow) => {
  initWalletMockProvider(win, DEVNET);
});

before(() => {});

beforeEach(() => {
  // Cypress commands you would like to run before every single Cypress test.
  cy.clearLocalStorage();
});
