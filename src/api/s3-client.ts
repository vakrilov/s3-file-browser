import type { Credentials } from "./context";
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

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
}
