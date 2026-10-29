# DevLog
In this Github repository you can find the source code and all documentation about the **DevLog** portfolio project.
## About the project
In this project I used many technologies, which I've learned before: **React, TypeScript, Express, Axios, Supabase, Github REST API**.
I tried to challange myself instead of making a regular to-do app.
You'll be able to find all the versions in each tags by the time.

## About v0.1
### Features
  #### Frontend
  * Login: The user is able to login into his own account.
  * Registration: New commers are able to create new accounts.
  * HomePage: In HomePage, the website, loads the user data from the databse safely.
  #### Backend
  * server.ts uses the methods from seperated files.
  * Each method is able to handle the errors and send back the response to the client-side.
  * backend uses **dayjs npm library** to get the current date, when user created his account. 
  #### Database
  * Database uses multiple TLS rules for user protection.

### Getting started
### Method 1:
  1. Download the source code from here with the *"green code -> download-zip"* button
  1. Extract files in a folder
  1. Open an IDE (e.g. VisualStudio Code)
  1. Open a new terminal and navigate into the project folder
  ```bash
  cd <DevLog location>
  ```
  1. Write the follows:
  ``` bash
  npm install
  ```
  ``` bash
  npm run dev
  ```
### Method 2:
  1. In an IDE's terminal (e.g. VisualStudio Code) write the follows:
  ``` bash
  git clone https://github.com/SzaboXaver/DevLog.git
  ```
  ``` bash
  cd <DevLog>
  ```
  Here you can click: file -> open folder or in the terminal:
  ``` bash
  code . -r
  ```
