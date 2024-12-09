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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - uses: Genez-io/genezio-github-action@v3
        with:
          token: ${{ secrets.GENEZIO_TOKEN }}
      - name: Deploy backend
        working-directory: ./
        run: genezio deploy
```

You can test or check logs for the deployed project at https://app.genez.io.

## Documentation

To find more details on how to use `genezio`, check out the official [documentation](https://genez.io/docs):

- [Getting started](https://genezio.com/docs/getting-started/)
- [Integrations](https://docs.genez.io/genezio-documentation/integrations)

If you cannot find what you are looking for in the docs, don't hesitate to drop us a [GitHub issue](https://github.com/Genez-io/genezio/issues) or [start a discussion on Discord](https://discord.gg/uc9H5YKjXv).

## License

The associated scripts and documentation in this project are released under the GNU General Public License v3.0 license.
