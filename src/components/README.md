React Components
===

There are too distinct component types in this application:

* Re-usable components, stored in `common/` folder, and
* Everything else that compose the application and not particularly reusable.

For the latter, some components are grouped by their purpose:

* `client/`: The client pane where transactions are composed and executed
* `options/`: The Options modal and its related components
* `palette/`: The right sidebar and its related components

Please note that some of the common components still rely on the global state. You may want to review the component's behaviour before introducing it elsewhere.