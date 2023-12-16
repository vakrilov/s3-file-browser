import {
  isRoot,
  isDir,
  parentDir,
  parentDirs,
  fileName,
  fileCompare,
} from "./fs";

describe("isRoot", () => {
  test("is true for empty path", () => {
    expect(isRoot("")).toBe(true);
  });
  test("is false for non-empty path", () => {
    expect(isRoot("/")).toBe(false);
    expect(isRoot("/foo")).toBe(false);
    expect(isRoot("foo")).toBe(false);
  });
});

describe("isDir", () => {
  test("is true for paths ending in /", () => {
    expect(isDir("/foo/")).toBe(true);
    expect(isDir("foo/")).toBe(true);
    expect(isDir("foo/bar/")).toBe(true);
  });
  test("is false for paths not ending in /", () => {
    expect(isDir("foo")).toBe(false);
    expect(isDir("foo.txt")).toBe(false);
    expect(isDir("foo/bar")).toBe(false);
    expect(isDir("foo/bar.txt")).toBe(false);
  });
});

describe("parentDir", () => {
  test("returns root for root", () => {
    expect(parentDir("")).toBe("");
  });
  test("returns parent for dir", () => {
    expect(parentDir("foo/")).toBe("");
    expect(parentDir("foo/bar/")).toBe("foo/");
  });
  test("returns parent dir for file", () => {
    expect(parentDir("bar")).toBe("");
    expect(parentDir("foo/bar")).toBe("foo/");
    expect(parentDir("foo/bar.txt")).toBe("foo/");
  });
});

describe("parentDirs", () => {
  test("returns empty for root", () => {
    expect(parentDirs("")).toEqual([]);
  });
  test("returns parent for dir", () => {
    expect(parentDirs("foo/")).toEqual([]);
    expect(parentDirs("foo/bar/")).toEqual(["foo/"]);
  });
  test("returns parent dir for file", () => {
    expect(parentDirs("bar")).toEqual([]);
    expect(parentDirs("foo/bar")).toEqual(["foo/"]);
    expect(parentDirs("foo/bar.txt")).toEqual(["foo/"]);
  });
});

describe("fileName", () => {
  test("returns root for root", () => {
    expect(fileName("")).toBe("");
  });
  test("returns dir name for dir", () => {
    expect(fileName("foo/")).toBe("foo");
    expect(fileName("foo/bar/")).toBe("bar");
  });
  test("returns file name for file", () => {
    expect(fileName("bar")).toBe("bar");
    expect(fileName("foo/bar")).toBe("bar");
    expect(fileName("foo/bar.txt")).toBe("bar.txt");
  });
});

describe("fileCompare", () => {
  test("dirs come before files", () => {
    expect(fileCompare("foo/", "bar")).toBe(-1);
    expect(fileCompare("bar", "foo/")).toBe(1);
  });
  test("dirs are sorted alphabetically", () => {
    expect(fileCompare("bar/", "foo/")).toBe(-1);
    expect(fileCompare("foo/", "bar/")).toBe(1);
  });
  test("files are sorted alphabetically", () => {
    expect(fileCompare("bar", "foo")).toBe(-1);
    expect(fileCompare("foo", "bar")).toBe(1);
  });
});
