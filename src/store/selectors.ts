import type { TypedUseSelectorHook } from "react-redux";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { uniq } from "lodash-es";

import type { RootState } from "./store";
import { Delimiter } from "../api/s3-client";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const selectFiles = (state: RootState) => state.files;
const selectWorkingDir = (state: RootState) => state.workingDir;
const selectExpandedDirs = (state: RootState) => state.expandedDirs;
const selectLoadingDirs = (state: RootState) => state.loadingDirs;

export const useWorkingDir = () => useAppSelector(selectWorkingDir);

const selectWorkingDirFiles = createSelector(
  [selectFiles, selectWorkingDir],
  (files, wd) => {
    const nested = files
      .filter((f) => f.startsWith(wd))
      .map((f) => f.slice(wd.length))
      .map((f) => {
        const idx = f.indexOf(Delimiter);
        return idx > 0 ? f.slice(0, idx + 1) : f;
      })
      .filter((f) => f !== "" && f !== Delimiter);
    return uniq(nested);
  }
);

export const useWorkingDirFiles = () => useAppSelector(selectWorkingDirFiles);

export const useExpandedDirs = () => useAppSelector(selectExpandedDirs);

export const useLoadingDirs = () => useAppSelector(selectLoadingDirs);
