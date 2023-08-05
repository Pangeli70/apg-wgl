/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/12]
 * @version 0.9.8 [APG 2023/07/22]
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
        version: serverInfo.version,
        title: serverInfo.title,
      },
      _page_: {
        title: "WGL tests and demos",
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
          href: `/tests/gltf/extrusions/list`,
          caption: "Gltf extrusions tests"
        },
        {
          href: `/tests/glb/list`,
          caption: "Glb demo files"
        },

      ];

    return r;
  }



}
