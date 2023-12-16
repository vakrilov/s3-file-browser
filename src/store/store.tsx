import { Provider } from "react-redux";
import { Middleware, configureStore } from "@reduxjs/toolkit";

import { createAutoLoadDirMiddleware } from "./auto-load-middleware";

import { S3FileBrowserClient } from "../api/s3-client";
import { useContext, useMemo } from "react";
import { ApiClientContext } from "../api/context";
import {
  expandedDirsSlice,
  filesSlice,
  loadingDirsSlice,
  workingDirSlice,
} from "./slices";

export const createAppStore = (client: S3FileBrowserClient | null) => {
  const middlewares: Middleware[] = [];
  if (client) {
    middlewares.push(createAutoLoadDirMiddleware(client) as Middleware);
  }

  const store = configureStore({
    reducer: {
      workingDir: workingDirSlice.reducer,
      files: filesSlice.reducer,
      expandedDirs: expandedDirsSlice.reducer,
      loadingDirs: loadingDirsSlice.reducer,
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

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { client } = useContext(ApiClientContext);

  // Store is re-created whenever client changes (new login)
  const store = useMemo(() => createAppStore(client), [client]);
  return <Provider store={store}>{children}</Provider>;
};
