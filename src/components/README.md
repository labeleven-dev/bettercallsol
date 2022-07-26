React Components
===

There are too distinct component types in this application:

* Re-usable components, stored in `common/` folders, and
* Everything else that compose the application and not particularly reusable.

Each domain can have its own `common` folder for reusable components that only used in that domain. The top-level `common` folder is reserved for cross-domain reusable components.

Top-level domains:

* `client`: The main pane where transactions are compose and executed. Entry-point: `client/Transaction.tsx`
* `options`: The Options modal to configure settings. Entry-point: `options/Options.tsx`
* `palette`: The right-hand sidebar. Entry-point: `palette/Palette.tsx`