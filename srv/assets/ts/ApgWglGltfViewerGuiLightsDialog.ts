import { ApgWglGltfViewer } from "./ApgWglGltfViewer.ts";
import {
IApgWglDomButton,
    IApgWglDomColorPicker, IApgWglDomDialog,
    IApgWglDomOutput, IApgWglDomSlider,
} from "./ApgWglGltfViewerInterfaces.ts"



export class ApgWglGltfViewerGuiLightsDialog {

    private _viewer: ApgWglGltfViewer;

    me: IApgWglDomDialog;

    parent: IApgWglDomDialog;

    ambientLightColor: IApgWglDomColorPicker;
    ambientLightColorValue: IApgWglDomOutput;
    ambientLightIntensity: IApgWglDomSlider;
    ambientLightIntensityValue: IApgWglDomOutput;

    directionalLightColor: IApgWglDomColorPicker;
    directionalLightColorValue: IApgWglDomOutput;
    directionalLightIntensity: IApgWglDomSlider;
    directionalLightIntensityValue: IApgWglDomOutput;

    directionalLightX: IApgWglDomSlider;
    directionalLightXValue: IApgWglDomOutput;
    directionalLightY: IApgWglDomSlider;
    directionalLightYValue: IApgWglDomOutput;
    directionalLightZ: IApgWglDomSlider;
    directionalLightZValue: IApgWglDomOutput;

    closeLightsDialogButton: IApgWglDomButton;

    constructor(aviewer: ApgWglGltfViewer) {
        this._viewer = aviewer;
        const document = this._viewer.document;

        this.me = document.getElementById("lightsSettingsDialog") as IApgWglDomDialog;

        this.parent = document.getElementById("settingsDialog") as IApgWglDomDialog;

        this.ambientLightColor = document.getElementById("ambientLightColor") as IApgWglDomColorPicker;
        this.ambientLightColor.addEventListener("change", (_e) => {
            this.#ambientLightColorChange();
        })
        this.ambientLightColorValue = document.getElementById("ambientLightColorValue") as IApgWglDomOutput;
        this.ambientLightIntensity = document.getElementById("ambientLightIntensity") as IApgWglDomSlider;
        this.ambientLightIntensity.addEventListener("change", (_e) => { 
            this.#ambientLightIntensityChange();
        })
        this.ambientLightIntensityValue = document.getElementById("ambientLightIntensityValue") as IApgWglDomOutput;

        this.directionalLightColor = document.getElementById("directionalLightColor") as IApgWglDomColorPicker;
        this.directionalLightColorValue = document.getElementById("directionalLightColorValue") as IApgWglDomOutput;
        this.directionalLightIntensity = document.getElementById("directionalLightIntensity") as IApgWglDomSlider;
        this.directionalLightIntensityValue = document.getElementById("directionalLightIntensityValue") as IApgWglDomOutput;

        this.directionalLightX = document.getElementById("directionalLightX") as IApgWglDomSlider;
        this.directionalLightXValue = document.getElementById("directionalLightXValue") as IApgWglDomOutput;
        this.directionalLightY = document.getElementById("directionalLightY") as IApgWglDomSlider;
        this.directionalLightYValue = document.getElementById("directionalLightYValue") as IApgWglDomOutput;
        this.directionalLightZ = document.getElementById("directionalLightZ") as IApgWglDomSlider;
        this.directionalLightZValue = document.getElementById("directionalLightZValue") as IApgWglDomOutput;

        this.closeLightsDialogButton = document.getElementById('closeLightsDialogButton') as IApgWglDomButton;
        this.closeLightsDialogButton.addEventListener('click', (_e: any) => {
            this.me.close();
        });

        this.#initLightSettingsDialog();

    }

    #initLightSettingsDialog() {
        const options = this._viewer.options;

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

    }

    #ambientLightIntensityChange() {

        const options = this._viewer.options;
        options.ambLightIntensity = parseFloat(this.ambientLightIntensity.value);
        this.ambientLightIntensityValue.textContent = options.ambLightIntensity.toFixed(2);
        this._viewer.updateLights();
    }

    #ambientLightColorChange() {
        const options = this._viewer.options;
        const hexStr = this.ambientLightColor.value.replaceAll("#", "0x");
        const hexVal = parseInt(hexStr, 16);
        options.ambLightColor.setHex(hexVal);
        this.ambientLightColorValue.textContent = this.ambientLightColor.value;
        this._viewer.updateLights();
    }

    #directionalLightIntensityChange() {
        const options = this._viewer.options;
        options.dirLightIntensity = parseFloat(this.directionalLightIntensity.value);
        this.directionalLightIntensityValue.textContent = this.directionalLightIntensity.value;
        this._viewer.updateLights();
    }

    #directionalLightColorChange() {
        const options = this._viewer.options;
        const hexStr = this.directionalLightColor.value.replaceAll("#", "0x");
        const hexVal = parseInt(hexStr, 16);
        options.ambLightColor.setHex(hexVal);
        this.directionalLightColorValue.textContent = this.directionalLightColor.value;
        this._viewer.updateLights();
    }

    #directionalLightXChange() {
        const options = this._viewer.options;
        options.dirLightPosition.x = parseFloat(this.directionalLightX.value);
        this.directionalLightXValue.textContent = this.directionalLightX.value;
        this._viewer.updateLights();
    }
    #directionalLightYChange() {
        const options = this._viewer.options;
        options.dirLightPosition.y = parseFloat(this.directionalLightY.value);
        this.directionalLightYValue.textContent = this.directionalLightY.value;
        this._viewer.updateLights();
    }
    #directionalLightZChange() {
        const options = this._viewer.options;
        options.dirLightPosition.z = parseFloat(this.directionalLightZ.value);
        this.directionalLightZValue.textContent = this.directionalLightZ.value;
        this._viewer.updateLights();
    }


}