import { RefObject } from "react";

export const focusNextSibling = (ref: RefObject<HTMLElement>) => {
  const next = ref?.current?.nextElementSibling;

  if (next instanceof HTMLElement) {
    next.focus();
  }
};

export const focusPreviousSibling = (ref: RefObject<HTMLElement>) => {
  const previous = ref?.current?.previousElementSibling;

  if (previous instanceof HTMLElement) {
    previous.focus();
  }
};
