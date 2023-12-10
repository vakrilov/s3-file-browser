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

// TODO: Figure out Middleware types
const createLoadWorkingDirectoryMiddleware =
  (client: S3FileBrowserClient) =>
  (store: MiddlewareAPI<AppDispatch, RootState>) =>
  (next: Dispatch<Action>) =>
  async (action: Action) => {
    if (
      workingDirSlice.actions.setWorkingDir.match(action) ||
      expandedDirs.actions.expandDir.match(action)
    ) {
      const dir = action.payload;
      if (store.getState().loadingDirs.includes(dir)) {
        console.log("Dir already loading:", dir);
        return;
      }
      
      const { startLoading, endLoading } = loadingDirs.actions;

      store.dispatch(startLoading(dir));
      client
        .loadFolder(action.payload)
        .then((newFiles) =>
          store.dispatch(objectsSlice.actions.addFiles(newFiles))
        )
        .finally(() => store.dispatch(endLoading(dir)));
    }

    return next(action);
  };

const createAppStore = (client: S3FileBrowserClient | null) => {
  const middlewares: Middleware[] = [];
  if (client) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    middlewares.push(createLoadWorkingDirectoryMiddleware(client) as any);
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
