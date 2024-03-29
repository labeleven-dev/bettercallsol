import { ColorModeScript } from "@chakra-ui/react";
import * as Sentry from "@sentry/react";
import { App } from "components/App";
import React from "react";
import * as ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "reportWebVitals";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  release: import.meta.env.VITE_SEMVER
    ? `${import.meta.env.VITE_SEMVER} (${import.meta.env.VITE_BUILD})`
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
        <QueryClientProvider client={new QueryClient()}>
          <App />
          {/* Only included if NODE_ENV is development */}
          <ReactQueryDevtools />
        </QueryClientProvider>
      </Sentry.ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
