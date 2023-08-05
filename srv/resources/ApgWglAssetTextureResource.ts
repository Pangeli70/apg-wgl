/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.8 [APG 2023/06/14]
 * -----------------------------------------------------------------------
 */
import { Edr } from "../deps.ts";


/** Resource to deliver textures stored in asset folder */
export class ApgWglAssetTextureResource extends Edr.ApgEdrStaticResource {

  public override paths = [
    "/assets/img/gltf/.*\.(jpg|jpeg|png|exr|hdr)",
  ];

  public async GET(request: Edr.Drash.Request, response: Edr.Drash.Response) {

    const extension = request.url.split(".").at(-1);
    let type: string;
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        type = 'image/jpeg'
        break;
      case 'png':
        type = 'image/png'
        break;
      default:
        type = 'application/octet-stream'
    }

    const file = Edr.ApgEdrService.AssetsFolder + new URL(request.url).pathname;
    
    const content = await this.processBin(file) as Uint8Array;
    
    response.body = content;
    response.headers.set("Content-Type", type);

    const maxAge = Edr.ApgEdrService.ClientBinMaxAgeSeconds;
    response.headers.append("Cache-Control", `private, max-age=${maxAge}, immutable`)
  }

}