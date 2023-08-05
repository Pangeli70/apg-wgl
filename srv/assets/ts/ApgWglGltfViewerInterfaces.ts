export type HTMLCanvasElement = /*unresolved*/ any;
export type TEventCallBack = (aevent: any) => void;

export interface IApgWglDomElement {
    id: string;
    clientWidth: number;
    clientHeight: number;

    appendChild(achild: IApgWglDomElement | HTMLCanvasElement): void;
    addEventListener(aevent: string, acallback: TEventCallBack): void;
}

export interface IApgWglDomBody extends IApgWglDomElement {
    requestFullscreen(): void;
    cancelFullscreen(): void;
}

export interface IApgWglDomDocument extends IApgWglDomElement {
    getElementById(aid: string): IApgWglDomElement;
    createElement(atag: string): IApgWglDomElement;
    createTextNode(atext: string): IApgWglDomElement;

    body: IApgWglDomBody

    fullscreenElement?: IApgWglDomElement;
}

export interface IApgWglBrowserLocalStorage {
    getItem(akey: string): unknown;
    setItem(akey: string, avalue: unknown): void;
}

export interface IApgWglBrowserWindow {
    devicePixelRatio: number;
    innerWidth: number;
    innerHeight: number;
    localStorage: IApgWglBrowserLocalStorage
}

export interface IApgWglDomAnchor extends IApgWglDomElement {
    href: string;
    innerText: string;
    download: string;
    click(): void;
    
}


export interface IApgWglDomButton extends IApgWglDomElement {
    disabled: boolean;
    click(): void;

}


export interface IApgWglDomCheckBox extends IApgWglDomElement {
    checked: boolean;
    click(): void;
}

export interface IApgWglDomCanvas extends IApgWglDomElement {
    width: string;
    height: string;
    toBlob(af: Function): any;
}

export interface IApgWglDomDialog extends IApgWglDomElement {
    close(): void;
    showModal(): void;
}

export interface IApgWglDomColorPicker extends IApgWglDomElement {
    value: string;
}

export interface IApgWglDomSlider extends IApgWglDomElement {
    value: string;
}

export interface IApgWglDomRange extends IApgWglDomElement {
    name: string;
    type: string;
    min: string;
    max: string;
    step: string;
    value: string;
}

export interface IApgWglDomOutput extends IApgWglDomElement {
    textContent: string;
}