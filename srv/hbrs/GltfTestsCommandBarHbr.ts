/** -----------------------------------------------------------------------
 * @module [GLTF_Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.5.1 [APG 2019/01/16]
 * @version 0.8.0 [APG 2022/05/12]
 * -----------------------------------------------------------------------
 */
import { ApgHbrCommandBar } from '../../../apg/Hbr/mod.ts';


export class GltfTestsCommandBarHbr extends ApgHbrCommandBar {

  readonly _ROOT_ROUTE = '/gltf/tests/';

  constructor(afolder: string) {
    super([]);

    this.links = [
      {
        id: 0,
        name: 'Rebuild tests',
        link: this._ROOT_ROUTE + afolder + '/true'
      }
    ];

    this.initialized = true;

  }


}
