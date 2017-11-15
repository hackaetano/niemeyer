# Niemeyer API

## Environment setup

First of all, you need to install Node and NPM. The better way to install and manage the versions of these aplications is through NVM. [This link](https://github.com/creationix/nvm) has all instructions that you need to do it.

The Niemeyer API runs through the most stable Node's version (v8.9.1). Assuming that you have already installed NVM, to use this version of node, all that you have to do is:

```
# Install Node Version trhough NVM
$ nvm install 8.9.1

# Use Node v8.9.1
$ nvm use 8.9.1

# (Optional) You also can set this version as default on a shell
$ nvm alias default 8.9.1
```

## Installing Dependencies

After you've finish the setup of your environment and clone the repository, you must install the dependencies from it. Don't worry, it's simple as take candy from children. Go to your cloned repository folder and run:

```
# Install NPM packages
$ npm install
```

Besides, the Niemeyer API uses MongoDB as database system. You need to install it to run the project locally. [Here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) are the instructions that you need to install Mongo for Ubuntu. If you're using MacOS, the instructions are [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/).

## Running the project

This project uses MongoDB, as you read it above. Before start the API, be sure that you've started mongo service. You don't need to create a collection or any schema. Niemeyer API uses mongoose module to handle with that, and all models are already setted on the project. To initiate mongo, execute this command in some tab of your terminal:

```
# Initiate MongoDB
$ mongod
```
If you installed Mongo correctly, it will start to listen connections and you're ready to go.

To start the server and run the API you must type on your terminal (from your repository folder):

```
# Start App
$ npm start
```

## Development mode

To keep the application running and restart for all change during the development you can use a NPM package called forever: 

```
# Install forever package globally
$ npm install forever -g

# Running forever (rsrsrs)
$ forever --watch bin/www
```