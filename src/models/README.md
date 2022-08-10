Models
===

All TypeScript types and relevant mappers, intialisers, constants, etc. are housed here.

Each domain has its own file. In case of larger files, it may be split into multiple files with the same prefix, e.g. `internal-types.ts` and `internal-mappers.ts`. In which case:

* `*-types` contains the TypeScript types
* `*-mappers` contains functions to map to/from the domain model. Other domains typically map to/from `internal` (and occassionally `web3js`).

The following domains have been covered:

* `internal`: The common data model representing the internal state of a transaction, including its UI state
* `state`: The non-transaction, e.g. options, non-transaction UI state, etc., models.
* `preview`: The models and mappers, imported from the chain and previewed in "Import" palette
* `external`: The external representation of the transaction, used for export/share and corresponding import/load

In most cases, the interfaces are prefixed with an `I`, e.g. `ITransaction`, to distinguish them from their web3.js counter-part or the correpsonding React components.