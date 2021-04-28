# Rize Boilerplate UI

## Prerequisites
- NodeJS v12 and up
    - Check nvm to manage multiple versions of node/npm on your local
- Expo CLI version 3.27.8
- [Git](https://git-scm.com/)
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall) for macOS users
- [iOS Simulator (macOS only)](https://docs.expo.io/workflow/ios-simulator/)
- [Android Emulator](https://docs.expo.io/workflow/android-studio-emulator/)

## Recommended Tools
- [VSCode Editor](https://code.visualstudio.com/download)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- Windows users: [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-core-on-windows) or Bash via WSL

## Installing Expo CLI
This boilerplate requires specifically the `3.27.8` version of the Expo CLI in order for it to run properly.
1. If you have Expo CLI already installed, check the version by running `expo --version`
2. If you have a different version installed, uninstall it first by running `npm uninstall -g expo-cli`
3. Install the `3.27.8` version by running `npm install -g expo-cli@3.27.8`

## Running the App
1. Clone the [RizeFinance/compliance-demo-ui](https://github.com/RizeFinance/compliance-demo-ui) repository on your machine
2. Run yarn to install the dependencies
3. At the root of the project directory, create a .env file with the following contents:
    ```
    REACT_NATIVE_RIZE_PROGRAM_ID=
    REACT_NATIVE_RIZE_HMAC=
    REACT_NATIVE_API_BASE_URL=http://localhost/api
    ```
    Place a working Rize Program ID and HMAC **(Note: These two will be removed in the future)**
    
    Replace the value of REACT_NATIVE_API_BASE_URL with the base URL of the middleware API.
4. Run one of the following:
    - For iOS (Make sure you have XCode and iOS Simulator installed):
        ```
        yarn ios
        ```
    - For android (Make sure you have an Android Emulator installed):
        ```
        yarn android
        ```

## Troubleshooting
- `XDLError: ValidationError: "scheme" is not allowed`
    - If you received this error message, make sure you have the Expo CLI version `3.27.8` installed on your machine. If you recently installed Expo CLI `3.27.8` coming from another version, delete the `.expo` folder in the project directory.