# Harbor &middot; [![Production](https://github.com/jhorback/harbor/actions/workflows/deploy-prod.yml/badge.svg?branch=master)](https://github.com/jhorback/harbor/actions/workflows/deploy-prod.yml) [![Dev](https://github.com/jhorback/harbor/actions/workflows/deploy-dev.yml/badge.svg)](https://github.com/jhorback/harbor/actions/workflows/deploy-dev.yml) [![Preview](https://github.com/jhorback/harbor/actions/workflows/deploy-preview.yml/badge.svg)](https://github.com/jhorback/harbor/actions/workflows/deploy-preview.yml) [![Build](https://github.com/jhorback/harbor/actions/workflows/build-feature.yml/badge.svg)](https://github.com/jhorback/harbor/actions/workflows/build-feature.yml)

A simple content creation web application.


## Installation
```js
npm install
```
Install firebase tools
```js
 npm install -g firebase-tools
```
> https://www.npmjs.com/package/firebase-tools


## Development
```js
npm run dev
```
> This will serve the application using `vite`


## Build and test
```js
npm run build
```
> This will build the application to the `dist` folder using `vite`
```js
npm run test
```
> This currently will only run the compiler as there are no unit tests.


## Preview
```js
npm run preview
```
> This will build and serve the application using `vite`
```js
npm run preview:fb
```
> This will build the application using `vite` but use `firebase` to serve.


## Component Library
```js
npm run storybook
```
> This will launch the component library.



## Deployment
Deployments to the `habor-dev` firebase project are **automatic when pushing to the develop branch**.

Pull requests are required for merging into the develop and master branches.

### Deployment previews
When adding the `preview` label to a pull request, a temporary preview instance will be deployed.


### Deployments from master
A production firebase project, i.e. `harbor-production`, has not been created yet. When the initial release is ready, this can be created along with a github action that will deploy the master branch when pushed.

See additional notes on this in the harbor [wiki](https://github.com/jhorback/harbor/wiki/Firebase).

### Manual deployments
A manual deployment can be done from the command line using `npm run deploy`.

Deploying in this manner should be done with caution since this will
build and deploy whatever branch you are on directly to 
the live `habor-dev` instance.
