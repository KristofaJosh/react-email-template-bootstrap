Help us reach more developers—star this repo if it helped you today!

[![GitHub stars](img.shields.io)](https://github.com/KristofaJosh/react-email-template-bootstrap)

# React Email Template Bootstrap

This project uses [React Email](https://react.email/) that has a live preview right in your browser so you don't need to keep sending real emails during development.

## Getting Started

First, install the dependencies:

```sh
yarn install
```

Then, run the development server:

```sh
yarn dev
```

Open [localhost:3000](http://localhost:3000) with your browser to see the result.

## Scaffolding new emails with Plop

This repository includes a Plop generator to quickly scaffold new email templates.
Ensure to always use this except otherwise else you may miss important boilerplate code.

Run the generator:

```sh
yarn gen:email
```

You will be prompted for:

- componentName: e.g. ActionRequired
- domain: pick one of general or custom (you can extend this later)
- customDomain: only when you pick custom
- previewText: the preview shown in inbox clients
- buttonPath: path appended to baseUrl for the primary CTA, e.g. /account/orders

This command generates a file at:

```
emails/<domain>/<kebab-case-component-name>.tsx
```

Example

```sh
yarn gen:email
# componentName: NewNegotiationOffer
# domain: negotiation
# previewText: New Negotiation Offer
# buttonPath: /account/negotiations
```

This will create emails/negotiation/new-negotiation-offer.tsx similar to the existing example and wired to use:

- EmailContentWrapper
- EmailBody with a CTA Button linking to baseUrl + buttonPath
- Footer with the provided email
- .PreviewProps for local preview

### Next steps to deploy typings for consumer `@<org>/email-templates`

#### 1) Bump version

- Follow semver. For the first public release:
  ```sh
  npm version patch -m "chore(release): %s"
  ```
  This updates `version` and creates a git tag.
```json
{
  ...
  "publishConfig": {
    "@<org>:registry": "https://npm.pkg.github.com"
  }
}
```

#### 2) Tag and release notes

- If you didn’t let `npm version` create a tag, add one and push:
  ```sh
  git push --follow-tags
  ```
  Create a GitHub Release describing the exported types and usage.

## License

MIT License
