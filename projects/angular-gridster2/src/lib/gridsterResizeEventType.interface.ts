export interface GridsterResizeEventType {
    n: boolean;
    s: boolean;
    w: boolean;
    e: boolean;
}

export interface EventTarget2 extends EventTarget {
    hasAttribute: (attribute: string) => boolean;
    getAttribute: (attribute: string) => string;
}

export interface MouseEvent2 extends MouseEvent {
    target: EventTarget2;
}
