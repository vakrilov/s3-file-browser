import { FunctionComponent, useCallback, useMemo } from "react";

import { VscFolder, VscFolderOpened } from "react-icons/vsc";

import "./TreeView.scss";
import { useAppSelector } from "../store/selectors";
import { isDir, isRoot, parentDir } from "../utils/fs";
import { actions, useAppDispatch } from "../store/store";
import { Delimiter } from "../api/s3-client";

export const dirInfo = (dir: string) => {
  if (isRoot(dir)) {
    return { name: "~", level: 0 };
  }

  const parts = dir.split(Delimiter);
  if (isDir(dir)) parts.pop();

  return {
    name: parts[parts.length - 1],
    level: parts.length - 1,
  };
};

type DirItemProps = {
  dir: string;
};

const DirItem: FunctionComponent<DirItemProps> = ({ dir }: DirItemProps) => {
  const dispatch = useAppDispatch();

  const expanded = useAppSelector((state) => state.expandedDirs.includes(dir));
  const workingDir = useAppSelector((state) => state.workingDir.includes(dir));

  const toggleExpand = useCallback(() => {
    const action = expanded ? actions.collapseDir(dir) : actions.expandDir(dir);
    dispatch(action);
  }, [dir, expanded, dispatch]);

  const { name, level } = dirInfo(dir);

  return (
    <li onClick={toggleExpand} className={workingDir ? "working-dir" : ""}>
      <span>{" |>".repeat(level)} </span>
      {expanded ? <VscFolderOpened /> : <VscFolder />} {name}
    </li>
  );
};

export const TreeView = () => {
  const files = useAppSelector((state) => state.files);
  const expandedDirs = useAppSelector((state) => state.expandedDirs);

  const dirs = useMemo(
    () =>
      files.filter((file) => {
        if (!isDir(file)) return false;
        const parent = parentDir(file);
        return isRoot(parent) || expandedDirs.includes(parent);
      }),
    [files, expandedDirs]
  );

  return (
    <div className="tree-view">
      <h1>TreeView</h1>

      <ul>
        {dirs.map((dir) => (
          <DirItem key={dir} dir={dir} />
        ))}
      </ul>
    </div>
  );
};
