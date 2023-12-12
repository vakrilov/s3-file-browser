import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Modal } from "./Modal";
import { thunks } from "../../store/actions";
import { useAppDispatch } from "../../store/hooks";
import { VscLoading } from "react-icons/vsc";
import { Loader } from "../Loader";

type ShowFileModalProps = {
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

export const ShowFileModal: FunctionComponent<ShowFileModalProps> = ({
  isOpen,
  onClose,
  path,
}) => {
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>{path}</div>
      <div>{fileBody === null ? <Loader /> : fileBody}</div>
    </Modal>
  );
};
