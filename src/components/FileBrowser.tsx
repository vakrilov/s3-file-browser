import { TreeView } from "./TreeView";
import { WorkingDirectory } from "./WorkingDirectory/WorkingDirectory";

import "./FileBrowser.scss";

export const FileBrowser = () => (
  <div className="file-browser">
    <div className="left-panel">
      <TreeView />
    </div>
    <div className="right-panel">
      <WorkingDirectory />
    </div>
  </div>
);
