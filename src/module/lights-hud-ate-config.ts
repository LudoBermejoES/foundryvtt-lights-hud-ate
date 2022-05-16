import type { TokenData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs';
import CONSTANTS from './constants';
import { error, info, retrieveItemLights, updateTokenLightingFromData, warn } from './lib/lib';
import {
  confirmDialogATLEffectItem,
  confirmDialogDropTheTorch,
  customATLDialog,
  presetDialog,
} from './lights-hud-ate-dialogs';
import { LightDataDialog, LightHUDNoteFlags } from './lights-hud-ate-models';

export function getATLEffectsFromItem(item: Item): ActiveEffect[] {
  // const atlChanges = effect.data.changes.filter((changes) =>
  //     changes.key.startsWith('ATL')
  // );
  const atlEffects =
    item.effects.filter((entity) => !!entity.data.changes.find((effect) => effect.key.includes('ATL'))) ?? [];
  return atlEffects;
}

export async function addLightsHUDButtons(app, html: JQuery<HTMLElement>, data) {
  if (
    !game.settings.get(CONSTANTS.MODULE_NAME, 'applyOnFlagItem') &&
    !game.settings.get(CONSTANTS.MODULE_NAME, 'applyOnATEItem')
  ) {
    error(`YOU MUST DECIDE OR LIGHTHUD WITH FLAGS OR LIGHTHUD WITH ATE EFFECTS !!!`, true);
    return;
  }

  const tokenInfoObject = app.object.data;
  // let tokenInfo = new tokenInformations(tokenInfoObject);
  const token = <Token>app.object;
  const tokenD = <TokenDocument>app.object.document;
  const actorId = <string>data.actorData._id || <string>data.actorId;
  const actor = <Actor>game.actors?.get(actorId);
  if (!actor) {
    info(`No actor id ${data.actorId} founded for the light hud`);
    return;
  }

  const tokenId = <string>tokenD.id;
  // const actorId = <string>actor.id;

  const imageDisplay = <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'imageDisplay');
  const imageOpacity = <number>game.settings.get(CONSTANTS.MODULE_NAME, 'imageOpacity') / 100;

  const isGM = game.user?.isGM;

  // ================================
  // OLD CODE
  //=================================

  const imagesParsed = await retrieveItemLights(token);

  const wildcardDisplay = await renderTemplate(`/modules/${CONSTANTS.MODULE_NAME}/templates/artSelect.hbs`, {
    tokenId,
    actorId,
    isGM,
    imagesParsed,
    imageDisplay,
    imageOpacity,
  });

  // const is080 = !isNewerVersion('0.8.0', <string>game.version);
  const settingHudColClass = <string>game.settings.get(CONSTANTS.MODULE_NAME, 'hudColumn') ?? 'left';
  const settingHudTopBottomClass = <string>game.settings.get(CONSTANTS.MODULE_NAME, 'hudTopBottom') ?? 'top';

  const buttonPos = '.' + settingHudColClass.toLowerCase();

  const col = html.find(buttonPos);
  if (settingHudTopBottomClass.toLowerCase() === 'top') {
    col.prepend(wildcardDisplay);
  } else {
    col.append(wildcardDisplay);
  }

  col
    // html
    // .find('div.right')
    // .append(wildcardDisplay)
    .click((event) => {
      let activeButton, clickedButton, tokenButton;
      for (const button of html.find('div.control-icon')) {
        if (button.classList.contains('active')) activeButton = button;
        if (button === event.target.parentElement) clickedButton = button;
        if (button.dataset.action === 'lights-hud-ate-selector') tokenButton = button;
      }

      if (clickedButton === tokenButton && activeButton !== tokenButton) {
        tokenButton.classList.add('active');
        if (settingHudColClass.toLowerCase() === 'left') {
          (<HTMLElement>html.find('.lights-hud-ate-selector-wrap')[0]).style.left = token.width + 150 + 'px';
        }

        (<HTMLElement>html.find('.lights-hud-ate-selector-wrap')[0]).classList.add('active');
        const effectSelector = '[data-action="effects"]'; //is080 ? '[data-action="effects"]' : '.effects';
        (<HTMLElement>html.find(`.control-icon${effectSelector}`)[0]).classList.remove('active');
        (<HTMLElement>html.find('.status-effects')[0]).classList.remove('active');
      } else {
        tokenButton.classList.remove('active');

        (<HTMLElement>html.find('.lights-hud-ate-selector-wrap')[0]).classList.remove('active');
      }
    });

  const buttons = html.find('.lights-hud-ate-button-select');
  const buttonMacroPreset = $(html.find('.lights-hud-ate-button-macro-preset'));
  const buttonMacroCustom = $(html.find('.lights-hud-ate-button-macro-custom'));

  buttons.map((button) => {
    buttons[button]?.addEventListener('click', async function (event) {
      event.preventDefault();
      event.stopPropagation();
      const buttonClick = event.button; // 0 left click

      const lightDataDialog = retrieveDataFromHtml(this);
      if (lightDataDialog) {
        confirmDialogATLEffectItem(lightDataDialog).render(true);
      }
    });
    buttons[button]?.addEventListener('contextmenu', async function (event) {
      event.preventDefault();
      event.stopPropagation();
      const buttonClick = event.button; // 0 left click

      const lightDataDialog = retrieveDataFromHtml(this);
      if (lightDataDialog) {
        confirmDialogDropTheTorch(lightDataDialog).render(true);
      }
    });
  });

  buttonMacroPreset.on('click', async function (event) {
    event.preventDefault();
    event.stopPropagation();
    const buttonClick = event.button; // 0 left click
    const actorId = <string>$(this).attr('data-actor-id');
    const tokenId = <string>$(this).attr('data-token-id');
    // A macro for the Foundry virtual tabletop that lets a user configure their token's vision and lighting settings.
    // This script is taken from Sky's foundry repo here: https://github.com/Sky-Captain-13/foundry/blob/master/scriptMacros/tokenVision.js.
    const applyChanges = false;
    presetDialog(applyChanges).render(true);
  });

  buttonMacroCustom.on('click', async function (event) {
    event.preventDefault();
    event.stopPropagation();
    const buttonClick = event.button; // 0 left click
    const actorId = <string>$(this).attr('data-actor-id');
    const tokenId = <string>$(this).attr('data-token-id');
    // A macro for the Foundry virtual tabletop that lets a user configure their token's vision and lighting settings.
    // This script is taken from Sky's foundry repo here: https://github.com/Sky-Captain-13/foundry/blob/master/scriptMacros/tokenVision.js.
    const applyChanges = false;
    //customDialog(applyChanges).render(true);
    customATLDialog(applyChanges).render(true);
  });
  // }
}

