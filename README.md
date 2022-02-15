# LightHUD+ATE

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/foundryvtt-lights-hud-ate/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) 

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Flights-hud-ate&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=lights-hud) 

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-lights-hud-ate%2Fmaster%2Fsrc%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-lights-hud-ate%2Fmaster%2Fsrc%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Flights-hud-ate%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/lights-hud-ate/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/foundryvtt-lights-hud-ate/total?style=for-the-badge)

A Foundry VTT module that displays on the HUD config of the token all the available lighting items on the token/actor, with some [ATE](https://github.com/kandashi/Active-Token-Lighting) effect.

This project is born like a fusion of two other modules [LightsHUD](https://github.com/Malekal4699/LightsHUD/) and [ATE](https://github.com/kandashi/Active-Token-Lighting), but then i rewriting almost everything so is just a new module inspired form these other module.

Remember tu support these authors if you feel generous:


## NOTE: If you are a javascript developer and not a typescript developer, you can just use the javascript files under the dist folder

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/foundryvtt-lights-hud-ate/master/src/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

## Known Issue\Limitation

- **HELP WANTED** The token MUST BE LINKED TO A ACTOR,  if anyone can solve this let me know
- **HELP WANTED** This is just a "fast to make" module maybe someone a little more expert than me with form application and hud layer can do a better form for a better user experience
- [ATE](https://github.com/kandashi/Active-Token-Lighting) has still some problem with brigthSight and dimSight, and some numeric value, but some PR are been committed to kandashi attention for solve these issues, so will wait for his review.
- [CommunityLighting](https://github.com/BlitzKraig/fvtt-CommunityLighting) is not been updated for foundryvtt 9 so is not advisable to used right now.

## Feature

### Add vision and lighting modification with ATE active effect

Add vision and lighting modification with ATE active effect, no token configuration is actually touched, everything is on the active effect management, the duration the remove, the adding, you can even merge the effect of two different kind of visions and lighting together

#### Add a button to the 'Token vision configuration' macro

On the hud config of the token you can see on the popout form a button 'Call macro preset' and 'Call macro custom', the are a embedded version of the macro [token_vision_config.js](https://github.com/foundry-vtt-community/macros/blob/main/token/token_vision_config.js) and  the variant with about time [token_vision_config_about_time.js](https://github.com/foundry-vtt-community/macros/blob/main/module-specific/token_vision_config_about_time.js)for make the work of the gm more fast when forget to set some vision.

I add two dialog panel one for put the preset one from the current supported system and one for put a custom preset, _no store of these custom is done_, if you want to store a custom lighting or vision just create a item and use [ATE](https://github.com/kandashi/Active-Token-Lighting).

**NOTE:** The custom dialog work with [CommunityLighting](https://github.com/BlitzKraig/fvtt-CommunityLighting) if is enabled and active it will show more options for animation type.



# Build

## Install all packages

```bash
npm install
```
## npm build scripts

### build

will build the code and copy all necessary assets into the dist folder and make a symlink to install the result into your foundry data; create a
`foundryconfig.json` file with your Foundry Data path.

```json
{
  "dataPath": "~/.local/share/FoundryVTT/"
}
```

`build` will build and set up a symlink between `dist` and your `dataPath`.

```bash
npm run-script build
```

### NOTE:

You don't need to build the `foundryconfig.json` file you can just copy the content of the `dist` folder on the module folder under `modules` of Foundry

### build:watch

`build:watch` will build and watch for changes, rebuilding automatically.

```bash
npm run-script build:watch
```

### clean

`clean` will remove all contents in the dist folder (but keeps the link from build:install).

```bash
npm run-script clean
```
### lint and lintfix

`lint` launch the eslint process based on the configuration [here](./.eslintrc)

```bash
npm run-script lint
```

`lintfix` launch the eslint process with the fix argument

```bash
npm run-script lintfix
```

### prettier-format

`prettier-format` launch the prettier plugin based on the configuration [here](./.prettierrc)

```bash
npm run-script prettier-format
```

### package

`package` generates a zip file containing the contents of the dist folder generated previously with the `build` command. Useful for those who want to manually load the module or want to create their own release

```bash
npm run-script package
```

## [Changelog](./changelog.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-lights-hud-ate/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

- [LightsHUD](https://github.com/Malekal4699/LightsHUD/): [THE BEER-WARE LICENSE (Revision 42)](https://github.com/Malekal4699/LightsHUD/blob/master/LICENSE.md)
- [TorchLight](https://github.com/PhilippeKr/TorchLight) : [???](https://github.com/PhilippeKr/TorchLight)
- [Torch](https://github.com/League-of-Foundry-Developers/Torch): [???](https://github.com/League-of-Foundry-Developers/Torch)
- []

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

## Acknowledgements

Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

Mad props to the 'League of Extraordinary FoundryVTT Developers' community which helped me figure out a lot.

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

- [LightsHUD](https://github.com/Malekal4699/LightsHUD/) ty to [Malekal4699](https://github.com/Malekal4699)
- [LightsHUD-Fork](https://github.com/Malekal4699/LightsHUD-Fork) ty to [Malekal4699](https://github.com/Malekal4699)
- [TorchLight](https://github.com/PhilippeKr/TorchLight) ty to [PhilippeKr](https://github.com/PhilippeKr)
- [Torch](https://github.com/League-of-Foundry-Developers/Torch) ty to [Lupestro](https://foundryvtt.com/community/lupestro)
- [Drop My Torch](https://gitlab.com/derekstucki/drop-my-torch) ty to [Derekstucki](https://gitlab.com/derekstucki)
