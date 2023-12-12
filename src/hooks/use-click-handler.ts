import { MouseEvent, MouseEventHandler, useCallback, useRef } from "react";

type Params<T> = {
  onSingleClick?: MouseEventHandler<T>;
  onDoubleClick?: MouseEventHandler<T>;
  latency?: number;
};

export const useClickHandler = <T>({
  onSingleClick,
  onDoubleClick,
  latency = 200,
}: Params<T>) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  };

  return useCallback(
    (event: MouseEvent<T>) => {
      clearTimer();

      if (event.detail === 1) {
        timerRef.current = setTimeout(() => {
          onSingleClick?.(event);
        }, latency);
      } else if (event.detail % 2 === 0) {
        onDoubleClick?.(event);
      }
    },
    [onSingleClick, onDoubleClick, latency]
  );
};
