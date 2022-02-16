# LightHUD+ATE

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/foundryvtt-lights-hud-ate/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) 

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Flights-hud-ate&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=lights-hud-ate) 

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-lights-hud-ate%2Fmaster%2Fsrc%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-lights-hud-ate%2Fmaster%2Fsrc%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Flights-hud-ate%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/lights-hud-ate/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/foundryvtt-lights-hud-ate/total?style=for-the-badge)

A Foundry VTT module that displays on the HUD config of the token all the available lighting items on the token/actor, with some [ATE](https://github.com/kandashi/Active-Token-Lighting) effect.

This project is born like a fusion of two other modules [LightsHUD](https://github.com/Malekal4699/LightsHUD/) and [ATE](https://github.com/kandashi/Active-Token-Lighting), but then i rewriting almost everything so is just a new module inspired form these other module. Remember to support these authors if you feel generous on their patreon or kofi account.

![imggif]()

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

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

### socketlib

This module uses the [socketlib](https://github.com/manuelVo/foundryvtt-socketlib) library for wrapping socket methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

### ATE (old ATL)

This module uses the [ATE](https://github.com/kandashi/Active-Token-Lighting) library for wrapping methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

## Suggested Modules

- [CommunityLighting](https://github.com/BlitzKraig/fvtt-CommunityLighting) (need to be updated for 9)
- [Times up](https://gitlab.com/tposney/times-up)
- [Dae](https://gitlab.com/tposney/dae)

## Compatibility Modules

- [Sense Walls Multisystem](https://github.com/p4535992/fvtt-sense-walls-multisystem/)
- [About Time](https://gitlab.com/tposney/about-time)

## Known Issue\Limitation

- **HELP WANTED** The token MUST BE LINKED TO A ACTOR,  if anyone can solve this let me know
- **HELP WANTED** This is just a "fast to make" module maybe someone a little more expert than me with form application and hud layer can do a better form for a better user experience
- [ATE](https://github.com/kandashi/Active-Token-Lighting) has still some problem with brigthSight and dimSight, and some numeric value, but some PR are been committed to kandashi attention for solve these issues, so will wait for his review.
- [CommunityLighting](https://github.com/BlitzKraig/fvtt-CommunityLighting) is not been updated for foundryvtt 9 so is not advisable to used right now.
- The modules is not smart enough to distinct multiple ligthing effect on the same item and is not make sense ? Every item must have only one effect with _ATL changes_ on it. If multiple effect with _ATL changes_ are founded on the same item only the first is analyzed from the module, you can use multiple item where each has is own lighting configuration.

## Supported Systems

- [Dnd5e](https://gitlab.com/foundrynet/dnd5e)
- [Pathfinder 2e](https://foundryvtt.com/packages/pf2e)

**How can i add my system ?** That's is pretty easy on the code level ty to the design pattern so i just need some information on the system rules and voilà.

## Feature

### Add a custom ATE Effect for customize vision and lighting on my game

This is already done from the [ATE](https://github.com/kandashi/Active-Token-Lighting) checkout the documentation on that module.

### Add vision and lighting modification with ATE active effect (the advisable way)

Add vision and lighting modification with ATE active effect, no token configuration is actually touched, everything is on the active effect management, the duration the remove, the adding, you can even merge the effect of two different kind of visions and lighting together.

The module is build to show on a hud panel all the item with some ATL effect applied on it, there is a distinction between passive, temporary, applied, need to be attuned or equipped condition (suppressed).

![img](./wiki/assets/tutorial_commented.png)

| Symbol | Description  |
|:----:|:----:|
|![exclamation-triangle-solid](./wiki/icons/exclamation-triangle-solid.svg) | The symbol of the **yellow exclamation triangle** means the active effect is _suppressed_ for some reason that you can delve into in the effects panel, usually _need to be attuned or equipped condition_ this does not prevent the effect from being active or not, only that it will result in the subcategory of inactive effects. |
|![eye-solid](./wiki/icons/eye-solid.svg) | The symbol of the **purple eye** means the active effect is _passive_ like a race feature or a special ability like darkvision, this does not prevent the effect from being active or not, only that it will result in the subcategory of inactive effects. |
|![hourglass-solid](./wiki/icons/hourglass-solid.svg) | The symbol of the **orange hourglass** means the active effect is _temporary_ like a spell valid only for tot. rounds or seconds, this is usually managed from the [About Time](https://gitlab.com/tposney/about-time) module if installed, this does not prevent the effect from being active or not, only that it will result in the subcategory of temporary effects. |
|![lightbulb-solid](./wiki/icons/lightbulb-solid.svg) | The symbol of the **green lightbulb** means the active effect is _enabled_ (or _applied_). |
|![lightbulb-regular](./wiki/icons/lightbulb-regular.svg) | The symbol of the **red lightbulb** means the active effect is _disabled_ (or _not applied_). |

### Add a button to the 'Token vision configuration' macro (for everyone need to be just fast and not perfect)

On the hud config of the token you can see on the popout form a button 'Call macro preset' and 'Call macro custom', the are a embedded version of the macro [token_vision_config.js](https://github.com/foundry-vtt-community/macros/blob/main/token/token_vision_config.js) and  the variant with about time [token_vision_config_about_time.js](https://github.com/foundry-vtt-community/macros/blob/main/module-specific/token_vision_config_about_time.js)for make the work of the gm more fast when forget to set some vision.

I add two dialog panel one for put the preset one from the current supported system and one for put a custom preset, _no store of these custom is done_, if you want to store a custom lighting or vision just create a item and use [ATE](https://github.com/kandashi/Active-Token-Lighting).

**NOTE:** You can still apply the custom vision and light like a new active effect by checking the checkbox _Apply as ATE/ATL Effect_.

**NOTE:** The custom dialog work with [CommunityLighting](https://github.com/BlitzKraig/fvtt-CommunityLighting) if is enabled and active it will show more options for animation type.

**NOTE:** This is useful for fast configuration during the game, but is advisable to always use items with ATL changes on it.

## How can i contribute 

Anyone can contribute with a custom lighting and vision item, you just need to export the item you created with the ATL effect on it and i will create a compendium, or better open a PR on the official [ATE](https://github.com/kandashi/Active-Token-Lighting) compendium.

![img](./wiki/assets/community_compendium.png)

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
- [Image dropdown](https://github.com/marghoobsuleman/ms-Dropdown) with [MIT](https://github.com/marghoobsuleman/ms-Dropdown/blob/master/MIT-LICENSE.txt)
- Some icons are retrieve from the [Dnd5e system](https://gitlab.com/foundrynet/dnd5e) with [MIT](https://gitlab.com/foundrynet/dnd5e/-/blob/master/LICENSE.txt)
- Some icons are retrieve from the [Pf2 system](https://gitlab.com/hooking/foundry-vtt---pathfinder-2e/) with [GPLv2](https://gitlab.com/hooking/foundry-vtt---pathfinder-2e/-/blob/master/LICENSE)

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
- The dropdown with image is build with [Image dropdown](https://github.com/marghoobsuleman/ms-Dropdown)
