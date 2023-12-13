import { useContext } from "react";
import { LoginForm } from "./components/LoginForm";
import { ApiClientContext } from "./api/context";
import { FileBrowser } from "./components/FileBrowser";

import "./App.scss";

export const App = () => {
  const { client } = useContext(ApiClientContext);

  return (
    <>
      <h1>AWS S3 File Browser</h1>
      {client ? <FileBrowser /> : <LoginForm />}
    </>
  );
};
