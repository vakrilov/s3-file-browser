import { useCallback, useEffect, useState } from "react";
import {
  VscReply,
  VscTrash,
  VscNewFile,
  VscNewFolder,
  VscGoToFile,
} from "react-icons/vsc";

import { isDir, isRoot, parentDir } from "../../utils/fs";
import { actions, thunks } from "../../store/actions";
import {
  useAppDispatch,
  useWorkingDir,
  useWorkingDirFiles,
} from "../../store/hooks";

import "./WorkingDirectory.scss";
import { ShowFileModal } from "../modals/ShowFileModal";
import { CreateObjectModal } from "../modals/CreateObjectModal";
import { WorkingDirectoryItem } from "./WorkingDirectoryItem";

type OpenedModal = null | "open-file" | "create-file" | "create-dir";

export const WorkingDirectory = () => {
  const workingDir = useWorkingDir();
  const files = useWorkingDirFiles();
  const dispatch = useAppDispatch();

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [openedModal, setOpenedModal] = useState<OpenedModal>(null);

  const selectedFile = selectedIdx !== null ? files[selectedIdx] : null;
  const isFileSelected = selectedFile && !isDir(selectedFile);

  const handleCloseModal = useCallback(() => setOpenedModal(null), []);

  const handleGoUp = useCallback(
    () => dispatch(actions.setWorkingDir(parentDir(workingDir))),
    [workingDir, dispatch]
  );

  const handleDeleteFile = useCallback(async () => {
    if (
      isFileSelected &&
      confirm(`Are you sure you want to delete ${selectedFile}?`)
    ) {
      await dispatch(thunks.deleteFile(`${workingDir}${selectedFile}`));
      setSelectedIdx(null);
    }
  }, [workingDir, isFileSelected, selectedFile, dispatch]);

  const handleOpenFile = useCallback(
    () => selectedFile && setOpenedModal("open-file"),
    [selectedFile]
  );

  const handleItemClick = useCallback(
    (file: string) => {
      if (selectedFile === file) {
        if (isDir(file)) {
          dispatch(actions.setWorkingDir(`${workingDir}${file}`));
        } else {
          handleOpenFile();
        }
      }
    },
    [selectedFile, workingDir, handleOpenFile, dispatch]
  );

  const handleFocus = useCallback(
    (file: string) => setSelectedIdx(files.indexOf(file)),
    [files]
  );

  useEffect(() => setSelectedIdx(null), [workingDir]);

  return (
    <div className="working-directory">
      <div className="commands">
        <button onClick={handleGoUp} disabled={isRoot(workingDir)}>
          <VscReply className="icon up" />
        </button>
        <button onClick={handleDeleteFile} disabled={!isFileSelected}>
          <VscTrash className="icon" />
        </button>
        <button onClick={handleOpenFile} disabled={!isFileSelected}>
          <VscGoToFile className="icon" />
        </button>
        <button onClick={() => setOpenedModal("create-file")}>
          <VscNewFile className="icon" />
        </button>
        <button onClick={() => setOpenedModal("create-dir")}>
          <VscNewFolder className="icon" />
        </button>
      </div>

      <div className="file-list">
        <span className="current-dir">~/{workingDir}</span>

        <ul>
          {files.map((file, idx) => (
            <WorkingDirectoryItem
              key={file}
              file={file}
              selected={idx === selectedIdx}
              onClick={handleItemClick}
              onFocus={handleFocus}
            />
          ))}
        </ul>
      </div>

      <ShowFileModal
        isOpen={openedModal === "open-file"}
        onClose={handleCloseModal}
        path={`${workingDir}${selectedFile}`}
      />

      <CreateObjectModal
        isOpen={openedModal === "create-dir"}
        type="dir"
        onClose={handleCloseModal}
      />

      <CreateObjectModal
        isOpen={openedModal === "create-file"}
        type="file"
        onClose={handleCloseModal}
      />
    </div>
  );
};
