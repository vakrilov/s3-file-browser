import { useCallback, useEffect, useState } from "react";
import {
  VscFile,
  VscFolder,
  VscReply,
  VscTrash,
  VscOutput,
} from "react-icons/vsc";

import { isDir, isRoot, parentDir } from "../utils/fs";
import { actions } from "../store/actions";
import {
  useAppDispatch,
  useWorkingDir,
  useWorkingDirFiles,
} from "../store/hooks";

import "./WorkingDirectory.scss";

export const WorkingDirectory = () => {
  const workingDir = useWorkingDir();
  const files = useWorkingDirFiles();
  const dispatch = useAppDispatch();

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const selectedFile = selectedIdx !== null && files[selectedIdx];
  const isFileSelected = selectedFile && !isDir(selectedFile);

  const handleGoUp = useCallback(() => {
    dispatch(actions.setWorkingDir(parentDir(workingDir)));
  }, [workingDir, dispatch]);

  const handleDeleteFile = useCallback(() => {
    console.log("delete file", selectedFile);
  }, [selectedFile, dispatch]);

  const handleOpenFile = useCallback(() => {
    console.log("open file", selectedFile);
  }, [selectedFile, dispatch]);

  const handleClick = useCallback(
    (file: string) => {
      if (selectedFile !== file) {
        setSelectedIdx(files.indexOf(file));
      } else if (selectedFile === file) {
        if (isDir(file)) {
          dispatch(actions.setWorkingDir(`${workingDir}${file}`));
        } else {
          handleOpenFile();
        }
      }
    },
    [files, selectedFile, workingDir, handleOpenFile, dispatch]
  );

  useEffect(() => setSelectedIdx(null), [workingDir]);

  return (
    <div className="working-directory">
      <div className="commands">
        <button onClick={handleGoUp} disabled={isRoot(workingDir)}>
          <VscReply className="icon up" /> Up
        </button>
        <button onClick={handleDeleteFile} disabled={!isFileSelected}>
          <VscTrash className="icon" /> Delete
        </button>
        <button onClick={handleOpenFile} disabled={!isFileSelected}>
          <VscOutput className="icon" /> Open
        </button>
      </div>

      <span className="current-dir">~/{workingDir}</span>

      <ul>
        {files.map((file, idx) => {
          const isDir = file.endsWith("/");
          const className = selectedIdx === idx ? "selected" : "";
          if (isDir) {
            return (
              <li
                className={className}
                key={file}
                onClick={() => handleClick(file)}
              >
                <VscFolder />
                {file}
              </li>
            );
          } else {
            return (
              <li
                className={className}
                key={file}
                onClick={() => handleClick(file)}
              >
                <VscFile />
                {file}
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};
