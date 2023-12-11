import {
  PayloadAction,
  createSlice
} from "@reduxjs/toolkit";

export const expandedDirsSlice = createSlice({
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
