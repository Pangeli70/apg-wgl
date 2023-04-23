/** -----------------------------------------------------------------------
 * @module [GLTF]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/04/29-2022/06/05]
 * -----------------------------------------------------------------------
 */
import {
  THREE,
  StdPath
} from "../../../deps.ts";

import {
  ApgUtils, ApgUtilsDateTimeStamp
} from '../../Utils/mod.ts';

import {
  ApgGltf
} from '../src/classes/ApgGltf.ts';

import {
  ApgGltfMaterialsHelper,
  eApgGltfMaterialTypes
} from './ApgGltfMaterialsHelper.ts';

import {
  ApgGltfExtrusionHelper,
  IApgGltfPolylineExtrusionSettings
} from './ApgGltfExtrusionHelper.ts'



export class ApgGltfTester {

  readonly MATERIALS_NUM = 9;

  private _outputPath = '';
  private _materials: Map<string, THREE.Material[]> = new Map();

  constructor(apath: string) {
    this._outputPath = apath;
    this._materials = ApgGltfMaterialsHelper.prepareTestMaterials(this.MATERIALS_NUM);
  }


  private _closedSplinesScene(
    anx: number,
    anz: number,
    adeltax: number,
    adeltaz: number,
    amaterialType: eApgGltfMaterialTypes,
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
        let geometry = ApgGltfExtrusionHelper.randomShape_Extrusion_Along_ClosedSpline();
        geometry.scale(0.5, 0.5, 0.5);
        const px = ox + (x * stepX);
        const pz = oz + (z * stepZ);
        console.log(`px: ${px} pz: ${pz}`);
        geometry.translate(px, 0, pz);

        const material = this._materials.get(amaterialType)![matIndex];

        if(aflatShading){
          const newGeometry = geometry.toNonIndexed();
          newGeometry.computeVertexNormals();
          geometry = <THREE.ExtrudeBufferGeometry>newGeometry; // This cast is a hack
        }
        
        const mesh = new THREE.Mesh(geometry, <any>material);
        scene.add(mesh);
        matIndex++;
        if (matIndex == this.MATERIALS_NUM) matIndex = 0;
      }
    }

    return scene;

  }


  private _openedSplinesScene(
    anx: number,
    anz: number,
    adeltax: number,
    adeltaz: number,
    amaterialType: eApgGltfMaterialTypes,
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
        let geometry = ApgGltfExtrusionHelper.randomShape_Extrusion_Along_OpenedSpline();
        geometry.scale(0.5, 0.5, 0.5);
        const px = ox + (x * stepX);
        const pz = oz + (z * stepZ);
        //console.log(`px: ${px} pz: ${pz}`);
        geometry.translate(px, 0, pz);

        if(aflatShading){
          const newGeometry = geometry.toNonIndexed();
          newGeometry.computeVertexNormals();
          geometry = <THREE.ExtrudeBufferGeometry>newGeometry; // This cast is a hack
        }

        const material = this._materials.get(amaterialType)![matIndex];

        const mesh = new THREE.Mesh(geometry, <any>material);
        scene.add(mesh);
        //console.log(`Added mesh to scene (${x},${z})`);
        matIndex++;
        if (matIndex == this.MATERIALS_NUM) matIndex = 0;
      }
    }
    return scene;
  }


  private _polyLineScene(
    anx: number,
    anz: number,
    adeltax: number,
    adeltaz: number,
    amaterialType: eApgGltfMaterialTypes,
    aflatShading: boolean,
    adrawGenerators: boolean
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

        const px = ox + (x * stepX);
        const pz = oz + (z * stepZ);

        const extrudeSettings: IApgGltfPolylineExtrusionSettings = {
          nodes: 4,
          segmentLength: 50,
          maxDistance: 5,
          maxAngleDeg: 30,
          closed: false,
          capped: false
        };

        const generators = ApgGltfExtrusionHelper.randomShape_Extrusion_Along_PolyLine_Generators(extrudeSettings)
        let geometry = ApgGltfExtrusionHelper.randomShape_Extrusion_Along_PolyLine(generators, extrudeSettings);
        //geometry.scale(0.5, 0.5, 0.5);
        geometry.translate(px, 0, pz);

        if(aflatShading){
          const newGeometry = geometry.toNonIndexed();
          newGeometry.computeVertexNormals();
          geometry = <THREE.ExtrudeBufferGeometry>newGeometry; // This cast is a hack
        }

        const material = this._materials.get(amaterialType)![matIndex];
        const mesh = new THREE.Mesh(geometry, <any>material);
        scene.add(mesh);

        if (adrawGenerators) {
          const generatorsGeom = ApgGltfExtrusionHelper.randomShape_Extrusion_Along_PolyLine_Generators_Geometry(generators);
          generatorsGeom.translate(px, 0, pz);
          const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
          const line = new THREE.Line(generatorsGeom, <any>lineMaterial);
          scene.add(line);
        }
        matIndex++;
        if (matIndex == this.MATERIALS_NUM) matIndex = 0;
      }
    }
    return scene;
  }


  private _linearExtrusionsScene(
    anx: number,
    anz: number,
    adeltax: number,
    adeltaz: number,
    amaterialType: eApgGltfMaterialTypes,
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

    //console.log(`Nx: ${nx} Nz: ${nz}`);
    //console.log(`Ox: ${ox} Oz: ${oz}`);
    let matIndex = 0;
    for (let x = 0; x < nx; x++) {
      for (let z = 0; z < nz; z++) {

        const px = ox + (x * stepX);
        const pz = oz + (z * stepZ);

        let geometry = ApgGltfExtrusionHelper.randomShape_Extrusion_Along_Line();
        //geometry.scale(0.5, 0.5, 0.5);
        geometry.translate(px, 0, pz);
        const material = this._materials.get(amaterialType)![matIndex];
        const mesh = new THREE.Mesh(geometry, <any>material);
        scene.add(mesh);

        if(aflatShading){
          const newGeometry = geometry.toNonIndexed();
          newGeometry.computeVertexNormals();
          geometry = <THREE.ExtrudeBufferGeometry>newGeometry; // This cast is a hack
        }

        //console.log(`Added mesh to scene (${x},${z})`);
        matIndex++;
        if (matIndex == this.MATERIALS_NUM) matIndex = 0;
      }
    }
    return scene;
  }


  private async _save(ascene: any, afileName: string, aisProd: boolean) {

    // We don't have write permissions in production
    if (aisProd) {
      return;
    }

    const file = StdPath.normalize(this._outputPath + afileName + '.gltf');
    const r = await ApgGltf.exportGLTF(ascene, file);
    return r;
  }


  async runTests(afolder: string, aisProduction: boolean) {

    if (!aisProduction) {
      ApgUtils.Fs_ClearFolderSync(this._outputPath);

      for (let i = 0; i < 4; i++) {
      //for (let i = 2; i < 4; i++) {
        const rx = Math.trunc((Math.random() * 3) + 2);
        const rz = Math.trunc((Math.random() * 3) + 2);
        let scene = undefined;
        const materialType = <eApgGltfMaterialTypes>afolder;
        
        let isFlatShading = false;
        if(materialType.toLowerCase().indexOf("flat")!== -1 ){
          isFlatShading = true;
        }

        let fileName = "";
        if (i == 0) {
          scene = this._closedSplinesScene(rx, rz, 200, 200, materialType, isFlatShading);
          fileName = "ClosedSplineTest";
        } else if (i == 1) {
          scene = this._openedSplinesScene(rx, rz, 200, 200, materialType, isFlatShading);
          fileName = "OpenedSplineTest";
        } else if (i == 2) {
          scene = this._polyLineScene(rx, rz, 200, 200, materialType, isFlatShading, true);
          fileName = "PolyLineTest";
        } else {
          scene = this._linearExtrusionsScene(rx, rz, 200, 200, materialType, isFlatShading);
          fileName = "LinearExtrusionTest";
        }
        const dateTimeStamp = new ApgUtilsDateTimeStamp(new Date()).Value;
        await this._save(
          scene,
          i.toString() + "_" + fileName + "_" + dateTimeStamp,
          aisProduction
        )
      }
    }
  }

}