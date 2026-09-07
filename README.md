# web-component-designer-zpl-demo

Demonstration Project using https://github.com/node-projects/web-component-designer

The ZPL support includes barcode, font-metric, and resize work adapted from
[ZPLab](https://github.com/u8array/ZPLab) and renders barcodes with BWIP-JS.
See [THIRD-PARTY-LICENSES.md](./THIRD-PARTY-LICENSES.md) for complete notices.
The sample also includes the extended element tree for selecting, locking, and
controlling the designer/runtime visibility of label elements.

## url of demo project

https://node-projects.github.io/web-component-designer-zpl-demo/index.html

## Developing

  * Install dependencies
```
  $ npm install
```

  * Compile TypeScript after making changes
```
  $ npm run tsc
```

  * Run the app in a local server
```
  $ npm start
```

  * Open the URL printed by the development server.

## Acknowledgements and third-party licenses

This demo redistributes the ZPL add-on and its bundled printer-preview fonts.
We sincerely thank [u8array](https://github.com/u8array) and the
[ZPLab](https://github.com/u8array/ZPLab) project for making its barcode,
preview, resizing, font-metric, and printer-font work available to the community.
If you are looking for a complete standalone ZPL label designer,
[ZPLab](https://zplab.org/) is an excellent choice. The web-component-designer
ZPL add-on serves a different purpose: it is designed to be embedded into and
integrated with another application.
The deployed page links directly to [THIRD-PARTY-LICENSES.md](./THIRD-PARTY-LICENSES.md).
The demo consumes the published `@node-projects/web-component-designer` and
`@node-projects/web-component-designer-zpl` npm packages. Their browser assets,
printer-preview fonts, and bundled third-party notices are copied into the
deployed site from `node_modules`.
