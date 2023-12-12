import { isRoot } from "./fs";

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
