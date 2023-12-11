import {
  workingDirSlice,
  filesSlice,
  expandedDirsSlice,
  loadingDirsSlice,
} from "./slices";

export const actions = {
  ...workingDirSlice.actions,
  ...filesSlice.actions,
  ...expandedDirsSlice.actions,
  ...loadingDirsSlice.actions,
};
