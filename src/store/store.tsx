/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch } from "react-redux";
import { createSlice } from "@reduxjs/toolkit";
import type {
  Action,
  Middleware,
  MiddlewareAPI,
  PayloadAction,
} from "@reduxjs/toolkit";
import { S3FileBrowserClient } from "../api/s3-client";
import { Dispatch, useContext, useMemo } from "react";
import { ApiClientContext } from "../api/context";
import { uniq } from "lodash-es";
import { fileCompare } from "../utils/fs";

const workingDirSlice = createSlice({
  name: "workingDir",
  initialState: "",
  reducers: {
    setWorkingDir: (_, action: PayloadAction<string>) => action.payload,
  },
});

const objectsSlice = createSlice({
  name: "files",
  initialState: [] as string[],
  reducers: {
    addFiles: (store, action: PayloadAction<string[]>) =>
      uniq([...store, ...action.payload]).sort(fileCompare),
  },
});

// TODO: Figure out Middleware types
const createLoadWorkingDirectoryMiddleware =
  (client: S3FileBrowserClient) =>
  (store: MiddlewareAPI<AppDispatch, StoreType>) =>
  (next: Dispatch<Action>) =>
  async (action: Action) => {
    if (workingDirSlice.actions.setWorkingDir.match(action)) {
      const newFiles = await client.loadFolder(action.payload);
      store.dispatch(objectsSlice.actions.addFiles(newFiles));
    }

    return next(action);
  };

const createAppStore = (client: S3FileBrowserClient | null) => {
  const middlewares: Middleware[] = [];
  if (client) {
    middlewares.push(createLoadWorkingDirectoryMiddleware(client) as any);
  }

  const store = configureStore({
    reducer: {
      workingDir: workingDirSlice.reducer,
      files: objectsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: client,
        },
      }).concat(middlewares),
  });

  // Trigger middlewares on init
  store.dispatch(workingDirSlice.actions.setWorkingDir(""));

  return store;
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { client } = useContext(ApiClientContext);
  const store = useMemo(() => createAppStore(client), [client]);
  return <Provider store={store}>{children}</Provider>;
};

type StoreType = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<StoreType["getState"]>;
export type AppDispatch = StoreType["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const actions = {
  ...workingDirSlice.actions,
  ...objectsSlice.actions,
};
