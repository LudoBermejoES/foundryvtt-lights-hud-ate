import CONSTANTS from './constants';
import { i18n } from './lib/lib';

export const game = getGame();
export const canvas = getCanvas();

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
function getCanvas(): Canvas {
  if (!(canvas instanceof Canvas) || !canvas.ready) {
    throw new Error('Canvas Is Not Initialized');
  }
  return canvas;
}

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
function getGame(): Game {
  if (!(game instanceof Game)) {
    throw new Error('Game Is Not Initialized');
  }
  return game;
}

export const registerSettings = function (): void {
  // ============================================================
  // OLD SETTINGS TO REMOVE PROBABLY
  // ===========================================================

  game.settings.register(CONSTANTS.MODULE_NAME, 'position', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.position.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.position.hint`),
    scope: 'world',
    config: true,
    type: String,
    default: 'left',
    choices: {
      left: i18n(`${CONSTANTS.MODULE_NAME}.position.left`),
      right: i18n(`${CONSTANTS.MODULE_NAME}.position.right`),
      top: i18n(`${CONSTANTS.MODULE_NAME}.position.top`),
      bottom: i18n(`${CONSTANTS.MODULE_NAME}.position.bottom`),
    },
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'playerActivation', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.playerActivation.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.playerActivation.hint`),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

  // game.settings.register(CONSTANTS.MODULE_NAME, 'checkAvailability', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.checkAvailability.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.checkAvailability.hint`),
  //   scope: 'world',
  //   config: true,
  //   default: false,
  //   type: Boolean,
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'consumeItem', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.consumeItem.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.consumeItem.hint`),
  //   scope: 'world',
  //   config: true,
  //   default: false,
  //   type: Boolean,
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'torchType.nameConsumableTorch', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.torchType.nameConsumableTorch.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.torchType.nameConsumableTorch.hint`),
  //   scope: 'world',
  //   config: true,
  //   default: 'Torch',
  //   type: String,
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'lanternType.nameConsumableLantern', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.nameConsumableLantern.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.nameConsumableLantern.hint`),
  //   scope: 'world',
  //   config: true,
  //   default: 'Oil (flask)',
  //   type: String,
  // });

  // // Light Parameters
  // game.settings.register(CONSTANTS.MODULE_NAME, 'lightBrightRadius', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lightBrightRadius.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lightBrightRadius.hint`),
  //   scope: 'world',
  //   config: true,
  //   default: 20,
  //   type: Number,
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'lightDimRadius', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lightDimRadius.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lightDimRadius.hint`),
  //   scope: 'world',
  //   config: true,
  //   default: 40,
  //   type: Number,
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'lightType', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lightType.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lightType.hint`),
  //   scope: 'world',
  //   config: true,
  //   type: String,
  //   default: 'Type1',
  //   choices: {
  //     Type0: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type0`),
  //     Type1: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type1`),
  //     Type2: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type2`),
  //     Type3: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type3`),
  //     Type4: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type4`),
  //     Type5: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type5`),
  //     Type6: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type6`),
  //     Type7: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type7`),
  //     Type8: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type8`),
  //     Type9: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type9`),
  //     Type10: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type10`),
  //     Type11: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type11`),
  //     Type12: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type12`),
  //     Type13: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type13`),
  //     Type14: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type14`),
  //     Type15: i18n(`${CONSTANTS.MODULE_NAME}.lightType.type15`),
  //     TypeC: i18n(`${CONSTANTS.MODULE_NAME}.lightType.typeC`),
  //   },
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customLightColor', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lightType.customColor.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lightType.customColor.hint`),
  //   scope: 'world',
  //   config: true,
  //   restricted: false,
  //   type: String,
  //   default: '#a2642a',
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customLightColorIntensity', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lightType.customIntensity.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lightType.customIntensity.hint`),
  //   scope: 'world',
  //   config: true,
  //   restricted: true,
  //   type: Number,
  //   default: 0.5,
  //   range: {
  //     min: 0.0,
  //     step: 0.05,
  //     max: 1,
  //   },
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customlight.animationType', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lightType.customAnimationType.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lightType.customAnimationType.hint`),
  //   scope: 'world',
  //   config: true,
  //   type: String,
  //   default: 'none',
  //   choices: {
  //     none: i18n(`${CONSTANTS.MODULE_NAME}.animationType.none`),
  //     torch: i18n(`${CONSTANTS.MODULE_NAME}.animationType.torch`),
  //     pulse: i18n(`${CONSTANTS.MODULE_NAME}.animationType.pulse`),
  //     chroma: i18n(`${CONSTANTS.MODULE_NAME}.animationType.chroma`),
  //     wave: i18n(`${CONSTANTS.MODULE_NAME}.animationType.wave`),
  //     fog: i18n(`${CONSTANTS.MODULE_NAME}.animationType.fog`),
  //     sunburst: i18n(`${CONSTANTS.MODULE_NAME}.animationType.sunburst`),
  //     dome: i18n(`${CONSTANTS.MODULE_NAME}.animationType.dome`),
  //     emanation: i18n(`${CONSTANTS.MODULE_NAME}.animationType.emanation`),
  //     hexa: i18n(`${CONSTANTS.MODULE_NAME}.animationType.hexa`),
  //     ghost: i18n(`${CONSTANTS.MODULE_NAME}.animationType.ghost`),
  //     energy: i18n(`${CONSTANTS.MODULE_NAME}.animationType.energy`),
  //     roiling: i18n(`${CONSTANTS.MODULE_NAME}.animationType.roiling`),
  //     hole: i18n(`${CONSTANTS.MODULE_NAME}.animationType.hole`),
  //   },
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customlight.animationSpeed', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lightType.customAnimationSpeed.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lightType.customAnimationSpeed.hint`),
  //   scope: 'world',
  //   config: true,
  //   restricted: true,
  //   type: Number,
  //   default: 5,
  //   range: {
  //     min: 1,
  //     step: 1,
  //     max: 10,
  //   },
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customlight.animationIntensity', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lightType.customAnimationIntensity.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lightType.customAnimationIntensity.hint`),
  //   scope: 'world',
  //   config: true,
  //   restricted: true,
  //   type: Number,
  //   default: 5,
  //   range: {
  //     min: 1,
  //     step: 1,
  //     max: 10,
  //   },
  // });
  // // Lantern Parameters
  // game.settings.register(CONSTANTS.MODULE_NAME, 'lanternBrightRadius', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lanternBrightRadius.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lanternBrightRadius.hint`),
  //   scope: 'world',
  //   config: true,
  //   default: 20,
  //   type: Number,
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'lanternDimRadius', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lanternDimRadius.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lanternDimRadius.hint`),
  //   scope: 'world',
  //   config: true,
  //   default: 40,
  //   type: Number,
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'lanternType', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.hint`),
  //   scope: 'world',
  //   config: true,
  //   type: String,
  //   default: 'Type1',
  //   choices: {
  //     Type0: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.type0`),
  //     Type1: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.type1`),
  //     Type2: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.type2`),
  //     Type3: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.type3`),
  //     Type4: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.type4`),
  //     Type5: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.type5`),
  //     Type6: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.type6`),
  //     Type7: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.type7`),
  //     Type8: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.type8`),
  //     Type9: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.type9`),
  //     TypeC: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.typeC`),
  //   },
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customLanternColor', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.customColor.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.customColor.hint`),
  //   scope: 'world',
  //   config: true,
  //   restricted: false,
  //   type: String,
  //   default: '#a2642a',
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customLanternColorIntensity', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.customIntensity.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.customIntensity.hint`),
  //   scope: 'world',
  //   config: true,
  //   restricted: true,
  //   type: Number,
  //   default: 0.5,
  //   range: {
  //     min: 0.0,
  //     step: 0.05,
  //     max: 1,
  //   },
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customLanternAnimationType', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.customAnimationType.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.customAnimationType.hint`),
  //   scope: 'world',
  //   config: true,
  //   type: String,
  //   default: 'none',
  //   choices: {
  //     none: i18n(`${CONSTANTS.MODULE_NAME}.animationType.none`),
  //     torch: i18n(`${CONSTANTS.MODULE_NAME}.animationType.torch`),
  //     pulse: i18n(`${CONSTANTS.MODULE_NAME}.animationType.pulse`),
  //     chroma: i18n(`${CONSTANTS.MODULE_NAME}.animationType.chroma`),
  //     wave: i18n(`${CONSTANTS.MODULE_NAME}.animationType.wave`),
  //     fog: i18n(`${CONSTANTS.MODULE_NAME}.animationType.fog`),
  //     sunburst: i18n(`${CONSTANTS.MODULE_NAME}.animationType.sunburst`),
  //     dome: i18n(`${CONSTANTS.MODULE_NAME}.animationType.dome`),
  //     emanation: i18n(`${CONSTANTS.MODULE_NAME}.animationType.emanation`),
  //     hexa: i18n(`${CONSTANTS.MODULE_NAME}.animationType.hexa`),
  //     ghost: i18n(`${CONSTANTS.MODULE_NAME}.animationType.ghost`),
  //     energy: i18n(`${CONSTANTS.MODULE_NAME}.animationType.energy`),
  //     roiling: i18n(`${CONSTANTS.MODULE_NAME}.animationType.roiling`),
  //     hole: i18n(`${CONSTANTS.MODULE_NAME}.animationType.hole`),
  //   },
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customLanternAnimationSpeed', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.customAnimationSpeed.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.customAnimationSpeed.hint`),
  //   scope: 'world',
  //   config: true,
  //   restricted: true,
  //   type: Number,
  //   default: 5,
  //   range: {
  //     min: 1,
  //     step: 1,
  //     max: 10,
  //   },
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customLanternAnimationIntensity', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.customAnimationIntensity.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.lanternType.customAnimationIntensity.hint`),
  //   scope: 'world',
  //   config: true,
  //   restricted: true,
  //   type: Number,
  //   default: 5,
  //   range: {
  //     min: 1,
  //     step: 1,
  //     max: 10,
  //   },
  // });
  // // Torch Parameters
  // game.settings.register(CONSTANTS.MODULE_NAME, 'torchBrightRadius', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.torchBrightRadius.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.torchBrightRadius.hint`),
  //   scope: 'world',
  //   config: true,
  //   default: 20,
  //   type: Number,
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'torchDimRadius', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.torchDimRadius.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.torchDimRadius.hint`),
  //   scope: 'world',
  //   config: true,
  //   default: 40,
  //   type: Number,
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'torchType', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.torchType.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.torchType.hint`),
  //   scope: 'world',
  //   config: true,
  //   type: String,
  //   default: 'Type1',
  //   choices: {
  //     Type0: i18n(`${CONSTANTS.MODULE_NAME}.torchType.type0`),
  //     Type1: i18n(`${CONSTANTS.MODULE_NAME}.torchType.type1`),
  //     Type2: i18n(`${CONSTANTS.MODULE_NAME}.torchType.type2`),
  //     Type3: i18n(`${CONSTANTS.MODULE_NAME}.torchType.type3`),
  //     Type4: i18n(`${CONSTANTS.MODULE_NAME}.torchType.type4`),
  //     Type5: i18n(`${CONSTANTS.MODULE_NAME}.torchType.type5`),
  //     Type6: i18n(`${CONSTANTS.MODULE_NAME}.torchType.type6`),
  //     Type7: i18n(`${CONSTANTS.MODULE_NAME}.torchType.type7`),
  //     Type8: i18n(`${CONSTANTS.MODULE_NAME}.torchType.type8`),
  //     Type9: i18n(`${CONSTANTS.MODULE_NAME}.torchType.type9`),
  //     TypeC: i18n(`${CONSTANTS.MODULE_NAME}.torchType.typeC`),
  //   },
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customTorchColor', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.torchType.customColor.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.torchType.customColor.hint`),
  //   scope: 'world',
  //   config: true,
  //   restricted: false,
  //   type: String,
  //   default: '#a2642a',
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customTorchColorIntensity', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.torchType.customIntensity.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.torchType.customIntensity.hint`),
  //   scope: 'world',
  //   config: true,
  //   restricted: true,
  //   type: Number,
  //   default: 0.5,
  //   range: {
  //     min: 0.0,
  //     step: 0.05,
  //     max: 1,
  //   },
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customTorchAnimationType', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.torchType.customAnimationType.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.torchType.customAnimationType.hint`),
  //   scope: 'world',
  //   config: true,
  //   type: String,
  //   default: 'none',
  //   choices: {
  //     none: i18n(`${CONSTANTS.MODULE_NAME}.animationType.none`),
  //     torch: i18n(`${CONSTANTS.MODULE_NAME}.animationType.torch`),
  //     pulse: i18n(`${CONSTANTS.MODULE_NAME}.animationType.pulse`),
  //     chroma: i18n(`${CONSTANTS.MODULE_NAME}.animationType.chroma`),
  //     wave: i18n(`${CONSTANTS.MODULE_NAME}.animationType.wave`),
  //     fog: i18n(`${CONSTANTS.MODULE_NAME}.animationType.fog`),
  //     sunburst: i18n(`${CONSTANTS.MODULE_NAME}.animationType.sunburst`),
  //     dome: i18n(`${CONSTANTS.MODULE_NAME}.animationType.dome`),
  //     emanation: i18n(`${CONSTANTS.MODULE_NAME}.animationType.emanation`),
  //     hexa: i18n(`${CONSTANTS.MODULE_NAME}.animationType.hexa`),
  //     ghost: i18n(`${CONSTANTS.MODULE_NAME}.animationType.ghost`),
  //     energy: i18n(`${CONSTANTS.MODULE_NAME}.animationType.energy`),
  //     roiling: i18n(`${CONSTANTS.MODULE_NAME}.animationType.roiling`),
  //     hole: i18n(`${CONSTANTS.MODULE_NAME}.animationType.hole`),
  //   },
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customTorchAnimationSpeed', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.torchType.customAnimationSpeed.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.torchType.customAnimationSpeed.hint`),
  //   scope: 'world',
  //   config: true,
  //   restricted: true,
  //   type: Number,
  //   default: 5,
  //   range: {
  //     min: 1,
  //     step: 1,
  //     max: 10,
  //   },
  // });
  // game.settings.register(CONSTANTS.MODULE_NAME, 'customTorchAnimationIntensity', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.torchType.customAnimationIntensity.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.torchType.customAnimationIntensity.hint`),
  //   scope: 'world',
  //   config: true,
  //   restricted: true,
  //   type: Number,
  //   default: 5,
  //   range: {
  //     min: 1,
  //     step: 1,
  //     max: 10,
  //   },
  // });

  // game.settings.register(CONSTANTS.MODULE_NAME, 'debug', {
  //   name: 'Debug',
  //   hint: 'Enable Debug.',
  //   scope: 'world',
  //   config: true,
  //   restricted: true,
  //   type: Boolean,
  //   default: false,
  // });

  // ==========================================================
  // ADDITIONAL
  // ==========================================================

  // game.settings.registerMenu(CONSTANTS.MODULE_NAME, 'tokenHUDSettings', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.settings.token-hud.Name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.settings.token-hud.Hint`),
  //   scope: 'client',
  //   icon: 'fas fa-exchange-alt',
  //   type: TokenHUDSettings,
  //   restricted: false,
  // });

  // Deprecated
  // game.settings.register(CONSTANTS.MODULE_NAME, 'enableTokenHUD', {
  //   name: i18n(`${CONSTANTS.MODULE_NAME}.settings.enableTokenHUD.name`),
  //   hint: i18n(`${CONSTANTS.MODULE_NAME}.settings.enableTokenHUD.hint`),
  //   scope: 'client',
  //   config: false,
  //   type: Boolean,
  //   default: true,
  // });

  // Deprecated
  game.settings.register(CONSTANTS.MODULE_NAME, 'alwaysShowHUD', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settings.token-hud.Name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settings.token-hud.Hint`),
    scope: 'client',
    config: false,
    type: Boolean,
    default: false,
  });

  // Deprecated
  game.settings.register(CONSTANTS.MODULE_NAME, 'HUDDisplayImage', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settings.HUDDisplayImage.Name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settings.HUDDisplayImage.Hint`),
    scope: 'client',
    config: false,
    type: Boolean,
    default: true,
  });

  // Deprecated
  game.settings.register(CONSTANTS.MODULE_NAME, 'HUDImageOpacity', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settings.HUDImageOpacity.Name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settings.HUDImageOpacity.Hint`),
    scope: 'client',
    config: false,
    //@ts-ignore
    range: {
      min: 0,
      max: 100,
      step: 1,
    },
    type: Number,
    default: 50,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'hudSettings', {
    scope: 'client',
    config: false,
    type: Object,
    default: <Object>{
      enableSideMenu: game.settings.get(CONSTANTS.MODULE_NAME, 'enableTokenHUD'),
      displayAsImage: <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'HUDDisplayImage'),
      imageOpacity: <number>game.settings.get(CONSTANTS.MODULE_NAME, 'HUDImageOpacity'),
      alwaysShowButton: <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'alwaysShowHUD'),
      updateActorImage: false,
      includeWildcard: true,
    },
  });
};
