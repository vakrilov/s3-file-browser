import type { Credentials } from "./context";
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2Output,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const Delimiter = "/";
const MaxKeys = 1000;

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

  public loadFolder = async (path: string) => {
    const response = await this.apiClient.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: path,
        Delimiter,
      })
    );

    const folders =
      response.CommonPrefixes?.map((r) => r?.Prefix as string).filter(
        Boolean
      ) ?? [];
    const files =
      response.Contents?.map((r) => r?.Key as string).filter(Boolean) ?? [];

    return { folders, files };
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

  public deleteFile = async (path: string) => {
    await this.apiClient.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: path,
      })
    );
  };

  public deleteAllFiles = async () => {
    const files = await this.getAllFiles();
    const deletePromises = files.map((path) => {
      return this.deleteFile(path);
    });
    await Promise.all(deletePromises);
  };
}
