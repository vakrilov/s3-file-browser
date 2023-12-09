import { useContext } from "react";
import { range } from "lodash-es";
import { ApiClientContext } from "../api/context";

import "./DebugTools.scss";

const createStructure = (
  prefix: string,
  lvl = 0
): { name: string; content: string }[] => {
  const files = range(5).map((i) => ({
    name: `${prefix}/file${i}.txt`,
    content: `This is file ${i}`,
  }));

  if (lvl < 2) {
    const dirs = range(3).map((i) =>
      createStructure(`${prefix}/folder${i}`, lvl + 1)
    );
    return [...files, ...dirs.flat()];
  } else {
    return files;
  }
};

export const DebugTools = () => {
  const { client, clearClient } = useContext(ApiClientContext);

  const getAll = async () => {
    const files = await client?.getAllFiles();
    console.log(files);
  };

  const deleteAll = async () => client?.deleteAllFiles();

  const createSampleData = async () => {
    const files = createStructure("");
    const createPromises = files.map(({ name, content }) =>
      client?.createFile(name, content)
    );
    await Promise.all(createPromises);
  };

  return (
    <div className="stack">
      <h1>Debug Tools</h1>
      <button onClick={getAll}>get all</button>
      <button onClick={deleteAll}>delete all</button>
      <button onClick={createSampleData}>sample data</button>
      <button onClick={clearClient}>log-out</button>
    </div>
  );
};
