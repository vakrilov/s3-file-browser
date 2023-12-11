import {
  PayloadAction,
  createSlice
} from "@reduxjs/toolkit";

export const workingDirSlice = createSlice({
  name: "workingDir",
  initialState: "",
  reducers: {
    setWorkingDir: (_, action: PayloadAction<string>) => action.payload,
  },
});
