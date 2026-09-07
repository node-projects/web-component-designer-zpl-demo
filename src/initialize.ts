import { CommandType, DocumentContainer, PropertyGridWithHeader, type IElementDefinition } from '@node-projects/web-component-designer';
import { PaletteElements } from '@node-projects/web-component-designer/dist/elements/widgets/paletteView/paletteElements.js';
import { CodeViewMonaco } from '@node-projects/web-component-designer-codeview-monaco';
import { addZplLanguageToMonaco, createZplDesignerServiceContainer } from '@node-projects/web-component-designer-zpl';

await window.customElements.whenDefined('node-projects-document-container');

const propertyGrid = document.querySelector<PropertyGridWithHeader>('node-projects-web-component-designer-property-grid-with-header')!;
const serviceContainer = createZplDesignerServiceContainer();
serviceContainer.config.codeViewWidget = CodeViewMonaco;

const sampleLabel = `^XA
^FO48,48^A0N,28,28^FDZPL STUDIO / SHIPPING LABEL^FS
^FO48,105^GB716,3,3^FS
^FO48,150^A0N,24,24^FDSHIP TO^FS
^FO48,198^A0N,48,48^FDAlex Morgan^FS
^FO48,264^A0N,30,30^FD123 Sample Street^FS
^FO48,307^A0N,30,30^FDBerlin, 10115^FS
^FO48,350^A0N,30,30^FDGermany^FS
^FO48,420^GB716,3,3^FS
^FO48,463^A0N,24,24^FDORDER NUMBER^FS
^FO48,510^BY3,3,120^BCN,120,Y,N,N^FDSO-40192^FS
^FO48,726^GB716,3,3^FS
^FO48,770^A0N,24,24^FDROUTE / LOCATION^FS
^FO48,823^A0N,70,70^FDA-14-99^FS
^FO575,770^BQN,2,5^FDLA,SO-40192^FS
^FO48,970^GB716,3,3^FS
^FO48,1015^A0N,24,24^FDPACKAGE 01 / 01^FS
^FO48,1110^A0N,22,22^FDCreated with ZPL Studio^FS
^XZ`;

const monaco = await CodeViewMonaco.getMonacoLib();
addZplLanguageToMonaco(monaco);

const documentContainer = new DocumentContainer(serviceContainer);
document.getElementById('editor')!.appendChild(documentContainer);
const codeView = documentContainer.codeView as CodeViewMonaco;
codeView.language = 'zplLanguage';
codeView.theme = 'zplTheme';

propertyGrid.serviceContainer = serviceContainer;
propertyGrid.instanceServiceContainer = documentContainer.instanceServiceContainer;

// Keep the same 4 × 6 inch format used by the ZPL preview service.
const canvas = documentContainer.designerView.designerCanvas;
canvas.designerWidth = '812px';
canvas.designerHeight = '1218px';
canvas.style.background = 'radial-gradient(circle, #cdd8d7 .8px, transparent .8px) 0 0 / 12px 12px #f3f6f6';

const objectDetails: Record<string, [string, string, string]> = {
    'zpl-text': ['Text', 'Single line or paragraph', '^FD'],
    'zpl-graphic-box': ['Box / line', 'Rules, borders and frames', '^GB'],
    'zpl-graphic-circle': ['Circle', 'Circular outlines and shapes', '^GC'],
    'zpl-graphic-diagonal-line': ['Diagonal line', 'Angled rules and dividers', '^GD'],
    'zpl-image': ['Image', 'Monochrome graphics and logos', '^GF']
};
const escapeHtml = (text: string) => {
    const element = document.createElement('span');
    element.textContent = text;
    return element.innerHTML;
};
const paletteGroups: { section: HTMLElement; palette: PaletteElements; elements: (IElementDefinition & { searchText: string })[] }[] = [];
for (const elementsService of serviceContainer.getServices('elementsService')) {
    const definitions = await elementsService.getElements();
    const section = document.createElement('section');
    section.className = 'palette-group';
    const title = document.createElement('h2');
    title.textContent = elementsService.name === 'zpl' ? 'Objects' : 'Barcodes & 2D symbols';
    const palette = new PaletteElements();
    const elements = definitions.map(definition => {
        const details = objectDetails[definition.tag];
        const name = details?.[0] ?? definition.name ?? definition.tag;
        const description = details?.[1] ?? 'Machine-readable symbol';
        const command = details?.[2] ?? definition.description?.match(/\^[A-Z0-9]+/)?.[0] ?? '';
        return {
            ...definition,
            description: '',
            displayHtml: `<span style="display:flex;align-items:center;justify-content:space-between;gap:8px"><span><span style="display:block;font-size:12px;font-weight:550;color:#425357">${escapeHtml(name)}</span><span style="display:block;font-size:10px;color:#91a09f;margin-top:4px">${escapeHtml(description)}</span></span><span style="font:10px ui-monospace,monospace;color:#8d9d9b">${escapeHtml(command)}</span></span>`,
            name,
            searchText: `${name} ${description} ${command}`.toLowerCase()
        };
    });
    section.append(title, palette);
    document.getElementById('palette-list')!.appendChild(section);
    palette.loadElements(serviceContainer, elements);
    paletteGroups.push({ section, palette, elements });
}

document.getElementById('palette-search')!.addEventListener('input', event => {
    const query = (event.target as HTMLInputElement).value.trim().toLowerCase();
    let count = 0;
    for (const group of paletteGroups) {
        const matches = group.elements.filter(element => element.searchText.includes(query));
        group.palette.loadElements(serviceContainer, matches);
        group.section.hidden = !matches.length;
        count += matches.length;
    }
    document.getElementById('no-results')!.hidden = count > 0;
});

const selection = documentContainer.instanceServiceContainer.selectionService;
selection.onSelectionChanged.on(() => {
    const item = selection.primarySelection;
    const hasSelection = item && !item.isRootItem;
    propertyGrid.hidden = !hasSelection;
    document.getElementById('inspector-empty')!.hidden = !!hasSelection;
    document.getElementById('selection-type')!.textContent = hasSelection ? objectDetails[item.element.localName]?.[0] ?? 'Barcode' : 'Label';
});

function refreshCommands() {
    for (const type of [CommandType.undo, CommandType.redo]) {
        (document.getElementById(type) as HTMLButtonElement).disabled = !documentContainer.canExecuteCommand({ type });
    }
}
for (const type of [CommandType.undo, CommandType.redo]) {
    document.getElementById(type)!.addEventListener('click', () => {
        documentContainer.executeCommand({ type });
        refreshCommands();
    });
}
documentContainer.instanceServiceContainer.undoService.onTransaction.on(refreshCommands);
documentContainer.onTabChanged.on(refreshCommands);
documentContainer.onContentChanged.on(() => {
    document.getElementById('document-status')!.textContent = 'Modified';
    document.getElementById('status-message')!.textContent = 'Changes ready to export';
    refreshCommands();
});
document.getElementById('export')!.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([documentContainer.content], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shipping-label.zpl';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.getElementById('document-status')!.textContent = 'Exported';
    document.getElementById('status-message')!.textContent = 'ZPL file exported';
});

await documentContainer.setContentAsync(sampleLabel);
documentContainer.instanceServiceContainer.undoService.clear();
requestAnimationFrame(() => {
    const rect = canvas.getBoundingClientRect();
    canvas.zoomPoint({ x: 406, y: 609 }, Math.min(.65, (rect.width - 80) / 812, (rect.height - 60) / 1218));
    refreshCommands();
    document.getElementById('document-status')!.textContent = 'Demo label';
    document.getElementById('status-message')!.textContent = 'Ready to design';
});
