# camoufox-js

[![npm version](https://badge.fury.io/js/camoufox.svg)](https://badge.fury.io/js/camoufox)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A JavaScript/TypeScript port of [Camoufox](https://github.com/daijro/camoufox) - an advanced anti-fingerprinting tool for Firefox automation. This library provides a complete Node.js wrapper that doesn't rely on Python scripts, offering native JavaScript performance and integration.

> **Note**: This is a modified fork of [apify/camoufox-js](https://github.com/apify/camoufox-js) with additional features and improvements.

## Features

- 🎭 **Advanced Anti-Fingerprinting**: Sophisticated browser fingerprint spoofing
- 🌍 **GeoIP Integration**: Automatic location-based configuration
- 🖱️ **Human-like Behavior**: Cursor movement humanization
- 🔧 **Highly Configurable**: Extensive customization options
- 📱 **Cross-Platform**: Support for Windows, macOS, and Linux
- 🚀 **TypeScript Support**: Full type definitions included
- 🎯 **Playwright Integration**: Built on top of Playwright for reliable automation

## Installation

```bash
npm install camoufox
```

## Quick Start

### Basic Usage

```javascript
import { Camoufox } from 'camoufox';

async function main() {
    // Launch Camoufox with default settings
    const browser = await Camoufox({
        headless: false
    });
    
    const page = await browser.newPage();
    await page.goto('https://example.com');
    
    // Your automation code here
    
    await browser.close();
}

main();
```

### Advanced Configuration

```javascript
import { Camoufox } from 'camoufox';

async function main() {
    const browser = await Camoufox({
        // Operating system fingerprint
        os: 'windows', // or 'macos', 'linux', or ['windows', 'macos']
        
        // GeoIP-based configuration
        geoip: true, // Auto-detect IP, or pass specific IP: '1.2.3.4'
        
        // Humanize cursor movement
        humanize: 1.5, // Max duration in seconds
        
        // Locale settings
        locale: ['en-US', 'en-GB'],
        
        // Proxy configuration
        proxy: {
            server: 'http://proxy.example.com:8080',
            username: 'user',
            password: 'pass'
        },
        
        // Block resources
        block_images: true,
        block_webrtc: true,
        
        // Custom screen constraints
        screen: {
            min_width: 1024,
            max_width: 1920,
            min_height: 768,
            max_height: 1080
        },
        
        // Firefox addons
        addons: ['ublock_origin'],
        
        // Custom fonts
        fonts: ['Arial', 'Times New Roman'],
        
        // Debug mode
        debug: true
    });
    
    const page = await browser.newPage();
    await page.goto('https://browserscan.net');
    
    await browser.close();
}

main();
```

## API Reference

### Main Functions

#### `Camoufox(options: LaunchOptions): Promise<Browser>`

Launches a new Camoufox browser instance with the specified options.

#### `downloadBrowser(installDir?: PathLike): Promise<string>`

Downloads and installs the Camoufox browser binaries.

#### `downloadMMDB(): Promise<void>`

Downloads the GeoIP database for location-based fingerprinting.

#### `removeMMDB(): void`

Removes the downloaded GeoIP database.

### Launch Options

| Option | Type | Description |
|--------|------|-------------|
| `os` | `string \| string[]` | Operating system for fingerprint generation |
| `headless` | `boolean \| 'virtual'` | Run in headless mode (use 'virtual' for Xvfb on Linux) |
| `geoip` | `string \| boolean` | IP-based geolocation configuration |
| `humanize` | `boolean \| number` | Humanize cursor movement |
| `locale` | `string \| string[]` | Browser locale settings |
| `proxy` | `string \| object` | Proxy configuration |
| `block_images` | `boolean` | Block all images |
| `block_webrtc` | `boolean` | Block WebRTC |
| `block_webgl` | `boolean` | Block WebGL |
| `screen` | `Screen` | Screen dimension constraints |
| `window` | `[number, number]` | Fixed window size |
| `addons` | `string[]` | Firefox addons to load |
| `fonts` | `string[]` | Custom fonts to load |
| `fingerprint` | `Fingerprint` | Custom BrowserForge fingerprint |
| `executable_path` | `string` | Custom Firefox executable path |
| `firefox_user_prefs` | `object` | Firefox user preferences |
| `args` | `string[]` | Additional browser arguments |
| `env` | `object` | Environment variables |
| `debug` | `boolean` | Enable debug output |

## Command Line Interface

Camoufox-js includes a CLI tool for browser management:

```bash
# Download/update Camoufox binaries
npx camoufox fetch

# Remove Camoufox binaries
npx camoufox remove

# Test browser with a URL
npx camoufox test [url]
```

## Examples

### Web Scraping with Anti-Detection

```javascript
import { Camoufox } from 'camoufox';

async function scrapeWithStealth() {
    const browser = await Camoufox({
        os: 'windows',
        geoip: true,
        humanize: true,
        block_images: true, // Faster loading
        addons: ['ublock_origin'] // Ad blocking
    });
    
    const page = await browser.newPage();
    
    // Navigate with human-like behavior
    await page.goto('https://example.com', {
        waitUntil: 'networkidle'
    });
    
    // Extract data
    const title = await page.title();
    console.log('Page title:', title);
    
    await browser.close();
}
```

### Testing with Different Fingerprints

```javascript
import { Camoufox } from 'camoufox';

async function testFingerprints() {
    const configs = [
        { os: 'windows', locale: 'en-US' },
        { os: 'macos', locale: 'en-GB' },
        { os: 'linux', locale: 'de-DE' }
    ];
    
    for (const config of configs) {
        const browser = await Camoufox(config);
        const page = await browser.newPage();
        
        await page.goto('https://browserscan.net');
        
        // Check fingerprint
        const userAgent = await page.evaluate(() => navigator.userAgent);
        console.log(`${config.os}: ${userAgent}`);
        
        await browser.close();
    }
}
```

## Troubleshooting

### Common Issues

1. **Browser not found**: Run `npx camoufox fetch` to download binaries
2. **GeoIP errors**: Ensure GeoIP database is downloaded with `downloadMMDB()`
3. **Permission errors**: Check file permissions in the installation directory
4. **Proxy issues**: Verify proxy configuration and connectivity

### Debug Mode

Enable debug mode to see detailed configuration:

```javascript
const browser = await Camoufox({
    debug: true,
    // ... other options
});
```

## Requirements

- Node.js 16+ 
- Windows, macOS, or Linux
- Internet connection for initial setup

## Related Projects

- [Camoufox](https://github.com/daijro/camoufox) - Original Python implementation
- [Playwright](https://playwright.dev/) - Browser automation framework
- [BrowserForge](https://github.com/daijro/browserforge) - Browser fingerprint generation

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- 📖 [Documentation](https://github.com/daijro/camoufox)
- 🐛 [Issue Tracker](https://github.com/tocha688/camoufox-js/issues)
- 💬 [Discussions](https://github.com/tocha688/camoufox-js/discussions)


