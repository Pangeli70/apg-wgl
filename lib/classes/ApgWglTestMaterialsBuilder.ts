/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/14]
 * @version 0.9.8 [APG 2023/07/22]
 * -----------------------------------------------------------------------
 */

import { THREE } from "../deps.ts";
import { eApgWglTestMaterialsTypes } from "../enums/eApgWglTestMaterialTypes.ts";

export type TApgWglTestMaterials = Record<eApgWglTestMaterialsTypes, THREE.Material[]>;


export class ApgWglTestMaterialsBuilder {

  static #randomRgb(amin = 0, amax = 1) {
    const delta = amax - amin;
    const r = Math.random() * delta + amin;
    const g = Math.random() * delta + amin;
    const b = Math.random() * delta + amin;
    const color = new THREE.Color(r, g, b)
    //console.log(`r:${r}, g:${g}, b:${b}`);
    return color;
  }

  static #makeRandomColorLineMaterials(anumColors: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumColors; i++) {
      const rgb = this.#randomRgb();
      const material = <THREE.Material>new THREE.LineBasicMaterial({
        color: rgb
      });
      r.push(material);
    }

    return r;
  }

  static #buildRandomBasicWireframeMaterials(anumber: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumber; i++) {
      const rgb = this.#randomRgb();
      const material = <THREE.Material>new THREE.MeshBasicMaterial({
        color: rgb,
        wireframe: true,
        transparent: false,
        side: THREE.FrontSide,
        opacity: 1
      });
      r.push(material);
    }
    return r;
  }



  static #buildRandomLambertMaterials(anumber: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumber; i++) {
      const material = <THREE.Material>new THREE.MeshLambertMaterial({
        name: `Lambert_${i + 1}`,
        color: this.#randomRgb(),
        transparent: false,
        side: THREE.FrontSide,
        opacity: 1
      });
      r.push(material);
    }

    return r;
  }

  static #buildRandomFlatLambertMaterials(anumber: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumber; i++) {
      const material = <THREE.Material>new THREE.MeshLambertMaterial({
        name: `Lambert_Flat_${i + 1}`,
        color: this.#randomRgb(),
        transparent: false,
        side: THREE.FrontSide,
        opacity: 1,
        flatShading: true,
      });
      r.push(material);
    }

    return r;
  }

  static #buildRandomFlatTransparentLambertMaterials(anumber: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumber; i++) {
      const material = <THREE.Material>new THREE.MeshLambertMaterial({
        name: `Lambert_Flat_Transparent_${i + 1}`,
        color: this.#randomRgb(),
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


  static #buildRandomPhongMaterials(anumber: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumber; i++) {
      const material = <THREE.Material>new THREE.MeshPhongMaterial({
        name: `Phong_${i + 1}`,
        color: this.#randomRgb(),
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

  static #buildRandomTexturizedPhongMaterials(anumber: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumber; i++) {
      const material = <THREE.Material>new THREE.MeshPhongMaterial({
        name: `Phong_Textured_${i + 1}`,
        color: this.#randomRgb(),
        transparent: false,
        side: THREE.FrontSide,
        opacity: 1,
        flatShading: false,
        reflectivity: (Math.random() + 0.5) / 1.5,
        specular: this.#randomRgb(),
        shininess: Math.random() * 100
      });
      r.push(material);
    }

    return r;
  }

  static #buildRandomBumpMappedPhongMaterials(anumber: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumber; i++) {
      const material = <THREE.Material>new THREE.MeshPhongMaterial({
        name: `Phong_BumpMapped_${i + 1}`,
        color: this.#randomRgb(),
        transparent: false,
        side: THREE.FrontSide,
        opacity: 1,
        flatShading: false,
        reflectivity: (Math.random() + 0.5) / 1.5,
        specular: this.#randomRgb(),
        shininess: Math.random() * 100
      });
      r.push(material);
    }

    return r;
  }

  static #buildRandomNormalMappedPhongMaterials(anumber: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumber; i++) {
      const material = <THREE.Material>new THREE.MeshPhongMaterial({
        name: `Phong_NormalMapped_${i + 1}`,
        color: this.#randomRgb(),
        transparent: false,
        side: THREE.FrontSide,
        opacity: 1,
        flatShading: false,
        reflectivity: (Math.random() + 0.5) / 1.5,
        specular: this.#randomRgb(),
        shininess: Math.random() * 100
      });
      r.push(material);
    }

    return r;
  }


  static #buildRandomStdMaterials(anumber: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumber; i++) {
      const material = <THREE.Material>new THREE.MeshStandardMaterial({
        name: `Std_${i + 1}`,
        color: this.#randomRgb(),
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

  static #buildRandomTexturizedStdMaterials(anumber: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumber; i++) {
      const material = <THREE.Material>new THREE.MeshStandardMaterial({
        name: `Std_Textured_${i + 1}`,
        color: this.#randomRgb(),
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

  static #buildRandomBumpMappedStdMaterials(anumber: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumber; i++) {
      const material = <THREE.Material>new THREE.MeshStandardMaterial({
        name: `Std_NormalMapped_${i + 1}`,
        color: this.#randomRgb(),
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

  static #buildRandomNormalMappedStdMaterials(anumber: number) {

    const r: THREE.Material[] = [];

    for (let i = 0; i < anumber; i++) {
      const material = <THREE.Material>new THREE.MeshStandardMaterial({
        name: `Std_NormalMapped_${i + 1}`,
        color: this.#randomRgb(),
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


  static buildRandomTestMaterials(anumber: number) {

    const materials: TApgWglTestMaterials = {
      [eApgWglTestMaterialsTypes.LineMaterials]: this.#makeRandomColorLineMaterials(anumber),

      [eApgWglTestMaterialsTypes.BasicWireframeMaterials]: this.#buildRandomBasicWireframeMaterials(anumber),

      [eApgWglTestMaterialsTypes.LambertMaterials]: this.#buildRandomLambertMaterials(anumber),
      [eApgWglTestMaterialsTypes.LambertFlatMaterials]: this.#buildRandomFlatLambertMaterials(anumber),
      [eApgWglTestMaterialsTypes.LambertFlatTransparentMaterials]: this.#buildRandomFlatTransparentLambertMaterials(anumber),

      [eApgWglTestMaterialsTypes.PhongMaterials]: this.#buildRandomPhongMaterials(anumber),
      [eApgWglTestMaterialsTypes.PhongTexturizedMaterials]: this.#buildRandomTexturizedPhongMaterials(anumber),
      [eApgWglTestMaterialsTypes.PhongBumpMappedMaterials]: this.#buildRandomBumpMappedPhongMaterials(anumber),
      [eApgWglTestMaterialsTypes.PhongNormalMappedMaterials]: this.#buildRandomNormalMappedPhongMaterials(anumber),
      
      [eApgWglTestMaterialsTypes.StdMaterials]: this.#buildRandomStdMaterials(anumber),
      [eApgWglTestMaterialsTypes.StdTexturizedMaterials]: this.#buildRandomTexturizedStdMaterials(anumber),
      [eApgWglTestMaterialsTypes.StdBumpMappedMaterials]: this.#buildRandomBumpMappedStdMaterials(anumber),
      [eApgWglTestMaterialsTypes.StdNormalMappedMaterials]: this.#buildRandomNormalMappedStdMaterials(anumber)
    }

    return materials;
  }

}