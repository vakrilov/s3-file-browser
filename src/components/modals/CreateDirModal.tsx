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

import "./CreateDirModal.scss";

const regex = /^\w+$/;
const isValidName = (str: string) => regex.test(str);

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateDirModal: FunctionComponent<Props> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const workingDir = useWorkingDir();
  const files = useWorkingDirFiles();

  const [name, setName] = useState("");
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
    await dispatch(thunks.createDir(`${workingDir}${name}${Delimiter}`));
    setName("");
    setLoading(false);
    onClose();
  }, [canSubmit, workingDir, name, onClose, dispatch]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="create-dir-modal">
        Create new directory
        <div>
          {workingDir}
          <input value={name} onChange={(e) => setName(e.target.value)} />/
        </div>
        {loading && <Loader />}
        {alreadyExists && <div>Already exists</div>}
        {name && !isValid && <div>Not a valid name</div>}
        <button onClick={handleCreate} disabled={!canSubmit}>
          Create
        </button>
      </div>
    </Modal>
  );
};
