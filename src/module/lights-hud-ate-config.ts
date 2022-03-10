import { TokenData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import API from './api';
import EffectsPanelApp from './app/lights-hud-ate-effects-panel-app';
import CONSTANTS from './constants';
import Effect from './effects/effect';
import EffectInterface from './effects/effect-interface';
import {
  checkString,
  dialogWarning,
  i18n,
  i18nFormat,
  info,
  isStringEquals,
  prepareTokenDataDropTheTorch,
  retrieveItemLights,
  rollDependingOnSystem,
  updateTokenLighting,
  warn,
} from './lib/lib';
import {
  confirmDialogATLEffectItem,
  confirmDialogDropTheTorch,
  customATLDialog,
  presetDialog,
} from './lights-hud-ate-dialogs';
import {
  LightDataHud,
  VisionHUDElement,
  VisionHUDPreset,
  LightHUDPreset,
  LightHUDElement,
  LightDataDialog,
} from './lights-hud-ate-models';
import { canvas, game } from './settings';

export function getATLEffectsFromItem(item: Item): ActiveEffect[] {
  // const atlChanges = effect.data.changes.filter((changes) =>
  //     changes.key.startsWith('ATL')
  // );
  const atlEffects =
    item.effects.filter((entity) => !!entity.data.changes.find((effect) => effect.key.includes('ATL'))) ?? [];
  return atlEffects;
}

export async function addLightsHUDButtons(app, html, data) {
  const tokenInfoObject = app.object.data;
  // let tokenInfo = new tokenInformations(tokenInfoObject);
  const token = <Token>app.object;
  const tokenD = <TokenDocument>app.object.document;
  const actor = <Actor>game.actors?.get(data.actorId);
  if (!actor) {
    info(`No actor id ${data.actorId} founded for the light hud`);
    return;
  }

  const tokenId = <string>tokenD.id;
  const actorId = <string>actor.id;

  const imageDisplay = <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'imageDisplay');
  const imageOpacity = <number>game.settings.get(CONSTANTS.MODULE_NAME, 'imageOpacity') / 100;

  const isGM = game.user?.isGM;

  // const lightItems: Item[] = [];
  // //const physicalItems = ['weapon', 'equipment', 'consumable', 'tool', 'backpack', 'loot'];
  // // const spellsItems = ['spell','feat'];
  // // For every itemwith a ATL/ATE effect
  // actor.data.items.contents.forEach((im: Item) => {
  //   // if (im && physicalItems.includes(im.type)) {}
  //   const atlEffects = im.effects.filter((entity) => {
  //     return entity.data.changes.find((effect) => effect.key.includes('ATL')) != undefined;
  //   });
  //   if (atlEffects.length > 0) {
  //     lightItems.push(im);
  //   }
  // });

  // // Convert item to LightHudData
  // const imagesParsed = await Promise.all(
  //   lightItems.map(async (item: Item) => {
  //     const im = <string>item.img;
  //     const split = im.split('/');
  //     const extensions = im.split('.');
  //     const extension = extensions[extensions.length - 1];
  //     const img = ['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(extension);
  //     const vid = ['webm', 'mp4', 'm4v'].includes(extension);
  //     // TODO for now we check if at least one active effect has the atl/ate changes on him
  //     const aeAtl = <ActiveEffect[]>getATLEffectsFromItem(item) || [];
  //     let appliedTmp = false;
  //     let disabledTmp = false;
  //     let suppressedTmp = false;
  //     let temporaryTmp = false;
  //     let passiveTmp = false;
  //     let effectidTmp = '';
  //     let effectnameTmp = '';
  //     let turnsTmp = 0;
  //     let isExpiredTmp = false;
  //     if (aeAtl.length > 0) {
  //       const nameToSearch = <string>aeAtl[0].name || aeAtl[0].data.label;
  //       // const effectFromActor = <ActiveEffect>await API.findEffectByNameOnActor(<string>actor.id, nameToSearch);
  //       let effectFromActor = <ActiveEffect>actor.data.effects.find((ae: ActiveEffect) => {
  //         return isStringEquals(nameToSearch, ae.data.label);
  //       });
  //       if (!effectFromActor) {
  //         info(`No active effect found on token ${token.name} with name ${nameToSearch}`);
  //         aeAtl[0].data.transfer = false;
  //         await API.addActiveEffectOnToken(<string>tokenD.id, aeAtl[0]);
  //         // ???
  //         effectFromActor = <ActiveEffect>tokenD.actor?.data.effects.find((ae: ActiveEffect) => {
  //           return isStringEquals(nameToSearch, ae.data.label);
  //         });
  //       }
  //       const applied = await API.hasEffectAppliedOnToken(<string>tokenD.id, nameToSearch, true);
  //       // If the active effect is disabled or is supressed
  //       // const isDisabled = aeAtl[0].data.disabled || false;
  //       // const isSuppressed = aeAtl[0].data.document.isSuppressed || false;
  //       disabledTmp = effectFromActor.data.disabled || false;
  //       //@ts-ignore
  //       suppressedTmp = effectFromActor.data.document.isSuppressed || false;
  //       temporaryTmp = effectFromActor.isTemporary || false;
  //       passiveTmp = !temporaryTmp;
  //       if (applied && !disabledTmp && !suppressedTmp) {
  //         appliedTmp = true;
  //       }
  //       effectidTmp = <string>effectFromActor.id;
  //       effectnameTmp = <string>effectFromActor.name ?? effectFromActor.data.label;
  //       // ADDED
  //       const remainingSeconds = _getSecondsRemaining(effectFromActor.data.duration);
  //       turnsTmp = <number>effectFromActor.data.duration.turns;
  //       isExpiredTmp = remainingSeconds < 0;
  //     }
  //     if (!suppressedTmp) {
  //       appliedTmp = appliedTmp || (passiveTmp && !disabledTmp);
  //     } else {
  //       appliedTmp = !appliedTmp;
  //     }

  //     if (aeAtl.length > 0 && !effectidTmp) {
  //       warn(`No ATL active effect found on actor ${token.name} from item ${item.name}`,true);
  //     }

  //     return <LightDataHud>{
  //       route: im,
  //       name: item.name,
  //       applied: appliedTmp,
  //       disabled: disabledTmp,
  //       suppressed: suppressedTmp,
  //       isTemporary: temporaryTmp,
  //       passive: passiveTmp,
  //       img: img,
  //       vid: vid,
  //       type: img || vid,
  //       itemid: item.id,
  //       itemname: item.name,
  //       effectid: effectidTmp,
  //       effectname: effectnameTmp,
  //       turns:turnsTmp,
  //       isExpired:isExpiredTmp
  //     };
  //   }),
  // );

  if (!game.settings.get(CONSTANTS.MODULE_NAME, 'useBasicPanelEffects')) {
    const imagesParsed = await retrieveItemLights(actor, tokenD);
    const effectsPanelApp = new EffectsPanelApp(imagesParsed);
    //await effectsPanelApp.init(actor, tokenD);
    effectsPanelApp.render(true);
  } else {
    // ================================
    // OLD CODE
    //=================================

    const imagesParsed = await retrieveItemLights(actor, tokenD);

    const wildcardDisplay = await renderTemplate(`/modules/${CONSTANTS.MODULE_NAME}/templates/artSelect.hbs`, {
      tokenId,
      actorId,
      imagesParsed,
      imageDisplay,
      imageOpacity,
      isGM,
    });

    const is080 = !isNewerVersion('0.8.0', <string>game.data.version);

    html
      .find('div.right')
      // .find(".col.lights-hud-ate-column-" + position).prepend(tbuttonItemLight)
      .append(wildcardDisplay)
      .click((event) => {
        let activeButton, clickedButton, tokenButton;
        for (const button of html.find('div.control-icon')) {
          if (button.classList.contains('active')) activeButton = button;
          if (button === event.target.parentElement) clickedButton = button;
          if (button.dataset.action === 'lights-hud-ate-selector') tokenButton = button;
        }

        if (clickedButton === tokenButton && activeButton !== tokenButton) {
          tokenButton.classList.add('active');

          html.find('.lights-hud-ate-selector-wrap')[0].classList.add('active');
          const effectSelector = is080 ? '[data-action="effects"]' : '.effects';
          html.find(`.control-icon${effectSelector}`)[0].classList.remove('active');
          html.find('.status-effects')[0].classList.remove('active');
        } else {
          tokenButton.classList.remove('active');

          html.find('.lights-hud-ate-selector-wrap')[0].classList.remove('active');
        }
      });

    const buttons = html.find('.lights-hud-ate-button-select');
    const buttonMacroPreset = $(html.find('.lights-hud-ate-button-macro-preset'));
    const buttonMacroCustom = $(html.find('.lights-hud-ate-button-macro-custom'));

    buttons.map((button) => {
      buttons[button].addEventListener('click', async function (event) {
        event.preventDefault();
        event.stopPropagation();
        const buttonClick = event.button; // 0 left click

        const lightDataDialog = retrieveDataFromHtml(this);
        if (lightDataDialog) {
          confirmDialogATLEffectItem(lightDataDialog).render(true);
        }
      });
      buttons[button].addEventListener('contextmenu', async function (event) {
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
  }
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

  if (!lightDataDialog.itemId) {
    warn(`No item id ${lightDataDialog.itemId} founded for the light hud`, true);
    return;
  }
  if (!lightDataDialog.effectId) {
    warn(`No active effect id ${lightDataDialog.effectId} founded for the light hud`, true);
    return;
  }
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

// TODO consider handling rounds/seconds/turns based on whatever is defined for the effect rather than do conversions
function _getSecondsRemaining(duration) {
  if (duration.seconds || duration.rounds) {
    const seconds = duration.seconds ?? duration.rounds * (CONFIG.time?.roundTime ?? 6);
    return duration.startTime + seconds - game.time.worldTime;
  } else {
    return Infinity;
  }
}
