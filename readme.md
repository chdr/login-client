# login-client


## Building and Deployment

### Production vs Development vs Development

This repository is included as a Composer dependency of [`chdr/cheddar`](https://github.com/chdr/cheddar). At present, it seems that three different build processes are required:

1. One for production
2. One for development of `chdr/cheddar`, with the `chdr/login-client` as a static Composer dependency
3. One for active development of `chdr/login-client`

The primary difference between the production versus the development builds is base url used in any links and API calls (though there are significant code optimization setting differences as well). The primary difference of the development builds is the path required to move the `build` directory to `chdr/cheddar`.

The basic steps are the same for each:
1. Install the dependencies of `chdr/login-client`
2. Build `chdr/login-client`
3. Move the contents of the `build` directory to `public/login` of `chdr/cheddar`

#### Installing the Dependencies

Production dependencies can be installed with

```
yarn install --production=true
```

All production and development dependencies can be installed with
```
yarn install
```

#### Build `chdr/login-client`

The production build can be run locally with:

```
yarn run build
```

The development builds can be run locally with:

```
yarn run build-dev
```

If you're actively developing the login client, you can use
```
yarn run start
```
to watch for changes and rebuild. The contents of the `build` directory will be copied to `chdr/cheddar`. This requires `chdr/login-client` to be cloned at the same hierarchical level in your folder structure.

#### Move the Contents of the `build` Directory

The production and the development build as a static dependency of `chdr/cheddar` can be moved with:

```
yarn run copy-build
```

If actively developing the `chdr/login-client`, you can use
```
yarn run copy-build-active
```

#### Putting It All Together

Convenience scripts for installing dependencies, building the application, and moving the contents has been created for production and as a static development dependency of `chdr/cheddar`.

For production:

```
yarn run deploy-production
```

As a static dependency:

```
yarn run deploy-development-static
```

While actively developing, just use:
```
yarn run start
```
