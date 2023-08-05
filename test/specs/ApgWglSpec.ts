/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/04/29-2022/06/05]
 * -----------------------------------------------------------------------
 */

import { ApgWglTestService } from "../../lib/mod.ts";
import { eApgWglTestMaterialsTypes } from "../../mod.ts";
import { Uts, Spc, Wgl, THREE } from "../deps.ts";



export class ApgWglSpec extends Spc.ApgSpcSpec {


  private _materials: Wgl.TApgWglTestMaterials;

  constructor() {
    super(import.meta.url)

    this.flags = {
      [this._polyLineScene.name]: Spc.eApgSpcRun.yes
    }

    this._outputPath = ApgWglTestService.TestOutputPath;
    this._materials = Wgl.ApgWglTestMaterialsBuilder.buildRandomTestMaterials(this.MATERIALS_NUM);

  }

  readonly MATERIALS_NUM = 9;

  private _outputPath = '';

  materialType = Wgl.eApgWglTestMaterialsTypes.LambertFlatMaterials;



  private _polyLineScene(
    anx: number,
    anz: number,
    adeltax: number,
    adeltaz: number,
    amaterialType: Wgl.eApgWglTestMaterialsTypes,
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
    // for (let x = 0; x < nx; x++) {
    //   for (let z = 0; z < nz; z++) {

    //     const px = ox + (x * stepX);
    //     const pz = oz + (z * stepZ);

    //     const extrudeSettings: Wgl.IApgWglPolylineExtrusionSettings = {
    //       nodes: 4,
    //       segmentLength: 50,
    //       maxDistance: 5,
    //       maxAngleDeg: 30,
    //       closed: false,
    //       capped: false
    //     };

    //     const generators = Wgl.ApgWglExtrusionBuilder
    //       .randomShape_Extrusion_Along_PolyLine_Generators_Geometry(extrudeSettings)
    //     let geometry = Wgl.ApgWglExtrusionBuilder
    //       .randomShape_Extrusion_Along_PolyLine(generators, extrudeSettings);
    //     //geometry.scale(0.5, 0.5, 0.5);
    //     geometry.translate(px, 0, pz);

    //     if (aflatShading) {
    //       const newGeometry = geometry.toNonIndexed();
    //       newGeometry.computeVertexNormals();
    //       geometry = <THREE.ExtrudeGeometry>newGeometry; // This cast is a hack
    //     }

    //     const material = this._materials[amaterialType][matIndex];
    //     const mesh = new THREE.Mesh(geometry, <any>material);
    //     scene.add(mesh);

    //     if (adrawGenerators) {
    //       const generatorsGeom = Wgl.ApgWglExtrusionBuilder.randomShape_Extrusion_Along_PolyLine_Generators_Geometry(generators);
    //       generatorsGeom.translate(px, 0, pz);
    //       const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    //       const line = new THREE.Line(generatorsGeom, <any>lineMaterial);
    //       scene.add(line);
    //     }
    //     matIndex++;
    //     if (matIndex == this.MATERIALS_NUM) matIndex = 0;
    //   }
    // }
    return scene;
  }

  private _demoAtomScene() {
    const demo = new Wgl.ApgWgDemoAtom();
    return demo.init();

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

      const materials = Object.values(eApgWglTestMaterialsTypes);

      for (const material of materials) {

        for (const extrusionType of Object.values(Wgl.eApgWglTestExtrusionTypes)) {

          const rx = Math.trunc((Math.random() * 3) + 2);
          const rz = Math.trunc((Math.random() * 3) + 2);

          let isFlatShading = false;
          if (material.toLowerCase().indexOf("flat") !== -1) {
            isFlatShading = true;
          }

          let scene: THREE.Scene;
          const dateTimeStamp = new Uts.ApgUtsDateTimeStamp(new Date()).Stamp;

          switch (extrusionType) {
            case Wgl.eApgWglTestExtrusionTypes.Linear:
              scene = Wgl.ApgWglTestService.GetLinearExtrusionsTestScene(rx, rz, 200, 200, material);
              break;
            case Wgl.eApgWglTestExtrusionTypes.OpenedPolyLine:
              scene = this._polyLineScene(rx, rz, 200, 200, material, isFlatShading, true);
              break;
            case Wgl.eApgWglTestExtrusionTypes.OpenedSpline:
              scene = Wgl.ApgWglTestService.GetOpenedSplinesTestScene(rx, rz, 200, 200, material, isFlatShading);
              break;
            case Wgl.eApgWglTestExtrusionTypes.ClosedSpline:
              scene = Wgl.ApgWglTestService.GetClosedSplinesTestScene(rx, rz, 200, 200, material, isFlatShading);
              break;
          }

          await this._save(
            scene,
            material + "_" + extrusionType + "_" + dateTimeStamp,
            Uts.ApgUtsIs.IsDeploy()
          )
        }
      }
    }
  }

}