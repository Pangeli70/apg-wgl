export class ApgWglGltfViewerGuiMainMenu {
  _viewer;
  mainMenu;
  settingsButton;
  settingsDialog;
  reloadEnvMapButton;
  reloadGltfButton;
  fullScreenButton;
  screenShotButton;
  closeMainMenuButton;
  hiddenScreenShotAnchor;
  constructor(aviewer) {
    this._viewer = aviewer;
    const document = this._viewer.document;
    this.mainMenu = document.getElementById("mainMenuDialog");
    this.settingsDialog = document.getElementById("settingsDialog");
    this.hiddenScreenShotAnchor = document.getElementById("hiddenScreenShotAnchor");
    this.settingsButton = document.getElementById("openSettingsButton");
    this.settingsButton.addEventListener("click", (_e) => {
      this.mainMenu.close();
      this.settingsDialog.showModal();
    });
    this.reloadEnvMapButton = document.getElementById("reloadEnvMapButton");
    this.reloadEnvMapButton.addEventListener("click", (_e) => {
      this.mainMenu.close();
      this.reloadEnvMap();
    });
    this.reloadGltfButton = document.getElementById("reloadGltfButton");
    this.reloadGltfButton.addEventListener("click", (_e) => {
      this.mainMenu.close();
      this.reloadResource();
    });
    this.screenShotButton = document.getElementById("screenShotButton");
    this.screenShotButton.addEventListener("click", (_e) => {
      this.mainMenu.close();
      this.screenshot();
    });
    this.fullScreenButton = document.getElementById("fullScreenButton");
    this.fullScreenButton.addEventListener("click", (_e) => {
      this.mainMenu.close();
      const document2 = this._viewer.document;
      if (!document2.fullscreenElement) {
        document2.body.requestFullscreen();
      } else {
        document2.body.cancelFullscreen();
      }
    });
    this.closeMainMenuButton = document.getElementById("closeMainMenuButton");
    this.closeMainMenuButton.addEventListener("click", (_e) => {
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
    const resourceSubScene = this._viewer.scene.getObjectByName(resourceName);
    if (!resourceSubScene) {
      alert("The resource to be removed (" + resourceName + ") was not found");
      return;
    }
    this._viewer.scene.remove(resourceSubScene);
    this._viewer.loadSceneFromResource(resourceName);
  }
  screenshot() {
    const viewer = this._viewer;
    const canvas = viewer.canvas;
    const fileName = "ApgWglViewerScreenshot -" + canvas.width.toString() + "x" + canvas.height.toString() + ".png";
    viewer.render();
    canvas.toBlob((blob) => {
      const a = this.hiddenScreenShotAnchor;
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
    });
    this.mainMenu.close();
  }
}
