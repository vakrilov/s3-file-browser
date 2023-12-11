import { useContext } from "react";
import { LoginForm } from "./components/LoginForm";
import { ApiClientContext, Credentials } from "./api/context";
import { FileBrowser } from "./components/FileBrowser";

import "./App.scss";

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
      {client ? <FileBrowser /> : <LoginForm onSubmit={tryInit} />}
    </>
  );
}

export default App;
