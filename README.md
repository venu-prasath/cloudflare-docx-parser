# cloudflare-docx-parser

A lightweight library to parse Microsoft Word (.docx) files in Cloudflare Workers. This package is written in TypeScript and extracts plain text by unzipping .docx files (which are essentially ZIP archives) and parsing their XML content.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Bundling](#bundling)
- [TypeScript Support](#typescript-support)
- [Testing with Cloudflare Workers](#testing-with-cloudflare-workers)
- [Contributing](#contributing)
- [License](#license)

## Overview

`cloudflare-docx-parser` is designed for Cloudflare Workers and other environments that do not have support for Node.js or browser-specific APIs. It leverages:

- **fflate** for unzipping the .docx file.
- **fast-xml-parser** for parsing XML content within the document.

This makes it an excellent choice for extracting text from docx files in edge environments or serverless functions.

## Features

- **Cloudflare Compatibility:** Works in Cloudflare Workers using only standard Web APIs.
- **TypeScript Support:** Provides full TypeScript support and type declarations.
- **Simple API:** One function, `parseDocx`, to extract plain text from a given .docx file.
- **Lightweight:** Uses fast, lightweight libraries that run efficiently in edge environments.

## Installation

Install the package with npm:

```bash
npm install cloudflare-docx-parser
```


## Usage

Below is an example of how to use the package in your project. This example is especially suited for Cloudflare Workers.

### Example Worker Code

```typescript
import { parseDocx } from "cloudflare-docx-parser";

try {
  // Read the .docx file from the request body
  const fileBuffer = await request.arrayBuffer();
  // Parse the .docx and extract plain text
  const extractedText = await parseDocx(fileBuffer);

  return new Response(extractedText, {
    headers: { "Content-Type": "text/plain" },
  });
} catch (error: any) {
  return new Response(error.message, { status: 400 });
}
```


## Bundling

For deployment in Cloudflare Workers, bundle the code using a tool such as [esbuild](https://esbuild.github.io).

### Bundling Example using esbuild

Add a build script to your `package.json`:

```json
"scripts": {
  "build": "esbuild src/index.ts --bundle --minify --platform=browser --format=esm --outfile=dist/index.js"
}
```


Then run:

```bash
npm run build
```


The output bundle will be generated at `dist/index.js`.

## TypeScript Support

The package is written in TypeScript and includes type declarations. Ensure your `tsconfig.json` is similar to the following for best compatibility:

```json
{
"compilerOptions": {
"target": "ES2020",
"module": "ESNext",
"declaration": true,
"outDir": "./dist",
"moduleResolution": "node",
"esModuleInterop": true,
"strict": true
},
"include": ["src/**/*"],
"exclude": ["node_modules"]
}
```
## Testing with Cloudflare Workers

You can test the solution in a Cloudflare Worker by using [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/).

### Steps to Test

1. **Install Wrangler:**

```bash
npm install -g @cloudflare/wrangler
```

2. **Initialize a new Worker Project:**

```bash
wrangler init --name cloudflare-docx-parser
```


3. **Integrate cf-docx-parser:**

Use the example provided above in your Worker script.

4. **Run Locally:**

```bash
wrangler dev
```


## Contributing

Contributions, bug reports, and feature requests are welcome! Please submit a PR or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License.



