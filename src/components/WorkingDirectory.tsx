import { useWorkingDir } from "../store/selectors";
import "./WorkingDirectory.scss";

export const WorkingDirectory = () => {
  const workingDir = useWorkingDir();

  return (
    <div className="working-directory">
      <h1>WorkingDirectory</h1>
      <div>current: ~/{workingDir}</div>

    </div>
  );
};
