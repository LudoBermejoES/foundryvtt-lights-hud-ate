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

  // game.settings.registerMenu(CONSTANTS.MODULE_NAME, 'tokenHUDSettings', {
  //   name: game.i18n.localize('LightsHUD.settings.token-hud.Name'),
  //   hint: game.i18n.localize('LightsHUD.settings.token-hud.Hint'),
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
    default: {
      enableSideMenu: game.settings.get(CONSTANTS.MODULE_NAME, 'enableTokenHUD'),
      displayAsImage: game.settings.get(CONSTANTS.MODULE_NAME, 'HUDDisplayImage'),
      imageOpacity: game.settings.get(CONSTANTS.MODULE_NAME, 'HUDImageOpacity'),
      alwaysShowButton: game.settings.get(CONSTANTS.MODULE_NAME, 'alwaysShowHUD'),
      updateActorImage: false,
      includeWildcard: true
    },
  });
};
