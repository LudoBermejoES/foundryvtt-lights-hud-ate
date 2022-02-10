import API from './api';
import CONSTANTS from './constants';
import EffectInterface from './effects/effect-interface';
import HOOKS from './hooks';
import { debug } from './lib/lib';
import { addLightsHUDButtons } from './lights-hud-config';
import { canvas, game } from './settings';
import { registerSocket } from './socket';

export const initHooks = async (): Promise<void> => {
  // LightsHUD.debug();
  // LightsHUD.clBanner();
  // registerSettings();

  // registerLibwrappers();

  Hooks.once('socketlib.ready', registerSocket);

  if (game.settings.get(CONSTANTS.MODULE_NAME, 'debugHooks')) {
    for (const hook of Object.values(HOOKS)) {
      if (typeof hook === 'string') {
        Hooks.on(hook, (...args) => debug(`Hook called: ${hook}`, ...args));
        debug(`Registered hook: ${hook}`);
      } else {
        for (const innerHook of Object.values(hook)) {
          Hooks.on(<string>innerHook, (...args) => debug(`Hook called: ${innerHook}`, ...args));
          debug(`Registered hook: ${innerHook}`);
        }
      }
    }
  }

  //@ts-ignore
  window.LightHUD = {
    API,
  };
};

export const setupHooks = async (): Promise<void> => {
  // setup all the hooks

  //@ts-ignore
  window.LightHUD.API.effectInterface = new EffectInterface(CONSTANTS.MODULE_NAME);
  //@ts-ignore
  window.LightHUD.API.effectInterface.initialize();

  if (game[CONSTANTS.MODULE_NAME]) {
    game[CONSTANTS.MODULE_NAME] = {};
  }
  if (game[CONSTANTS.MODULE_NAME].API) {
    game[CONSTANTS.MODULE_NAME].API = {};
  }
  //@ts-ignore
  game[CONSTANTS.MODULE_NAME].API = window.LightHUD.API;
};

export const readyHooks = async (): Promise<void> => {
  // checkSystem();
  // registerHotkeys();
  // Hooks.callAll(HOOKS.READY);

  // LightHUDPlaceableConfig.registerHooks();

  // Add any additional hooks if necessary

  // registerHUD();
  Hooks.on('renderTokenHUD', (app, html, data) => {
    addLightsHUDButtons(app, html, data);
  });
};
