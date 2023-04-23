/** -----------------------------------------------------------------------
 * @module [GLTF]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/14]
 * -----------------------------------------------------------------------
 */

import { THREE } from "../../../deps.ts";


export enum eApgGltfMaterialTypes {
  LineMaterials = 'LineMats',
  WireframeMaterials = 'wireframe_mats',
  LambertMaterials = 'lambert_mats',
  PhongMaterials = 'phong_mats',
  PhongFlatMaterials = 'phong_flat_mats',
  PhongTranspMaterials = 'phong_transp_mats',
  PhongTexturedMaterials = 'phong_txtrd_mats',
  PhongBumpedMaterials = 'phong_bumped_mats',
  StdMaterials = 'std_mats',
  StdTexturedMaterials = 'std_txtrd_mats',
  StdNormaledMaterials = 'std_nrmled_mats',
}


export class ApgGltfMaterialsHelper {

  public static randomRgb(amin = 0, amax = 1) {
    const delta = amax - amin;
    const r = Math.random() * delta + amin;
    const g = Math.random() * delta + amin;
    const b = Math.random() * delta + amin;
    const color = new THREE.Color(r, g, b)
    //console.log(`r:${r}, g:${g}, b:${b}`);
    return color;
  }

  public static makeRandomColorLineMaterials(anumColors: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumColors; i++) {
      const rgb = this.randomRgb();
      const material = <THREE.Material>new THREE.LineBasicMaterial({
        color: rgb
      });
      r.push(material);
    }

