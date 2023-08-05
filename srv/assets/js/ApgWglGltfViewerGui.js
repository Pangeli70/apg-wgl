import { ApgWglGltfViewerGuiMainMenu } from "./ApgWglGltfViewerGuiMainMenu.ts";
import { ApgWglGltfViewerGuiSettingsDialog } from "./ApgWglGltfViewerGuiSettingsDialog.ts";
import { ApgWglGltfViewerGuiLightsDialog } from "./ApgWglGltfViewerGuiLightsDialog.ts";
export class ApgWglGltfViewerGui {
  _viewer;
  starterButton;
  mainMenuDialog;
  mainMenu;
  settings;
  lights;
  constructor(astarterButtonName, aviewer) {
    this._viewer = aviewer;
    const document = this._viewer.document;
    this.starterButton = document.getElementById(astarterButtonName);
    this.starterButton.addEventListener("click", (_e) => {
      this.mainMenuDialog.showModal();
    });
    this.mainMenuDialog = document.getElementById("mainMenuDialog");
    this.mainMenu = new ApgWglGltfViewerGuiMainMenu(aviewer);
    this.settings = new ApgWglGltfViewerGuiSettingsDialog(aviewer);
    this.lights = new ApgWglGltfViewerGuiLightsDialog(aviewer);
  }
}
