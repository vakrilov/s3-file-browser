import { useMemo } from "react";

import {
  useAppSelector,
  useExpandedDirs,
  useWorkingDir,
} from "../../store/hooks";

import { isDir, parentDir, parentDirs } from "../../utils/fs";
import { TreeViewItem } from "./TreeViewItem";

import "./TreeView.scss";

export const TreeView = () => {
  const files = useAppSelector((state) => state.files);
  const expandedDirs = useExpandedDirs();
  const workingDir = useWorkingDir();

  const dirs = useMemo(
    () =>
      files.filter(
        (file) =>
          isDir(file) &&
          (workingDir.includes(parentDir(file)) ||
            parentDirs(file).every((parent) => expandedDirs.includes(parent)))
      ),
    [files, expandedDirs, workingDir]
  );

  return (
    <div className="tree-view">
      <ul>
        {dirs.map((dir) => (
          <TreeViewItem key={dir} dir={dir} />
        ))}
      </ul>
    </div>
  );
};
