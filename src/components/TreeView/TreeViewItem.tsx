import { memo, useCallback, useMemo } from "react";
import cx from "clsx";
import { range } from "lodash-es";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { actions } from "../../store/actions";
import { useClickHandler } from "../../hooks/use-click-handler";
import { VscChevronRight, VscReply } from "react-icons/vsc";
import { isRoot } from "../../utils/fs";
import { Delimiter } from "../../api/s3-client";
import { Loader } from "../Loader";
import { RootState } from "../../store/store";

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

const selectIsLoading = (state: RootState, dir: string) =>
  state.loadingDirs.includes(dir);

const selectIsExpanded = (state: RootState, dir: string) =>
  state.expandedDirs.includes(dir);

const selectIsMarked = (state: RootState, dir: string) =>
  state.workingDir.includes(dir);

export const TreeViewItem = memo(({ dir }: Props) => {
  const dispatch = useAppDispatch();

  const { name, level } = useMemo(() => getDirInfo(dir), [dir]);

  const isLoading = useAppSelector((state) => selectIsLoading(state, dir));
  const isExpanded = useAppSelector((state) => selectIsExpanded(state, dir));
  const isMarked = useAppSelector((state) => selectIsMarked(state, dir));

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
});
