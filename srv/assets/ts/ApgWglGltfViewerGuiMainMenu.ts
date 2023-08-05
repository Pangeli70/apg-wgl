
import { ApgWglGltfViewer } from "./ApgWglGltfViewer.ts";
import { IApgWglDomAnchor, IApgWglDomButton, IApgWglDomDialog } from "./ApgWglGltfViewerInterfaces.ts"


export class ApgWglGltfViewerGuiMainMenu {
    private _viewer: ApgWglGltfViewer;

    mainMenu: IApgWglDomDialog;

    settingsButton: IApgWglDomButton;
    settingsDialog: IApgWglDomDialog;
    
    reloadEnvMapButton: IApgWglDomButton;
    reloadGltfButton: IApgWglDomButton;
    fullScreenButton: IApgWglDomButton;
    screenShotButton: IApgWglDomButton;

    closeMainMenuButton: IApgWglDomButton;

    hiddenScreenShotAnchor: IApgWglDomAnchor;

    constructor(aviewer: ApgWglGltfViewer) {
        this._viewer = aviewer;
        const document = this._viewer.document;

        this.mainMenu = document.getElementById("mainMenuDialog") as IApgWglDomDialog;
        this.settingsDialog = document.getElementById("settingsDialog") as IApgWglDomDialog;
        // this is created dynamically
        this.hiddenScreenShotAnchor = document.getElementById("hiddenScreenShotAnchor") as IApgWglDomAnchor;

        this.settingsButton = document.getElementById('openSettingsButton') as IApgWglDomButton;
        this.settingsButton.addEventListener('click', (_e: any) => {
            this.mainMenu.close();
            this.settingsDialog.showModal();
        });

        this.reloadEnvMapButton = document.getElementById('reloadEnvMapButton') as IApgWglDomButton;
        this.reloadEnvMapButton.addEventListener('click', (_e: any) => {
            this.mainMenu.close();
            this.reloadEnvMap();
        });

        this.reloadGltfButton = document.getElementById('reloadGltfButton') as IApgWglDomButton;
        this.reloadGltfButton.addEventListener('click', (_e: any) => {
            this.mainMenu.close();
            this.reloadResource();
        });

        this.screenShotButton = document.getElementById('screenShotButton') as IApgWglDomButton;
        this.screenShotButton.addEventListener('click', (_e: any) => {
            this.mainMenu.close();
            this.screenshot();
        });

        this.fullScreenButton = document.getElementById('fullScreenButton') as IApgWglDomButton;
        this.fullScreenButton.addEventListener('click', (_e: any) => {
            this.mainMenu.close();
            const document = this._viewer.document;
            if (!document.fullscreenElement) {
                document.body.requestFullscreen();
            }
            else {
                document.body.cancelFullscreen();
            }
        });

        this.closeMainMenuButton = document.getElementById('closeMainMenuButton') as IApgWglDomButton;
        this.closeMainMenuButton.addEventListener('click', (_e: any) => {
            this.mainMenu.close();
        });

    }


    reloadEnvMap() {
        const viewer = this._viewer;
        if (viewer.options.useExrInsteadThanHdr) {
            viewer.initExrEnvMap();
        } else {
            viewer.initHdrEnvMap();
        }
        viewer.render();
    }

    reloadResource() {
        const resourceName = this._viewer.resourceName;
        const resourceSubScene = this._viewer.scene!.getObjectByName(resourceName);
        if (!resourceSubScene) {
            alert("The resource to be removed (" + resourceName + ") was not found")
            return;
        }
        this._viewer.scene!.remove(resourceSubScene);
        this._viewer.loadSceneFromResource(resourceName);
    }

    screenshot() {
        const viewer = this._viewer;
        const canvas = viewer.canvas!;
        const fileName = "ApgWglViewerScreenshot -" + canvas.width.toString() + "x" + canvas.height.toString() + ".png";
        viewer.render();
        canvas!.toBlob((blob: any) => {
            const a = this.hiddenScreenShotAnchor;
            const url = URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
        });
        this.mainMenu.close();
    }


}


