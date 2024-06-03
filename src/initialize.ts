import { DocumentContainer, PaletteView, PropertyGridWithHeader } from '@node-projects/web-component-designer';
import { CodeViewMonaco } from '@node-projects/web-component-designer-codeview-monaco';
import { addZplLanguageToMonaco, createZplDesignerServiceContainer } from '@node-projects/web-component-designer-zpl';

await window.customElements.whenDefined("node-projects-document-container");

const paletteView = <PaletteView>document.querySelector('node-projects-palette-view');
const propertyGridWithHeader = <PropertyGridWithHeader>document.querySelector('node-projects-web-component-designer-property-grid-with-header');

let serviceContainer = createZplDesignerServiceContainer();
serviceContainer.config.codeViewWidget = CodeViewMonaco;

const documentContainer = new DocumentContainer(serviceContainer);
documentContainer.style.gridArea = 'c';
document.getElementById('root').appendChild(documentContainer);
(<CodeViewMonaco>documentContainer.codeView).language = "zplLanguage";
(<CodeViewMonaco>documentContainer.codeView).theme = "zplTheme";
addZplLanguageToMonaco();

paletteView.loadControls(serviceContainer, serviceContainer.getServices('elementsService'));

propertyGridWithHeader.serviceContainer = serviceContainer;
propertyGridWithHeader.instanceServiceContainer = documentContainer.instanceServiceContainer;
