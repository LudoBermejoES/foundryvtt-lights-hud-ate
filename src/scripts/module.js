import { LightHUDAteNote } from "./lights-hud-ate-note.js";
import { setApi } from "../main.js";
import API from "./api.js";
import HandlebarHelpers from "./app/lights-hud-ate-handlebar-helpers.js";
import CONSTANTS from "./constants.js";
import "./hooks.js";
import "./lib/lib.js";
import { addLightsHUDButtons } from "./lights-hud-ate-config.js";
import { registerSocket } from "./socket.js";
export let aemlApiLigthsHudAte;
export const initHooks = async () => {
    // registerSettings();
    // registerLibwrappers();
    // registerHandlebarsHelpers();
    new HandlebarHelpers().registerHelpers();
    Hooks.once("socketlib.ready", registerSocket);
    registerSocket();
    // if (game.settings.get(CONSTANTS.MODULE_NAME, 'debugHooks')) {
    //   for (const hook of Object.values(HOOKS)) {
    //     if (typeof hook === 'string') {
    //       Hooks.on(hook, (...args) => debug(`Hook called: ${hook}`, ...args));
    //       debug(`Registered hook: ${hook}`);
    //     } else {
    //       for (const innerHook of Object.values(hook)) {
    //         Hooks.on(<string>innerHook, (...args) => debug(`Hook called: ${innerHook}`, ...args));
    //         debug(`Registered hook: ${innerHook}`);
    //       }
    //     }
    //   }
    // }
    // if (game.settings.get(CONSTANTS.MODULE_NAME, 'tempEffectsAsStatus')) {
    //   //@ts-ignore
    //   libWrapper.register(CONSTANTS.MODULE_NAME, 'TokenHUD.prototype._onToggleEffect', patchToggleEffect, 'MIXED');
    // }
};
export const setupHooks = async () => {
    //@ts-ignore
    aemlApiLigthsHudAte = game.modules.get("active-effect-manager-lib").api;
    aemlApiLigthsHudAte.effectInterface.initialize(CONSTANTS.MODULE_NAME);
    setApi(API);
};
export const readyHooks = async () => {
    // checkSystem();
    // registerHotkeys();
    // Hooks.callAll(HOOKS.READY);
    // Add any additional hooks if necessary
    // registerHUD();
    Hooks.on("renderTokenHUD", (app, html, data) => {
        module.renderTokenHUD(app, html, data);
    });
    Hooks.on("renderItemSheet", (app, html, data) => {
        module.renderItemSheet(app, html, data);
    });
};
const module = {
    async renderTokenHUD(...args) {
        const [app, html, data] = args;
        if (!app) {
            return;
        }
        if (game.settings.get(CONSTANTS.MODULE_NAME, "enableHud")) {
            if (game.settings.get(CONSTANTS.MODULE_NAME, "enableHudOnlyGM") && !game.user?.isGM) {
                // DO NOTHING
            }
            else {
                addLightsHUDButtons(app, html, data);
            }
        }
        // if (!app.object) {
        //   return;
        // }
        // if (game.settings.get(CONSTANTS.MODULE_NAME, 'tempEffectsAsStatus')) {
        //   const statusEffects = html.find('.status-effects');
        //   // filter out temporary effects from status icons
        //   const filteredEffects = app.object.actor.temporaryEffects.filter((effect) => {
        //     return !CONFIG.statusEffects.some((statusEffect) => statusEffect.id === effect.flags?.core?.statusId);
        //   });
        //   const newEffectIcons = `
        //   ${filteredEffects
        //     .map(
        //       (effect) =>
        //         `<img class="effect-control active"
        //         data-effect-uuid="${effect.uuid}"
        //         src="${effect.icon}"
        //         title="${effect.label}"
        //         data-status-id="${effect.uuid}" />`,
        //     )
        //     .join('')}
        //   `;
        //   statusEffects.append(newEffectIcons);
        // }
    },
    async renderItemSheet(...args) {
        const [app, html, data] = args;
        // TODO FOR NOW ONLY GM CAN SEE THIS
        if (game.user?.isGM) {
            if (game.settings.get(CONSTANTS.MODULE_NAME, "applyOnFlagItem") ||
                game.settings.get(CONSTANTS.MODULE_NAME, "applyOnATEItem")) {
                LightHUDAteNote._initEntityHook(app, html, data);
            }
        }
    },
};
