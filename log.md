# AWS API Exploration
- Will use https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-s3
- Reading the [docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/ListObjectsV2Command/) - seems that using `Prefix` + `Delimiter` might be enough to implement to lazily load files in a particular folder.

- What to do with empty directories? 
  - Option 1: Create a `<path>/new_dir/.` file when creating a new directory to enforce the directory structure. The `.` file can be hidden in the UI.
  - Option 2: Keep newly created dirs only on the client side. Dont like it too much as they wont be persisted on the BE and won't survive refreshes
