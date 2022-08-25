/// <reference types="cypress" />

import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PhantomWallet } from "../utils/mock-wallet/phantom/types";
import { DEVNET } from "../utils/mock-wallet/phantom/phan-wallet-mock";
import { EXAMPLES } from "../../src/library/examples";

let wallet: PhantomWallet | undefined;

before(() => {
  cy.visit("/");
  cy.window().then((win) => {
    wallet = win.solana;
    cy.log("wallet", wallet);
    cy.log("payer keypair", wallet.publicKey.toBase58());
  });
});

describe("Run Example", () => {
  it("Connect Wallet", () => {
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

        assert(wallet.isConnected === true);
        assert(wallet.connectionURL === DEVNET);
      });
  });

  it("Load Example: Transfer SOL", async () => {
    let exampleName = "systemProgramTransfer";
    cy.get("[data-cy=example-btn]").click();
    cy.get(`[data-cy=example-${exampleName}]`).click();

    let example = EXAMPLES[exampleName];
    for (let instruction of example.transaction.instructions) {
      let index = example.transaction.instructions.indexOf(instruction);
      cy.get(`[id=program-id-${index}]`)
        .invoke("val")
        .should("eq", instruction.programId);
      for (let account of instruction.accounts) {
        let accountIndex = instruction.accounts.indexOf(account);

        if (account.type.type == "wallet") {
          // if account type is wallet, click the magic wand
          cy.get(`[id=account-input-group-${index}-${accountIndex}]`)
            .find("[aria-label=Auto-fill]")
            .click();
          cy.get(`[id=account-${index}-${accountIndex}]`)
            .invoke("val")
            .should("eq", wallet.publicKey.toBase58());
          // click airdrop 1
          cy.get(`[id=account-input-group-${index}-${accountIndex}]`)
            .find('[aria-label="Airdrop SOL"]')
            .click();
          cy.get("button")
            .contains("Airdrop")
            .click()
            .wait(5000)
            .then(async () => {
              let balance = await wallet.getBalance("confirmed");
              assert(
                balance === LAMPORTS_PER_SOL,
                `expected ${balance} balance to equal **${LAMPORTS_PER_SOL}`
              );
            });
        } else {
          cy.get(`[id=account-${index}-${accountIndex}]`)
            .invoke("val")
            .should("eq", account.pubkey);
        }
      }
    }

    // send transaction
    cy.get("[id=root]").click();
    cy.get('[aria-label="Run Program"]').click().wait(10000);
    // todo: somehow monitor the value instead of retries?
    cy.get("[id=signature]")
      .invoke({ timeout: 25000 }, "text")
      .then(async (signature: string) => {
        assert(
          signature ===
            wallet.transactionSignatures[
              wallet.transactionSignatures.length - 1
            ],
          `expected ${signature} signature to equal **${
            wallet.transactionSignatures[
              wallet.transactionSignatures.length - 1
            ]
          }`
        );

        let transaction = await wallet.getConfirmedTransaction(
          signature,
          "confirmed"
        );

        cy.log("", transaction.meta.logMessages);

        assert(
          transaction.meta.logMessages[0] ===
            "Program 11111111111111111111111111111111 invoke [1]",
          `expected ${
            transaction.meta.logMessages[0]
          } message to equal **${"Program 11111111111111111111111111111111 invoke [1]"}`
        );
        assert(
          transaction.meta.logMessages[1] ===
            "Program 11111111111111111111111111111111 success",
          `expected ${
            transaction.meta.logMessages[1]
          } message to equal **${"Program 11111111111111111111111111111111 success"}`
        );
      });
  });
});
