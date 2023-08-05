import { ApgWglGltfViewer } from "./ApgWglGltfViewer.ts";
import {
    IApgWglDomDialog, IApgWglDomElement,
    IApgWglDomCheckBox, IApgWglDomAnchor, IApgWglDomButton
} from "./ApgWglGltfViewerInterfaces.ts";

export class ApgWglGltfViewerGuiSettingsDialog {


    private _viewer: ApgWglGltfViewer;

    me: IApgWglDomDialog;

    parent: IApgWglDomDialog;
    lightsSettingsDialog: IApgWglDomDialog;


    useEnvMapChkBox: IApgWglDomCheckBox;
    lightsSettingsButton: IApgWglDomButton;
    useExrChkBox: IApgWglDomCheckBox;
    useFloorChkBox: IApgWglDomCheckBox;
    closeSettingsDialogButton: IApgWglDomAnchor

    constructor(aviewer: ApgWglGltfViewer) {
        this._viewer = aviewer;
        const document = this._viewer.document;

        this.me = document.getElementById("settingsDialog") as IApgWglDomDialog;

        this.parent = document.getElementById("mainMenuDialog") as IApgWglDomDialog;
        this.lightsSettingsDialog = document.getElementById("lightsSettingsDialog") as IApgWglDomDialog;

        this.useEnvMapChkBox = document.getElementById("viewerSettingsUseMap") as IApgWglDomCheckBox;
        this.useEnvMapChkBox.checked = this._viewer.options.useEnvMapInsteadThanLights;
        this.useEnvMapChkBox.addEventListener('click', (_e: any) => {
            this.#envSettingsUseMapChange();
        });

        this.lightsSettingsButton = document.getElementById("openLightsDialogButton") as IApgWglDomButton;
        this.lightsSettingsButton.disabled = this._viewer.options.useEnvMapInsteadThanLights;
        this.lightsSettingsButton.addEventListener('click', (_e: any) => {
            this.me.close();
            this.lightsSettingsDialog.showModal();
        });

        this.useExrChkBox = document.getElementById("viewerSettingsUseExr") as IApgWglDomCheckBox;
        this.useExrChkBox.checked = this._viewer.options.useExrInsteadThanHdr;
        this.useExrChkBox.addEventListener('click', (_e: any) => {
            this._viewer.options.useExrInsteadThanHdr = this.useExrChkBox.checked;
        });

        this.useFloorChkBox = document.getElementById("viewerSettingsUseFloor") as IApgWglDomCheckBox;
        this.useFloorChkBox.addEventListener('click', (_e: any) => {

        });

        this.closeSettingsDialogButton = document.getElementById('closeSettingsDialogButton') as IApgWglDomAnchor;
        this.closeSettingsDialogButton.addEventListener('click', (_e: any) => {
            this.me.close();
        });

    }



    #envSettingsUseMapChange() {
        if (this.useEnvMapChkBox.checked) {
            this.lightsSettingsButton.disabled = true;
        }
        else {
            this.lightsSettingsButton.disabled = false;
        }
        this._viewer.options.useEnvMapInsteadThanLights = this.useEnvMapChkBox.checked;
        this.#setupLights();
        this._viewer.render();
    }


    #setupLights() {

        if (this._viewer.options.useEnvMapInsteadThanLights) {
            this._viewer.scene!.environment = this._viewer.currEnv;
            this._viewer.ambientLight!.visible = false;
            this._viewer.directionalLight!.visible = false;
        } else {
            this._viewer.scene!.environment = null;
            this._viewer.ambientLight!.visible = true;
            this._viewer.directionalLight!.visible = true;
        }
    }


}