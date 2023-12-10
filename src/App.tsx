import { useContext } from "react";
import { LoginForm } from "./components/LoginForm";
import { ApiClientContext, Credentials } from "./api/context";
import { WorkingDirectory } from "./components/WorkingDirectory";
import { TreeView } from "./components/TreeView";

import "./App.scss";
import { DebugTools } from "./components/DebugTools";

function App() {
  const { client, initClient } = useContext(ApiClientContext);

  const tryInit = async (credentials: Credentials) => {
    const success = await initClient(credentials);
    if (!success) {
      alert("Failed to connect");
    }
  };

  return (
    <div>
      <h1>AWS S3 File Browser</h1>
      {!client && <LoginForm onSubmit={tryInit} />}

      {client && (
        <div className="file-browser">
          <div className="left-panel">
            <TreeView />
          </div>
          <div className="right-panel">
            <WorkingDirectory />
          </div>
        </div>
      )}

      {client && <DebugTools />}
    </div>
  );
}

export default App;
