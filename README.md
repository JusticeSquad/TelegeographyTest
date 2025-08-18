# TeleGeography Test App

Welcome to the TeleGeography Test App. This app loads data files representing wire center locations and the NPA/NXX combinations they serve. Users can view these in the data table, find them on the map, use the data table to find specific wire centers on the map, and use the filter bar to search by CLLI or NPA. This app uses React/Typescript, Context for state management between components, Mapbox and ReactMapGL for controlling the map, and MaterialUI for various interface elements.

# Running the App

To run the app, open `dist/index.html` in a modern browser (e.g. Chrome or Firefox).

# Building the App

## Downloading NPM

This app is created using `pnpm`. To build it, you need `node`, `npm`, and `pnpm` installed. To do so, you can download NodeJS from here:

https://nodejs.org/en/download/

Alternatively, you can download `nvm` from here:

https://github.com/coreybutler/nvm-windows
https://github.com/nvm-sh/nvm

Once `nvm` is installed, you can follow the instructions on the websites to select your versions of `node` and `npm`.

Once `npm` is installed, `pnpm` can be installed with this command from the command line:

`npm install -g pnpm`

## Running

Once `pnpm` is finished installing, enter the command line in this directory. You can install the packages necessary to run the app with this command:

`pnpm install`

Once the packages are successfully installed, use the following to run the development version of the app:

`pnpm run start`

To create a new production build, run the following command:

`pnpm run build`

# Configuration

The app uses a `.env` file to configure the Mapbox access token. I've provided my own access token, but should you prefer to build the app with your own, you can change the `MAPBOX_ACCESS_TOKEN` environment variable to use your own access token.