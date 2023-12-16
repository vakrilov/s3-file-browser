import { selectWorkingDirFiles, selectTreeViewDirs } from "./selectors";

describe("selectWorkingDirFiles", () => {
  test("should return empty array if working dir is root", () => {
    const state = {
      files: ["foo", "bar", "baz"],
      workingDir: "",
      expandedDirs: [],
      loadingDirs: [],
    };

    expect(selectWorkingDirFiles(state)).toEqual(["foo", "bar", "baz"]);
  });
});

describe("selectTreeViewDirs", () => {
  test("should return empty array if working dir is root", () => {
    const state = {
      files: ["foo/", "bar/", "baz"],
      workingDir: "",
      expandedDirs: [],
      loadingDirs: [],
    };
    expect(selectTreeViewDirs(state)).toEqual(["foo/", "bar/"]);
  });
});
