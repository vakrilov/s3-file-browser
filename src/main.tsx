import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ApiClientProvider } from "./api/context.tsx";
import { StoreProvider } from "./store/store.ts";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApiClientProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </ApiClientProvider>
  </React.StrictMode>
);
