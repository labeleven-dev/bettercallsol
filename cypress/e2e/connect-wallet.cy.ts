/// <reference types="cypress" />

import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PhantomWallet } from "../utils/mock-wallet/phantom/types";
import { DEVNET } from "../utils/mock-wallet/phantom/phan-wallet-mock";

let wallet: PhantomWallet | undefined;

before(() => {
  cy.visit("/");
  cy.window().then((win) => {
    wallet = win.solana;
    cy.log("wallet", wallet);
    cy.log("payer keypair", wallet.publicKey.toBase58());
  });
});

describe("Connect Wallet", () => {
  it("connect wallet", () => {
    cy.get(".wallet-adapter-button-trigger").click();
    cy.get(".wallet-adapter-modal-list")
      .children("li")
      .children("button.wallet-adapter-button")
      .first()
      .click();
    cy.get(".wallet-adapter-button-trigger").click("center");
    cy.get(".wallet-adapter-button.wallet-adapter-button-trigger")
      .should(
        "contain.text",
        `${wallet.publicKey.toBase58().slice(0, 4)}..${wallet.publicKey
          .toBase58()
          .slice(-4)}`
      )
      .then(async () => {
        cy.log("wallet connect", wallet.isConnected);
        cy.log("wallet connection url", wallet.connectionURL);
        cy.log("wallet publicKey", wallet.publicKey.toBase58());
        let balance = await wallet.getBalance("confirmed");
        cy.log("wallet balance", balance);

        assert(wallet.isConnected === true);
        assert(wallet.connectionURL === DEVNET);
      });
  });
});
