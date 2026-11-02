# DevLog

In this GitHub repository you can find the source code and all documentation about the **DevLog** portfolio project.

## About the project

In this project I used many technologies, which I've learned previously: **React, TypeScript, Express, Axios, Supabase, GitHub REST API**.

I tried to challenge myself instead of making a regular to-do app.

You'll be able to find all the versions in the tags over time.

## About v0.1

### Features

#### Frontend
* Login: The user is able to log in to their own account.
* Registration: Newcomers are able to create new accounts.
* Homepage: On the homepage, the website loads the user data from the database safely.

#### Backend
* `server.ts` uses the methods from separate files.
* Each method is able to handle errors and send back the response to the client side.
* The backend uses the **Day.js npm library** to get the current date when a user creates their account.

#### Database
* The database uses multiple RLS policies for user protection.

### Getting started

### Method 1:
1. Download the source code from here using the *"green Code → Download ZIP"* button.
2. Extract the files into a folder.
3. Open an IDE (e.g. Visual Studio Code).
4. Open a new terminal and navigate to the project folder.

```bash
cd <DevLog location>
```

5. Type the following commands:

```bash
npm install
```

```bash
npm run dev
```

### Method 2:
1. In an IDE's terminal (e.g. Visual Studio Code), type the following command:

```bash
git clone https://github.com/SzaboXaver/DevLog.git
```

2. Navigate to the project folder:

```bash
cd <DevLog>
```

Here you can click: File → Open Folder, or type the following command in the terminal:

```bash
code . -r
```
