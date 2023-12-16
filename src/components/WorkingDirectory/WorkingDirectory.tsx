import { useCallback, useEffect, useState } from "react";
import {
  VscReply,
  VscTrash,
  VscNewFile,
  VscNewFolder,
  VscGoToFile,
} from "react-icons/vsc";

import { isDir, isRoot, parentDir } from "@/utils/fs";
import { actions, thunks } from "@/store/actions";
import {
  useAppDispatch,
  useWorkingDir,
  useWorkingDirFiles,
} from "@/store/selectors";

import "./WorkingDirectory.scss";
import { ShowFileModal } from "../modals/ShowFileModal";
import { CreateObjectModal } from "../modals/CreateObjectModal";
import { WorkingDirectoryItem } from "./WorkingDirectoryItem";

type OpenedModal = null | "open-file" | "create-file" | "create-dir";

export const WorkingDirectory = () => {
  const dispatch = useAppDispatch();
  const workingDir = useWorkingDir();
  const files = useWorkingDirFiles();

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [openedModal, setOpenedModal] = useState<OpenedModal>(null);
  const isFileSelected = selectedFile && !isDir(selectedFile);

  // Reset selection when working dir changes
  useEffect(() => setSelectedFile(null), [workingDir]);

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
      setSelectedFile(null);
    }
  }, [workingDir, isFileSelected, selectedFile, dispatch]);

  const handleOpenFile = useCallback(
    () => selectedFile && setOpenedModal("open-file"),
    [selectedFile]
  );

  const handleItemActivate = useCallback(
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
          {files.map((file) => (
            <WorkingDirectoryItem
              key={file}
              file={file}
              selected={file === selectedFile}
              onActivate={handleItemActivate}
              onFocus={setSelectedFile}
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
