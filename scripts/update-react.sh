#!/bin/bash

# remove current react installation and its dependencies
npm uninstall react react-dom
npm cache clean --force

# install the latest version of react
npm i react@latest react-dom@latest

# restart the development server
# npm start