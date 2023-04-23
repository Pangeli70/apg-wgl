// deno-lint-ignore-file no-explicit-any


//import * as THREE from "https://ga.jspm.io/npm:three@0.140.0/build/three.module.js";
//import { GLTFExporter } from "https://ga.jspm.io/npm:three@0.140.0/examples/jsm/exporters/GLTFExporter.js";


import { GLTFExporter } from "../../../../deps.ts";
import {
  ApgJsonFile
} from '../../../Json/mod.ts';
import { ApgResult, ApgResultErrors } from "../../../Result/mod.ts";

import {
  ApgUtils,
} from '../../../Utils/mod.ts';

export class ApgGltf {



  static async exportGLTF(scene: any, afile: string) {

    let r = new ApgResult();

    const gltfExporter = new GLTFExporter();

    const options = {
      trs: false,
      onlyVisible: true,
      truncateDrawRange: true,
      binary: false,
      maxTextureSize: 4092
    };

    try {
      const gltf = await gltfExporter.parseAsync(scene, options);
      r = await this._serialize(gltf, afile);
    }
    catch (error) {
      r = ApgResultErrors.Unmanaged(JSON.stringify(error));
    }
    return r;
  }

  private static async _serialize(aresult: ArrayBuffer | string, afile: string) {
    let r = new ApgResult();

    if (!ApgUtils.FS_FolderOfFileExistsSync(afile)) {
      r = ApgResultErrors.Unmanaged("XDFR5556: Folder does not exist for: " + afile);
      return r;
    }

    if (aresult instanceof ArrayBuffer) {
      const raw = new Uint8Array(aresult)
      // TODO this can trhow 
      await Deno.writeFile(afile, raw);
    } else {
      const json = JSON.stringify(aresult, null, 2);
      r = await ApgJsonFile.writeData(json, afile);
    }
    return r;
  }



}
