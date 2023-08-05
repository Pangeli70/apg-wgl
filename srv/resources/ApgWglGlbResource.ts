/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.8 [APG 2023/07/23]
 * -----------------------------------------------------------------------
 */
import { Edr, Uts } from "../deps.ts";

/** Deliver GLB files stored in assets folder */
export class ApgWglGlbResource extends Edr.ApgEdrStaticResource {

  public override paths = ["/assets/glb/.*\.(glb)",];

  public async GET(request: Edr.Drash.Request, response: Edr.Drash.Response) {

    const type = 'model/gltf-binary'
    const fragments = new URL(request.url).pathname.split("/");
    const fileName = decodeURI(fragments[3]);
    const file = Uts.Std.Path.resolve('./srv/assets/glb/' + fileName);

    const content = await this.processBin(file) as Uint8Array;

    response.body = content;
    response.headers.set("Content-Type", type);

    const maxAge = Edr.ApgEdrService.ClientBinMaxAgeSeconds;
    response.headers.append("Cache-Control", `private, max-age=${maxAge}, immutable`)

  }

}