/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/12]
 * -----------------------------------------------------------------------
 */
import { ApgWglSpec } from "../../test/specs/ApgWglSpec.ts";
import { Edr, Uts, Tng, Wgl, Dir } from "../deps.ts";

export class ApgWglGltfExtrusionsTestResource extends Edr.ApgEdrLoggableResource {
  public override paths = ["/tests/gltf/extrusions/:material/:isDeploy"];

  public async GET(request: Edr.Drash.Request, response: Edr.Drash.Response) {

    //this.logInit(import.meta.url, request);
    //this.logBegin(this.GET.name)

    const serverInfo = Dir.ApgDirServer.GetInfo(Dir.eApgDirEntriesIds.wgl);


    const rawMaterial =  request.pathParam("material")! ;
    const rawIsDeploy = request.pathParam("isDeploy");

    const outputFolder = Uts.Std.Path.resolve(Wgl.ApgWglTestService.TestOutputPath);

    const files: string[] = [];
    for await (const entry of Deno.readDir(outputFolder)) {
      if (
        entry.isFile
        && entry.name.indexOf('.gltf') != -1
        && entry.name.indexOf(rawMaterial + "_") != -1
      ) {
        files.push(entry.name);
      }
    }

    const links: Uts.IApgUtsHyperlink[] = [];
    for (const value of Object.values(Wgl.eApgWglTestExtrusionTypes)) {
      for (const file of files) {
        if (file.indexOf(value) != -1) {
          links.push({
            href: "/gltf/viewer/" + file,
            caption: file
          });
        }
      }
    }

    const isProduction = Uts.ApgUtsIs.IsDeploy();
    if (!isProduction && Uts.ApgUtsIs.IsTrueish(rawIsDeploy)) {
      const tester = new ApgWglSpec();
      await tester.execute();
    }

    const templateData = {
      _site_: {
        name: serverInfo.caption,
        title: serverInfo.title
      },
      _page_: {
        title: "Available gltf tests for material [" + rawMaterial + "]",
        toolbar: "",
        released: "2022/09/19"
      },
      _links_: links
    };

    const html = await Tng.ApgTngService.Render("/ApgWglHomePage.html", templateData) as string;

    response.html(html);

    //this.logEnd();
  }
}
