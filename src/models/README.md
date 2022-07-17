Models
===

All data models and related mappers/utilities, used in this application, are defined here.

* `web3.ts`: The internal representation of web3.js objects, the common (intermediate) transaction data models, that are mapped to other models. These are also used to track the transaction-specific application global state.
* `state.ts`: The non-transaction application global state

In most cases, the interfaces are prefixed with an `I`, e.g. `ITransaction`, to distinguish them from their web3.js counter-part or the correpsonding React component.