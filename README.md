# S3 File Browser


## Decisions
- **Production:** App is deployed at: https://main--statuesque-selkie-bb655a.netlify.app/ using Netlify
- **Styling:** "No CSS Frameworks and No Component libs", so decided to use plain-old SAAS for styling
- **API:** Using `@aws-sdk/client-s3` as suggested. AWS credentials are stored in local storage. Since it's a client only app without login I decided no to worry about security.
- **State:** Decided to use Redux(+Toolkit) for state management. Here is a quick breakdown of the store:
    - `files` - contains the list of files and folders. Folders always end with `/`
    - `workingDir` - contains the current path
    - `expandedDirs` - list of manually expanded directories. All folders form the `workingDir` are also treated as expanded, so that it is always visible in the tree-view 
    - `loadingDirs` - list of directories that are currently being loaded
    - `auto-load-middleware` - middleware that automatically refreshes the contents of a directory. Triggered when `workingDir` changes or a directory is expanded. It will also handle files that have been deleted.
- **Empty Directories:** To be able to create persist empty directories - a new file with a special name is created to "reserve" the name of the directory. This file is hidden in the UI and there is basic validation for the file names when creating so that it doesn't conflict with the special file names.
- **Bonus Features**
  - **Lazy Loading:** I assumed that the bucket can have many files or deep structure. This is why I decided not to load all objects at once, but only those that are needed. The AWS API has `Prefix` and `Delimiter` parameters that made that possible.
  - **Keyboard Navigation:** Spend some time to implement keyboard navigation (using up/down to navigate and left/right to expand/collapse). I thought it would be a nice addition to app.
  - **Dev-menu** with some commands to ease up testing - just for fun :)
- **Skipped Features:** Things I didn't do because I didn't find an elegant way to implement:
  - >A directory containing subdirectories should be marked so the user can understand that it can be expanded.
    - I didn't do that. Currently, when expanding a directory, all of its child directories can also be expanded. The reason for that is that I don't know if they have sub-directories and I cannot get that information with the same API call, that I use to initially load the parent directory. I decided it is an overkill to load all sub-directories just to check if they have children.
  - >The web app should be able to detect changes to the bucket and react appropriately by removing non-existent or displaying new directories or files.
    - Looking trough the [S3 Client API](https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-s3) I couldn't find a way to subscribe to changes in the bucket. I didn't want to do polling strategy and I decided that the auto-refresh of the `workingDir` and expandedDirs should be sufficient.
- **Cutting corners:** Things I didn't do because of time constraints:
  - **Error handling:** I didn't have time to add proper error handling. I just added some basic error messages for the most common errors.
  - **Tests:** I didn't have time to write proper tests. I just added tests for the most important selectors, auto-load-middleware and some utils and hooks.
