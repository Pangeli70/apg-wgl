function Pippo() {
  console.log("pippo");
}

function LoadTextureAsync(aurl) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(aurl, resolve, undefined, reject)
  })
}

// aurls: string[]
// r: Promise[] 
function GetLoadingTexturesPromises(aurls) {
  const r = [];
  aurls.forEach(aurl => {
    const promise = LoadTextureAsync(aurl)
    r.push(promise);
  });
  return r;
}

// atextureLoadingPromises: Promise[]
// r = Texture[]
function GetTexturesByPromises(atextureLoadingPromises) {
  const r = [];

  Promise.all(atextureLoadingPromises).then((atextures) => {
    r = atextures;
  });
  return r;
}

// aurls: string[]
// r = Texture[]
function GetTexturesByUrls(aurls) {
  const promises = GetLoadingTexturesPromises(aurls);
  const textures = GetTexturesByPromises(promises);
  return textures;
}

// atext: string
// aulParent: ul DOM element
// alogger: string[]
function ApgUlLogger(atext, aulParent, alogger) {

  alogger.push(atext);

  const li = document.createElement('li');
  aulParent.appendChild(li);

  const litxt = document.createTextNode(atext);
  li.appendChild(litxt);

}