import { useCallback, useEffect, useState } from "react";
import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import "./App.css";
import { Credentials, LoginForm } from "./components/LoginForm";

const accessKeyId = "AKIATOK7VIOC75HLBJWT";
const secretAccessKey = "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";
const region = "eu-west-1";
const bucket = "llib-236960695173-10";

function App() {
  const initClient = useCallback(
    async ({ bucket, region, accessKeyId, secretAccessKey }: Credentials) => {
      console.log({ bucket, region, accessKeyId, secretAccessKey });
      const client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      console.log(
        await client.send(
          new ListObjectsV2Command({
            Bucket: bucket,
          })
        )
      );
    },
    []
  );

  // useEffect(() => {
  //   const client = new S3Client({
  //     region,
  //     credentials: {
  //       accessKeyId,
  //       secretAccessKey,
  //     },
  //   });

  //   const execute = async () => {
  //     // console.log(
  //     //   await client.send(
  //     //     new PutObjectCommand({
  //     //       Bucket: bucket,
  //     //       Key: "object12.txt",
  //     //       Body: "test",
  //     //     })
  //     //   )
  //     // );
  //     // console.log(
  //     //   await client.send(
  //     //     new PutObjectCommand({
  //     //       Bucket: bucket,
  //     //       Key: "folder/object22.txt",
  //     //       Body: "test",
  //     //     })
  //     //   )
  //     // );

  //     console.log(
  //       await client.send(
  //         new ListObjectsV2Command({
  //           Bucket: bucket,
  //         })
  //       )
  //     );

  //     console.log(
  //       await client.send(
  //         new ListObjectsV2Command({
  //           Bucket: bucket,
  //           Delimiter: "/",
  //           Prefix: "",
  //         })
  //       )
  //     );
  //   };
  //   execute();
  // }, []);

  return (
    <>
      <h1>AWS S3 File Browser</h1>
      <LoginForm onSubmit={initClient} />
    </>
  );
}

export default App;
