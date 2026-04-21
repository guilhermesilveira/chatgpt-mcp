import { PathLike } from 'fs';
import { LaunchOptions as LaunchOptions$1, Browser, BrowserContext, BrowserType } from 'playwright-core';
import { FingerprintGeneratorOptions, Fingerprint } from 'fingerprint-generator';

declare const DefaultAddons: {
    /**
     * Default addons to be downloaded
     */
    UBO: string;
};

type Screen = FingerprintGeneratorOptions['screen'];
interface LaunchOptions {
    /** Operating system to use for the fingerprint generation.
     * Can be "windows", "macos", "linux", or a list to randomly choose from.
     * Default: ["windows", "macos", "linux"]
     * ["windows", "macos", "linux", "android", "ios"]
     */
    os?: string | string[];
    /** Whether to block all images. */
    block_images?: boolean;
    /** Whether to block WebRTC entirely. */
    block_webrtc?: boolean;
    /** Whether to block WebGL. To prevent leaks, only use this for special cases. */
    block_webgl?: boolean;
    /** Disables the Cross-Origin-Opener-Policy, allowing elements in cross-origin iframes to be clicked. */
    disable_coop?: boolean;
    /** Calculate longitude, latitude, timezone, country, & locale based on the IP address.
     * Pass the target IP address to use, or `true` to find the IP address automatically.
     */
    geoip?: string | boolean;
    geoip_file?: string;
    /** Humanize the cursor movement.
     * Takes either `true`, or the MAX duration in seconds of the cursor movement.
     * The cursor typically takes up to 1.5 seconds to move across the window.
     */
    humanize?: boolean | number;
    /** Locale(s) to use. The first listed locale will be used for the Intl API. */
    locale?: string | string[];
    /** List of Firefox addons to use. */
    addons?: string[];
    /** Fonts to load into the browser (in addition to the default fonts for the target `os`).
     * Takes a list of font family names that are installed on the system.
     */
    fonts?: string[];
    /** If enabled, OS-specific system fonts will not be passed to the browser. */
    custom_fonts_only?: boolean;
    /** Default addons to exclude. Passed as a list of `DefaultAddons` enums. */
    exclude_addons?: (keyof typeof DefaultAddons)[];
    /** Constrains the screen dimensions of the generated fingerprint. */
    screen?: Screen;
    /** Set a fixed window size instead of generating a random one. */
    window?: [number, number];
    /** Use a custom BrowserForge fingerprint. If not provided, a random fingerprint will be generated
     * based on the provided `os` & `screen` constraints.
     */
    fingerprint?: Fingerprint;
    /** Firefox version to use. Defaults to the current Camoufox version.
     * To prevent leaks, only use this for special cases.
     */
    ff_version?: number;
    /** Whether to run the browser in headless mode. Defaults to `false`.
     * Note: On Linux, passing `headless='virtual'` will use Xvfb.
     */
    headless?: boolean | "virtual";
    /** Whether to enable running scripts in the main world.
     * To use this, prepend "mw:" to the script: `page.evaluate("mw:" + script)`.
     */
    main_world_eval?: boolean;
    /** Custom browser executable path. */
    executable_path?: string | PathLike;
    /** Firefox user preferences to set. */
    firefox_user_prefs?: Record<string, any>;
    /** Proxy to use for the browser.
     * Note: If `geoip` is `true`, a request will be sent through this proxy to find the target IP.
     */
    proxy?: string | LaunchOptions$1['proxy'];
    /** Cache previous pages, requests, etc. (uses more memory). */
    enable_cache?: boolean;
    /** Arguments to pass to the browser. */
    args?: string[];
    /** Environment variables to set. */
    env?: Record<string, string | number | boolean>;
    /** Prints the config being sent to Camoufox. */
    debug?: boolean;
    /** Virtual display number. Example: `":99"`. This is handled by Camoufox & AsyncCamoufox. */
    virtual_display?: string;
    /** Use a specific WebGL vendor/renderer pair. Passed as a tuple of `[vendor, renderer]`. */
    webgl_config?: [string, string];
    /** Open using launchPersistentContext */
    data_dir?: string;
    /** Additional Firefox launch options. */
    [key: string]: any;
}
declare function launchOptions({ config, os, block_images, block_webrtc, block_webgl, disable_coop, webgl_config, geoip, geoip_file, humanize, locale, addons, fonts, custom_fonts_only, exclude_addons, screen, window, fingerprint, ff_version, headless, main_world_eval, executable_path, firefox_user_prefs, proxy, enable_cache, args, env, i_know_what_im_doing, debug, virtual_display, ...launch_options }: LaunchOptions): Promise<Record<string, any>>;

declare function Camoufox(launch_options: LaunchOptions): Promise<Browser | BrowserContext>;
declare function NewBrowser(playwright: BrowserType<Browser>, headless?: boolean | 'virtual', fromOptions?: Record<string, any>, persistentContext?: boolean, debug?: boolean, launch_options?: LaunchOptions): Promise<Browser | BrowserContext>;

declare function downloadMMDB(mmdb_file?: string): Promise<void>;
declare function removeMMDB(mmdb_file?: string): void;

declare const INSTALL_DIR: PathLike;
declare function getLaunchPath(installDir?: PathLike): string;

declare function downloadBrowser(installDir?: PathLike): Promise<PathLike>;

export { Camoufox, INSTALL_DIR, type LaunchOptions, NewBrowser, downloadBrowser, downloadMMDB, getLaunchPath, launchOptions, removeMMDB };
