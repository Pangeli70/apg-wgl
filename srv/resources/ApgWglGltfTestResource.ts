/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.7 [APG 2023/04/25] Separation of concerns lib/srv
 * -----------------------------------------------------------------------
 */
import { Edr, Uts } from "../deps.ts";
import { ApgWglTestService } from "../../mod.ts";

/** Deliver gltf files stored in test folder */
export class ApgWglGltfTestResource extends Edr.ApgEdrStaticResource {

  public override paths = ["/test/gltf/.*\.(gltf)",];

  public async GET(request: Edr.Drash.Request, response: Edr.Drash.Response) {

    const type = 'model/gltf+json'
    const fragments = new URL(request.url).pathname.split("/");
    const fileName = decodeURI(fragments[3]);
    const file = Uts.Std.Path.resolve(ApgWglTestService.TestOutputPath + fileName);

    const text = await this.processText(file) as string;

    response.text(text, 200, { 'Content-Type': type });

  }

}