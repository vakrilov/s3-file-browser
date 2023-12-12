import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { uniq } from "lodash-es";
import { fileCompare } from "../../utils/fs";

export const filesSlice = createSlice({
  name: "files",
  initialState: [] as string[],
  reducers: {
    addFiles: (store, action: PayloadAction<string[]>) =>
      uniq([...store, ...action.payload]).sort(fileCompare),

    removeFile: (store, action: PayloadAction<string>) =>
      store.filter((file) => file !== action.payload),

    addFile: (store, action: PayloadAction<string>) =>
      uniq([...store, action.payload]).sort(fileCompare),
  },
});
