# ShortURL Service

## Development

1. Install dependencies with `yarn` in both `frontend/` and `backend/`.

   ```bash
   pushd frontend && yarn && popd
   pushd backend && yarn && popd
   ```

2. Start frontend development server, which is a `webpack-dev-server` configured by `create-react-app`.

   ```bash
   cd frontend
   yarn start
   ```

3. Start backend API server. Uses port `3001` if not supplied via an environment variable.

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

The distribution package is friendly to hosting services that support Node.js, so it can be easily picked up and run.

(One just need to install necessary dependencies and run the `start` script.)

### Manual

If you have full control of the server, or you want to test locally, you can

```bash
# Don't forget to run "yarn build" in both frontend/ and backend/
cd backend
node build/index.js --public="../frontend/build"
```

Above starts a backend server that also host static assets. Without `--public` option, the server runs API services only.