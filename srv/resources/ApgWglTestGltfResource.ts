/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.7 [APG 2023/04/25] Separation of concerns lib/srv
 * -----------------------------------------------------------------------
 */
import { Edr, Uts } from "../deps.ts";
import { ApgWglService } from "../../mod.ts";

/** Deliver gltf files stored in test folder */
export class ApgWglTestGltfResource extends Edr.ApgEdrStaticResource {

  public override paths = [
    "/gltf/test/.*\.(gltf)",
  ];

  public async GET(request: Edr.Drash.Request, response: Edr.Drash.Response) {

    const type = 'model/gltf+json'
    const fragments = new URL(request.url).pathname.split("/");
    const file = Uts.Std.Path.resolve(ApgWglService.TestOutputPath + fragments[3]);

    const text = await this.processText(file) as string;

    response.text(text, 200, { 'Content-Type': type });

  }

}