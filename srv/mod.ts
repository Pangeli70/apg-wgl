import { Edr } from "./deps.ts";
import { ApgWglAssetTextureResource } from './resources/ApgWglAssetTextureResource.ts';
import { ApgWglAssetTranspiledTsResource } from './resources/ApgWglAssetTranspiledTsResource.ts';

import { ApgWglHomeResource } from './resources/ApgWglHomeResource.ts';

import { ApgWglGltfExtrusionsTestListResource } from './resources/ApgWglGltfExtrusionsTestListResource.ts';
import { ApgWglGltfExtrusionsTestResource } from './resources/ApgWglGltfExtrusionsTestResource.ts';
import { ApgWglGltfViewerResource } from './resources/ApgWglGltfViewerResource.ts';
import { ApgWglGltfTestResource } from './resources/ApgWglGltfTestResource.ts';

import { ApgWglGlbListResource } from './resources/ApgWglGlbListResource.ts';
import { ApgWglGlbViewerResource } from './resources/ApgWglGlbViewerResource.ts';
import { ApgWglGlbResource } from './resources/ApgWglGlbResource.ts';


export const ApgWglResources: typeof Edr.Drash.Resource[] = [

    // Static
    Edr.ApgEdrAssetsTextFileResource,
    Edr.ApgEdrAssetBinFileResource,

    ApgWglAssetTextureResource,
    ApgWglAssetTranspiledTsResource,

    ApgWglHomeResource,

    ApgWglGltfExtrusionsTestListResource,
    ApgWglGltfExtrusionsTestResource,

    ApgWglGltfTestResource,
    ApgWglGltfViewerResource,

    ApgWglGlbListResource,
    ApgWglGlbResource,
    ApgWglGlbViewerResource,
];


export const ApgWglServices: Edr.Drash.Service[] = [
    new Edr.Drash.CORSService()
];