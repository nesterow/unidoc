## Quick Start

Before getting started please make sure you have installed required software. 
If you don't need MongoDB for your application you can skip installation part.

----------------------
## Install Git
If you using windows download [git-scm installer](https://git-scm.com/downloads) and follow instructions.

----------------------
## Install Node.JS
Frontless requires *node.js >= v10*
We recomend to use [nvm](https://github.com/nvm-sh/nvm) to get right Node.JS version.

#### Install NVM on Ubuntu/Mac
```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

#### Install NVM on Windows
Download the latest [installer for windows](https://github.com/coreybutler/nvm/releases)

----------------------
## Install MongoDB Server
You can install and configure MongoDB on your local machine or use [MongoLab](https://mlab.com/) sandbox  for development purposes

#### Install MongoDB on Linux
Follow the official manual at [docs.mongodb.com](https://docs.mongodb.com/manual/administration/install-on-linux/)

#### Install MongoDB on Mac
Install [brew](https://brew.sh/) then follow the official manual at [docs.mongodb.com](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

#### Install MongoDB on Win
[Download](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) official installer and after installation configure mongodb service.

----------------------
## Create Frontless
Now you can start you first application
```bash
npx create-frontless myapp
cd myapp
npm start
```
That's it! The application should be running on [http://localhost:6767](http://localhost:6767)

#### A clean boilerplate
To help you get familiar with Frontless the core distribution is packed with some examples. 
If you don't need them you can start with a clean template:
```bash
npx create-frontless myapp --clean
```

----------------------

