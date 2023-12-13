import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useState,
} from "react";
import { clearObject, getObject, setObject } from "../utils/local-storage";
import { S3FileBrowserClient } from "./s3-client";

const CREDENTIALS_KEY = "s3-browser-credentials";

export type Credentials = {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

export type ApiClientContextType = {
  client: S3FileBrowserClient | null;
  initClient: (credentials: Credentials) => Promise<boolean>;
  clearClient: () => void;
};

const saveCredentials = (credentials: Credentials): void =>
  setObject(CREDENTIALS_KEY, credentials);

const loadCredentials = (): Credentials | null => getObject(CREDENTIALS_KEY);

const clearCredentials = (): void => clearObject(CREDENTIALS_KEY);

const credentials = loadCredentials();
const initialClient = credentials && new S3FileBrowserClient(credentials);

export const ApiClientContext = createContext<ApiClientContextType>({
  client: null,
  initClient: async () => false,
  clearClient: () => {},
});

export const ApiClientProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [client, setClient] = useState(initialClient);

  const initClient = useCallback(
    async (credentials: Credentials) => {
      const client = new S3FileBrowserClient(credentials);

      const test = await client.testConnection();
      if (!test) {
        return false;
      }

      saveCredentials(credentials);
      setClient(client);
      return true;
    },
    [setClient]
  );

  const clearClient = useCallback(() => {
    clearCredentials();
    setClient(null);
  }, [setClient]);

  return (
    <ApiClientContext.Provider value={{ client, initClient, clearClient }}>
      {children}
    </ApiClientContext.Provider>
  );
};
