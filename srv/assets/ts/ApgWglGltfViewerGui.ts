
import { ApgWglGltfViewer } from "./ApgWglGltfViewer.ts";

import { IApgWglDomAnchor, IApgWglDomDialog } from "./ApgWglGltfViewerInterfaces.ts"

import { ApgWglGltfViewerGuiMainMenu } from "./ApgWglGltfViewerGuiMainMenu.ts";
import { ApgWglGltfViewerGuiSettingsDialog } from "./ApgWglGltfViewerGuiSettingsDialog.ts";
import { ApgWglGltfViewerGuiLightsDialog } from "./ApgWglGltfViewerGuiLightsDialog.ts";


export class ApgWglGltfViewerGui {
    private _viewer: ApgWglGltfViewer;

    starterButton: IApgWglDomAnchor;
    mainMenuDialog: IApgWglDomDialog;

    mainMenu: ApgWglGltfViewerGuiMainMenu;
    settings: ApgWglGltfViewerGuiSettingsDialog;
    lights: ApgWglGltfViewerGuiLightsDialog;



    constructor(astarterButtonName: string, aviewer: ApgWglGltfViewer) {
        this._viewer = aviewer;
        const document = this._viewer.document;

        this.starterButton = document.getElementById(astarterButtonName) as IApgWglDomAnchor;
        this.starterButton.addEventListener('click', (_e: any) => {
            this.mainMenuDialog.showModal();
        });
        this.mainMenuDialog = document.getElementById("mainMenuDialog") as IApgWglDomDialog;

        this.mainMenu = new ApgWglGltfViewerGuiMainMenu(aviewer);
        this.settings = new ApgWglGltfViewerGuiSettingsDialog(aviewer);
        this.lights = new ApgWglGltfViewerGuiLightsDialog(aviewer);
    }


}


