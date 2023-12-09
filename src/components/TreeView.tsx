import { useContext, useEffect, useState } from "react";
import { uniq } from "lodash-es";
import { ApiClientContext } from "../api/context";

import "./TreeView.scss";

export const TreeView = () => {
  const { client } = useContext(ApiClientContext);
  const [currentPath, setCurrentPath] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    if (!client) return;

    const loadCurrentFolder = async () => {
      const res = await client.loadFolder(currentPath);
      const newFiles = uniq([...files, ...res.files, ...res.folders]);
      const sortedFiles = newFiles.sort((a, b) => a.localeCompare(b));
      setFiles(sortedFiles);
    };
    loadCurrentFolder();
  }, [files, client, currentPath]);

  return (
    <div className="tree-view">
      <h1>TreeView</h1>

      <ul>
        {files.map((file) => (
          <li key={file} onClick={() => setCurrentPath(file)}>
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};
