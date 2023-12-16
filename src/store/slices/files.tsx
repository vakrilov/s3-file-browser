import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { uniq } from "lodash";
import { fileCompare } from "@/utils/fs";

export const filesSlice = createSlice({
  name: "files",
  initialState: [] as string[],
  reducers: {
    addFile: (store, action: PayloadAction<string>) =>
      uniq([...store, action.payload]).sort(fileCompare),

    addFiles: (store, action: PayloadAction<string[]>) =>
      uniq([...store, ...action.payload]).sort(fileCompare),

    removeFile: (store, action: PayloadAction<string>) =>
      store.filter((file) => file !== action.payload),

    removeFiles: (store, action: PayloadAction<string[]>) =>
      store.filter(
        (file) => !action.payload.some((toRemove) => file === toRemove)
      ),
  },
});
