/** -----------------------------------------------------------------------
 * @module [GLTF_Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.5.1 [APG 2019/01/16]
 * @version 0.8.0 [APG 2022/04/29]
 * -----------------------------------------------------------------------
 */

import { ApgUtils } from '../../../apg/Utils/mod.ts';

import {
  ApgHbrMessage,
  ApgHbrPage,
  IApgHbrLink
} from '../../../apg/Hbr/mod.ts';

import { GltfTestsIndexHbr } from './GltfTestsIndexHbr.ts';

export class GltfTestsContentHbr extends ApgHbrPage {

  folder: string;
  subfolder: string;

  constructor(afolder: string, asubfolder: string) {
    super();
    this.initialized = true;
    this.folder = afolder;
    this.subfolder = asubfolder;
  }


  build(): string {

    let r = new ApgHbrMessage('Check the folder ' + this.folder + ' for the results').build();

    const files = ApgUtils.Fs_GetFileNamesSortedSync(this.folder, '.gltf');
    const links: IApgHbrLink[] = [];
    let i = 0;
    files.forEach(file => {

      const fileStat =  Deno.statSync(this.folder+ file);

      const href = "/gltf/viewer/" + this.subfolder + "/" + file;
      const link = { 
        id: i, 
        name: file, 
        link: href,
        payload: fileStat.size 
      }
      links.push(link);
      i++;
    });

    r += new GltfTestsIndexHbr(links).build();

    return r;
  }

}
