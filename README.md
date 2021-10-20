# ShortURL Service

## 需求完成狀態

### 必要需求

- [x] 專案需要使用 [Git](https://git-scm.com/) 管理專案，並公開至 [GitHub](https://github.com/)
- [x] Git commit 訊息需符合 [Conventional Commits](https://www.conventionalcommits.org/zh-hant/v1.0.0/)，並使用英文撰寫
- [x] 專案須包含 [`README.md`](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-on-github/about-readmes)，其中描述專案的安裝、建置、使用，包含的功能與操作方式
- [x] 前端使用 [React.js](https://zh-hant.reactjs.org/) 16 以上實作整個頁面與元件
- [x] 後端使用 [Node.js](https://nodejs.org/en/) 14 以上
- [x] 使用者可以填入一段網址，會產生一段短網址
- [x] 使用者可以瀏覽短網址，服務會將短網址重新導向到原始網址

### 專案需符合以下至少兩項需求

- [x] 使用 [TypeScript](https://www.typescriptlang.org/) 4.3 以上實作
- [x] 後端使用任一套 [ORM](https://en.wikipedia.org/wiki/Object–relational_mapping) 搭配任一套 [RDBMS](https://en.wikipedia.org/wiki/Relational_database)
- [x] 整個 React App 使用 [Functional Component](https://reactjs.org/docs/components-and-props.html#function-and-class-components)
- [x] 使用套件檢查程式碼風格 (例如：[JavaScript Standard](https://standardjs.com/)、[ESLint](https://eslint.org/))
- [x] 專案需要能被公開瀏覽使用 (例如使用 [Heroku](https://www.heroku.com/))
- [ ] [單元測試](https://en.wikipedia.org/wiki/Unit_testing)
- [ ] [E2E 測試](https://www.browserstack.com/guide/end-to-end-testing)
- [ ] 開發時全程使用 [TDD](https://en.wikipedia.org/wiki/Test-driven_development)
- [ ] 整合 [CI/CD](https://en.wikipedia.org/wiki/CI/CD) 流程

### 需挑選以下至少兩項功能實作

- [x] 需要驗證網址有效
- [ ] 使用者可以使用密碼註冊、登入、登出
- [ ] 使用者可以新增、建立、更新、刪除多個短網址
- [ ] 短網址重新導向的過程使用快取 (可暫時避免向資料庫查詢)
- [ ] 使用者可以知道短網址瀏覽次數
- [ ] 服務會避免短網址重複重導向到相同網址
- [ ] 從短網址拿到原始網址的 [Open Graph Metadata](https://ogp.me/) （標題、描述、圖片）
- [ ] 使用者可以自訂 [Open Graph Metadata](https://ogp.me/)（標題、描述、圖片）

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
# Don't forget to build the packages
pushd frontend && yarn build && popd
pushd backend && yarn build && popd
# Start the server
cd backend
node build/index.js --public="../frontend/build" --blacklist-hosts="localhost:3001"
```

Above starts a backend server that also host static assets, at default port `3001`. Without `--public` option, the server runs API services only. Without `--blacklist-hosts` option, the server is vulnerable to recursive redirection (one can generate a short URL from another short URL, and a chain of redirection can be crafted).

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

## Problems, Improvements, and Ideas

* Problem: The API type definition is duplicated in both `frontend/` and `backend/` since `create-react-app` doesn't allow importing scripts outside of `frontend/src/`, and there's no exposed config option to change it ([source](https://stackoverflow.com/a/44115058)).
* Improvement: Extract request handlers to a "controller" module.
* Idea: Count redirection times for each URL and show trending URLs on the homepage.
* Idea: See who generates the short URL, by logging IP or having an account system.