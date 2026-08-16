import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const notice = readFileSync(resolve('THIRD-PARTY-LICENSES.md'), 'utf8');
for (const marker of ['ZPLab', 'Copyright (c) 2026 u8array', 'BWIP-JS', 'Wunderbaum', 'Copyright (c) 2021-2025 Martin Wendt', 'PrintLab ZPL', 'PrintLab Mono', 'Bitstream Vera', 'OCR-A', 'OCR-B']) {
    if (!notice.includes(marker)) throw new Error(`THIRD-PARTY-LICENSES.md is missing: ${marker}`);
}

if (!existsSync(resolve('node_modules/@node-projects/web-component-designer/dist/index.js'))) {
    throw new Error('Demo is missing the published designer-core ESM entry point');
}

if (!existsSync(resolve('node_modules/@node-projects/web-component-designer/assets/images/tools/PointerTool.svg'))) {
    throw new Error('Demo is missing the designer-core toolbar assets');
}

for (const file of [
    'node_modules/@node-projects/web-component-designer-widgets-wunderbaum/dist/index.js',
    'node_modules/wunderbaum/dist/wunderbaum.esm.min.js',
    'node_modules/wunderbaum/dist/wunderbaum.css'
]) {
    if (!existsSync(resolve(file))) throw new Error(`Demo is missing extended-tree dependency: ${file}`);
}

for (const file of ['PrintLabZPL-Bold.woff2', 'PrintLabZPL-Bold.ttf', 'PrintLabMono.ttf', 'VeraMono.ttf', 'VeraMono-Bold.ttf', 'OCRB.ttf', 'OCRA.ttf']) {
    if (!existsSync(resolve('node_modules/@node-projects/web-component-designer-zpl/dist/assets/fonts', file))) {
        throw new Error(`Published ZPL package is missing font: ${file}`);
    }
}

for (const file of ['NOTICE.md', 'PrintLabMono-NOTICE.md', 'VeraMono-NOTICE.md', 'OCRB-NOTICE.md', 'OCRA-NOTICE.md', 'LICENSE-APACHE-2.0.txt']) {
    if (!existsSync(resolve('node_modules/@node-projects/web-component-designer-zpl/dist/assets/fonts', file))) {
        throw new Error(`Published ZPL package is missing font notice: ${file}`);
    }
}
