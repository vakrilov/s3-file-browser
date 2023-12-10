import { Provider, useDispatch } from "react-redux";
import {
  Action,
  Middleware,
  MiddlewareAPI,
  PayloadAction,
  createSlice,
  configureStore,
} from "@reduxjs/toolkit";
import { uniq } from "lodash-es";

import { S3FileBrowserClient } from "../api/s3-client";
import { Dispatch, useContext, useMemo } from "react";
import { ApiClientContext } from "../api/context";
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

const expandedDirs = createSlice({
  name: "expandedDirs",
  initialState: [] as string[],
  reducers: {
    expandDir: (draft, action: PayloadAction<string>) => {
      if (!draft.includes(action.payload)) {
        draft.push(action.payload);
      }
    },
    collapseDir: (draft, action: PayloadAction<string>) => {
      const index = draft.indexOf(action.payload);
      if (index !== -1) {
        draft.splice(index, 1);
      }
    },
  },
});

const loadingDirs = createSlice({
  name: "loadingDirs",
  initialState: [] as string[],
  reducers: {
    startLoading: (draft, action: PayloadAction<string>) => {
      if (!draft.includes(action.payload)) {
        draft.push(action.payload);
      }
    },
    endLoading: (draft, action: PayloadAction<string>) => {
      const index = draft.indexOf(action.payload);
      if (index !== -1) {
        draft.splice(index, 1);
      }
    },
  },
});

const loadFolder = async (
  dir: string,
  dispatch: AppDispatch,
  client: S3FileBrowserClient
) => {
  const { startLoading, endLoading } = loadingDirs.actions;

  dispatch(startLoading(dir));
  try {
    const newFiles = await client.loadFolder(dir);
    dispatch(objectsSlice.actions.addFiles(newFiles));
  } finally {
    dispatch(endLoading(dir));
  }
};

const createAutoLoadDirMiddleware =
  (client: S3FileBrowserClient) =>
  (store: MiddlewareAPI<AppDispatch, RootState>) =>
  (next: Dispatch<Action>) =>
  (action: Action) => {
    if (
      workingDirSlice.actions.setWorkingDir.match(action) ||
      expandedDirs.actions.expandDir.match(action)
    ) {
      const dir = action.payload;
      const alreadyLoading = store.getState().loadingDirs.includes(dir);
      if (!alreadyLoading) {
        loadFolder(dir, store.dispatch, client);
      } else {
        console.log("Already loading", dir);
      }
    }

    return next(action);
  };

const createAppStore = (client: S3FileBrowserClient | null) => {
  const middlewares: Middleware[] = [];
  if (client) {
    middlewares.push(createAutoLoadDirMiddleware(client) as Middleware);
  }

  const store = configureStore({
    reducer: {
      workingDir: workingDirSlice.reducer,
      files: objectsSlice.reducer,
      expandedDirs: expandedDirs.reducer,
      loadingDirs: loadingDirs.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
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
  ...expandedDirs.actions,
  ...loadingDirs.actions,
};
