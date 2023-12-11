import {
  PayloadAction,
  createSlice
} from "@reduxjs/toolkit";

export const loadingDirsSlice = createSlice({
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
