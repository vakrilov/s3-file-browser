import { useContext } from "react";
import { VscSignOut } from "react-icons/vsc";
import { TreeView } from "./TreeView/TreeView";
import { WorkingDirectory } from "./WorkingDirectory/WorkingDirectory";

import "./FileBrowser.scss";
import { ApiClientContext } from "../api/context";

export const FileBrowser = () => {
  const { client, clearClient } = useContext(ApiClientContext);

  return (
    <div className="file-browser">
      <header className="header">
        <h2>
          Bucket: <strong>{client?.bucket}</strong>
        </h2>
        <button onClick={clearClient}>
          <VscSignOut /> Logout
        </button>
      </header>
      <div className="left-panel">
        <TreeView />
      </div>
      <div className="right-panel">
        <WorkingDirectory />
      </div>
    </div>
  );
};
