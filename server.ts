/** -----------------------------------------------------------------------
 * @module [apg-wgl] Web 3D Graphics Library using three.js
 * @author [APG] ANGELI Paolo Giusto
 * 
 * -----------------------------------------------------------------------
 */
import { Edr, Dir, Lgr, Tng } from "./srv/deps.ts";
import { ApgWglResources, ApgWglServices } from "./srv/mod.ts";

Edr.ApgEdrService.Init({
  assetsFolder: "./srv",
  clientTxtMaxAgeSeconds: 5
});

Lgr.ApgLgr.AddConsoleTransport();

Tng.ApgTngService.Init('./srv/templates', "");

const serverInfo = Dir.ApgDirServer.GetInfo(Dir.eApgDirEntriesIds.wgl);

const server = new Edr.Drash.Server({
  hostname: '0.0.0.0',
  port: serverInfo.localPort,
  resources: ApgWglResources,
  services: ApgWglServices,
  protocol: "http"
});

server.run();

Dir.ApgDirServer.StartupResume(serverInfo);


