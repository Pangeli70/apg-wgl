/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/04/29-2022/06/05]
 * -----------------------------------------------------------------------
 */

import { ApgWglService } from "../../lib/mod.ts";
import { eApgWglMaterialTypes } from "../../mod.ts";
import { Uts, Spc, Wgl, THREE } from "../deps.ts";



export class ApgWglSpec extends Spc.ApgSpcSpec {

  constructor() {
    super(import.meta.url)

    this.flags = {
      [this._closedSplinesScene.name]: Spc.eApgSpcRun.yes
    }

    this._outputPath = ApgWglService.TestOutputPath;
    this._materials = Wgl.ApgWglMaterialsHelper.prepareTestMaterials(this.MATERIALS_NUM);

  }

  readonly MATERIALS_NUM = 9;

  private _outputPath = '';
  private _materials: Map<string, THREE.Material[]> = new Map();

  materialType = Wgl.eApgWglMaterialTypes.PhongFlatMaterials;

  private _closedSplinesScene(
    anx: number,
    anz: number,
    adeltax: number,
    adeltaz: number,
    amaterialType: Wgl.eApgWglMaterialTypes,
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
        let geometry = Wgl.ApgWglExtrusionHelper.randomShape_Extrusion_Along_ClosedSpline();
        geometry.scale(0.5, 0.5, 0.5);
        const px = ox + (x * stepX);
        const pz = oz + (z * stepZ);
        console.log(`px: ${px} pz: ${pz}`);
        geometry.translate(px, 0, pz);

        const material = this._materials.get(amaterialType)![matIndex];

        if (aflatShading) {
          const newGeometry = geometry.toNonIndexed();
          newGeometry.computeVertexNormals();
          geometry = <THREE.ExtrudeGeometry>newGeometry; // This cast is a hack
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
    amaterialType: Wgl.eApgWglMaterialTypes,
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
        let geometry = Wgl.ApgWglExtrusionHelper.randomShape_Extrusion_Along_OpenedSpline();
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
    amaterialType: Wgl.eApgWglMaterialTypes,
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

        const extrudeSettings: Wgl.IApgWglPolylineExtrusionSettings = {
          nodes: 4,
          segmentLength: 50,
          maxDistance: 5,
          maxAngleDeg: 30,
          closed: false,
          capped: false
        };

        const generators = Wgl.ApgWglExtrusionHelper.randomShape_Extrusion_Along_PolyLine_Generators(extrudeSettings)
        let geometry = Wgl.ApgWglExtrusionHelper.randomShape_Extrusion_Along_PolyLine(generators, extrudeSettings);
        //geometry.scale(0.5, 0.5, 0.5);
        geometry.translate(px, 0, pz);

        if (aflatShading) {
          const newGeometry = geometry.toNonIndexed();
          newGeometry.computeVertexNormals();
          geometry = <THREE.ExtrudeGeometry>newGeometry; // This cast is a hack
        }

        const material = this._materials.get(amaterialType)![matIndex];
        const mesh = new THREE.Mesh(geometry, <any>material);
        scene.add(mesh);

        if (adrawGenerators) {
          const generatorsGeom = Wgl.ApgWglExtrusionHelper.randomShape_Extrusion_Along_PolyLine_Generators_Geometry(generators);
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
    amaterialType: Wgl.eApgWglMaterialTypes,
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

        let geometry = Wgl.ApgWglExtrusionHelper.randomShape_Extrusion_Along_Line();
        //geometry.scale(0.5, 0.5, 0.5);
        geometry.translate(px, 0, pz);
        const material = this._materials.get(amaterialType)![matIndex];
        const mesh = new THREE.Mesh(geometry, <any>material);
        scene.add(mesh);

        if (aflatShading) {
          const newGeometry = geometry.toNonIndexed();
          newGeometry.computeVertexNormals();
          geometry = <THREE.ExtrudeGeometry>newGeometry; // This cast is a hack
        }

        //console.log(`Added mesh to scene (${x},${z})`);
        matIndex++;
        if (matIndex == this.MATERIALS_NUM) matIndex = 0;
      }
    }
    return scene;
  }


  private async _save(ascene: THREE.Scene, afileName: string, aisProd: boolean) {

    // We don't have write permissions in production
    if (aisProd) {
      return;
    }

    const file = Uts.Std.Path.resolve(this._outputPath + afileName + '.gltf');
    const r = await Wgl.ApgWglGltf.exportGLTF(ascene, file);
    return r;
  }


  override async execute() {

    if (!Uts.ApgUtsIs.IsDeploy()) {
      Uts.ApgUtsFs.ClearFolderSync(this._outputPath);

      const materials = Object.values(eApgWglMaterialTypes);

      for (const material of materials) {

        for (let i = 0; i < 4; i++) {
          //for (let i = 2; i < 4; i++) {
          const rx = Math.trunc((Math.random() * 3) + 2);
          const rz = Math.trunc((Math.random() * 3) + 2);
          let scene = undefined;

          let isFlatShading = false;
          if (material.toLowerCase().indexOf("flat") !== -1) {
            isFlatShading = true;
          }

          let fileName = "";
          if (i == 0) {
            scene = this._closedSplinesScene(rx, rz, 200, 200, material, isFlatShading);
            fileName = "ClosedSplineTest";
          } else if (i == 1) {
            scene = this._openedSplinesScene(rx, rz, 200, 200, material, isFlatShading);
            fileName = "OpenedSplineTest";
          } else if (i == 2) {
            scene = this._polyLineScene(rx, rz, 200, 200, material, isFlatShading, true);
            fileName = "PolyLineTest";
          } else {
            scene = this._linearExtrusionsScene(rx, rz, 200, 200, material, isFlatShading);
            fileName = "LinearExtrusionTest";
          }
          const dateTimeStamp = new Uts.ApgUtsDateTimeStamp(new Date()).Stamp;
          await this._save(
            scene,
            material + "_" + i.toString() + "_" + fileName + "_" + dateTimeStamp,
            Uts.ApgUtsIs.IsDeploy()
          )
        }
      }
    }
  }

}