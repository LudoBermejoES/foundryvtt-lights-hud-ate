import API from './api';
import CONSTANTS from './constants';
import EffectInterface from './effects/effect-interface';
import HOOKS from './hooks';
import { debug } from './lib/lib';
import { addLightsHUDButtons } from './lights-hud-ate-config';
import { canvas, game } from './settings';
import { registerSocket } from './socket';

export const initHooks = async (): Promise<void> => {
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
  window.LightHudAte = {
    API,
  };
};

export const setupHooks = async (): Promise<void> => {
  // setup all the hooks

  //@ts-ignore
  window.LightHudAte.API.effectInterface = new EffectInterface(CONSTANTS.MODULE_NAME);
  //@ts-ignore
  window.LightHudAte.API.effectInterface.initialize();

  if (game[CONSTANTS.MODULE_NAME]) {
    game[CONSTANTS.MODULE_NAME] = {};
  }
  if (game[CONSTANTS.MODULE_NAME].API) {
    game[CONSTANTS.MODULE_NAME].API = {};
  }
  //@ts-ignore
  game[CONSTANTS.MODULE_NAME].API = window.LightHudAte.API;
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

    // Adjustable vision
    // let tokenHUDButton = GetTokenHUDButtonHTML(data._id);
    // const tokenId = <string>data._id;
    // const token = <Token>canvas.tokens?.controlled.find(t => t.data._id == tokenId);
    // const tokenHUDButtonTemplate = $(`<div class="control-icon avtoggle"><i class="lights-hud-ate-adjustableVision-eye"></i></div>`);
    // const $tokenHUDButton = tokenHUDButtonTemplate;
    // $tokenHUDButton.toggleClass("active", <boolean>token.data.document?.getFlag(CONSTANTS.MODULE_NAME, LightHUDFlags.useAltVision) || false);
    // const tokenHUDButton = $tokenHUDButton
    // html.find(".col.left").prepend(tokenHUDButton);

    // html.find(".col.left").on("click", ".control-icon.avtoggle", (event) => {
    //   //TokenHUDButtonOnClick(data._id, tokenHUDButton)
    //   const selected = !token.data.document?.getFlag(CONSTANTS.MODULE_NAME, LightHUDFlags.useAltVision);

    //   //ToggleTokenHUDActive(selected);
    //   $('.lights-hud-ate-adjustableVision-eye').parent().toggleClass("active", selected);
    //   token.document.setFlag(CONSTANTS.MODULE_NAME, LightHUDFlags.useAltVision, selected);
    // });
  },
};
