#!/usr/bin/env node
import {
  ALLOW_GEOIP,
  Camoufox,
  CamoufoxFetcher,
  DefaultAddons,
  INSTALL_DIR,
  LAUNCH_FILE,
  OS_NAME,
  __require,
  downloadMMDB,
  getAsBooleanFromENV,
  init_esm_shims,
  installedVerStr,
  maybeDownloadAddons,
  removeMMDB
} from "./chunk-QNWJYPXY.js";

// src/__main__.ts
init_esm_shims();
import { Command } from "commander";
import { existsSync, rmSync } from "fs";
import path from "path";
var CamoufoxUpdate = class _CamoufoxUpdate extends CamoufoxFetcher {
  currentVerStr;
  constructor(proxy) {
    super(INSTALL_DIR, proxy);
    this.currentVerStr = null;
    try {
      this.currentVerStr = installedVerStr();
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
    if (getAsBooleanFromENV("PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD", false)) {
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
      const epath = path.join(this.installDir.toString(), LAUNCH_FILE[OS_NAME]);
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
    if (!existsSync(INSTALL_DIR)) {
      return false;
    }
    await rmSync(INSTALL_DIR, { recursive: true, force: true });
    console.log("Camoufox binaries removed!");
    return true;
  }
};
var program = new Command();
program.command("fetch").option("--proxy <proxy>", "Use proxy for downloading (e.g., http://127.0.0.1:8080)").action(async (options) => {
  const updater = await CamoufoxUpdate.create(options.proxy);
  await updater.update();
  if (ALLOW_GEOIP) {
    downloadMMDB();
  }
  maybeDownloadAddons(DefaultAddons);
});
program.command("remove").action(async () => {
  const updater = await CamoufoxUpdate.create();
  if (!await updater.cleanup()) {
    console.log("Camoufox binaries not found!", "red");
  }
  removeMMDB();
});
program.command("test").argument("[url]", "URL to open", null).action(async (url) => {
  const browser = await Camoufox({
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
  console.log(INSTALL_DIR);
});
program.command("version").action(async () => {
  try {
    const pkgVersion = __require("pkg-version");
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
