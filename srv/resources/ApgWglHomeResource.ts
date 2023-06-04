/** -----------------------------------------------------------------------
 * @module [GLTF_Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/12]
 * -----------------------------------------------------------------------
 */


import { Edr, Tng, Dir, Uts } from "../deps.ts";


export class ApgWglHomeResource extends Edr.Drash.Resource {
  public override paths = ["/"];

  public async GET(_request: Edr.Drash.Request, response: Edr.Drash.Response) {

    const serverInfo = Dir.ApgDirServer.GetInfo(Dir.eApgDirEntriesIds.wgl);

    const _links_ = this._getLinks();

    const templateData = {
      _site_: {
        name: serverInfo.caption,
        title: serverInfo.title
      },
      _page_: {
        title: "Available WGL Gltf tests",
        toolbar: "",
        released: "2023/06/04"
      },
      _links_
    };

    const html = await Tng.ApgTngService.Render("/ApgWglHomePage.html", templateData) as string;

    response.html(html);

  }




  private _getLinks() {
    const r: Uts.IApgUtsHyperlink[] =
      [
        {
          href: "/gltf/tests/wireframe_mats/false",
          caption: "Wireframe materials"
        },
        {
          href: "/gltf/tests/lambert_mats/false",
          caption: "Lambert materials"
        },
        {
          href: "/gltf/tests/phong_mats/false",
          caption: "Phong materials",
        },
        {
          href: "/gltf/tests/phong_flat_mats/false",
          caption: "Phong materials flat shading",
        },
        {
          href: "/gltf/tests/phong_transp_mats/false",
          caption: "Phong materials transparent flat shading",
        },
        {
          href: "/gltf/tests/phong_txtrd_mats/false",
          caption: "Phong materials textured",
        },
        {
          href: "/gltf/tests/phong_bumped_mats/false",
          caption: "Phong materials bumped",
        },
        {
          href: "/gltf/tests/std_mats/false",
          caption: "Standard materials",
        },
        {
          href: "/gltf/tests/std_txtrd_mats/false",
          caption: "Standard materials textured",
        },
        {
          href: "/gltf/tests/std_nrmled_mats/false",
          caption: "Standard materials with normal maps",
        },
      ];

    return r;
  }



}
