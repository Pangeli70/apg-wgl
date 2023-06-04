


import { Uts, Rst, GLTFExporter, THREE } from "../deps.ts";

export class ApgWglGltf {

  static async exportGLTF(scene: THREE.Scene, afile: string) {

    let r: Rst.IApgRst = { ok: true };

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
      r = Rst.ApgRstErrors.Simple(JSON.stringify(error));
    }
    return r;
  }


  private static async _serialize(
    aresult: ArrayBuffer | { [key: string]: any },
    afile: string
  ) {

    let r: Rst.IApgRst = { ok: true };

    const path = Uts.Std.Path.dirname(afile);
    if (!Uts.ApgUtsFs.FolderExistsSync(path)) {
      r = Rst.ApgRstErrors.Simple("Folder does not exist to store: " + path);
      return r;
    }

    if (Uts.ApgUtsFs.FileExistsSync(afile)) {
      r = Rst.ApgRstErrors.Simple("The file already exists: " + afile);
      return r;
    }

    if (aresult instanceof ArrayBuffer) {
      const raw = new Uint8Array(aresult)
      await Deno.writeFile(afile, raw);
    } else {
      const json = JSON.stringify(aresult, null, 2);
      await Deno.writeTextFile(afile, json);
    }
    return r;
  }

}
