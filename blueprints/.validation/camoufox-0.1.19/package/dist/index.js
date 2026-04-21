import {
  Camoufox,
  INSTALL_DIR,
  NewBrowser,
  camoufoxPath,
  downloadMMDB,
  getLaunchPath,
  init_esm_shims,
  launchOptions,
  removeMMDB
} from "./chunk-QNWJYPXY.js";

// src/index.ts
init_esm_shims();
async function downloadBrowser(installDir = INSTALL_DIR) {
  return await camoufoxPath(installDir);
}
export {
  Camoufox,
  INSTALL_DIR,
  NewBrowser,
  downloadBrowser,
  downloadMMDB,
  getLaunchPath,
  launchOptions,
  removeMMDB
};
