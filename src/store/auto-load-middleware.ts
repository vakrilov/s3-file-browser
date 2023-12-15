import { Action, MiddlewareAPI } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { S3FileBrowserClient } from "../api/s3-client";
import { AppDispatch, RootState } from "./store";
import {
  expandedDirsSlice,
  filesSlice,
  loadingDirsSlice,
  workingDirSlice,
} from "./slices";
import { isDir } from "../utils/fs";

const reloadDir = async (
  dir: string,
  { dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>,
  client: S3FileBrowserClient
) => {
  const { startLoading, endLoading } = loadingDirsSlice.actions;

  dispatch(startLoading(dir));
  try {
    const newFiles = await client.loadDir(dir);

    // Get all files that are inside the directory
    const nestedExistingFiles = getState().files.filter(
      (path) => path.startsWith(dir) && path.length > dir.length
    );

    // Remove all files that are not:
    // - in the new files list
    // - inside a directory from the new files list
    const filesToRemove = nestedExistingFiles.filter(
      (existingFile) =>
        !newFiles.some((newFile) => {
          if (isDir(newFile)) {
            return existingFile.startsWith(newFile);
          } else {
            return existingFile === newFile;
          }
        })
    );

    if (filesToRemove.length > 0) {
      dispatch(filesSlice.actions.removeFiles(filesToRemove));
    }
    dispatch(filesSlice.actions.addFiles(newFiles));
  } finally {
    dispatch(endLoading(dir));
  }
};

export const createAutoLoadDirMiddleware =
  (client: S3FileBrowserClient) =>
  (store: MiddlewareAPI<AppDispatch, RootState>) =>
  (next: Dispatch<Action>) =>
  (action: Action) => {
    if (
      workingDirSlice.actions.setWorkingDir.match(action) ||
      expandedDirsSlice.actions.expandDir.match(action)
    ) {
      const dir = action.payload;
      const alreadyLoading = store.getState().loadingDirs.includes(dir);
      if (!alreadyLoading) {
        reloadDir(dir, store, client);
      } else {
        console.log("Already loading", dir);
      }
    }

    return next(action);
  };
