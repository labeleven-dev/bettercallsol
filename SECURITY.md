# Security Policy

## Supported Versions

The Alpha is currently being supported with security updates.

## Reporting a Vulnerability

If you encounter any security concerns, please follow _responsible disclosure_ and email security AT labeleven.dev.

## Exposure

The current iteration of this tool is a single-page application, statically hosted and with no backend (besides Solana itself), i.e. runs entirely in your browser.

* Wallets are accessed via [`@solana/wallet-adapter`](https://github.com/solana-labs/wallet-adapter) so the private keys or seeds are not exposed to the application.
* Only the app options are stored in the browser's local storage.
* Generated keypairs are stored in memory and do not survive page refreshes

## Best Practices

* Use a separate wallet than your main one to connect with Better Call SOL