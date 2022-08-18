import { ColorModeScript } from "@chakra-ui/react";
import * as Sentry from "@sentry/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: process.env.REACT_APP_SEMVER
    ? `${process.env.REACT_APP_SEMVER} (${process.env.REACT_APP_BUILD})`
    : "local",
});

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <>
      {
        // TODO initial colour mode is broken https://github.com/chakra-ui/chakra-ui/discussions/5051
        !localStorage.getItem("chakra-ui-color-mode") &&
          localStorage.setItem("chakra-ui-color-mode", "dark")
      }
    </>
    <ColorModeScript initialColorMode="system" />
    <BrowserRouter>
      <Sentry.ErrorBoundary>
        <App />
      </Sentry.ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
