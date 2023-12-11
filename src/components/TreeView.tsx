import { FunctionComponent, useCallback, useMemo } from "react";
import cx from "clsx";
import { range } from "lodash-es";

import {
  useAppSelector,
  useExpandedDirs,
  useLoadingDirs,
  useWorkingDir,
} from "../store/selectors";
import { isDir, isRoot, parentDir, parentDirs } from "../utils/fs";
import { actions, useAppDispatch } from "../store/store";
import { Delimiter } from "../api/s3-client";
import { useClickHandler } from "../hooks/use-click-handler";

import { VscChevronRight, VscLoading, VscReply } from "react-icons/vsc";
import "./TreeView.scss";

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

const TreeViewItem: FunctionComponent<DirItemProps> = ({ dir }: DirItemProps) => {
  const dispatch = useAppDispatch();

  const expanded = useExpandedDirs();
  const workingDir = useWorkingDir();
  const loading = useLoadingDirs(); //TODO: how to prevent this form causing rerender?

  const { name, level } = useMemo(() => getDirInfo(dir), [dir]);
  const isMarked = useMemo(() => workingDir.includes(dir), [dir, workingDir]);
  const isExpanded = useMemo(() => expanded.includes(dir), [dir, expanded]);
  const isLoading = useMemo(() => loading.includes(dir), [dir, loading]);

  const toggleExpand = useCallback(() => {
    if (isMarked) return;

    const action = isExpanded
      ? actions.collapseDir(dir)
      : actions.expandDir(dir);
    dispatch(action);
  }, [dir, isMarked, isExpanded, dispatch]);

  const setWorkingDir = useCallback(() => {
    dispatch(actions.setWorkingDir(dir));
    dispatch(actions.expandDir(dir));
  }, [dir, dispatch]);

  const clickHandler = useClickHandler({
    onSingleClick: toggleExpand,
    onDoubleClick: setWorkingDir,
  });

  return (
    <li onClick={clickHandler}>
      {range(level).map((i) => (
        <span key={i} className="indent"></span>
      ))}
      <div className={cx("item-content", isMarked && "marked")}>
        {isMarked ? (
          <VscReply className={cx("icon", "marked")} />
        ) : (
          <VscChevronRight className={cx("icon", isExpanded && "expanded")} />
        )}

        <span>{name}</span>
      </div>

      {isLoading && <VscLoading className="loading" />}
    </li>
  );
};

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
