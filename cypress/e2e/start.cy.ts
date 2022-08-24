/// <reference types="cypress" />

describe("Start", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("check local storage", () => {
    cy.window()
      .its("localStorage.bcsol-store")
      .then(($store) => {
        cy.log($store);
        expect($store.includes("transactionOptions")).to.equal(true);
        expect($store.includes("appOptions")).to.equal(true);
        expect($store.includes("firstTime")).to.equal(true);
      });
  });
});
