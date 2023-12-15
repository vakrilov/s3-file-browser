import { useCallback, useMemo, useRef } from "react";
import cx from "clsx";
import { VscFile, VscFolder } from "react-icons/vsc";

import { isDir } from "../../utils/fs";
import { focusNextSibling, focusPreviousSibling } from "../../utils/focus";

import "./WorkingDirectory.scss";

type Props = {
  file: string;
  selected: boolean;
  onClick: (file: string) => void;
  onFocus: (file: string) => void;
};
export const WorkingDirectoryItem = ({
  file,
  selected,
  onClick,
  onFocus,
}: Props) => {
  const ref = useRef<HTMLLIElement>(null);
  const Icon = isDir(file) ? VscFolder : VscFile;

  const handleClick = useCallback(() => {
    console.log("click:", file, selected);
    onClick(file);
  }, [selected, file, onClick]);

  const handleFocus = useCallback(
    (e: unknown) => {
      console.log("focus:", file);
      console.log(e);
      onFocus(file);
    },
    [file, onFocus]
  );

  const keyHandlers = useMemo(
    () =>
      ({
        ArrowUp: () => focusPreviousSibling(ref),
        ArrowDown: () => focusNextSibling(ref),
        Enter: () => onClick(file),
      } as { [key: string]: () => void }),
    [file, onClick]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => keyHandlers[e.key]?.(),
    [keyHandlers]
  );

  return (
    <li
      ref={ref}
      tabIndex={0}
      className={cx({ selected })}
      onFocus={handleFocus}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Icon />
      {file}
    </li>
  );
};
