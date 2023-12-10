import { VscFile, VscFolder } from "react-icons/vsc";
import { useWorkingDir, useWorkingDirFiles } from "../store/selectors";
import "./WorkingDirectory.scss";
import { useCallback } from "react";
import { actions, useAppDispatch } from "../store/store";
import { Delimiter } from "../api/s3-client";
import { parentDir } from "../utils/fs";

export const WorkingDirectory = () => {
  const workingDir = useWorkingDir();
  const files = useWorkingDirFiles();
  const dispatch = useAppDispatch();

  const handleDirChange = useCallback(
    (path: string) => dispatch(actions.setWorkingDir(`${workingDir}${path}`)),
    [workingDir, dispatch]
  );

  const handleGoUp = useCallback(() => {
    dispatch(actions.setWorkingDir(parentDir(workingDir)));
  }, [workingDir, dispatch]);

  return (
    <div className="working-directory">
      <h1>WorkingDirectory</h1>
      <div>current: ~/{workingDir}</div>
      <div>
        <button onClick={handleGoUp}>../</button>
      </div>

      <ul>
        {files.map((file) => {
          const isDir = file.endsWith("/");
          if (isDir) {
            return (
              <li key={file} onClick={() => handleDirChange(file)}>
                <VscFolder />
                {file}
              </li>
            );
          } else {
            return (
              <li key={file} onClick={() => console.log(file)}>
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
