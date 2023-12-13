import { useCallback, useEffect, useState } from "react";
import {
  VscFile,
  VscFolder,
  VscReply,
  VscTrash,
  VscOutput,
  VscNewFile,
  VscNewFolder,
} from "react-icons/vsc";

import { isDir, isRoot, parentDir } from "../utils/fs";
import { actions, thunks } from "../store/actions";
import {
  useAppDispatch,
  useWorkingDir,
  useWorkingDirFiles,
} from "../store/hooks";

import "./WorkingDirectory.scss";
import { Delimiter } from "../api/s3-client";
import { ShowFileModal } from "./modals/ShowFileModal";
import { CreateDirModal } from "./modals/CreateDirModal";

type OpenedModal = null | "open-file" | "create-file" | "create-dir";

export const WorkingDirectory = () => {
  const workingDir = useWorkingDir();
  const files = useWorkingDirFiles();
  const dispatch = useAppDispatch();

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [openedModal, setOpenedModal] = useState<OpenedModal>(null);

  const selectedFile = selectedIdx !== null ? files[selectedIdx] : null;
  const isFileSelected = selectedFile && !isDir(selectedFile);

  const onCloseModal = useCallback(() => setOpenedModal(null), []);

  const handleGoUp = useCallback(
    () => dispatch(actions.setWorkingDir(parentDir(workingDir))),
    [workingDir, dispatch]
  );

  const handleDeleteFile = useCallback(async () => {
    if (selectedFile) {
      await dispatch(thunks.deleteFile(`${workingDir}${selectedFile}`));
      setSelectedIdx(null);
    }
  }, [workingDir, selectedFile, dispatch]);

  const handleOpenFile = useCallback(
    () => selectedFile && setOpenedModal("open-file"),
    [selectedFile]
  );

  const handleCreateFile = useCallback(() => setOpenedModal("create-file"), []);

  const handleCreateDir = useCallback(() => setOpenedModal("create-dir"), []);

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
        <button onClick={handleCreateFile}>
          <VscNewFile className="icon" /> New File
        </button>
        <button onClick={handleCreateDir}>
          <VscNewFolder className="icon" /> New Dir
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

      <ShowFileModal
        isOpen={openedModal === "open-file"}
        onClose={onCloseModal}
        path={`${workingDir}${selectedFile}`}
      />

      <CreateDirModal
        isOpen={openedModal === "create-dir"}
        onClose={onCloseModal}
      />
    </div>
  );
};
