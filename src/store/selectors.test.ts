import { selectWorkingDirFiles, selectTreeViewDirs } from "./selectors";

const testFiles = [
  "a1/",
  "a1/a1_file",
  "a1/a21/",
  "a1/a21/a21_file",
  "a1/a22/",
  "a1/a22/a22_file",
  "a1/a22/a3/",
  "a1/a22/a3/a3_file",

  "b1/",
  "b1/b1_file",
  "b1/b2/",
  "b1/b2/b2_file",
  "b1/b2/b3/",
  "b1/b2/b3/b3_file",

  "root_file",
];

describe("selectWorkingDirFiles", () => {
  const getState = (workingDir: string) => ({
    files: testFiles,
    workingDir,
    expandedDirs: [],
    loadingDirs: [],
  });

  test("should return root directories when working dir is root", () => {
    const state = getState("");

    expect(selectWorkingDirFiles(state)).toEqual(["a1/", "b1/", "root_file"]);
  });

  test("should return root directories when working dir is not root", () => {
    const state = getState("a1/");

    expect(selectWorkingDirFiles(state)).toEqual(["a1_file", "a21/", "a22/"]);
  });
});

describe("selectTreeViewDirs", () => {
  const getState = (workingDir: string, expandedDirs: string[]) => ({
    files: testFiles,
    workingDir,
    expandedDirs,
    loadingDirs: [],
  });

  describe("when working dir is root", () => {
    test("when no expanded dirs, should return root dirs", () => {
      const state = getState("", []);

      expect(selectTreeViewDirs(state)).toEqual(["a1/", "b1/"]);
    });

    test("when expanded root dirs, should return root dirs", () => {
      const state = getState("", ["a1/"]);

      expect(selectTreeViewDirs(state)).toEqual([
        "a1/",
        "a1/a21/",
        "a1/a22/",
        "b1/",
      ]);
    });

    test("when expanded nested dirs, should return all expanded dirs", () => {
      const state = getState("", ["a1/", "a1/a22/"]);

      expect(selectTreeViewDirs(state)).toEqual([
        "a1/",
        "a1/a21/",
        "a1/a22/",
        "a1/a22/a3/",
        "b1/",
      ]);
    });

    test("when expanded nested dirs with gap, should return only root dirs", () => {
      const state = getState("", ["a1/a2/a3"]);

      expect(selectTreeViewDirs(state)).toEqual(["a1/", "b1/"]);
    });
  });

  describe("when working dir is not root", () => {
    test("when no expanded dirs, should expand working dir path", () => {
      const state = getState("b1/", []);

      expect(selectTreeViewDirs(state)).toEqual(["a1/", "b1/", "b1/b2/"]);
    });

    test("when no expanded dirs, should expand working dir path 2", () => {
      const state = getState("b1/b2/", []);

      expect(selectTreeViewDirs(state)).toEqual([
        "a1/",
        "b1/",
        "b1/b2/",
        "b1/b2/b3/",
      ]);
    });

    test("when expanded root dirs, should expand working dir path 2", () => {
      const state = getState("b1/b2/", ["a1/"]);

      expect(selectTreeViewDirs(state)).toEqual([
        "a1/",
        "a1/a21/",
        "a1/a22/",
        "b1/",
        "b1/b2/",
        "b1/b2/b3/",
      ]);
    });
  });
});
