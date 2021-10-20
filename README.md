# ShortURL Service

## Development

1. Install dependencies with `yarn` in both `frontend/` and `backend/`.

   ```bash
   pushd frontend && yarn && popd
   pushd backend && yarn && popd
   ```

2. Start frontend development server, which is a `webpack-dev-server` provided by `create-react-app`.

   ```bash
   cd frontend
   yarn start
   ```

3. Start backend API server. It uses port `3001` if not supplied via the environment variable `PORT`.

   ```bash
   cd backend
   yarn start
   ```

   `webpack-dev-server` proxies backend-related requests to this server.

   Server auto-restarts on file change.

## Deploy

### Automatic

Create a distribution package and push it to `deploy` git branch.

```bash
./create-dist/create-dist.sh
```

The distribution package is friendly to hosting services that support Node.js. ("friendly" – one just need to `npm install` and `npm start` to bring it up)

### Manual

If you have full control of the server, or you want to test locally, you can also

```bash
pushd frontend && yarn build && popd
pushd backend && yarn build && popd
cd backend
node build/index.js --public="../frontend/build"
```

Above starts a backend server that also host static assets. Without `--public` option, the server runs API services only.

## Design

```
                       ┌───────────┐
                       │ React App ├──────────────┐
                       └─────┬─────┘              │ ┌──────────┐
                             │                    ├─┤ Frontend │
                       ┌─────▼──────┐             │ └──────────┘
                   ┌───┤ Web Client ├─────────────┘
┌───────────────┐  │   └─────┬──────┘
│ API on top of ├──┤         │
│     HTTP      │  │   ┌─────▼──────────┐
└───────────────┘  └───┤ Express Server ├─────────┐
                       └─────┬──────────┘         │
                             │                    │
                       ┌─────▼──────────────────┐ │ ┌─────────┐
                       │ URL Shortening Service ├─┼─┤ Backend │
                       └─────┬──────────────────┘ │ └─────────┘
                             │                    │
                       ┌─────▼──────────────────┐ │
                       │ SQLite database driven ├─┘
                       │ by TypeORM             │
                       └────────────────────────┘
```

### Frontend

* Initialized with [`create-react-app`](https://create-react-app.dev/).
* Use **TypeScript 4.4**.
* `create-react-app` comes with ESLint rules.
* Use [Prettier](https://prettier.io/) to format code with [@pmndrs](https://github.com/pmndrs)'s configuration. The coding style is cleaner, and when used with ESLint, common pitfalls can be avoided.
* Configured auto formatting code on file save when using VSCode.

#### React App (`frontend/src/App.tsx`)

* Use **React 17**.
* Use **Sass** to write CSS since
  * it's **productive** (close to writing native CSS),
  * **safe** (automatically add random suffixes to class names so no worry about class name conflicts),
  * and **good for performance** (compiled to CSS file so no need for a runtime).
* Use built-in hooks of React to manage state since the app is small (< 100 lines of code).

#### Web Client (`frontend/src/apiClient.ts`)

* Use [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to make HTTP requests.
* Handle server errors (e.g. `500 internal server error` when the database is not running normally) as well as service errors (e.g. invalid URL provided).

### Backend

* Use **TypeScript 4.4**.
* Not bundling code, only use `tsc` to compile them for simplicity.
* Written tests for core algorithms and functions in `backend/src/utils.ts` with [zora](https://github.com/lorenzofox3/zora).

#### Express Server (`backend/src/index.ts`)

* Validates an user-provided URL before passing it to the URL shortening service.
* By default runs only the API server providing URL shortening service, so one can serve static assets with `nginx` or other servers optimized for static assets. But there's an option to enable serving static assets with Express.

#### URL Shortening Service (`backend/src/service.ts`)

* Does not generate a complete short URL, instead, generates only a hash, to make the database portable between different domains.

* Uses the count of rows in the database table storing URLs and Base58 (excluding confusing chars "0OIl", see `backend/src/utils.ts`) to generate an unique short hash for each original URL.
* If an original URL already exists in the database, the previously generated hash is used.

#### SQLite database driven by TypeORM (`backend/src/entities/url.ts`)

* SQLite is designed to be "embedded" thus doesn't require users to setup and manage an additional database server. This makes it easy to use in prototyping.
* TypeORM works well with TypeScript and abstracts many details such as creating database file, initializing tables, and writing SQL queries by using the built-in driver for SQLite.
* The minimal setup is one table for storing hash to original URL mapping. The table has two columns, `shortHash` and `originalUrl`. `shortHash` is used as the primary key.

### API

* **POST** `/api/shorturls` with

  ```typescript
  interface CreateShortUrlRequestData {
    url: string
  }
  ```

  encoded as `application/json` to get a response

  ```typescript
  interface CreateShortUrlResponseData {
    error: boolean
    hash: string
    message: string
  }
  ```

  as `application/json`.

  When `error` is `true`, `hash` is useless and `message` can be shown to the user. Otherwise, use `hash` to build the shortened URL as `http(s)://<your_host>/s/<hash>`.

* **GET** `/s/<hash>` to be redirected to the original URL of `hash`. Redirected to `/` when the original URL is not found.

## Problems and Ideas

* Problem: The API type definition is duplicated in both `frontend/` and `backend/` since `create-react-app` doesn't allow importing scripts outside of `frontend/src/`, and there's no exposed config option to change it ([source](https://stackoverflow.com/a/44115058)).
* Idea: Count redirection times for each URL and show trending URLs on the homepage.
* Idea: See who generates the short URL, by logging IP or having an account system.