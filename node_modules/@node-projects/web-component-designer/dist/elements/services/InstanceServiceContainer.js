import { BaseServiceContainer } from './BaseServiceContainer.js';
import { DesignContext } from '../widgets/designerView/DesignContext.js';
import { TypedEvent } from '@node-projects/base-custom-webcomponent';
export class InstanceServiceContainer extends BaseServiceContainer {
    designContext = new DesignContext();
    designerCanvas;
    collaborationService;
    designer; //usable to assign designer from outside
    documentContainer; //usable to assign designer from outside
    onContentChanged = new TypedEvent();
    constructor(designerCanvas) {
        super();
        this.designerCanvas = designerCanvas;
    }
    get rootDesignItem() {
        return this.designerCanvas.rootDesignItem;
    }
    get undoService() {
        return this.getLastService('undoService');
    }
    get selectionService() {
        return this.getLastService('selectionService');
    }
    get stylesheetService() {
        return this.getLastService('stylesheetService');
    }
    get designItemDocumentPositionService() {
        return this.getLastService('designItemDocumentPositionService');
    }
}
//# sourceMappingURL=InstanceServiceContainer.js.map