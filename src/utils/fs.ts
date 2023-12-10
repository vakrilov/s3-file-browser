export const isRoot = (path: string) => path === "";

export const isDir = (path: string) => path[path.length - 1] === "/";

export const parentDir = (path: string) => {
  if (isRoot(path)) return path;

  const idx = isDir(path)
    ? path.lastIndexOf("/", path.length - 2)
    : path.lastIndexOf("/");

  return path.slice(0, idx + 1);
};
