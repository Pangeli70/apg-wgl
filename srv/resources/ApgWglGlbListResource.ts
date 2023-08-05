/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.8 [APG 2023/07/23]
 * -----------------------------------------------------------------------
 */
import { Edr, Uts, Tng, Dir } from "../deps.ts";

export class ApgWglGlbListResource extends Edr.ApgEdrLoggableResource {
  public override paths = ["/tests/glb/list"];

  public async GET(_request: Edr.Drash.Request, response: Edr.Drash.Response) {

    //this.logInit(import.meta.url, request);
    //this.logBegin(this.GET.name)

    const serverInfo = Dir.ApgDirServer.GetInfo(Dir.eApgDirEntriesIds.wgl);


    const stlAssetsFolder = Uts.Std.Path.resolve('./srv/assets/glb/');

    const files: string[] = [];
    for await (const entry of Deno.readDir(stlAssetsFolder)) {
      if (
        entry.isFile
        && entry.name.indexOf('.glb') != -1
      ) {
        files.push(entry.name);
      }
    }

    const links: Uts.IApgUtsHyperlink[] = [];
    for (const file of files) {
      links.push({
        href: "/glb/viewer/" + file,
        caption: file
      });
    }

    const templateData = {
      _site_: {
        name: serverInfo.caption,
        title: serverInfo.title
      },
      _page_: {
        title: "Available Glb demo files",
        toolbar: "",
        released: "2023/07/23"
      },
      _links_: links
    };

    const html = await Tng.ApgTngService.Render("/ApgWglHomePage.html", templateData) as string;

    response.html(html);

    //this.logEnd();
  }
}
