import { memo, useCallback, useMemo, useRef } from "react";
import cx from "clsx";
import { range } from "lodash";
import { VscArrowRight, VscChevronRight } from "react-icons/vsc";

import { Delimiter } from "../../api/s3-client";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { actions } from "../../store/actions";
import { RootState } from "../../store/store";
import { isRoot } from "../../utils/fs";
import { focusNextSibling, focusPreviousSibling } from "../../utils/focus";
import { useClickHandler } from "../../hooks/use-click-handler";
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

const selectIsLoading = (state: RootState, dir: string) =>
  state.loadingDirs.includes(dir);

const selectIsExpanded = (state: RootState, dir: string) =>
  state.expandedDirs.includes(dir);

const selectIsMarked = (state: RootState, dir: string) =>
  state.workingDir.startsWith(dir);

export const TreeViewItem = memo(({ dir }: Props) => {
  const ref = useRef<HTMLLIElement>(null);
  const dispatch = useAppDispatch();

  const { name, level } = useMemo(() => getDirInfo(dir), [dir]);

  const isLoading = useAppSelector((state) => selectIsLoading(state, dir));
  const isExpanded = useAppSelector((state) => selectIsExpanded(state, dir));
  const isMarked = useAppSelector((state) => selectIsMarked(state, dir));

  // Don't expand/collapse marked items - they are always expanded
  const collapseCommand = useCallback(
    () => !isMarked && isExpanded && dispatch(actions.collapseDir(dir)),
    [dir, isMarked, isExpanded, dispatch]
  );

  const expandCommand = useCallback(
    () => !isMarked && !isExpanded && dispatch(actions.expandDir(dir)),
    [dir, isMarked, isExpanded, dispatch]
  );

  const setWorkingDirCommand = useCallback(() => {
    dispatch(actions.setWorkingDir(dir));
    dispatch(actions.expandDir(dir));
  }, [dir, dispatch]);

  const toggleCommand = isExpanded ? collapseCommand : expandCommand;

  const handleClick = useClickHandler({
    onSingleClick: toggleCommand,
    onDoubleClick: setWorkingDirCommand,
  });

  const keyHandlers = useMemo(
    () =>
      ({
        ArrowRight: expandCommand,
        ArrowLeft: collapseCommand,
        ArrowUp: () => focusPreviousSibling(ref),
        ArrowDown: () => focusNextSibling(ref),
        Enter: setWorkingDirCommand,
      } as { [key: string]: () => void }),
    [expandCommand, collapseCommand, setWorkingDirCommand]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => keyHandlers[e.key]?.(),
    [keyHandlers]
  );

  return (
    <li
      ref={ref}
      className={cx(isMarked && "marked")}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {range(level).map((i) => (
        <span key={i} className="indent" />
      ))}

      <div className="item-content">
        {isMarked ? (
          <VscArrowRight className="icon" />
        ) : (
          <VscChevronRight className={cx("icon", isExpanded && "expanded")} />
        )}

        <span>{name}</span>

        {isLoading && <Loader />}
      </div>
    </li>
  );
});
