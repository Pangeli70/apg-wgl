import { Edr } from "./deps.ts";
import { ApgWglHomeResource } from './resources/ApgWglHomeResource.ts';
import { ApgWglTestsResource } from './resources/ApgWglTestsResource.ts';
import { ApgWglViewerResource } from './resources/ApgWglViewerResource.ts';


export const ApgWglResources: typeof Edr.Drash.Resource[] = [

    // Static
    Edr.ApgEdrAssetsTextFileResource,
    Edr.ApgEdrAssetBinFileResource,

    ApgWglHomeResource,
    ApgWglTestsResource,
    ApgWglViewerResource
];


export const ApgWglServices: Edr.Drash.Service[] = [
    new Edr.Drash.CORSService()
];