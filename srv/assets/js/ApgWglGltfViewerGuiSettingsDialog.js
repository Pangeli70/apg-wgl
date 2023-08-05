export class ApgWglGltfViewerGuiSettingsDialog {
  _viewer;
  me;
  parent;
  lightsSettingsDialog;
  useEnvMapChkBox;
  lightsSettingsButton;
  useExrChkBox;
  useFloorChkBox;
  closeSettingsDialogButton;
  constructor(aviewer) {
    this._viewer = aviewer;
    const document = this._viewer.document;
    this.me = document.getElementById("settingsDialog");
    this.parent = document.getElementById("mainMenuDialog");
    this.lightsSettingsDialog = document.getElementById("lightsSettingsDialog");
    this.useEnvMapChkBox = document.getElementById("viewerSettingsUseMap");
    this.useEnvMapChkBox.checked = this._viewer.options.useEnvMapInsteadThanLights;
    this.useEnvMapChkBox.addEventListener("click", (_e) => {
      this.#envSettingsUseMapChange();
    });
    this.lightsSettingsButton = document.getElementById("openLightsDialogButton");
    this.lightsSettingsButton.disabled = this._viewer.options.useEnvMapInsteadThanLights;
    this.lightsSettingsButton.addEventListener("click", (_e) => {
      this.me.close();
      this.lightsSettingsDialog.showModal();
    });
    this.useExrChkBox = document.getElementById("viewerSettingsUseExr");
    this.useExrChkBox.checked = this._viewer.options.useExrInsteadThanHdr;
    this.useExrChkBox.addEventListener("click", (_e) => {
      this._viewer.options.useExrInsteadThanHdr = this.useExrChkBox.checked;
    });
    this.useFloorChkBox = document.getElementById("viewerSettingsUseFloor");
    this.useFloorChkBox.addEventListener("click", (_e) => {
    });
    this.closeSettingsDialogButton = document.getElementById("closeSettingsDialogButton");
    this.closeSettingsDialogButton.addEventListener("click", (_e) => {
      this.me.close();
    });
  }
  #envSettingsUseMapChange() {
    if (this.useEnvMapChkBox.checked) {
      this.lightsSettingsButton.disabled = true;
    } else {
      this.lightsSettingsButton.disabled = false;
    }
    this._viewer.options.useEnvMapInsteadThanLights = this.useEnvMapChkBox.checked;
    this.#setupLights();
    this._viewer.render();
  }
  #setupLights() {
    if (this._viewer.options.useEnvMapInsteadThanLights) {
      this._viewer.scene.environment = this._viewer.currEnv;
      this._viewer.ambientLight.visible = false;
      this._viewer.directionalLight.visible = false;
    } else {
      this._viewer.scene.environment = null;
      this._viewer.ambientLight.visible = true;
      this._viewer.directionalLight.visible = true;
    }
  }
}
