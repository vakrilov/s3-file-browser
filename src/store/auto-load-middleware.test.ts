/* eslint-disable @typescript-eslint/no-explicit-any */
import { MiddlewareAPI } from "@reduxjs/toolkit";
import { S3FileBrowserClient } from "../api/s3-client";
import { createAutoLoadDirMiddleware } from "./auto-load-middleware";
import { AppDispatch, RootState } from "./store";
import { actions } from "./actions";

const getMockClient = () => {
  const client = {
    loadDir: jest.fn(),
  } as unknown as S3FileBrowserClient;

  const store = {
    getState: jest.fn(),
    dispatch: jest.fn(),
  } as unknown as MiddlewareAPI<AppDispatch, RootState>;

  const nextMock = jest.fn();

  const callMiddleware = createAutoLoadDirMiddleware(client)(store)(nextMock);

  return {
    loadDirMock: client.loadDir as jest.Mock,
    getStateMock: store.getState as jest.Mock,
    dispatchMock: store.dispatch as jest.Mock,
    nextMock: nextMock,
    callMiddleware,
  };
};

describe("AutoLoadDirMiddleware", () => {
  const { loadDirMock, nextMock, getStateMock, dispatchMock, callMiddleware } =
    getMockClient();
  beforeEach(() => jest.resetAllMocks());

  test("should call next", () => {
    callMiddleware({ type: "test" });
    expect(nextMock).toHaveBeenCalledTimes(1);
  });

  describe.each([actions.setWorkingDir("foo/"), actions.expandDir("foo/")])(
    "on $type action",
    (action) => {
      test("should call client loadDir", async () => {
        getStateMock.mockReturnValue({ files: [], loadingDirs: [] });
        loadDirMock.mockResolvedValue([]);

        await callMiddleware(action);
        expect(loadDirMock).toHaveBeenCalledTimes(1);
      });

      test("should not call client loadDir if directory is already loading", async () => {
        getStateMock.mockReturnValue({ files: [], loadingDirs: ["foo/"] });
        loadDirMock.mockResolvedValue([]);

        await callMiddleware(action);
        expect(loadDirMock).not.toHaveBeenCalled();
      });

      test("should dispatch startLoading and endLoading", async () => {
        getStateMock.mockReturnValue({ files: [], loadingDirs: [] });
        loadDirMock.mockResolvedValue([]);

        await callMiddleware(action);
        expect(dispatchMock).toHaveBeenCalledWith(actions.startLoading("foo/"));
        expect(dispatchMock).toHaveBeenCalledWith(actions.endLoading("foo/"));
      });

      test("should dispatch removeFiles for files not returned by API", async () => {
        getStateMock.mockReturnValue({ files: ["foo/old"], loadingDirs: [] });
        loadDirMock.mockResolvedValue([]);

        await callMiddleware(action);

        expect(dispatchMock).toHaveBeenCalledWith(
          actions.removeFiles(["foo/old"])
        );
      });

      test("should dispatch addFiles for files new files returned by API", async () => {
        getStateMock.mockReturnValue({ files: ["foo/old"], loadingDirs: [] });
        loadDirMock.mockResolvedValue(["foo/new"]);

        await callMiddleware(action);

        expect(dispatchMock).toHaveBeenCalledWith(
          actions.addFiles(["foo/new"])
        );
      });
    }
  );
});
