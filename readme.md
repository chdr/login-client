# Cheddar Client-Side Login App

## What Is This

This is a basic login and OAuth form that interacts with Cheddar's login
API module. It's intended to run alongside, but outside, a separate development
server running Cheddar's API.

## Quickstart

### Install and run Cheddar

See the [Cheddar repo's](https://github.com/chdr/cheddar) README.

## Install and run this application

```
npm install
npm start
```

or

```
yarn install
yarn start
```

## Development

It's probably useful to note that the following client-side libraries have been used in this application:
1. [React](https://reactjs.org/) using [Create React App](https://github.com/facebook/create-react-app)
2. [Axios](https://github.com/axios/axios)
3. [Formik](https://github.com/jaredpalmer/formik)
4. [Tailwind CSS](https://tailwindcss.com/)

## Testing

`npm test` or `yarn test` to run all the tests.

Client-side integration and unit tests use [Jest](https://jestjs.io/) and [Enzyme](https://github.com/airbnb/enzyme).

### Test Writing Strategy

All important application features should be tested with an integration test. Unit tests are used for development and regression prevention, but should not be relied on over an integration testing.

### Test Directory Structure

All tests are in `__tests__` directories. Integration tests are kept in `./src/__tests__` and are named with a `*.integrations.test.js` pattern. Unit tests are kept in `__tests__` directories within the same parent directory of the component that they test.
