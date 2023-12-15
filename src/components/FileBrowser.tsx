import { useContext, useState } from "react";
import { VscDebug, VscSignOut } from "react-icons/vsc";
import { TreeView } from "./TreeView/TreeView";
import { WorkingDirectory } from "./WorkingDirectory/WorkingDirectory";

import "./FileBrowser.scss";
import { ApiClientContext } from "../api/context";
import { DevToolsModal } from "./modals/DevTools";

export const FileBrowser = () => {
  const { client, clearClient } = useContext(ApiClientContext);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  return (
    <div className="file-browser">
      <header className="header">
        <h2>
          Bucket: <strong>{client?.bucket}</strong>
        </h2>
        <div className="commands">
          <button onClick={() => setIsDevToolsOpen(true)}>
            <VscDebug /> Dev Tools
          </button>
          <button onClick={clearClient}>
            <VscSignOut /> Logout
          </button>
        </div>
      </header>
      <div className="left-panel">
        <TreeView />
      </div>
      <div className="right-panel">
        <WorkingDirectory />
      </div>
      <DevToolsModal
        isOpen={isDevToolsOpen}
        onClose={() => setIsDevToolsOpen(false)}
      />
    </div>
  );
};
