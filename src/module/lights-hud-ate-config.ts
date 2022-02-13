import API from './api';
import CONSTANTS from './constants';
import Effect from './effects/effect';
import EffectInterface from './effects/effect-interface';
import { rollDependingOnSystem, warn } from './lib/lib';
import { LightDataHud } from './lights-hud-ate-models';
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
  const tokenD = <TokenDocument>app.object.document;
  const actor = <Actor>game.actors?.get(data.actorId);

  // const images = await actor?.getTokenImages() ?? []
  // if (images.length < 2) {
  //     return
  // }

  const imageDisplay = <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'imageDisplay');
  const imageOpacity = <number>game.settings.get(CONSTANTS.MODULE_NAME, 'imageOpacity') / 100;

  const lightItems: Item[] = [];

  //const physicalItems = ['weapon', 'equipment', 'consumable', 'tool', 'backpack', 'loot'];
  // const spellsItems = ['spell','feat'];
  // For every itemwith a ATL/ATE effect
  actor.data.items.contents.forEach((im: Item) => {
    // if (im && physicalItems.includes(im.type)) {}
    const atlEffects = im.effects.filter((entity) => {
      return entity.data.changes.find((effect) => effect.key.includes('ATL')) != undefined;
    });
    if (atlEffects.length > 0) {
      lightItems.push(im);
    }
  });

  // Convert item to LightHudData

  const imagesParsed = await Promise.all(
    lightItems.map(async (item: Item) => {
      const im = <string>item.img;
      const split = im.split('/');
      const extensions = im.split('.');
      const extension = extensions[extensions.length - 1];
      const img = ['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(extension);
      const vid = ['webm', 'mp4', 'm4v'].includes(extension);
      // TODO for now we check if at least one active effect has the atl/ate changes on him
      const aeAtl = <ActiveEffect[]>getATLEffectsFromItem(item) || [];
      let used = false;
      let disabled = false;
      let suppressed = false;
      let temporary = false;
      let passive = false;
      if (aeAtl.length > 0) {
        const nameToSearch = <string>aeAtl[0].name || aeAtl[0].data.label;
        // const effectFromActor = <ActiveEffect>await API.findEffectByNameOnActor(<string>actor.id, nameToSearch);
        // regex expression to match all non-alphanumeric characters in string
        const regex = /[^A-Za-z0-9]/g;
        const effectFromActor = <ActiveEffect>actor.data.effects.find((ae: ActiveEffect) => {
          // use replace() method to match and remove all the non-alphanumeric characters
          return nameToSearch
            .replace(regex, '')
            .toLowerCase()
            .startsWith(ae.data.label?.replace(regex, '')?.toLowerCase());
        });
        if (!effectFromActor) {
          // DO NOTHNG
        } else {
          const applied = await API.hasEffectAppliedOnActor(<string>actor.id, nameToSearch);
          // If the active effect is disabled or is supressed
          // const isDisabled = aeAtl[0].data.disabled || false;
          // const isSuppressed = aeAtl[0].data.document.isSuppressed || false;
          const isDisabled = effectFromActor.data.disabled || false;
          //@ts-ignore
          const isSuppressed = effectFromActor.data.document.isSuppressed || false;
          const isTemporary = effectFromActor.isTemporary || false;
          const isPassive = !isTemporary;
          if (applied && !isDisabled && !isSuppressed) {
            used = true;
          }
          disabled = isDisabled;
          suppressed = isSuppressed;
          temporary = isTemporary;
          passive = isPassive;
        }
      }
      return <LightDataHud>{
        route: im,
        name: item.name,
        used: used || (passive && !disabled),
        disabled: disabled,
        suppressed: suppressed,
        temporary: temporary,
        passive: passive,
        img: img,
        vid: vid,
        type: img || vid,
        itemid: item.id,
      };
    }),
  );

  const wildcardDisplay = await renderTemplate(`/modules/${CONSTANTS.MODULE_NAME}/templates/artSelect.hbs`, {
    imagesParsed,
    imageDisplay,
    imageOpacity,
  });

  // Define all three buttons
  // const tbuttonItemLight = $(
  //   `<div class="control-icon ${CONSTANTS.MODULE_NAME} lightItem" title="Light Item"><i class="fas fa-lightbulb"></i></div>`,
  // );

  // // Get the position of the column
  // const position = game.settings.get(CONSTANTS.MODULE_NAME, 'position');

  // // Create the column
  // const buttonsdiv = $(`<div class="col ${CONSTANTS.MODULE_NAME}-column-${position}"></div>`);

  // // Wrap the previous icons
  // const newdiv = `<div class="${CONSTANTS.MODULE_NAME}-container"></div>`;
  // html.find('.col.left').before(newdiv);

  // // Add the column
  // html.find(`.${CONSTANTS.MODULE_NAME}-container`).prepend(buttonsdiv);

  // tbuttonItemLight.addClass('active');

  // Finally insert the buttons in the column
  // html.find('.col.lights-hud-ate-column-' + position).prepend(tbuttonItemLight);

  const is080 = !isNewerVersion('0.8.0', game.data.version);

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

  buttons.map((button) => {
    buttons[button].addEventListener('click', async function (event) {
      event.preventDefault();
      event.stopPropagation();
      const buttonClick = event.button; // 0 left click
      // TODO Verificare recupero id dell'item
      const itemId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-item-id');
      const isApplied = !!(<string>$(this).find('.lights-hud-ate-button-image').attr('data-applied'));
      if (!itemId) {
        warn(`No id ${itemId} founded for retrieve the item`);
        return;
      }
      const controlled = <Token[]>canvas.tokens?.controlled;
      const index = controlled.findIndex((x) => x.data._id === tokenD.id);
      const tokenToChange = <Token>controlled[index];
      const actorId = <string>tokenToChange.actor?.id;
      if (!actorId) {
        warn(`No id ${actorId} founded for retrieve the item`);
        return;
      }
      const obj = <Actor>game.actors?.get(actorId) || <Actor>game.actors?.getName(actorId);
      // const obj = <Item>game.items?.get(uuid) || <Item>game.items?.getName(uuid);
      // const obj = tokenToChange.data;
      if (isApplied) {
        const atlEffectsS = obj.effects.filter((entity: ActiveEffect) => {
          return entity.data.changes.find((effect) => effect.key.includes('ATL')) != undefined;
        });
        atlEffectsS.forEach((entity: ActiveEffect) => {
          API.toggleEffectOnActor(actorId, <string>entity.id, false, false, false);
        });
      }

      const item = <Item>actor.items.find((entity: Item) => {
        return <string>entity.id == itemId;
      });
      if (item) {
        rollDependingOnSystem(item);
      } else {
        warn(`No item found for the id ${itemId}`);
      }

      //const updateTarget = tokenToChange.document ? tokenToChange.document : tokenToChange
      //const dimensions = getTokenDimensions(updateTarget, event.target.dataset.name)
      //let updateInfo = { img: event.target.dataset.name, ...dimensions }
      //updateTarget.update(updateInfo)
      // TODO GESTIRE GLI ACITVE EFFECT
    });
    buttons[button].addEventListener('contextmenu', async function (event) {
      event.preventDefault();
      event.stopPropagation();
      const buttonClick = event.button; // 0 left click
    });
  });
}
