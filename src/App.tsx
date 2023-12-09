import { useContext } from "react";
import { LoginForm } from "./components/LoginForm";
import { ApiClientContext, Credentials } from "./api/context";

import "./App.css";
import { DebugTools } from "./components/DebugTools";
import { TreeView } from "./components/TreeView";

function App() {
  const { client, initClient } = useContext(ApiClientContext);

  const tryInit = async (credentials: Credentials) => {
    const success = await initClient(credentials);
    if (!success) {
      alert("Failed to connect");
    }
  };

  return (
    <>
      <h1>AWS S3 File Browser</h1>
      {!client && <LoginForm onSubmit={tryInit} />}
      {client && <DebugTools />}
      {client && <TreeView />}
    </>
  );
}

export default App;
