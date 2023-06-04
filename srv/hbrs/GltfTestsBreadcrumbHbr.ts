/** -----------------------------------------------------------------------
 * @module [GLTF_Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.5.1 [APG 2019/01/16]
 * @version 0.8.0 [APG 2022/05/12]
 * -----------------------------------------------------------------------
 */
import { ApgHbrBreadcrumb } from '../../../apg/Hbr/mod.ts';


export class GltfTestsBreadcrumbHbr extends ApgHbrBreadcrumb {

  readonly _ROOT_ROUTE = '/gltf';

  constructor() {
    super([]);


    this.links = [{
      id: 0,
      name: 'Home',
      link: `/home`
    },
    {
      id: 1,
      name: 'Gltf',
      link: this._ROOT_ROUTE
    }];

    this.initialized = true;

  }


}