// ================================
// OLD CODE
//=================================

function retrieveDataFromHtml(html): LightDataDialog | undefined {
  const lightDataDialog = new LightDataDialog();

  if (game.settings.get(CONSTANTS.MODULE_NAME, 'imageDisplay')) {
    lightDataDialog.actorId = <string>$(html).find('.lights-hud-ate-button-image').attr('data-actor-id');
    lightDataDialog.tokenId = <string>$(html).find('.lights-hud-ate-button-image').attr('data-token-id');
    lightDataDialog.itemId = <string>$(html).find('.lights-hud-ate-button-image').attr('data-item-id');
    lightDataDialog.itemName = <string>$(html).find('.lights-hud-ate-button-image').attr('data-item-name');
    lightDataDialog.effectId = <string>$(html).find('.lights-hud-ate-button-image').attr('data-effect-id');
    lightDataDialog.effectName = <string>$(html).find('.lights-hud-ate-button-image').attr('data-effect-name');
    lightDataDialog.isApplied = <string>$(html).find('.lights-hud-ate-button-image').attr('data-applied') == 'true';
  } else {
    lightDataDialog.actorId = <string>$(html).find('.lights-hud-ate-button-image-text').attr('data-actor-id');
    lightDataDialog.tokenId = <string>$(html).find('.lights-hud-ate-button-image-text').attr('data-token-id');
    lightDataDialog.itemId = <string>$(html).find('.lights-hud-ate-button-image-text').attr('data-item-id');
    lightDataDialog.itemName = <string>$(html).find('.lights-hud-ate-button-image-text').attr('data-item-name');
    lightDataDialog.effectId = <string>$(html).find('.lights-hud-ate-button-image-text').attr('data-effect-id');
    lightDataDialog.effectName = <string>$(html).find('.lights-hud-ate-button-image-text').attr('data-effect-name');
    lightDataDialog.isApplied =
      <string>$(html).find('.lights-hud-ate-button-image-text').attr('data-applied') == 'true';
  }

  // NO NEED THIS CAN BE A FLAGGED ITEM
  // if (!lightDataDialog.effectId) {
  //   warn(`No active effect id ${lightDataDialog.effectId} founded for the light hud`, true);
  //   return;
  // }
  // NO NEED THIS CAN BE A ACTOR AE
  // if (!lightDataDialog.itemId) {
  //   warn(`No item id ${lightDataDialog.itemId} founded for the light hud`, true);
  //   return;
  // }

  if (!lightDataDialog.actorId) {
    warn(`No actor id ${lightDataDialog.actorId} founded for the light hud`, true);
    return;
  }

  const currentActor = game.actors?.get(lightDataDialog.actorId);
  if (!currentActor) {
    warn(`No actor founded with id ${lightDataDialog.actorId} for the light hud`, true);
    return;
  }

  const currentToken = canvas.tokens?.placeables?.find((t: Token) => t.id === lightDataDialog.tokenId);
  if (!currentToken) {
    warn(`No token founded with id ${lightDataDialog.tokenId} for the light hud`, true);
    return;
  }

  lightDataDialog.actorName = <string>currentActor.name;
  lightDataDialog.tokenName = <string>currentToken.name;
  return lightDataDialog;
}
