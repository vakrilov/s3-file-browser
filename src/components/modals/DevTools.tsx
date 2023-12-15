import { FC, useCallback, useContext, useState } from "react";
import { Modal } from "./Modal";
import { range } from "lodash-es";

import "./DevTools.scss";
import { ApiClientContext } from "../../api/context";
import { Loader } from "../Loader";
import { actions, thunks } from "../../store/actions";
import { useAppDispatch } from "../../store/hooks";

const randNum = () => Math.floor(Math.random() * 1000);

const createFiles = (
  prefix = "",
  lvl = 0
): { path: string; body: string }[] => {
  const files = range(3).map(() => ({
    path: `${prefix}file-${randNum()}.txt`,
    body: `This is sample file!`,
  }));

  if (lvl < 4) {
    const dirs = range(2).map(() =>
      createFiles(`${prefix}dir-lvl${lvl}-${randNum()}/`, lvl + 1)
    );
    return [...files, ...dirs.flat()];
  } else {
    return files;
  }
};

type Props = {
  isOpen: boolean;
  onClose?: () => void;
};

export const DevToolsModal: FC<Props> = ({ isOpen, onClose }) => {
  const { client } = useContext(ApiClientContext);
  const [isExecuting, setIsExecuting] = useState(false);
  const dispatch = useAppDispatch();
  const disableActions = !client || isExecuting;

  const logAllFiles = useCallback(async () => {
    setIsExecuting(true);
    try {
      console.log(await client?.getAllFiles());
    } finally {
      setIsExecuting(false);
    }
  }, [client]);

  const createSampleData = useCallback(async () => {
    setIsExecuting(true);
    try {
      const filesToCreate = createFiles();

      const createPromises = filesToCreate.map((fileInfo) =>
        dispatch(thunks.createFile(fileInfo))
      );
      await Promise.all(createPromises);
      dispatch(actions.setWorkingDir(""));
    } finally {
      setIsExecuting(false);
    }
  }, [dispatch]);

  const deleteAll = useCallback(async () => {
    if (client && confirm("Are you sure?")) {
      setIsExecuting(true);
      try {
        const filesToDelete = await client.getAllFiles();
        const deletePromises = filesToDelete.map((file) =>
          dispatch(thunks.deleteFile(file))
        );
        await Promise.all(deletePromises);
        dispatch(actions.setWorkingDir(""));
      } finally {
        setIsExecuting(false);
      }
    }
  }, [client, dispatch]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="dev-tools-modal">
      <Modal.Header>Developer Tools</Modal.Header>
      <Modal.Content>
        <button className="btn" onClick={logAllFiles} disabled={disableActions}>
          Log all object
        </button>

        <button
          className="btn"
          onClick={createSampleData}
          disabled={disableActions}
        >
          Fill in sample data
        </button>
        <button
          className="btn danger"
          onClick={deleteAll}
          disabled={disableActions}
        >
          Delete all files
        </button>
        {isExecuting && <Loader className="executing-loader" variant="large" />}
      </Modal.Content>
    </Modal>
  );
};
