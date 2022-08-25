<p align="center">
  <a href="https://rizefs.com" target="_blank" align="center">
    <img src="https://rizefs.com/wp-content/uploads/2021/01/rizelogo-grey.svg" width="200">
  </a>
  <br />
</p>





*Make financial services simple and accessible. Rize enables fintechs, financial institutions and brands to build across multiple account types with one API.* *If you want to join us [<kbd>**Check out our open positions**</kbd>](https://rizefs.com/careers/)_*



# Rize Prototype UI



## Warning!

This application is not an codeless solution for you and your team. Rize used this app to demo off new features such as Debit Cards and Brokerage accounts. 

This application requires a server application built by the [Rize CLI](https://github.com/RizeFinance/rize-cli) tool to support it's requests.

This application is supported by Rize in a web environment so you may need to make adjustments for IOS or Android.

**Have you watched the ["Build a Banking Application In Less Than 30 Minutes"](https://www.youtube.com/watch?v=m_uHTh8009c&t=1s) video?**



## Prerequisites

- NodeJS v12 and up
  - Check [nvm](https://github.com/creationix/nvm) to manage multiple versions of node/npm on your local
- Expo CLI version `3.27.8`
- [Git](https://git-scm.com/)
- Have added a registry user account for the GitHub Package registry for the `@rizefinance` scope ([more](#adding-the-registry-user-account))
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall) for macOS users
- [iOS Simulator (macOS only)](https://docs.expo.io/workflow/ios-simulator/)
- [Android Emulator](https://docs.expo.io/workflow/android-studio-emulator/)



## Recommeded Tools

- [VSCode Editor](https://code.visualstudio.com/download)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- Windows users: [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-core-on-windows) or Bash via WSL



## Installing Expo CLI

This boilerplate requires specifically the `3.27.8` version of the Expo CLI in order for it to run properly.

1. If you have Expo CLI already installed, check the version by running `expo --version`
2. If you have a different version installed, uninstall it first by running `npm uninstall -g expo-cli`
3. Install the `3.27.8` version by running `npm install -g expo-cli@3.27.8`



## Logging in to the GitHub Package Registry

1. Run `npm login --scope=@rizefinance --registry=https://npm.pkg.github.com`
2. Input your GitHub Username.
3. For the Password, input your [GitHub Personal Access Token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token). Your token should have the following scopes/permissions: `repo`, `read:packages`
4. Input the email address that you're using in GitHub.

To confirm you should see the following lines when you run npm config list

```
@rizefinance:registry = "https://npm.pkg.github.com"
//npm.pkg.github.com/:_authToken = (protected)
```



## Getting Started

1. [Log in to GitHub Package Registry](#logging-in-to-the-github-package-registry)

2. Install the `@rizefinance/cli` package 

   ```sh
   npm i -g @rizefinance/cli
   ```

3. Create and run a new app

   ```sh
   rize create my-project
   cd my-project
   docker-compose up
   ```

4. Check if Application is running at `http://localhost/api/health-check`



## Running the App

1. Clone or fork the [RizeFinance/compliance-demo-ui](https://github.com/RizeFinance/compliance-demo-ui) repository on your machine

2. [Log in to GitHub Package Registry](#logging-in-to-the-github-package-registry)

3. If working locally, please spin up an application via the CLI tool

4. Run `yarn` to install the dependencies

5. At the root of the project directory, create a .env file with the following contents:

   ```
   REACT_NATIVE_API_BASE_URL=http://localhost/api
   ALLOW_SIGNUP=true
   DEFAULT_PRODUCT_UID={YOUR_PROGRAMS_DEFAULT_PRODUCT_UID}
   RIZE_ENV=sandbox
   DEBIT_CARD_SERVICE_URL=https://web-card-service-sandbox.rizefs.com
   ```

   Replace the value of `REACT_NATIVE_API_BASE_URL` with the base URL of the middleware API, if you're using a different URL and not local docker.

6. Run one of the following:

   1. For Web (Currently supported and tested):

      ```
      yarn web
      ```

   2. For iOS (Make sure you have XCode and iOS Simulator installed, not supported/tested):

      ```
      yarn ios
      ```

   3. For android (Make sure you have an Android Emulator installed, not supported/tested):

      ```
      yarn android
      ```



## Troubleshooting

- `XDLError: ValidationError: "scheme" is not allowed`
  - If you received this error message, make sure you have the Expo CLI version `3.27.8` installed on your machine. If you recently installed Expo CLI `3.27.8` coming from another version, delete the `.expo` folder in the project directory
