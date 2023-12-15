import { RefObject, memo, useCallback, useMemo, useRef } from "react";
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

const nextSibling = (ref: RefObject<HTMLElement> | null) => {
  const next = ref?.current?.nextElementSibling;
  return next instanceof HTMLElement ? next : null;
};

const previousSibling = (ref: RefObject<HTMLElement> | null) => {
  const next = ref?.current?.previousElementSibling;
  return next instanceof HTMLElement ? next : null;
};

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          expandCommand();
          break;
        case "ArrowLeft":
          collapseCommand();
          break;
        case "ArrowUp":
          previousSibling(ref)?.focus();
          break;
        case "ArrowDown":
          nextSibling(ref)?.focus();
          break;
        case "Enter":
          setWorkingDirCommand();
          break;
      }
    },
    [expandCommand, collapseCommand, setWorkingDirCommand]
  );

  return (
    <li ref={ref} onClick={handleClick} tabIndex={0} onKeyDown={handleKeyDown}>
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
