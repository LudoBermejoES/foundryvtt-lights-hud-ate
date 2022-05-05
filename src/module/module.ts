import { LightHUDAteNote } from './lights-hud-ate-note';
import { getApi, setApi } from '../main';
import API from './api';
import HandlebarHelpers from './app/lights-hud-ate-handlebar-helpers';
import CONSTANTS from './constants';
import EffectInterface from './effects/effect-interface';
import HOOKS from './hooks';
import { debug } from './lib/lib';
import { addLightsHUDButtons } from './lights-hud-ate-config';
import { registerSocket } from './socket';

export const initHooks = async (): Promise<void> => {
  // registerSettings();

  // registerLibwrappers();
  // registerHandlebarsHelpers();
  new HandlebarHelpers().registerHelpers();

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
};

export const setupHooks = async (): Promise<void> => {
  // setup all the hooks
  API.effectInterface = new EffectInterface(CONSTANTS.MODULE_NAME) as unknown as typeof EffectInterface;
  //@ts-ignore
  API.effectInterface.initialize();
  setApi(API);
};

export const readyHooks = async (): Promise<void> => {
  // checkSystem();
  // registerHotkeys();
  // Hooks.callAll(HOOKS.READY);

  // Add any additional hooks if necessary

  // registerHUD();
  Hooks.on('renderTokenHUD', (app, html, data) => {
    module.renderTokenHUD(app, html, data);
  });

  Hooks.on('renderItemSheet', (app, html, data) => {
    module.renderItemSheet(app, html, data);
  });
};

const module = {
  async renderTokenHUD(...args) {
    const [app, html, data] = args;
    // TODO WE NEED THIS
    // if (!game.user?.isGM) {
    //   return;
    // }
    // if (!game.settings.get(CONSTANTS.MODULE_NAME, 'enableHud')) {
    //   return;
    // }
    addLightsHUDButtons(app, html, data);
  },
  async renderItemSheet(...args) {
    const [app, html, data] = args;
    // TODO FOR NOW ONLY GM CAN SEE THIS
    if (game.user?.isGM) {
      LightHUDAteNote._initEntityHook(app, html, data);
    }
  },
};