    return r;
  }

  public static makeRandomColorWireframeMaterials(anumColors: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumColors; i++) {
      const rgb = this.randomRgb();
      const isTransparent = false;
      const side = THREE.FrontSide;
      const opacity = 1;
      const material = <THREE.Material>new THREE.MeshLambertMaterial({
        color: rgb,
        wireframe: true,
        transparent: isTransparent,
        side: side,
        opacity: opacity
      });
      r.push(material);
    }
    return r;
  }

  public static makeRandomColorLambertMaterials(anumColors: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumColors; i++) {
      const material = <THREE.Material>new THREE.MeshLambertMaterial({
        color: this.randomRgb(),
        transparent: false,
        side: THREE.FrontSide,
        opacity: 1
      });
      r.push(material);
    }

    return r;
  }

  public static makeRandomColorPhongMaterials(anumColors: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumColors; i++) {
      const material = <THREE.Material>new THREE.MeshPhongMaterial({
        color: this.randomRgb(),
        transparent: false,
        side: THREE.FrontSide,
        opacity: 1,
        flatShading: false,
        reflectivity: (Math.random() + 0.5) / 1.5,
        shininess: Math.random()
      });
      r.push(material);
    }

    return r;
  }

  public static makeRandomColorFlatPhongMaterials(anumColors: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumColors; i++) {
      const material = <THREE.Material>new THREE.MeshPhongMaterial({
        color: this.randomRgb(),
        transparent: false,
        side: THREE.FrontSide,
        opacity: 1,
        flatShading: true,
        reflectivity: (Math.random() + 0.5) / 1.5
      });
      r.push(material);
    }

    return r;
  }

  public static makeRandomColorTransparentPhongMaterials(anumColors: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumColors; i++) {
      const material = <THREE.Material>new THREE.MeshPhongMaterial({
        color: this.randomRgb(),
        transparent: true,
        side: THREE.DoubleSide,
        opacity: (Math.random() * 0.25 + 0.25), // from 25% to 50%,
        flatShading: true,
        reflectivity: (Math.random() + 0.5) / 1.5
      });
      r.push(material);
    }

    return r;
  }

  public static makeRandomColorTexturedPhongMaterials(anumColors: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumColors; i++) {
      const material = <THREE.Material>new THREE.MeshPhongMaterial({
        name: `Textured_${i + 1}`,
        color: this.randomRgb(),
        transparent: false,
        side: THREE.FrontSide,
        opacity: 1,
        flatShading: false,
        reflectivity: (Math.random() + 0.5) / 1.5,
        specular: this.randomRgb(),
        shininess: Math.random() * 100
      });
      r.push(material);
    }

    return r;
  }

  public static makeRandomColorBumpedPhongMaterials(anumColors: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumColors; i++) {
      const material = <THREE.Material>new THREE.MeshPhongMaterial({
        name: `Bumped_${i + 1}`,
        color: this.randomRgb(),
        transparent: false,
        side: THREE.FrontSide,
        opacity: 1,
        flatShading: false,
        reflectivity: (Math.random() + 0.5) / 1.5,
        specular: this.randomRgb(),
        shininess: Math.random() * 100
      });
      r.push(material);
    }

    return r;
  }

  public static makeRandomColorStdMaterials(anumColors: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumColors; i++) {
      const material = <THREE.Material>new THREE.MeshStandardMaterial({
        color: this.randomRgb(),
        transparent: false,
        side: THREE.FrontSide,
        flatShading: false,
        opacity: 1,
        //reflectivity: (Math.random() + 0.5) / 1.5,
        //specular: this.randomRgb(),
        //shininess: Math.random() * 100
      });
      r.push(material);
    }

    return r;
  }

  public static makeRandomColorTexturedStdMaterials(anumColors: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumColors; i++) {
      const material = <THREE.Material>new THREE.MeshStandardMaterial({
        name: `Textured_${i + 1}`,
        color: this.randomRgb(),
        transparent: false,
        side: THREE.FrontSide,
        flatShading: false,
        opacity: 1,
        //reflectivity: (Math.random() + 0.5) / 1.5,
        //specular: this.randomRgb(),
        //shininess: Math.random() * 100
      });
      r.push(material);
    }

    return r;
  }

  public static makeRandomColorNormaledStdMaterials(anumColors: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumColors; i++) {
      const material = <THREE.Material>new THREE.MeshStandardMaterial({
        name: `Normaled_${i + 1}`,
        color: this.randomRgb(),
        transparent: false,
        side: THREE.FrontSide,
        flatShading: false,
        opacity: 1,
        //reflectivity: (Math.random() + 0.5) / 1.5,
        //specular: this.randomRgb(),
        //shininess: Math.random() * 100
      });
      r.push(material);
    }

    return r;
  }


  public static prepareTestMaterials(anumPerType: number) {

    const materials: Map<string, THREE.Material[]> = new Map();

    materials.set(
      eApgGltfMaterialTypes.LineMaterials,
      ApgGltfMaterialsHelper.makeRandomColorLineMaterials(anumPerType)
    );
    materials.set(
      eApgGltfMaterialTypes.WireframeMaterials,
      ApgGltfMaterialsHelper.makeRandomColorWireframeMaterials(anumPerType)
    );
    materials.set(
      eApgGltfMaterialTypes.LambertMaterials,
      ApgGltfMaterialsHelper.makeRandomColorLambertMaterials(anumPerType)
    );
    materials.set(
      eApgGltfMaterialTypes.PhongMaterials,
      ApgGltfMaterialsHelper.makeRandomColorPhongMaterials(anumPerType)
    );
    materials.set(
      eApgGltfMaterialTypes.PhongFlatMaterials,
      ApgGltfMaterialsHelper.makeRandomColorFlatPhongMaterials(anumPerType)
    );
    materials.set(
      eApgGltfMaterialTypes.PhongTranspMaterials,
      ApgGltfMaterialsHelper.makeRandomColorTransparentPhongMaterials(anumPerType)
    );
    materials.set(
      eApgGltfMaterialTypes.PhongTexturedMaterials,
      ApgGltfMaterialsHelper.makeRandomColorTexturedPhongMaterials(anumPerType)
    );
    materials.set(
      eApgGltfMaterialTypes.PhongBumpedMaterials,
      ApgGltfMaterialsHelper.makeRandomColorBumpedPhongMaterials(anumPerType)
    );
    materials.set(
      eApgGltfMaterialTypes.StdMaterials,
      ApgGltfMaterialsHelper.makeRandomColorStdMaterials(anumPerType)
    );
    materials.set(
      eApgGltfMaterialTypes.StdTexturedMaterials,
      ApgGltfMaterialsHelper.makeRandomColorTexturedStdMaterials(anumPerType)
    );
    materials.set(
      eApgGltfMaterialTypes.StdNormaledMaterials,
      ApgGltfMaterialsHelper.makeRandomColorNormaledStdMaterials(anumPerType)
    );

    return materials;
  }

}