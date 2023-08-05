function rawJavascript(templateData) {

    function pipo(templateData) {
        const r = [];
        r.push(`<!--
    @module [apg-wgl]
    @author [APG] ANGELI Paolo Giusto
    @version 0.9.7 [APG 2023/06/04] 
    @remarks This version uses the assets from https://apg-cdn.deno.dev
  -->
  <!DOCTYPE html>
  <html lang="en">
  
    <head>
      <title>
        `);
        r.push(_site_.name);
        r.push(`:`);
        r.push(_site_.version);
        r.push(`</title>
      <meta charset="UTF-8" />
      <meta content="IE=edge" />
  
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
      <meta name="author" content="APG Angeli Paolo Giusto" />
      <meta name="generator" content="Deno+Drash" />
      <meta name="keywords" content="Deno, Drash, APG, Angeli Paolo Giusto, Paolo Angeli" />
      <meta name="application-name" content="`);
        r.push(_site_.name);
        r.push(`" />
  
      <!-- Favicon -->
      <link rel="shortcut icon" type="image/x-icon"
            href="https://apg-cdn.deno.dev/assets/img/ico/Apg-favicon-2022.ico" />
  
      <!-- Stylesheets -->
      <!-- <link rel="stylesheet"
            href="https://unpkg.com/@picocss/pico@latest/css/pico.classless.min.css" /> -->
  
      <!-- <link rel="stylesheet" href="https://apg-cdn.deno.dev/assets/css/Apg-pico-custom.css"
            type="text/css" /> -->
  
      <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
      <!-- <link rel="stylesheet" href="http://necolas.github.io/normalize.css/8.0.1/normalize.css"> -->
      <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css"> -->
      <!-- <link rel="stylesheet" href="https://unpkg.com/wingcss"/> -->
      <!-- <link rel="stylesheet" href="https://unpkg.com/boltcss/bolt.min.css"/> -->
      <!-- <link rel="stylesheet" href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" > -->
  
  
  
      <link rel="stylesheet" href="/assets/css/ApgWglGltf.css" type="text/css">
  
    </head>
  
    <body>
      <header style="padding: 0">
        <section id="title" style="padding: 0; margin: 0">
          <table>
            <tr>
              <td style="width:4rem">
                <a href="/" title="Home">
                  <img title="Logo" style="min-width:3rem; min-height:3rem; "
                       src="https://apg-cdn.deno.dev/assets/img/png/APG-logo-2022-128px.png" />
                </a>
              </td>
              <td>
                <h2 style="margin-bottom: 0px">`);
        r.push(_site_.name);
        r.push(`<span style="font-size: 20&">`);
        r.push(_site_.version);
        r.push(`</span><br>
                  <span style="font-size: 50&">`);
        r.push(_site_.title);
        r.push(`</span>
                </h2>
              </td>
            </tr>
          </table>
        </section>`);
        if (_page_.toolbar) {
            r.push(`<section id="bar" style="text-align: center;">`);
            r.push(_page_.toolbar);
            r.push(`<hr>
        </section>`);
        }
        r.push(`<p class="apg-page-title">`);
        r.push(_page_.title);
        r.push(`</p>
  
      </header>
  
      <main style="padding: 0">
        
  
  
  <link
    href="/assets/css/ApgWglGltfViewer.css"
    rel="stylesheet"
    type="text/css"
  >
  
  
  <!-- Import maps polyfill -->
  <!-- Remove this when import maps will be widely supported -->
  <script
    async
    src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"
  ></script>
  
  
  <script>const gltfResource = "`);
        r.push(_resource_);
        r.push(`"; </script>
  
  
  <script type="module">
    import { ApgWglGltfViewer } from "/assets/ts/ApgWglGltfViewer.ts"
  
  
    const viewer = new ApgWglGltfViewer();
    window.ApgWglGltfViewer = viewer;
  
    viewer.init(window, document, gltfResource);
  
    animate();
  
    window.addEventListener('resize', onWindowResize);
  
  
    function onWindowResize() {
  
      viewer.resize();
  
    }
  
    function animate() {
  
      requestAnimationFrame(animate);
  
      if (viewer.controls) {
        viewer.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
      }
  
      viewer.render();
  
    }
  
  
  
  </script>
  
  <section id="ApgWglGltfViewer"></section>
  
  <p style="text-align: right;">
    <button
      type="button"
      id="openEnvSettingsDialog"
      style="max-width: 8rem; display: inline;"
      onclick="openMenuDialog()"
    >Menu</button>
  </p>
  
  
  <dialog id="viewerMenuDialog">
    <div style="min-width: 30rem">
      <h3 style="text-align: center;">Viewer Settings</h3>
      <p>
        <button
          type="button"
          style="max-width: 8rem; display: inline;"
          onclick="viewerOpenSettingsDialog()"
        >Settings</button>
      </p>
      <p>
        <button
          type="button"
          style="max-width: 8rem; display: inline;"
          onclick="viewerReloadEnvMap()"
        >Reload env</button>
      </p>
      <p>
        <button
          type="button"
          style="max-width: 8rem; display: inline;"
          onclick="vieweReloadGltf()"
        >Reload gltf</button>
      </p>
      <p>
        <button
          type="button"
          style="max-width: 8rem; display: inline;"
          onclick="viewerScreenshot()"
        >Screenshot</button>
      </p>
      <p style="text-align: right;">
        <button
          type="button"
          style="max-width: 8rem; display: inline;"
          onclick="closeMenuDialog()"
        >Close</button>
      </p>
      <a
        id="screenShotAnchor"
        style="display: none;"
      >Screenshot Anchor</a>
    </div>
  </dialog>
  
  <script>
    const menuDialog = {
      element: document.getElementById("viewerMenuDialog"),
      screenShotAnchor: document.getElementById("viewerScreenShotAnchor"),
    }
  
    function openMenuDialog() {
      menuDialog.element.showModal();
    }
  
    function closeMenuDialog() {
      menuDialog.element.close();
    }
  
    function viewerReloadEnvMap() {
      const viewer = window.ApgWglGltfViewer;
      if (viewer.options.useExrInsteadThanHdr) {
        viewer.initializeExrEnvMap();
      } else {
        viewer.initializeHdrEnvMap();
      }
      viewer.render();
    }
  
    function vieweReloadGltf() {
      const gltfObject = window.ApgWglGltfViewer.scene.getObjectByName(window.ApgWglGltfViewer.gltfResource);
      window.ApgWglGltfViewer.scene.remove(gltfObject);
      window.ApgWglGltfViewer.loadGltf(window.ApgWglGltfViewer.gltfResource);
    }
  
  
    function viewerScreenshot() {
      const canvas = window.ApgWglGltfViewer.canvas;
      const fileName = `screencapture - ${ canvas.width }x${ canvas.height }.png`;
      canvas.toBlob((blob) => {
        const a = menuDialog.screenShotAnchor;
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
      });
    };
  
  </script>
  
  
  <dialog id="envSettingsDialog">
    <div style="min-width: 30rem">
      <h3 style="text-align: center;">Environment Settings</h3>
  
  
      <input
        id="envUseMap"
        name="envUseMap"
        type="checkbox"
        onchange="envUseMapChange()"
      />
      <label for="envUseMap">Use env map instead than lights</label><br>
      <br>
  
      <input
        id="envUseExr"
        name="envUseExr"
        type="checkbox"
        onchange="envUseExrChange()"
      />
      <label for="envUseExr">Use exr maps instead than hdr maps</label><br>
      <br>
  
      <p style="text-align: right;">
  
        <button
          type="button"
          style="max-width: 8rem; display: inline;"
          onclick="closeEnvSettingsDialog()"
        >Close</button>
      </p>
  
    </div>
  </dialog>
  
  
  <script>
    const envControls = {
      dialog: document.getElementById("envSettingsDialog"),
      useEnvMapChkBox: document.getElementById("envUseMap"),
      useExrChkBox: document.getElementById("envUseExr"),
      lightsSettingsButton: document.getElementById("openLightSettingsDialog"),
  
    }
  
    window.onload = () => {
      envControls.lightsSettingsButton.disabled = window.ApgWglGltfViewer.options.useEnvMapInsteadThanLights;
    }
  
    function openEnvSettingsDialog() {
      envControls.useEnvMapChkBox.checked = window.ApgWglGltfViewer.options.useEnvMapInsteadThanLights;
      envControls.useExrChkBox.checked = window.ApgWglGltfViewer.options.useExrInsteadThanHdr;
  
      envControls.dialog.showModal();
    }
  
    function envUseMapChange() {
      const viewer = window.ApgWglGltfViewer;
      if (envControls.useEnvMapChkBox.checked) {
        envControls.lightsSettingsButton.disabled = true;
      }
      else {
        envControls.lightsSettingsButton.disabled = false;
      }
      viewer.options.useEnvMapInsteadThanLights = envControls.useEnvMapChkBox.checked;
      setupLights();
      viewer.render();
    }
  
  
    function setupLights() {
      const viewer = window.ApgWglGltfViewer;
      if (viewer.options.useEnvMapInsteadThanLights) {
        viewer.scene.environment = viewer.currEnv;
        viewer.ambientLight.visible = false;
        viewer.directionalLight.visible = false;
      } else {
        viewer.scene.environment = null;
        viewer.ambientLight.visible = true;
        viewer.directionalLight.visible = true;
      }
    }
  
    function envUseExrChange() {
      const viewer = window.ApgWglGltfViewer;
      viewer.options.useExrInsteadThanHdr = envControls.useExrChkBox.checked;
    }
  
  
  
    function closeEnvSettingsDialog() {
      envControls.dialog.close();
    }
  </script>
  
  
  <dialog id="lightSettingsDialog">
    <div>
  
      <p>Light Settings</p>
  
      <fieldset>
        <legend>Directional:</legend>
        <label for="ambientLightIntensity">Ambient intensity</label>
        <input
          id="ambientLightIntensity"
          name="ambientLightIntensity"
          type="range"
          min="0"
          max="1"
          step="0.05"
          onchange="ambientLightIntensityChange()"
        />
      </fieldset>
  
      <fieldset>
        <legend>Directional:</legend>
        <label for="directionalLightIntensity">Intensity</label>
        <input
          id="directionalLightIntensity"
          name="directionalLightIntensity"
          type="range"
          min="0"
          max="1"
          step="0.05"
          onchange="directionalLightIntensityChange()"
        />
  
        <label for="directionalLightColor">Color</label>
        <input
          id="directionalLightColor"
          name="directionalLightColor"
          type="color"
          onchange="directionalLightColorChange()"
        />
  
        <label for="directionalLightX">X rotation</label>
        <input
          id="directionalLightX"
          name="directionalLightX"
          type="range"
          min="-10"
          max="10"
          step="0.1"
          onchange="directionalLightXChange()"
        />
  
        <label for="directionalLightY">Y rotation</label>
        <input
          id="directionalLightY"
          name="directionalLightY"
          type="range"
          min="-10"
          max="10"
          step="0.1"
          onchange="directionalLightYChange()"
        />
  
        <label for="directionalLightZ">Z rotation</label>
        <input
          id="directionalLightZ"
          name="directionalLightZ"
          type="range"
          min="-10"
          max="10"
          step="0.1"
          onchange="directionalLightZChange()"
        />
      </fieldset>
      <button onclick="closeLightSettingsDialog()">Close</button>
    </div>
  </dialog>
  
  
  <script>
  
    const lightControls = {
      dialog: document.getElementById("lightSettingsDialog"),
      ambientLightIntensity: document.getElementById("ambientLightIntensity"),
      directionalLightIntensity: document.getElementById("directionalLightIntensity"),
      directionalLightColor: document.getElementById("directionalLightColor"),
      directionalLightX: document.getElementById("directionalLightX"),
      directionalLightY: document.getElementById("directionalLightY"),
      directionalLightZ: document.getElementById("directionalLightZ"),
    }
  
    function openLightSettingsDialog() {
      lightControls.ambientLightIntensity.value = window.ApgWglGltfViewer.ambientLight.intensity;
      lightControls.directionalLightIntensity.value = window.ApgWglGltfViewer.directionalLight.intensity;
      lightControls.directionalLightColor.value = "#" + window.ApgWglGltfViewer.directionalLight.color.getHexString();
      lightControls.directionalLightX.value = window.ApgWglGltfViewer.directionalLight.position.x;
      lightControls.directionalLightY.value = window.ApgWglGltfViewer.directionalLight.position.y;
      lightControls.directionalLightZ.value = window.ApgWglGltfViewer.directionalLight.position.z;
      lightControls.dialog.showModal();
    }
  
    function ambientLightIntensityChange() {
      window.ApgWglGltfViewer.ambientLight.intensity = parseFloat(lightControls.ambientLightIntensity.value);
    }
  
    function directionalLightIntensityChange() {
      window.ApgWglGltfViewer.directionalLight.intensity = parseFloat(lightControls.directionalLightIntensity.value);
    }
  
    function directionalLightColorChange() {
      const hexStr = lightControls.directionalLightColor.value.replaceAll("#", "0x");
      const hexVal = parseInt(hexStr, 16);
      window.ApgWglGltfViewer.directionalLight.color.setHex(hexVal);
    }
  
    function directionalLightXChange() {
      window.ApgWglGltfViewer.directionalLight.position.x = parseFloat(lightControls.directionalLightX.value);
    }
    function directionalLightYChange() {
      window.ApgWglGltfViewer.directionalLight.position.y = parseFloat(lightControls.directionalLightY.value);
    }
    function directionalLightZChange() {
      window.ApgWglGltfViewer.directionalLight.position.z = parseFloat(lightControls.directionalLightZ.value);
    }
  
    function closeLightSettingsDialog() {
      lightControls.dialog.close();
    }
  </script>
      </main>
  
      <footer style="padding: 0">
        <hr />
        <section id="footer" style="padding: 0; margin: 2em, 0, 0, 0">
          <p style="text-align: center; font-size: 0.5em">
            <em>
              © 2017-2023 APG: free man angeli paolo giusto.<br />
              Made with ❤ using
              <a href="https://deno.land/" target="_blank">Deno</a>,
              <a href="https://deno.land/" target="_blank">Deno deploy</a>,
              <a href="https://drash.land/" target="_blank"> Drash</a>,
              <a href="https://www.picocss.com/" target="_blank">Pico Css</a><br />
              SSR HTML by <a href="https://apg-cdn.deno.tng" target="_blank">Apg-Tng</a><br />
              Page released:`);
        r.push(_page_.released);
        r.push(`<br />
              <a href="https://apg-dir.deno.dev/">Apg directory</a>
            </em>
          </p>
        </section>
      </footer>
    </body>
  
  </html>`);
        return r.join("");
    }
}
}
