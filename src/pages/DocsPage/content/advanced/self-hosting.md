---
title: Self-hosting
description: tutorial on how to run 2anki.net
---

The instructions here are written for the Debian operating system. If you are using a different operating system, you may need to adjust the commands accordingly.
Please contribute back to the community by providing instructions for other operating systems https://github.com/2anki/docs.2anki.net

Note that commands might require root access, so you may need to prepend them with `sudo`
but it is not recommended to run the application as root. Lines starting `#` are example output and can be omitted.

## Prerequisites

Assuming you have your system up and running we will start by installing all the development requirements.

First we will install [git](https://git-scm.com/) get the [Node Version Manager](https://github.com/nvm-sh/nvm).

```bash
apt-get install -y git
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Now close that terminal and open up a new one to confirm that nvm is installed.

```bash
nvm --version
# 0.39.7
```

## Getting the source code

Clone the repository and navigate to the directory.

```bash
mkdir -pv ~/src/github.com/2anki
cd ~/src/github.com/2anki
git clone https://github.com/2anki/server
git clone https://github.com/2anki/web server/web
git clone https://github.com/2anki/create_deck
```

## Building the frontend

Navigate to the web directory and install the dependencies.

```bash
cd web
nvm install
npm install
npm run build
```

## Setup card creation service

Navigate to the create_deck directory and install the dependencies.

```bash
cd ../create_deck
apt-get install -y python3-pip
pip install --break-system-packages -r requirements.txt
```

## Running the server

Navigate to the server directory and install the dependencies.

Make sure your to add your ip address in the whitelist `src/lib/constants.ts` file.

Also setup a environment file in the server directory:

```bash
cat >> ~/src/github.com/2anki/server/.env <<EOF
WORKSPACE_BASE=/tmp/genanki
EOF
mkdir -pv /tmp/genanki
```

```bash
cd ../server
npm install
npm run build
node src/server.js
```

The server should now be running on port 2020. You can access it by visiting `http://<server-ip-address>:2020` in your browser.
