import { FC, useCallback, useEffect, useState } from "react";
import cx from "clsx";

import { Modal } from "./Modal";
import { thunks } from "@/store/actions";
import {
  useAppDispatch,
  useWorkingDir,
  useWorkingDirFiles,
} from "@/store/selectors";
import { Loader } from "../Loader";
import { Delimiter } from "@/api/s3-client";

import "./CreateObjectModal.scss";

const regex = /^[\w-]+$/;
const isValidName = (str: string) => regex.test(str);

type Props = {
  isOpen: boolean;
  type: "file" | "dir";
  onClose: () => void;
};

export const CreateObjectModal: FC<Props> = ({ isOpen, type, onClose }) => {
  const dispatch = useAppDispatch();
  const workingDir = useWorkingDir();
  const files = useWorkingDirFiles();

  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = isValidName(name);
  const alreadyExists =
    files.includes(name) || files.includes(`${name}${Delimiter}`);

  let error = "";
  if (alreadyExists) error = "File already exists";
  if (name && !isValid) error = "Not a valid name";

  const canSubmit = isValid && !alreadyExists && !loading;

  useEffect(() => {
    setLoading(false);
    setName("");
    setBody("");
  }, [isOpen]);

  const handleCreate = useCallback(async () => {
    if (!canSubmit) return;
    const path = `${workingDir}${name}`;

    setLoading(true);
    try {
      if (type === "file") {
        await dispatch(thunks.createFile({ path, body }));
      } else {
        await dispatch(thunks.createDir(`${path}${Delimiter}`));
      }
    } finally {
      setLoading(false);
    }

    onClose();
  }, [canSubmit, type, workingDir, name, body, onClose, dispatch]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="create-obj-modal">
      <Modal.Header>Create {type}</Modal.Header>
      <Modal.Content>
        <span className="label">Path</span>
        <div className="path">
          {workingDir}
          <input value={name} onChange={(e) => setName(e.target.value)} />
          {type === "dir" && Delimiter}
        </div>
        <span className={cx("error", error && "visible")}>{error}</span>
        {type === "file" && (
          <>
            <span className="label">Body</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} />
          </>
        )}
      </Modal.Content>
      <Modal.Footer>
        <button
          className="create-btn"
          onClick={handleCreate}
          disabled={!canSubmit}
        >
          Create
          {loading && <Loader />}
        </button>
      </Modal.Footer>
    </Modal>
  );
};
