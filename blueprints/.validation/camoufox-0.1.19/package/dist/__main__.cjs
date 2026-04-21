#!/usr/bin/env node
"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }














var _chunkNZSG52OAcjs = require('./chunk-NZSG52OA.cjs');

// src/__main__.ts
_chunkNZSG52OAcjs.init_cjs_shims.call(void 0, );
var _commander = require('commander');
var _fs = require('fs');
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var CamoufoxUpdate = class _CamoufoxUpdate extends _chunkNZSG52OAcjs.CamoufoxFetcher {
  
  constructor(proxy) {
    super(_chunkNZSG52OAcjs.INSTALL_DIR, proxy);
    this.currentVerStr = null;
    try {
      this.currentVerStr = _chunkNZSG52OAcjs.installedVerStr.call(void 0, );
    } catch (error) {
      if (error instanceof Error && error.name === "FileNotFoundError") {
        this.currentVerStr = null;
      } else {
        throw error;
      }
    }
  }
  static async create(proxy) {
    const updater = new _CamoufoxUpdate(proxy);
    await updater.init();
    return updater;
  }
  isUpdateNeeded() {
    if (_chunkNZSG52OAcjs.getAsBooleanFromENV.call(void 0, "PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD", false)) {
      console.log("Skipping browser download / update check due to PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD set!");
      return false;
    }
    return this.currentVerStr === null || this.currentVerStr !== this.verstr;
  }
  async update() {
    try {
      if (!this.isUpdateNeeded()) {
        console.log("Camoufox binaries up to date!");
        console.log(`Current version: v${this.currentVerStr}`);
        return;
      }
      if (this.currentVerStr !== null) {
        console.log(`Updating Camoufox binaries from v${this.currentVerStr} => v${this.verstr}`, "yellow");
      } else {
        console.log(`Fetching Camoufox binaries...`);
      }
      await this.install();
    } finally {
      const epath = _path2.default.join(this.installDir.toString(), _chunkNZSG52OAcjs.LAUNCH_FILE[_chunkNZSG52OAcjs.OS_NAME]);
      console.log(`Camoufox install dir: ${this.installDir}`);
      console.log(`Camoufox executable path: ${epath}`);
      if (process.platform !== "win32") {
        console.log(`
\u26A0\uFE0F  Permission Setup Required:`);
        console.log(`Please run the following command to add execute permissions to Camoufox:`);
        console.log(`\x1B[33mchmod +x "${epath}"\x1B[0m`);
        console.log(`Or set permissions for the entire directory:`);
        console.log(`\x1B[33mchmod -R 755 "${this.installDir}"\x1B[0m
`);
      }
    }
  }
  async cleanup() {
    if (!_fs.existsSync.call(void 0, _chunkNZSG52OAcjs.INSTALL_DIR)) {
      return false;
    }
    await _fs.rmSync.call(void 0, _chunkNZSG52OAcjs.INSTALL_DIR, { recursive: true, force: true });
    console.log("Camoufox binaries removed!");
    return true;
  }
};
var program = new (0, _commander.Command)();
program.command("fetch").option("--proxy <proxy>", "Use proxy for downloading (e.g., http://127.0.0.1:8080)").action(async (options) => {
  const updater = await CamoufoxUpdate.create(options.proxy);
  await updater.update();
  if (_chunkNZSG52OAcjs.ALLOW_GEOIP) {
    _chunkNZSG52OAcjs.downloadMMDB.call(void 0, );
  }
  _chunkNZSG52OAcjs.maybeDownloadAddons.call(void 0, _chunkNZSG52OAcjs.DefaultAddons);
});
program.command("remove").action(async () => {
  const updater = await CamoufoxUpdate.create();
  if (!await updater.cleanup()) {
    console.log("Camoufox binaries not found!", "red");
  }
  _chunkNZSG52OAcjs.removeMMDB.call(void 0, );
});
program.command("test").argument("[url]", "URL to open", null).action(async (url) => {
  const browser = await _chunkNZSG52OAcjs.Camoufox.call(void 0, {
    headless: false,
    env: process.env,
    config: { showcursor: true },
    humanize: 0.5,
    geoip: true
  });
  const page = await browser.newPage();
  if (url) {
    await page.goto(url);
  }
  await page.pause();
});
program.command("path").action(() => {
  console.log(_chunkNZSG52OAcjs.INSTALL_DIR);
});
program.command("version").action(async () => {
  try {
    const pkgVersion = _chunkNZSG52OAcjs.__require.call(void 0, "pkg-version");
    console.log(`Pip package:	v${pkgVersion("camoufox")}`);
  } catch (error) {
    console.log("Pip package:	Not installed!", "red");
  }
  const updater = await CamoufoxUpdate.create();
  const binVer = updater.currentVerStr;
  if (!binVer) {
    console.log("Camoufox:	Not downloaded!", "red");
    return;
  }
  console.log(`Camoufox:	v${binVer} `, "green", false);
  if (updater.isUpdateNeeded()) {
    console.log(`(Latest supported: v${updater.verstr})`, "red");
  } else {
    console.log("(Up to date!)", "yellow");
  }
});
program.parse(process.argv);
