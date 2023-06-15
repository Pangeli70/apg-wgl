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

    const file = Uts.Std.Path.resolve(Edr.ApgEdrService.AssetsFolder + new URL(request.url).pathname);

    const content = await Deno.readTextFile(file);

    try {
      const js = await Esb.transform(content, {
        loader: 'ts',
      });
      response.body = js.code;
    }
    catch (e) {
      console.log(e)
      response.body = "";
    }

    response.headers.set("Content-Type", type);

    const maxAge = Edr.ApgEdrService.ClientTxtMaxAgeSeconds;
    response.headers.append("Cache-Control", `private, max-age=${maxAge}, immutable`)
  }

}