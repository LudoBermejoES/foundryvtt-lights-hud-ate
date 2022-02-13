import API from './api';
import CONSTANTS from './constants';
import EffectInterface from './effects/effect-interface';
import { toggleEffectByUuid } from './lib/lib';
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

  const lightItems: Item[] = [];

  //const physicalItems = ['weapon', 'equipment', 'consumable', 'tool', 'backpack', 'loot'];
  // const spellsItems = ['spell'];
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

  const imageDisplay = <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'imageDisplay');
  const imageOpacity = <number>game.settings.get(CONSTANTS.MODULE_NAME, 'imageOpacity') / 100;

  const imagesParsed = lightItems.map(async (item: Item) => {
    const im = <string>item.img;
    const split = im.split('/');
    const extensions = im.split('.');
    const extension = extensions[extensions.length - 1];
    const img = ['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(extension);
    const vid = ['webm', 'mp4', 'm4v'].includes(extension);
    // TODO for now we check if at least one active effect has the atl/ate changes on him
    const aeAtl = <ActiveEffect>getATLEffectsFromItem(item)[0];
    let applied = false;
    if (aeAtl) {
      applied = await API.hasEffectAppliedFromIdOnActor(<string>actor.id, <string>aeAtl.id);
    }
    return {
      route: im,
      name: item.name,
      used: applied,
      img,
      vid,
      type: img || vid,
      id: item.id,
    };
  });

  const wildcardDisplay = await renderTemplate(`/modules/${CONSTANTS.MODULE_NAME}/templates/artSelect.hbs`, {
    imagesParsed,
    imageDisplay,
    imageOpacity,
  });

  // Define all three buttons
  const tbuttonItemLight = $(
    `<div class="control-icon ${CONSTANTS.MODULE_NAME} lightItem" title="Light Item"><i class="fas fa-lightbulb"></i></div>`,
  );
  // const tbuttonLight = $(
  //   `<div class="control-icon ${CONSTANTS.MODULE_NAME} lightEffect" title="Light Effect"><i class="fas fa-sun"></i></div>`,
  // );
  // const tbuttonLantern = $(
  //   `<div class="control-icon ${CONSTANTS.MODULE_NAME} lightItem" title="Light Item"><i class="fas fa-lightbulb"></i></div>`,
  // );
  // const tbuttonTorch = $(
  //   `<div class="control-icon ${CONSTANTS.MODULE_NAME} lightMacro" title="Light Macro"><i class="fas fa-fire"></i></div>`,
  // );

  // Get the position of the column
  const position = game.settings.get(CONSTANTS.MODULE_NAME, 'position');

  // Create the column
  const buttonsdiv = $(`<div class="col ${CONSTANTS.MODULE_NAME}-column-${position}"></div>`);

  // Wrap the previous icons
  const newdiv = `<div class="${CONSTANTS.MODULE_NAME}-container"></div>`;
  html.find('.col.left').before(newdiv);

  // Add the column
  html.find(`.${CONSTANTS.MODULE_NAME}-container`).prepend(buttonsdiv);

  tbuttonItemLight.addClass('active');
  // tbuttonLight.addClass('active');
  // tbuttonLantern.addClass('active');
  // tbuttonTorch.addClass('active');

  // Finally insert the buttons in the column
  html.find('.col.lights-hud-ate-column-' + position).prepend(tbuttonItemLight);
  // html.find(".col.lights-hud-ate-column-" + position).prepend(tbuttonTorch);
  // html.find(".col.lights-hud-ate-column-" + position).prepend(tbuttonLantern);
  // html.find(".col.lights-hud-ate-column-" + position).prepend(tbuttonLight);

  const is080 = !isNewerVersion('0.8.0', game.data.version);

  html
    .find('div.right')
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
    buttons[button].addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      // TODO Verificare recupero id dell'item
      const uuid = '';
      const controlled = <Token[]>canvas.tokens?.controlled;
      const index = controlled.findIndex((x) => x.data._id === tokenD.id);
      const tokenToChange = controlled[index];
      const actorToChange = tokenToChange.actor?.id;

      const obj = <any>fromUuid(uuid);
      if (obj instanceof Item) {
        //@ts-ignore
        rollDependingOnSystem(obj);
      } else if (obj instanceof ActiveEffect) {
        toggleEffectByUuid(uuid);
      } else {
        // DO NOTHING
      }

      //const updateTarget = tokenToChange.document ? tokenToChange.document : tokenToChange
      //const dimensions = getTokenDimensions(updateTarget, event.target.dataset.name)
      //let updateInfo = { img: event.target.dataset.name, ...dimensions }
      //updateTarget.update(updateInfo)
      // TODO GESTIRE GLI ACITVE EFFECT
    });
  });
}
