/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * -----------------------------------------------------------------------
 */
import { Edr, Uts } from "../deps.ts";
import * as Esb from "https://deno.land/x/esbuild@v0.18.0/mod.js"

/** Resource to deliver js transpiled starting from ts files stored in asset folder */
export class ApgWglAssetTranspiledTsResource extends Edr.ApgEdrStaticResource {

  public override paths = [
    "/assets/ts/.*\.ts",
  ];

  public async GET(request: Edr.Drash.Request, response: Edr.Drash.Response) {

    const type = 'text/javascript'

    const tsFile = Uts.Std.Path.resolve(Edr.ApgEdrService.AssetsFolder + new URL(request.url).pathname);
    const jsFile = tsFile.replace("\\ts", "\\js").replace(".ts", ".js");
    console.log(tsFile, jsFile)
    try {
      if (Uts.ApgUtsIs.IsDeploy()) {
        const jsContent = await Deno.readTextFile(jsFile);
        response.body = jsContent;
      } else {
        const tsContent = await Deno.readTextFile(tsFile);
        const js = await Esb.transform(tsContent, {
          loader: 'ts',
        });
        const jsContent = js.code;
        await Deno.writeTextFile(jsFile, jsContent);
        response.body = jsContent;
      }
    }
    catch (e) {
      console.log(e)
      response.body = "Error";
    }

    response.headers.set("Content-Type", type);

    const maxAge = Edr.ApgEdrService.ClientTxtMaxAgeSeconds;
    response.headers.append("Cache-Control", `private, max-age=${maxAge}, immutable`)
  }

}