import { THREE } from "../deps.ts";
import { eApgWglTestMaterialsTypes } from "../enums/eApgWglTestMaterialTypes.ts";
import { ApgWglExtrusionBuilder } from "../classes/ApgWglExtrusionBuilder.ts";
import { ApgWglTestMaterialsBuilder } from "../classes/ApgWglTestMaterialsBuilder.ts";

export class ApgWglTestService {

    private static _MATERIALS_NUM = 16;

    private static _outputPath = "./test/output/";

    static get TestOutputPath() { return this._outputPath; }

    private static _materials = ApgWglTestMaterialsBuilder.buildRandomTestMaterials(this._MATERIALS_NUM);

    
    static GetLinearExtrusionsTestScene(
        anx: number,
        anz: number,
        adeltax: number,
        adeltaz: number,
        amaterialType: eApgWglTestMaterialsTypes
    ) {

        const scene = new THREE.Scene();

        const axesHelper = new THREE.AxesHelper(200);
        scene.add(axesHelper);

        const stepX = adeltax;
        const stepZ = adeltaz;
        const nx = anx;
        const nz = anz;
        const tx = stepX * (nx - 1);
        const tz = stepZ * (nz - 1);
        const ox = tx / -2;
        const oz = tz / -2;

        //console.log(`Nx: ${nx} Nz: ${nz}`);
        //console.log(`Ox: ${ox} Oz: ${oz}`);
        let matIndex = 0;
        for (let x = 0; x < nx; x++) {
            for (let z = 0; z < nz; z++) {

                const px = ox + (x * stepX);
                const pz = oz + (z * stepZ);

                const geometry = ApgWglExtrusionBuilder.extrudeRandomShape();
                //geometry.scale(0.5, 0.5, 0.5);
                geometry.translate(px, 0, pz);
                const material = this._materials[amaterialType][matIndex];
                const mesh = new THREE.Mesh(geometry, <any>material);
                scene.add(mesh);

                //console.log(`Added mesh to scene (${x},${z})`);
                matIndex++;
                if (matIndex == this._MATERIALS_NUM) matIndex = 0;
            }
        }
        return scene;
    }

    static GetOpenedSplinesTestScene(
        anx: number,
        anz: number,
        adeltax: number,
        adeltaz: number,
        amaterialType: eApgWglTestMaterialsTypes,
        aflatShading: boolean
    ) {

        const scene = new THREE.Scene();

        const axesHelper = new THREE.AxesHelper(200);
        scene.add(axesHelper);

        const stepX = adeltax;
        const stepZ = adeltaz;
        const nx = anx;
        const nz = anz;
        const tx = stepX * (nx - 1);
        const tz = stepZ * (nz - 1);
        const ox = tx / -2;
        const oz = tz / -2;

        let matIndex = 0;
        for (let x = 0; x < nx; x++) {
            for (let z = 0; z < nz; z++) {
                let geometry = ApgWglExtrusionBuilder.extrudeRandomShapeAlongRandomOpenedSpline();
                geometry.scale(0.5, 0.5, 0.5);
                const px = ox + (x * stepX);
                const pz = oz + (z * stepZ);
                //console.log(`px: ${px} pz: ${pz}`);
                geometry.translate(px, 0, pz);

                if (aflatShading) {
                    const newGeometry = geometry.toNonIndexed();
                    newGeometry.computeVertexNormals();
                    geometry = <THREE.ExtrudeGeometry>newGeometry; // This cast is a hack
                }

                const material = this._materials[amaterialType][matIndex];

                const mesh = new THREE.Mesh(geometry, <any>material);
                scene.add(mesh);
                //console.log(`Added mesh to scene (${x},${z})`);
                matIndex++;
                if (matIndex == this._MATERIALS_NUM) matIndex = 0;
            }
        }
        return scene;
    }

    static GetClosedSplinesTestScene(
        anx: number,
        anz: number,
        adeltax: number,
        adeltaz: number,
        amaterialType: eApgWglTestMaterialsTypes,
        aflatShading: boolean
    ) {

        const scene = new THREE.Scene();

        const axesHelper = new THREE.AxesHelper(200);
        scene.add(axesHelper);

        const stepX = adeltax;
        const stepZ = adeltaz;
        const nx = anx;
        const nz = anz;
        const tx = stepX * (nx - 1);
        const tz = stepZ * (nz - 1);
        const ox = tx / -2;
        const oz = tz / -2;

        let matIndex = 0;
        for (let x = 0; x < nx; x++) {
            for (let z = 0; z < nz; z++) {
                let geometry = ApgWglExtrusionBuilder.extrudeRandomShapeAlongRandomClosedSpline();
                geometry.scale(0.5, 0.5, 0.5);
                const px = ox + (x * stepX);
                const pz = oz + (z * stepZ);
                console.log(`px: ${px} pz: ${pz}`);
                geometry.translate(px, 0, pz);

                const material = this._materials[amaterialType][matIndex];

                if (aflatShading) {
                    const newGeometry = geometry.toNonIndexed();
                    newGeometry.computeVertexNormals();
                    geometry = <THREE.ExtrudeGeometry>newGeometry; // This cast is a hack
                }

                const mesh = new THREE.Mesh(geometry, <any>material);
                scene.add(mesh);
                matIndex++;
                if (matIndex == this._MATERIALS_NUM) matIndex = 0;
            }
        }

        return scene;

    }


}