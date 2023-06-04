/** -----------------------------------------------------------------------
 * @module [GLTF_Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/12]
 * -----------------------------------------------------------------------
 */


import { eApgWglMaterialTypes } from "../../mod.ts";
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
          href: `/gltf/tests/${eApgWglMaterialTypes.WireframeMaterials}/false`,
          caption: "Wireframe materials"
        },
        {
          href: `/gltf/tests/${eApgWglMaterialTypes.LambertMaterials}/false`,
          caption: "Lambert materials"
        },
        {
          href: `/gltf/tests/${eApgWglMaterialTypes.PhongMaterials}/false`,
          caption: "Phong materials",
        },
        {
          href: `/gltf/tests/${eApgWglMaterialTypes.PhongFlatMaterials}/false`,
          caption: "Phong materials flat shading",
        },
        {
          href: `/gltf/tests/${eApgWglMaterialTypes.PhongTranspMaterials}/false`,
          caption: "Phong materials transparent flat shading",
        },
        {
          href: `/gltf/tests/${eApgWglMaterialTypes.PhongTexturedMaterials}/false`,
          caption: "Phong materials textured",
        },
        {
          href: `/gltf/tests/${eApgWglMaterialTypes.PhongBumpedMaterials}/false`,
          caption: "Phong materials bumped",
        },
        {
          href: `/gltf/tests/${eApgWglMaterialTypes.StdMaterials}/false`,
          caption: "Standard materials",
        },
        {
          href: `/gltf/tests/${eApgWglMaterialTypes.StdTexturedMaterials}/false`,
          caption: "Standard materials textured",
        },
        {
          href: `/gltf/tests/${eApgWglMaterialTypes.StdNormaledMaterials}/false`,
          caption: "Standard materials with normal maps",
        },
      ];

    return r;
  }



}
