import { useCallback, useMemo } from "react";
import cx from "clsx";
import { range } from "lodash-es";
import {
  useAppDispatch,
  useExpandedDirs,
  useLoadingDirs,
  useWorkingDir,
} from "../../store/hooks";
import { actions } from "../../store/actions";
import { useClickHandler } from "../../hooks/use-click-handler";
import { VscChevronRight, VscReply } from "react-icons/vsc";
import { isRoot } from "../../utils/fs";
import { Delimiter } from "../../api/s3-client";
import { Loader } from "../Loader";

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

type Props = {
  dir: string;
};

export const TreeViewItem = ({ dir }: Props) => {
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
        <span key={i} className="indent" />
      ))}

      <div className={cx("item-content", isMarked && "marked")}>
        {isMarked ? (
          <VscReply className={cx("icon", "marked")} />
        ) : (
          <VscChevronRight className={cx("icon", isExpanded && "expanded")} />
        )}

        <span>{name}</span>
      </div>

      {isLoading && <Loader />}
    </li>
  );
};
