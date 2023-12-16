import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { uniq } from "lodash";

import type { AppDispatch, RootState } from "./store";
import { Delimiter, EmptyDirFile } from "../api/s3-client";
import { isDir, parentDirs } from "../utils/fs";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const selectFiles = (state: RootState) => state.files;
const selectWorkingDir = (state: RootState) => state.workingDir;
const selectExpandedDirs = (state: RootState) => state.expandedDirs;
const selectLoadingDirs = (state: RootState) => state.loadingDirs;

export const selectWorkingDirFiles = createSelector(
  [selectFiles, selectWorkingDir],
  (files, wd) => {
    const nested = files
      .filter((f) => f.startsWith(wd))
      .map((f) => f.slice(wd.length))
      .map((f) => {
        const idx = f.indexOf(Delimiter);
        return idx > 0 ? f.slice(0, idx + 1) : f;
      })
      .filter((f) => f !== "" && f !== Delimiter && f !== EmptyDirFile);
    return uniq(nested);
  }
);
export const useWorkingDirFiles = () => useAppSelector(selectWorkingDirFiles);

export const useExpandedDirs = () => useAppSelector(selectExpandedDirs);
export const useLoadingDirs = () => useAppSelector(selectLoadingDirs);
export const useWorkingDir = () => useAppSelector(selectWorkingDir);

export const selectTreeViewDirs = createSelector(
  [selectFiles, selectExpandedDirs, selectWorkingDir],
  (files, expandedDirs, workingDir) => {
    // Working dir and all its parents are always expanded
    const expanded = uniq([
      workingDir,
      ...parentDirs(workingDir),
      ...expandedDirs,
    ]);

    // Dir is included if all of its parents are expanded
    return files.filter(
      (file) =>
        isDir(file) &&
        parentDirs(file).every((parent) => expanded.includes(parent))
    );
  }
);
export const useTreeViewDirs = () => useAppSelector(selectTreeViewDirs);
