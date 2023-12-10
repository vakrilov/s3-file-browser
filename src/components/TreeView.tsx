import { FunctionComponent, useCallback, useMemo } from "react";
import cx from "clsx";
import { VscChevronRight } from "react-icons/vsc";

import "./TreeView.scss";
import {
  useAppSelector,
  useExpandedDirs,
  useWorkingDir,
} from "../store/selectors";
import { isDir, isRoot, parentDir, parentDirs } from "../utils/fs";
import { actions, useAppDispatch } from "../store/store";
import { Delimiter } from "../api/s3-client";
import { range } from "lodash-es";
import { useClickHandler } from "../hooks/use-click-handler";

const getDirInfo = (dir: string) => {
  if (isRoot(dir)) {
    return { name: "~", level: 0 };
  }

  const parts = dir.split(Delimiter);

  return {
    name: parts[parts.length - 2],
    level: parts.length - 2,
  };
};

type DirItemProps = {
  dir: string;
};

const DirItem: FunctionComponent<DirItemProps> = ({ dir }: DirItemProps) => {
  const dispatch = useAppDispatch();

  const expanded = useExpandedDirs();
  const workingDir = useWorkingDir();

  const { name, level } = useMemo(() => getDirInfo(dir), [dir]);
  const isMarked = useMemo(() => workingDir.includes(dir), [dir, workingDir]);
  const isExpanded = useMemo(() => expanded.includes(dir), [dir, expanded]);

  const toggleExpand = useCallback(() => {
    const action = isExpanded
      ? actions.collapseDir(dir)
      : actions.expandDir(dir);
    dispatch(action);
  }, [dir, isExpanded, dispatch]);

  const setWorkingDir = useCallback(
    () => dispatch(actions.setWorkingDir(dir)),
    [dir, dispatch]
  );

  const clickHandler = useClickHandler({
    onSingleClick: toggleExpand,
    onDoubleClick: setWorkingDir,
  });

  return (
    <li onClick={clickHandler}>
      {range(level).map((i) => (
        <span key={i} className="indent"></span>
      ))}
      <VscChevronRight className={cx("icon", isExpanded && "expanded")} />
      <span className={cx(isMarked && "marked")}>{name}</span>
    </li>
  );
};

export const TreeView = () => {
  const files = useAppSelector((state) => state.files);
  const expandedDirs = useAppSelector((state) => state.expandedDirs);

  const dirs = useMemo(
    () =>
      files.filter(
        (file) =>
          isDir(file) &&
          parentDirs(file).every((parent) => expandedDirs.includes(parent))
      ),
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
