import CONSTANTS from './constants';
import EffectInterface from './effects/effect-interface';
import { registerHUD } from './lib';
import { canvas, game } from './settings';

export const initHooks = async (): Promise<void> => {
  // LightsHUD.debug();
  // LightsHUD.clBanner();
  // registerSettings();

  // registerLibwrappers();
  // TODO impplement socketLib
  // Hooks.once('socketlib.ready', registerSocket);

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

  Hooks.on('ready', () => {
    Hooks.on('renderTokenHUD', (app, html, data) => {
      LightsHUD.addLightsHUDButtons(app, html, data);
    });
    Hooks.on('renderControlsReference', (app, html, data) => {
      html
        .find('div')
        .first()
        .append(
          '<h3>LightsHUD</h3><ol class="hotkey-list"><li><h4>' +
            game.i18n.localize('LightsHUD.turnOffAllLights') +
            '</h4><div class="keys">' +
            game.i18n.localize('LightsHUD.holdCtrlOnClick') +
            '</div></li></ol>',
        );
    });
    game.socket.on('module.torch', (request) => {
      LightsHUD.handleSocketRequest(request);
    });
  });

  registerHUD();
};
