import type { Credentials } from "./context";
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2Output,
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export const Delimiter = "/";
export const EmptyDirFile = "__empty_dir__";
const MaxKeys = 1000;

const isDefined = <T>(x: T | undefined): x is T => x !== null;

export class S3FileBrowserClient {
  private apiClient: S3Client;
  private bucket: string;

  constructor({ region, accessKeyId, secretAccessKey, bucket }: Credentials) {
    this.apiClient = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucket = bucket;
  }

  public testConnection = async () => {
    try {
      await this.apiClient.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          MaxKeys: 1,
        })
      );
      return true;
    } catch (e) {
      return false;
    }
  };

  public createFile = async (path: string, content: string) =>
    await this.apiClient.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: path,
        Body: content,
      })
    );

  public readFile = async (path: string) => {
    const response = await this.apiClient.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: path,
      })
    );
    return await response.Body?.transformToString();
  };

  public deleteFile = async (path: string) =>
    await this.apiClient.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: path,
      })
    );

  public createDir = async (path: string) =>
    await this.apiClient.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: `${path}${EmptyDirFile}`,
        Body: "",
      })
    );

  public loadDir = async (path: string) => {
    const response = await this.apiClient.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: path,
        Delimiter,
      })
    );

    const dirs = (response.CommonPrefixes ?? [])
      .map((common) => common.Prefix)
      .filter(isDefined);

    const files = (response.Contents ?? [])
      .map((contents) => contents.Key)
      .filter(isDefined);

    return [...dirs, ...files];
  };

  public getAllFiles = async () => {
    const results = [];
    let hasMore = true;
    let nextToken = undefined;

    while (hasMore) {
      const {
        Contents,
        IsTruncated,
        NextContinuationToken,
      }: ListObjectsV2Output = await this.apiClient.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          MaxKeys,
          ContinuationToken: nextToken,
        })
      );

      if (Contents) {
        results.push(...Contents);
        hasMore = !!IsTruncated;
        nextToken = NextContinuationToken;
      } else {
        hasMore = false;
      }
    }

    return results.map((r) => r?.Key).filter(Boolean) as string[];
  };

  public deleteAllFiles = async () => {
    const files = await this.getAllFiles();
    const deletePromises = files.map((path) => {
      return this.deleteFile(path);
    });
    await Promise.all(deletePromises);
  };
}
