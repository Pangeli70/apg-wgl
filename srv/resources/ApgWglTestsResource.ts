/** -----------------------------------------------------------------------
 * @module [GLTF_Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/12]
 * -----------------------------------------------------------------------
 */


import { Spc } from "../../test/deps.ts";
import { ApgWglSpec } from "../../test/specs/ApgWglSpec.ts";
import { Edr, Uts, Tng, Wgl, Dir } from "../deps.ts";

export class ApgWglTestsResource extends Edr.ApgEdrLoggableResource {
  public override paths = ["/gltf/tests/:folder/:rebuild"];

  public async GET(request: Edr.Drash.Request, response: Edr.Drash.Response) {

    this.logInit(import.meta.url, request);
    this.logBegin(this.GET.name)

    const serverInfo = Dir.ApgDirServer.GetInfo(Dir.eApgDirEntriesIds.wgl);

    const rawFolder = request.pathParam("folder");
    const rawRebuild = request.pathParam("rebuild");

    const outputFolder = Uts.Std.Path.resolve(Wgl.ApgWglService.TestOutputPath + rawFolder + "/");

    const folderExists = Uts.ApgUtsFs.FolderExistsSync(outputFolder);

    if (!folderExists) {
      const error = `The folder [${outputFolder}] does not exist.`;
      console.log(error);
      return;
    }

    const isProduction = Uts.ApgUtsIs.IsDeploy();
    if (!isProduction && Uts.ApgUtsIs.IsTrueish(rawRebuild)) {


      const tester = new ApgWglSpec();
      await tester.execute();
    }


    const templateData = {
      _site_: {
        name: serverInfo.caption,
        title: serverInfo.title
      },
      _page_: {
        title: "Available gltf tests",
        toolbar: "",
        released: "2022/09/19"
      },
      _links_: []
    };

    const html = await Tng.ApgTngService.Render("/ApgWglHomePage.html", templateData) as string;

    response.html(html);

    this.logEnd();
  }
}
