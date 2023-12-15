import { FC, useCallback, useEffect, useState } from "react";
import { Modal } from "./Modal";
import { thunks } from "../../store/actions";
import { useAppDispatch } from "../../store/hooks";
import { Loader } from "../Loader";

import "./ShowFileModal.scss";

type Props = {
  isOpen: boolean;
  path: string;
  onClose?: () => void;
};

const useReadFile = (path: string) => {
  const dispatch = useAppDispatch();

  return useCallback(async () => {
    const action = thunks.readFile(path);
    const result = await dispatch(action);
    return result.payload as string;
  }, [path, dispatch]);
};

export const ShowFileModal: FC<Props> = ({ isOpen, onClose, path }) => {
  const readFileAction = useReadFile(path);
  const [fileBody, setFileBody] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      (async () => {
        setFileBody(null);
        const result = await readFileAction();
        setFileBody(result);
      })();
    }
  }, [isOpen, readFileAction]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="show-file-modal">
      <Modal.Header>Read File</Modal.Header>
      <Modal.Content>
        <div className="path">{path}</div>
        {fileBody === null ? (
          <Loader variant="large" />
        ) : (
          <textarea className="body" readOnly value={fileBody} />
        )}
      </Modal.Content>
    </Modal>
  );
};
