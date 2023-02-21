# genezio-github-action

This action sets up a `genezio` environment for using it in actions.

## Usage

To deploy your project on `genezio` using GitHub Actions, you have to provide a `genezio` access token.

Follow these steps to setup a `genezio` access token to use GitHub Actions:

- Head to the `genezio` [dashboard](https://app.genez.io/settings/tokens) to generate a `genezio` access token.
- Store the access token as a GitHub secret in your repository. To see how to create an action secret check this [tutorial](https://docs.github.com/en/actions/security-guides/encrypted-secrets?tool=webui#creating-encrypted-secrets-for-a-repository).

In the examples below the secret is referred to as `secrets.GENEZIO_TOKEN`. Change accordingly for your project.

### Backend Deployment

An example workflow to deploy the backend of your project with the latest version of `genezio`:

```yaml
name: genezio workflow
on:
  push:
    branches:
      - main

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - uses: Genez-io/genezio-github-action@main
        with:
          genezio-version: latest
          token: ${{ secrets.GENEZIO_TOKEN }}
      - name: Test genezio installation
        run: genezio ls
      # Check the deployed project at https://app.genez.io
      - name: Deploy backend
        working-directory: ./server
        run: genezio deploy
```

### Frontend Deployment

You can also deploy the frontend of your application using genezio.

Check the snippet below to automate it using this action:

```yaml
deploy-frontend:
  needs: deploy-backend
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 16
    - uses: Genez-io/genezio-github-action@main
      with:
        genezio-version: latest
        token: ${{ secrets.GENEZIO_TOKEN }}
    - name: Test genezio installation
      run: genezio ls
    - uses: actions/download-artifact@master
      with:
        name: genezio-generated-sdk
        path: ./client/sdk
    - name: Build the frontend code
      working-directory: ./client
      run: npm run build
```

## Complete examples

```yaml
name: genezio workflow
on:
  push:
    branches:
      - main

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - uses: Genez-io/genezio-github-action@main
        with:
          genezio-version: latest
          token: ${{ secrets.GENEZIO_TOKEN }}
      - name: Test genezio installation
        run: genezio ls
      # Check the project at https://app.genez.io
      - name: Deploy backend
        working-directory: ./server
        run: npm i && genezio deploy

      # Use this trick to upload the generated SDK as an artifact
      # It will be used to deploy the frontend
      - uses: actions/upload-artifact@v3
        with:
          name: genezio-generated-sdk
          path: ./client/sdk

  deploy-frontend:
    needs: deploy-backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - uses: Genez-io/genezio-github-action@main
        with:
          genezio-version: latest
          token: ${{ secrets.GENEZIO_TOKEN }}
      - name: Test genezio installation
        run: genezio ls
      - uses: actions/download-artifact@master
        with:
          name: genezio-generated-sdk
          path: ./client/sdk
      - name: Build the frontend code
        working-directory: ./client
        run: npm run build
      # Make sure that you setup a subdomain in the `genezio.yaml` file
      # The frontend can be accessed at https://<your-subdomain>.app.genez.io
      - name: Deploy the frontend for your project
        working-directory: ./server
        run: genezio deploy --frontend
```

## License

The associated scripts and documentation in this project are released under the GNU General Public License v3.0 license.
