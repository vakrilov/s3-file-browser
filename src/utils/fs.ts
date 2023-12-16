import { Delimiter } from "@/api/s3-client";

export const isRoot = (path: string) => path === "";

export const isDir = (path: string) => path[path.length - 1] === "/";

export const parentDir = (path: string) => {
  if (isRoot(path)) return path;

  const idx = isDir(path)
    ? path.lastIndexOf("/", path.length - 2)
    : path.lastIndexOf("/");

  return path.slice(0, idx + 1);
};

export const parentDirs = (path: string) => {
  if (isRoot(path)) return [];

  const parents = [];
  let current = parentDir(path);
  while (!isRoot(current)) {
    parents.push(current);
    current = parentDir(current);
  }
  return parents;
};

export const fileName = (dir: string) => {
  if (isRoot(dir)) return dir;

  const parts = dir.split(Delimiter);
  if (isDir(dir)) parts.pop();

  return parts[parts.length - 1];
};

export const fileCompare = (a: string, b: string) => {
  if (isDir(a) && !isDir(b)) return -1;
  if (!isDir(a) && isDir(b)) return 1;
  return a.localeCompare(b);
};
