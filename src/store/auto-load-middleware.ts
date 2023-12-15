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

const loadDir = async (
  dir: string,
  dispatch: AppDispatch,
  client: S3FileBrowserClient
) => {
  const { startLoading, endLoading } = loadingDirsSlice.actions;

  dispatch(startLoading(dir));
  try {
    const newFiles = await client.loadDir(dir);
    // TODO: Check for files that are removed
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
        loadDir(dir, store.dispatch, client);
      } else {
        console.log("Already loading", dir);
      }
    }

    return next(action);
  };
