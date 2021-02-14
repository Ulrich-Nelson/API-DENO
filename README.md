# API-DENO

This project is an application skeleton for a typical [Node.js](https://deno.land/) web app.

## Getting Started
To get you started you can simply clone the repository:

```
https://github.com/Ulrich-Nelson/API-DENO
```

## Prerequisites
You need git to clone the repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

Before you start, check it or install Deno on your machine.
Deno est fourni comme un exécutable unique sans dépendances. Vous pouvez l'installer à l'aide des programmes d'installation ci-dessous ou télécharger un binaire de version à partir de la page des versions .

#### Shell (Mac, Linux):

```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

#### PowerShell (Windows):

```
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

#### Homebrew (Mac):

```
brew install deno
```

#### Chocolatey (Windows):

```
choco install deno
```


#### Scoop (Windows):

```
scoop install deno
```

#### MongoDB
The project uses MongoDB as a database. If you are on Mac and using Homebrew package manager the installation is as simple as `brew install mongodb`.

#### Apidoc
To install run `npm install`.

### Start the MongoDB server
First we need to create the `db` directory where the database files will live in. In your terminal navigate to the `root` of your system by doing `cd ..` until you reach the top directory. You can create the directory by running `sudo mkdir -p /data/db`. Now open a different tab in your terminal and run `mongod` to start the Mongo server.

### Run the Application

The project is preconfigured with a simple development web server. The simplest way to start this server is:

    npm start

### API documentation

    /api-docs

The command will generate a /doc folder that will contain an index.html file. Open it in any browser. The file contains information about API routes.

### Project Structure

*Under Construction*
