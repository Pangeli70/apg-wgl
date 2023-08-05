/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.8 [APG 2023/07/23]
 * -----------------------------------------------------------------------
 */
import { Edr, Uts, Dir, Tng } from "../deps.ts";

export class ApgWglGlbViewerResource extends Edr.ApgEdrLoggableResource {
  public override paths = ["/glb/viewer/:glb"];

  public async GET(request: Edr.Drash.Request, response: Edr.Drash.Response) {

    //this.logInit(import.meta.url, request);
    //this.logBegin(this.GET.name)

    const serverInfo = Dir.ApgDirServer.GetInfo(Dir.eApgDirEntriesIds.wgl);

    const rawGlb = decodeURI(request.pathParam("glb")!);


    const glbFile = Uts.Std.Path.resolve('./srv/assets/glb/' + rawGlb);

    const fileExists = Uts.ApgUtsFs.FileExistsSync(glbFile);
    if (!fileExists) {
      const error = `The file [${rawGlb}] does not exist.`;
      console.log(error);
      return;
    }


    const templateData = {
      _site_: {
        name: serverInfo.caption,
        title: serverInfo.title
      },
      _page_: {
        title: "Glb viewer for [" + rawGlb + "]",
        toolbar: "",
        released: "2023/07/23"
      },
      _resource_: "/assets/glb/" + rawGlb
    };


    const html = await Tng.ApgTngService.Render("/ApgWglViewerPage.html", templateData) as string;

    response.html(html);

    //this.logEnd();
  }






}
