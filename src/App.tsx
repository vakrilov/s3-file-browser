import { useContext } from "react";
import { LoginForm } from "./components/LoginForm";
import { ApiClientContext, Credentials } from "./api/context";

import "./App.css";

function App() {
  const { client, initClient, clearClient } = useContext(ApiClientContext);

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
      {client && <button onClick={clearClient}>Logout</button>}
    </>
  );
}

export default App;
