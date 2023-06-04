/** -----------------------------------------------------------------------
 * @module [GLTF_Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.5.1 [APG 2019/01/19]
 * @version 0.8.0 [APG 2022/05/12]
 * -----------------------------------------------------------------------
 */

import { ApgHbr, IApgHbrLink } from '../../../apg/Hbr/mod.ts';


export class GltfTestsIndexHbr extends ApgHbr {

  links: IApgHbrLink[] = [];
  initialized = false;

  readonly TESTS_PLACEHOLDER = '{{{TESTS}}}';

  constructor(links: IApgHbrLink[]) {
    super();
    if (links) {
      this.links = links;
      this.initialized = true;
    }
  }


  template(): string {
    return `
      <div class= "collection" >
        ${this.TESTS_PLACEHOLDER}
      </div>
      `;
  }


  testsMarkup() {

    let r = '';

    if (this.initialized) {
      let i = 0;
      this.links.forEach((alink: IApgHbrLink) => {
        const fileSize = Math.round(alink.payload / 1024 /1024 * 100) / 100;
        r += `
            <h4 class="collection-item">
              ${i}: 
              <a href="${alink.link}">
                ${alink.name}
              </a> 
              ${fileSize}(MB)
            </h4>
          `;
        i++;
      });
    }
    return r;
  }


  build() {

    return this.interpolate(
      this.template(),
      this.TESTS_PLACEHOLDER,
      this.testsMarkup());

  }


}
