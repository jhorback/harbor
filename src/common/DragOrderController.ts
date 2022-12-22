

export class ItemIndexChanged extends Event {
    static eventType = "item-index-changed";
    sourceIndex:number;
    targetIndex:number;
    constructor(sourceIndex:number, targetIndex:number) {
        super(ItemIndexChanged.eventType, {bubbles:true, composed:true});
        this.sourceIndex = sourceIndex;
        this.targetIndex = targetIndex;
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations
 * 
 * Usage:
 * The host element passed in the constructor is used to dispatch the
 * ItemIndexChanged event.
 * 
 * Call dragOrderController.attach(el) with the element that contains
 * the items that are to be draggable.
 */
export class DragOrderController {

    host:Element;

    constructor(host:Element) {
        this.host = host;
    }

    attachedElement:Element|null = null;
    dragSource:Element|null = null;
    private abortController:AbortController = new AbortController();

    attach(el:Element) {
        if (this.attachedElement) {
            return;
        }

        this.attachedElement = el;
        const eventOptions = {
            signal: this.abortController.signal
        };

        el.addEventListener("dragover", containerDragOver(this) as EventListener, eventOptions);
        el.addEventListener("drop", containerDrop(this) as EventListener, eventOptions);
        setItemIndexes(this);
        Array.from(el.children).forEach(item => {
            item.setAttribute("draggable", "true");
            item.setAttribute("foo", "bar");
            item.addEventListener("dragstart", itemDragStart(this) as EventListener, eventOptions);
            item.addEventListener("dragend", itemDragEnd(this) as EventListener, eventOptions);
            item.addEventListener("dragenter", itemDragEnter(this) as EventListener, eventOptions);
            item.addEventListener("dragleave", itemDragLeave(this) as EventListener, eventOptions);
        });
    }

    detach() {
        if (!this.attachedElement) {
            return;
        }

        Array.from(this.attachedElement.children).forEach(item => 
            item.removeAttribute("draggable"));
        this.abortController.abort();
        this.abortController = new AbortController();
        this.attachedElement = null;
        this.dragSource = null;
    }
}


interface IIndexedElement extends HTMLElement {
    index:string
}

const containerDragOver = (controller:DragOrderController) => (event:DragEvent) => {
    event.preventDefault();
    const dt = event.dataTransfer!;
    dt.dropEffect = "move";
};

const containerDrop = (controller:DragOrderController) => (event:DragEvent) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const target = event.target as IIndexedElement;
    target.style.opacity = "1";
    const dt = event.dataTransfer!;
    const sourceIndex = parseInt(dt.getData("application/harbor-app-item"));
    const targetIndex = parseInt(target.index);
    controller.host.dispatchEvent(new ItemIndexChanged(sourceIndex, targetIndex));
    setItemIndexes(controller);
};

const setItemIndexes = (controller:DragOrderController) => {
    controller.attachedElement && Array.from(controller.attachedElement.children).forEach((item, index) => {
        (item as IIndexedElement).index = String(index);
    });
};


const itemDragStart = (controller:DragOrderController) => (event:DragEvent) => {
    const dt = event.dataTransfer!;
    const target = event.target as IIndexedElement;
    controller.dragSource = target;
    target.style.opacity = "0.4";
    dt.effectAllowed = "move";
    dt.setData("application/harbor-app-item", target.index);
};

const itemDragEnd = (controller:DragOrderController) => (event:DragEvent) => {
    const target = event.target as HTMLElement;
    target.style.opacity = "1";
};

const itemDragEnter = (controller:DragOrderController) => (event:DragEvent) => {
    const target = event.target as HTMLElement;
    if (target !== controller.dragSource && controller.dragSource !== null) {
        // this looks okay but changes the indexes
        // target.insertAdjacentElement("afterend", dragSource);
        target.style.opacity = "0.2";
    }
};

const itemDragLeave = (controller:DragOrderController) => (event:DragEvent) => {
    const target = event.target as IIndexedElement;
    const dt = event.dataTransfer!;
    dt.dropEffect = "move";
    if (target !== controller.dragSource) {
        target.style.opacity = "1";
    }
};
