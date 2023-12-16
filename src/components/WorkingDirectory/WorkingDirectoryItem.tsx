import { useCallback, useMemo, useRef } from "react";
import cx from "clsx";
import { VscFile, VscFolder } from "react-icons/vsc";

import { isDir } from "@/utils/fs";
import { focusNextSibling, focusPreviousSibling } from "@/utils/focus";

import "./WorkingDirectory.scss";
import { useClickHandler } from "@/hooks/use-click-handler";

type Props = {
  file: string;
  selected: boolean;
  onActivate: (file: string) => void;
  onFocus: (file: string) => void;
};
export const WorkingDirectoryItem = ({
  file,
  selected,
  onActivate,
  onFocus,
}: Props) => {
  const ref = useRef<HTMLLIElement>(null);
  const Icon = isDir(file) ? VscFolder : VscFile;

  const handleFocus = useCallback(() => onFocus(file), [file, onFocus]);
  const handleActivate = useCallback(
    () => onActivate(file),
    [file, onActivate]
  );
  const handleClick = useClickHandler({ onDoubleClick: handleActivate });

  const keyHandlers = useMemo(
    () =>
      ({
        ArrowUp: () => focusPreviousSibling(ref),
        ArrowDown: () => focusNextSibling(ref),
        Enter: () => onActivate(file),
      } as { [key: string]: () => void }),
    [file, onActivate]
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
