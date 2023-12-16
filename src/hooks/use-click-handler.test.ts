import { renderHook } from "@testing-library/react";
import { useClickHandler } from "./use-click-handler";
import { MouseEvent } from "react";

jest.useFakeTimers();

const getEvent = (detail = 1) =>
  new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    detail,
  }) as unknown as MouseEvent<HTMLButtonElement>;

const setupHook = () => {
  const onSingleClick = jest.fn();
  const onDoubleClick = jest.fn();
  const { result } = renderHook(() =>
    useClickHandler({ onSingleClick, onDoubleClick })
  );

  return { trigger: result.current, onSingleClick, onDoubleClick };
};

describe("useClickHandler", () => {
  it("should return a function", () => {
    const { result } = renderHook(() => useClickHandler({}));
    expect(result.current).toBeInstanceOf(Function);
  });

  it("should call onSingleClick only after the timeout is passed", () => {
    const { onSingleClick, onDoubleClick, trigger } = setupHook();

    trigger(getEvent());

    expect(onSingleClick).not.toHaveBeenCalled();
    expect(onDoubleClick).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(onSingleClick).toHaveBeenCalledTimes(1);
    expect(onDoubleClick).not.toHaveBeenCalled();
  });

  it("should call onDoubleClick on two clicks within the timeout", () => {
    const { onSingleClick, onDoubleClick, trigger } = setupHook();

    trigger(getEvent());
    trigger(getEvent(2));
    
    jest.runAllTimers();
    expect(onSingleClick).not.toHaveBeenCalled();
    expect(onDoubleClick).toHaveBeenCalledTimes(1);
  });

  it("should call onSingleClick twice on two slow clicks", () => {
    const { onSingleClick, onDoubleClick, trigger } = setupHook();

    trigger(getEvent());
    jest.advanceTimersByTime(500);

    expect(onSingleClick).toHaveBeenCalledTimes(1);
    expect(onDoubleClick).not.toHaveBeenCalled();

    trigger(getEvent());
    jest.advanceTimersByTime(500);
    
    expect(onSingleClick).toHaveBeenCalledTimes(2);
    expect(onDoubleClick).not.toHaveBeenCalled();
  });
});
