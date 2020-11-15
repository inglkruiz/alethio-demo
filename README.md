# AlethioDemo

This repository has been scaffolded using [Nrwl Nx](https://nx.dev). It is a monorepo that holds the source code of a Web application and its backend application (aka API).

## Dependency management

### Installing dependencies

The project uses [yarn](https://yarnpkg.com) as dependency manager. Once you have installed `yarn`, you can install the dependencies of this repository by running the following command:

```bash
yarn
```

### Bundling dependencies

This repository only contains one single [package.json](./package.json) file that lists the dependencies of all its frontend and backend applications. When a frontend application is built, its external dependencies (aka Node modules) are bundled in the resulting artifact. However, it is not the case for a backend application (for various valid reasons). It is well known that installing all the production dependencies would dramatically increase the size of the artifact. Instead, we need to extract the dependencies which are actually used by the backend application. More information about this problem can be found in [this GitHub issue](https://github.com/nrwl/nx/issues/1518). For now, a copy of package json dependencies is kept for deployment. If you install a dependency please update [deploy/api/package.json](./deploy/api/package.json) file. Theres a a way to fix this issue but requires time and testing.

## High-level architecture

Explained briefly...

### Frontend

Tracker app, the frontend application is a SPA built with:

- [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- [React](https://reactjs.org/docs/getting-started.html)
- [Redux toolkit](https://redux.js.org/introduction/getting-started#redux-toolkit) and [React-redux](https://react-redux.js.org/introduction/quick-start#quick-start) implementing [state slices](https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#writing-slices)
- [Material-ui for React](https://material-ui.com/getting-started/installation/)
- [Web3-utils](https://web3js.readthedocs.io/en/v1.3.0/web3-utils.html)
- [Numbro](https://numbrojs.com/getting-started.html)
- [Date-fns](https://date-fns.org/docs/Getting-Started) (not used yet but it is the chosen option for date formatting)
- [Lodash](https://lodash.com/)

It is deployed to [Heroku](https://www.heroku.com/home) using https://github.com/heroku/heroku-buildpack-static.git build pack, which is a Nginx.

### Backend

The API, the backend application is driven by [Nest](https://docs.nestjs.com/) framework. It includes:

- [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- [RxJs](https://rxjs-dev.firebaseapp.com/)
- [Swagger-ui](https://swagger.io/tools/swagger-ui/)

It also uses:

- [Lodash](https://lodash.com/)
- [Firebase admin](https://firebase.google.com/docs/admin/setup)

It is deployed to [Heroku](https://www.heroku.com/home) using https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-nodejs build pack.

### Deployment

In a nutshell the project is automated to run Continuos Integration and Delivery to [Heroku](https://www.heroku.com/home) using GitHub actions.

#### CI/CD

- GitHub Action [integrate](./.github/workflows/integrate.yml) executes on Pull requests to run Unit tests and test the production build task for the code in the PR branch.
- GitHub Action [tracker](./.github/workflows/tracker.yml) executes when code is pushed to `master` branch to deploy the frontend application.
- GitHub Action [api](./.github/workflows/api.yml) executes when code is pushed to `master` branch to deploy the backend application.

For this to work you will need to configure the following GitHub Secrets in your repository:

- `HEROKU_API_TOKEN` | https://devcenter.heroku.com/articles/authentication#retrieving-the-api-token
- `HEROKU_API_APP_NAME` | Your heroku repository name for the API. You can find it in your heroku app (Dyno) > Settings > as part of the property `Heroku git URL`
- `HEROKU_TRACKER_APP_NAME` | Your heroku repository name for the frontend application. You can find it in your heroku app (Dyno) > Settings > as part of the property `Heroku git URL`

#### Default cloud provider

As mentioned before [Heroku](https://www.heroku.com/home) is configured as the default cloud provider to host the project in two dynos.

For this to work you will need to configure the following environment variables:

**Backend application**

- `ALETHIO_API_KEY` | The API uses [Alethio Blockchain API](https://aleth.io/) to get data from the Ethereum Network. You will need to register to get one.
- `APP_NAME` | Simply your App Name for the Heroku backend. You can find it in your heroku app (Dyno) > Settings > property `App Name`.
- `FRONTEND_APP_URL` | The frontend application url. i.e. `https://your-url.herokuapp.com`

As a cache mechanism the API uses [Firebase](https://firebase.google.com/) to store Alethio API requests' responses. Therefore, the next three variables are needed to read and write to a Realtime database. You can generate a new private key using your Web Firebase console (it downloads a JSON file), and store the following values:

- `client_email` as `FIREBASE_CLIENT_EMAIL`
- `private_key` as `FIREBASE_PRIVATE_KEY`
- `project_id` as `FIREBASE_PROJECT_ID`

**Frontend application**

- `API_APP_NAME` | Simply your App Name for the Heroku backend. You can find it in your heroku app (Dyno) > Settings > property `App Name`.

## Local development

After installing project dependencies you have two options:

1. Run the frontend and backend applications with one single command from a terminal:

```bash
yarn nx run tracker:serveWithApi
```

2. Run the frontend and backend applications on different terminals:

```bash
yarn start tracker
```

```bash
yarn start api
```
