import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import { ActorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import CONSTANTS from './constants';
import { canvas, game } from './settings';

// =============================
// Module Generic function
// =============================

export function isGMConnected(): boolean {
  return Array.from(<Users>game.users).find((user) => user.isGM && user.active) ? true : false;
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, args = '') {
  if (game.settings.get(CONSTANTS.MODULE_NAME, 'debug')) {
    console.log(`DEBUG | ${CONSTANTS.MODULE_NAME} | ${msg}`, args);
  }
  return msg;
}

export function log(message) {
  message = `${CONSTANTS.MODULE_NAME} | ${message}`;
  console.log(message.replace('<br>', '\n'));
  return message;
}

export function notify(message) {
  message = `${CONSTANTS.MODULE_NAME} | ${message}`;
  ui.notifications?.notify(message);
  console.log(message.replace('<br>', '\n'));
  return message;
}

export function warn(warning, notify = false) {
  warning = `${CONSTANTS.MODULE_NAME} | ${warning}`;
  if (notify) ui.notifications?.warn(warning);
  console.warn(warning.replace('<br>', '\n'));
  return warning;
}

export function error(error, notify = true) {
  error = `${CONSTANTS.MODULE_NAME} | ${error}`;
  if (notify) ui.notifications?.error(error);
  return new Error(error.replace('<br>', '\n'));
}

export function timelog(message): void {
  warn(Date.now(), message);
}

export const i18n = (key: string): string => {
  return game.i18n.localize(key).trim();
};

export const i18nFormat = (key: string, data = {}): string => {
  return game.i18n.format(key, data).trim();
};

// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = 'fas fa-exclamation-triangle') {
  return `<p class="${CONSTANTS.MODULE_NAME}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">Item Piles</strong>
        <br><br>${message}
    </p>`;
}

// =============================
// Module Specific function
// =============================

export function registerHUD() {
  game.settings.registerMenu('LightsHUD', 'tokenHUDSettings', {
    name: game.i18n.localize('LightsHUD.settings.token-hud.Name'),
    hint: game.i18n.localize('LightsHUD.settings.token-hud.Hint'),
    scope: 'client',
    icon: 'fas fa-exchange-alt',
    type: TokenHUDSettings,
    restricted: false,
  });

  // Deprecated
  game.settings.register('LightsHUD', 'enableTokenHUD', {
    scope: 'client',
    config: false,
    type: Boolean,
    default: true,
  });

  // Deprecated
  game.settings.register('LightsHUD', 'alwaysShowHUD', {
    scope: 'client',
    config: false,
    type: Boolean,
    default: false,
  });

  // Deprecated
  game.settings.register('LightsHUD', 'HUDDisplayImage', {
    scope: 'client',
    config: false,
    type: Boolean,
    default: true,
  });

  // Deprecated
  game.settings.register('LightsHUD', 'HUDImageOpacity', {
    scope: 'client',
    config: false,
    range: {
      min: 0,
      max: 100,
      step: 1,
    },
    type: Number,
    default: 50,
  });

  game.settings.register('LightsHUD', 'hudSettings', {
    scope: 'client',
    config: false,
    type: Object,
    default: {
      enableSideMenu: game.settings.get('LightsHUD', 'enableTokenHUD'),
      displayAsImage: game.settings.get('LightsHUD', 'HUDDisplayImage'),
      imageOpacity: game.settings.get('LightsHUD', 'HUDImageOpacity'),
      alwaysShowButton: game.settings.get('LightsHUD', 'alwaysShowHUD'),
      updateActorImage: false,
      includeWildcard: true
    },
  });

  async function renderHudButton(hud, html, token) {
    renderHud(
      hud,
      html,
      token,
      '',
      doImageSearch,
      updateTokenImage,
      updateActorImage
    );
  }

  // Incorporating 'FVTT-TokenHUDWildcard' token hud button
  Hooks.on('renderTokenHUD', renderHudButton);
}
