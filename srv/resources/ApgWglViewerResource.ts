/** -----------------------------------------------------------------------
 * @module [GLTF_Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/12]
 * -----------------------------------------------------------------------
 */


import { Edr, Uts, Wgl, Dir, Tng } from "../deps.ts";


export class ApgWglViewerResource extends Edr.ApgEdrLoggableResource {
  public override paths = ["/gltf/viewer/:gltf"];

  public async GET(request: Edr.Drash.Request, response: Edr.Drash.Response) {

    //this.logInit(import.meta.url, request);
    //this.logBegin(this.GET.name)

    const serverInfo = Dir.ApgDirServer.GetInfo(Dir.eApgDirEntriesIds.wgl);

    const rawGltf = request.pathParam("gltf");


    const gltfFile = Uts.Std.Path.resolve(Wgl.ApgWglService.TestOutputPath + rawGltf);

    const fileExists = Uts.ApgUtsFs.FileExistsSync(gltfFile);
    if (!fileExists) {
      const error = `The file [${rawGltf}] does not exist.`;
      console.log(error);
      return;
    }


    const templateData = {
      _site_: {
        name: serverInfo.caption,
        title: serverInfo.title
      },
      _page_: {
        title: "Gltf viewer for [" + rawGltf + "]",
        toolbar: "",
        released: "2022/09/19"
      },
      _resource_: "/gltf/test/" + rawGltf
    };


    const html = await Tng.ApgTngService.Render("/ApgWglViewerPage.html", templateData) as string;

    response.html(html);

    //this.logEnd();
  }






}
