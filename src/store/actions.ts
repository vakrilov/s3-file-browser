import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  workingDirSlice,
  filesSlice,
  expandedDirsSlice,
  loadingDirsSlice,
} from "./slices";
import { S3FileBrowserClient } from "../api/s3-client";

const createFile = createAsyncThunk(
  "files/createFile",
  async (
    { path, body }: { path: string; body: string },
    { dispatch, extra }
  ) => {
    const client = extra as S3FileBrowserClient;
    console.log("createFile", path, body);
    await client.createFile(path, body);
    dispatch(filesSlice.actions.addFile(path));
  }
);

const readFile = createAsyncThunk(
  "files/readFile",
  async (path: string, { extra }) => {
    const client = extra as S3FileBrowserClient;

    return await client.readFile(path);
  }
);

const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (path: string, { dispatch, extra }) => {
    const client = extra as S3FileBrowserClient;

    await client.deleteFile(path);
    dispatch(filesSlice.actions.removeFile(path));
  }
);

const createDir = createAsyncThunk(
  "files/createFolder",
  async (path: string, { dispatch, extra }) => {
    const client = extra as S3FileBrowserClient;

    await client.createDir(path);
    dispatch(filesSlice.actions.addFile(path));
  }
);

export const thunks = {
  createFile,
  readFile,
  deleteFile,
  createDir,
};

export const actions = {
  ...workingDirSlice.actions,
  ...filesSlice.actions,
  ...expandedDirsSlice.actions,
  ...loadingDirsSlice.actions,
};
