import { FunctionComponent, useCallback, useState } from "react";
import { Modal } from "./Modal";
import { thunks } from "../../store/actions";
import {
  useAppDispatch,
  useWorkingDir,
  useWorkingDirFiles,
} from "../../store/hooks";
import { Loader } from "../Loader";
import { Delimiter } from "../../api/s3-client";

import "./CreateObjectModal.scss";

const regex = /^\w+$/;
const isValidName = (str: string) => regex.test(str);

type Props = {
  isOpen: boolean;
  type: "file" | "dir";
  onClose: () => void;
};

export const CreateObjectModal: FunctionComponent<Props> = ({
  isOpen,
  type,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const workingDir = useWorkingDir();
  const files = useWorkingDirFiles();

  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = isValidName(name);
  const alreadyExists =
    files.includes(name) || files.includes(`${name}${Delimiter}`);

  const canSubmit = isValid && !alreadyExists && !loading;

  const handleCreate = useCallback(async () => {
    if (!canSubmit) {
      return;
    }
    setLoading(true);
    if (type === "file") {
      await dispatch(
        thunks.createFile({
          path: `${workingDir}${name}`,
          body,
        })
      );
    } else {
      await dispatch(thunks.createDir(`${workingDir}${name}${Delimiter}`));
    }
    setName("");
    setBody("");
    setLoading(false);
    onClose();
  }, [canSubmit, type, workingDir, name, body, onClose, dispatch]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="create-obj-modal">
        Create new directory
        <div>
          {workingDir}
          <input value={name} onChange={(e) => setName(e.target.value)} />
          {type === "dir" && Delimiter}
        </div>
        {loading && <Loader />}
        {alreadyExists && <div>Already exists</div>}
        {name && !isValid && <div>Not a valid name</div>}
        {type === "file" && (
          <textarea value={body} onChange={(e) => setBody(e.target.value)} />
        )}
        <button onClick={handleCreate} disabled={!canSubmit}>
          Create
        </button>
      </div>
    </Modal>
  );
};
