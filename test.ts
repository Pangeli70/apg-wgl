/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * 
 * ------------------------------------------------------------------------
 */
import { Spc } from "./test/deps.ts";
import { ApgWglSpec } from "./test/specs/ApgWglSpec.ts";


async function ApgWglTests(arun: Spc.eApgSpcRun) {

    if (arun != Spc.eApgSpcRun.yes) return;

    const URI = "https://apg-tst.deno.dev/store";

    const testSpec = new ApgWglSpec();
    if (await testSpec.Run(Spc.eApgSpcRun.yes)) {
        const _r1 = await testSpec.SendEventsToTestService(URI, "Spc", testSpec.CLASS_NAME);
    }

    Spc.ApgSpcSpecifier.FinalReport();
}

await ApgWglTests(Spc.eApgSpcRun.yes);