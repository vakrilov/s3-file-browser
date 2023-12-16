import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ApiClientProvider } from "./api/context";
import { StoreProvider } from "./store/store";

import "normalize.css";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApiClientProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </ApiClientProvider>
  </React.StrictMode>
);
