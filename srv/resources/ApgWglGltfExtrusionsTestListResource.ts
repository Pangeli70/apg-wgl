/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/12]
 * @version 0.9.8 [APG 2023/07/22]
 * -----------------------------------------------------------------------
 */
import { eApgWglTestMaterialsTypes } from "../../mod.ts";
import { Edr, Tng, Dir, Uts } from "../deps.ts";


export class ApgWglGltfExtrusionsTestListResource extends Edr.Drash.Resource {

  public override paths = ["/tests/gltf/extrusions/list"];

  public async GET(_request: Edr.Drash.Request, response: Edr.Drash.Response) {

    const serverInfo = Dir.ApgDirServer.GetInfo(Dir.eApgDirEntriesIds.wgl);

    const _links_ = this._getLinks();

    const templateData = {
      _site_: {
        name: serverInfo.caption,
        version: serverInfo.version,
        title: serverInfo.title,
      },
      _page_: {
        title: "Available WGL Gltf extrusions tests",
        toolbar: "",
        released: "2023/06/04"
      },
      _links_
    };

    const html = await Tng.ApgTngService.Render("/ApgWglHomePage.html", templateData) as string;

    response.html(html);

  }


  private _getLinks() {

    const isDeploy = Uts.ApgUtsIs.IsDeploy();
    const rootUrl = '/tests/gltf/extrusions';

    const r: Uts.IApgUtsHyperlink[] =
      [
        {
          href: `${rootUrl}/${eApgWglTestMaterialsTypes.BasicWireframeMaterials}/${isDeploy}`,
          caption: "Wireframe materials"
        },

        {
          href: `${rootUrl}/${eApgWglTestMaterialsTypes.LambertMaterials}/${isDeploy}`,
          caption: "Lambert materials"
        },
        {
          href: `${rootUrl}/${eApgWglTestMaterialsTypes.LambertFlatMaterials}/${isDeploy}`,
          caption: "Lambert flat materials"
        },
        {
          href: `${rootUrl}/${eApgWglTestMaterialsTypes.LambertFlatTransparentMaterials}/${isDeploy}`,
          caption: "Lambert flat transparent materials"
        },

        {
          href: `${rootUrl}/${eApgWglTestMaterialsTypes.PhongMaterials}/${isDeploy}`,
          caption: "Phong materials",
        },
        {
          href: `${rootUrl}/${eApgWglTestMaterialsTypes.PhongTexturizedMaterials}/${isDeploy}`,
          caption: "Phong texturized materials",
        },
        {
          href: `${rootUrl}/${eApgWglTestMaterialsTypes.PhongBumpMappedMaterials}/${isDeploy}`,
          caption: "Phong bump mapped materials",
        },
        {
          href: `${rootUrl}/${eApgWglTestMaterialsTypes.PhongNormalMappedMaterials}/${isDeploy}`,
          caption: "Phong normal mapped materials",
        },


        {
          href: `${rootUrl}/${eApgWglTestMaterialsTypes.StdMaterials}/${isDeploy}`,
          caption: "Standard materials",
        },
        {
          href: `${rootUrl}/${eApgWglTestMaterialsTypes.StdTexturizedMaterials}/${isDeploy}`,
          caption: "Standard texturized materials",
        },
        {
          href: `${rootUrl}/${eApgWglTestMaterialsTypes.StdBumpMappedMaterials}/${isDeploy}`,
          caption: "Standard bump mapped materials",
        },
        {
          href: `${rootUrl}/${eApgWglTestMaterialsTypes.StdNormalMappedMaterials}/${isDeploy}`,
          caption: "Standard normal mapped materials",
        },
      ];

    return r;
  }



}
