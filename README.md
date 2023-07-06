# genezio-github-action

[![Validate 'genezio-github-action'](https://github.com/Genez-io/genezio-github-action/actions/workflows/test.yml/badge.svg)](https://github.com/Genez-io/genezio-github-action/actions/workflows/test.yml)

This action sets up a `genezio` environment for using it in actions.

## Usage

To deploy your project on `genezio` using GitHub Actions, you have to provide a `genezio` access token.

Follow these steps to setup a `genezio` access token to use GitHub Actions:

- Head to the `genezio` [dashboard](https://app.genez.io/settings/tokens) to generate a `genezio` access token.
- Store the access token as a GitHub secret in your repository. To see how to create an action secret check this [tutorial](https://docs.github.com/en/actions/security-guides/encrypted-secrets?tool=webui#creating-encrypted-secrets-for-a-repository).

In the examples below the secret is referred to as `secrets.GENEZIO_TOKEN`. Change accordingly for your project.

### Deployment

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
          token: ${{ secrets.GENEZIO_TOKEN }}
      - name: Deploy backend
        working-directory: ./server
        run: genezio deploy
```

You can test or check logs for the deployed project at https://app.genez.io/projects.

### Frontend and backend deployment in different jobs

If you want to deploy the frontend and backend of your project in different jobs, you can use `genezio deploy --backend` and `genezio deploy --frontend` commands.

For the frontend deployment, the genezio-generated SDK should be uploaded as an artifact:

```yaml
  # Use this trick to upload the generated SDK as an artifact
  # It will be used to deploy the frontend
  - uses: actions/upload-artifact@v3
    with:
      name: genezio-generated-sdk
      path: ./client/src/sdk
```

## Documentation

To find more details on how to use `genezio`, check out the official [documentation](https://genez.io/docs):

- [Getting started](https://docs.genez.io/genezio-documentation/getting-started)
- [Integrations](https://docs.genez.io/genezio-documentation/integrations)
- [Environment variables](https://docs.genez.io/genezio-documentation/set-envinronment-variables)

If you cannot find what you are looking for in the docs, don't hesitate to drop us a [GitHub issue](https://github.com/Genez-io/genezio/issues) or [start a discussion on Discord](https://discord.gg/uc9H5YKjXv).

## Troubleshooting

### Warnings on `npm run build` are treated as errors:

The following error may occur when running `npm run build` to build the frontend source code:
```
Treating warnings as errors because process.env.CI = true.
Most CI servers set it automatically.

Failed to compile.
```

The solution is to set CI to false in `package.json` or in your workflow:

```yaml
- name: Deploy backend
  working-directory: ./server
  run: genezio deploy
  env:
    CI: false
```

## License

The associated scripts and documentation in this project are released under the GNU General Public License v3.0 license.
