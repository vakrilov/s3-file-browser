import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch } from "react-redux";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { S3FileBrowserClient } from "../api/s3-client";
import { useContext, useMemo } from "react";
import { ApiClientContext } from "../api/context";

const workingDirSlice = createSlice({
  name: "workingDir",
  initialState: "",
  reducers: {
    set: (_, action: PayloadAction<string>) => action.payload,
  },
});

const createAppStore = (client: S3FileBrowserClient | null) => {
  console.log("createAppStore", client);
  return configureStore({
    reducer: {
      workingDir: workingDirSlice.reducer,
    },
  });
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
