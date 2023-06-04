/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/14]
 * -----------------------------------------------------------------------
 */

import { THREE} from "../deps.ts";
import { eApgWglMaterialTypes } from "../enums/eApgWglMaterialTypes.ts";


export class ApgWglMaterialsHelper {

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
      eApgWglMaterialTypes.LineMaterials,
      ApgWglMaterialsHelper.makeRandomColorLineMaterials(anumPerType)
    );
    materials.set(
      eApgWglMaterialTypes.WireframeMaterials,
      ApgWglMaterialsHelper.makeRandomColorWireframeMaterials(anumPerType)
    );
    materials.set(
      eApgWglMaterialTypes.LambertMaterials,
      ApgWglMaterialsHelper.makeRandomColorLambertMaterials(anumPerType)
    );
    materials.set(
      eApgWglMaterialTypes.PhongMaterials,
      ApgWglMaterialsHelper.makeRandomColorPhongMaterials(anumPerType)
    );
    materials.set(
      eApgWglMaterialTypes.PhongFlatMaterials,
      ApgWglMaterialsHelper.makeRandomColorFlatPhongMaterials(anumPerType)
    );
    materials.set(
      eApgWglMaterialTypes.PhongTranspMaterials,
      ApgWglMaterialsHelper.makeRandomColorTransparentPhongMaterials(anumPerType)
    );
    materials.set(
      eApgWglMaterialTypes.PhongTexturedMaterials,
      ApgWglMaterialsHelper.makeRandomColorTexturedPhongMaterials(anumPerType)
    );
    materials.set(
      eApgWglMaterialTypes.PhongBumpedMaterials,
      ApgWglMaterialsHelper.makeRandomColorBumpedPhongMaterials(anumPerType)
    );
    materials.set(
      eApgWglMaterialTypes.StdMaterials,
      ApgWglMaterialsHelper.makeRandomColorStdMaterials(anumPerType)
    );
    materials.set(
      eApgWglMaterialTypes.StdTexturedMaterials,
      ApgWglMaterialsHelper.makeRandomColorTexturedStdMaterials(anumPerType)
    );
    materials.set(
      eApgWglMaterialTypes.StdNormaledMaterials,
      ApgWglMaterialsHelper.makeRandomColorNormaledStdMaterials(anumPerType)
    );

    return materials;
  }

}