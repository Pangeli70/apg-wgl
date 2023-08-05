export class ApgWglGltfViewerLightsDialog {
  _viewer;
  me;
  parent;
  ambientLightColor;
  ambientLightColorValue;
  ambientLightIntensity;
  ambientLightIntensityValue;
  directionalLightColor;
  directionalLightColorValue;
  directionalLightIntensity;
  directionalLightIntensityValue;
  directionalLightX;
  directionalLightXValue;
  directionalLightY;
  directionalLightYValue;
  directionalLightZ;
  directionalLightZValue;
  constructor(aviewer) {
    this._viewer = aviewer;
    const document = this._viewer.document;
    this.me = document.getElementById("lightSettingsDialog");
    this.parent = document.getElementById("lightSettingsDialog");
    this.ambientLightColor = document.getElementById("ambientLightColor");
    this.ambientLightColorValue = document.getElementById("ambientLightColorValue");
    this.ambientLightIntensity = document.getElementById("ambientLightIntensity");
    this.ambientLightIntensityValue = document.getElementById("ambientLightIntensityValue");
    this.directionalLightColor = document.getElementById("directionalLightColor");
    this.directionalLightColorValue = document.getElementById("directionalLightColorValue");
    this.directionalLightIntensity = document.getElementById("directionalLightIntensity");
    this.directionalLightIntensityValue = document.getElementById("directionalLightIntensityValue");
    this.directionalLightX = document.getElementById("directionalLightX");
    this.directionalLightXValue = document.getElementById("directionalLightXValue");
    this.directionalLightY = document.getElementById("directionalLightY");
    this.directionalLightYValue = document.getElementById("directionalLightYValue");
    this.directionalLightZ = document.getElementById("directionalLightZ");
    this.directionalLightZValue = document.getElementById("directionalLightZValue");
  }
  openLightSettingsDialog() {
    const options = this._viewer.options;
    this.parent.close();
    this.ambientLightColor.value = "#" + options.ambLightColor.getHexString();
    this.ambientLightColorValue.textContent = this.ambientLightColor.value;
    this.ambientLightIntensity.value = options.ambLightIntensity.toFixed(2);
    this.ambientLightIntensityValue.textContent = this.ambientLightIntensity.value;
    this.directionalLightColor.value = "#" + options.dirLightColor.getHexString();
    this.directionalLightColorValue.textContent = this.directionalLightColor.value;
    this.directionalLightIntensity.value = options.dirLightIntensity.toFixed(2);
    this.directionalLightIntensityValue.textContent = this.directionalLightIntensity.value;
    this.directionalLightX.value = options.dirLightPosition.x.toFixed(2);
    this.directionalLightXValue.textContent = this.directionalLightX.value;
    this.directionalLightY.value = options.dirLightPosition.y.toFixed(2);
    this.directionalLightYValue.textContent = this.directionalLightY.value;
    this.directionalLightZ.value = options.dirLightPosition.z.toFixed(2);
    this.directionalLightZValue.textContent = this.directionalLightZ.value;
    this.me.showModal();
  }
  ambientLightIntensityChange() {
    const options = this._viewer.options;
    options.ambLightIntensity = parseFloat(this.ambientLightIntensity.value);
    this.ambientLightIntensityValue.textContent = options.ambLightIntensity.toFixed(2);
    this._viewer.updateLights();
  }
  ambientLightColorChange() {
    const options = this._viewer.options;
    const hexStr = this.ambientLightColor.value.replaceAll("#", "0x");
    const hexVal = parseInt(hexStr, 16);
    options.ambLightColor.setHex(hexVal);
    this.ambientLightColorValue.textContent = this.ambientLightColor.value;
    this._viewer.updateLights();
  }
  directionalLightIntensityChange() {
    const options = this._viewer.options;
    options.dirLightIntensity = parseFloat(this.directionalLightIntensity.value);
    this.directionalLightIntensityValue.textContent = this.directionalLightIntensity.value;
    this._viewer.updateLights();
  }
  directionalLightColorChange() {
    const options = this._viewer.options;
    const hexStr = this.directionalLightColor.value.replaceAll("#", "0x");
    const hexVal = parseInt(hexStr, 16);
    options.ambLightColor.setHex(hexVal);
    this.directionalLightColorValue.textContent = this.directionalLightColor.value;
    this._viewer.updateLights();
  }
  directionalLightXChange() {
    const options = this._viewer.options;
    options.dirLightPosition.x = parseFloat(this.directionalLightX.value);
    this.directionalLightXValue.textContent = this.directionalLightX.value;
    this._viewer.updateLights();
  }
  directionalLightYChange() {
    const options = this._viewer.options;
    options.dirLightPosition.y = parseFloat(this.directionalLightY.value);
    this.directionalLightYValue.textContent = this.directionalLightY.value;
    this._viewer.updateLights();
  }
  directionalLightZChange() {
    const options = this._viewer.options;
    options.dirLightPosition.z = parseFloat(this.directionalLightZ.value);
    this.directionalLightZValue.textContent = this.directionalLightZ.value;
    this._viewer.updateLights();
  }
  close() {
    this.me.close();
  }
}
