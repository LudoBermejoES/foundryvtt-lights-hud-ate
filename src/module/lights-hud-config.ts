import API from './api';
import CONSTANTS from './constants';
import EffectInterface from './effects/effect-interface';
import { canvas, game } from './settings';

export function getATLEffectsFromItem(item: Item): ActiveEffect[] {
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

  const imagesParsed = lightItems.map((item: Item) => {
    const im = <string>item.img;
    const split = im.split('/');
    const extensions = im.split('.');
    const extension = extensions[extensions.length - 1];
    const img = ['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(extension);
    const vid = ['webm', 'mp4', 'm4v'].includes(extension);
    const applied = API.hasEffectAppliedFromIdOnActor(<string>actor.id, <string>getATLEffectsFromItem(item)[0].id);
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
  // const tbuttonItemLight = $(
  //   `<div class="control-icon ${CONSTANTS.MODULE_NAME} lightItem" title="Light Item"><i class="fas fa-lightbulb"></i></div>`,
  // );
  const tbuttonLight = $(
    `<div class="control-icon ${CONSTANTS.MODULE_NAME} lightEffect" title="Light Effect"><i class="fas fa-sun"></i></div>`,
  );
  const tbuttonLantern = $(
    `<div class="control-icon ${CONSTANTS.MODULE_NAME} lightItem" title="Light Item"><i class="fas fa-lightbulb"></i></div>`,
  );
  const tbuttonTorch = $(
    `<div class="control-icon ${CONSTANTS.MODULE_NAME} lightMacro" title="Light Macro"><i class="fas fa-fire"></i></div>`,
  );

  // Get the position of the column
  const position = game.settings.get(CONSTANTS.MODULE_NAME, 'position');

  // Create the column
  const buttonsdiv = $(`<div class="col ${CONSTANTS.MODULE_NAME}-column-${position}"></div>`);

  // Wrap the previous icons
  const newdiv = `<div class="${CONSTANTS.MODULE_NAME}-container"></div>`;
  html.find('.col.left').before(newdiv);

  // Add the column
  html.find(`.${CONSTANTS.MODULE_NAME}-container`).prepend(buttonsdiv);

  const is080 = !isNewerVersion("0.8.0", game.data.version)

  html.find('div.right')
      .append(wildcardDisplay)
      .click((event) => {
          let activeButton, clickedButton, tokenButton;
          for ( const button of html.find('div.control-icon') ) {
              if (button.classList.contains('active')) activeButton = button
              if (button === event.target.parentElement) clickedButton = button
              if (button.dataset.action === 'lights-hud-selector') tokenButton = button
          }

          if (clickedButton === tokenButton && activeButton !== tokenButton) {
              tokenButton.classList.add('active')

              html.find('.lights-hud-selector-wrap')[0].classList.add('active')
              const effectSelector = is080 ? '[data-action="effects"]' : '.effects'
              html.find(`.control-icon${effectSelector}`)[0].classList.remove('active')
              html.find('.status-effects')[0].classList.remove('active')
          } else {
              tokenButton.classList.remove('active')

              html.find('.lights-hud-selector-wrap')[0].classList.remove('active')
          }
      })

  const buttons = html.find('.lights-hud-button-select')

  buttons.map((button) => {
      buttons[button].addEventListener('click', function (event) {
          event.preventDefault()
          event.stopPropagation()
          // TODO Verificare recupero id dell'item
          const controlled = <Token[]>canvas.tokens?.controlled;
          const index = controlled.findIndex(x => x.data._id === tokenD.id)
          const tokenToChange = controlled[index];
          const actorToChange = tokenToChange.actor?.id;

          //const updateTarget = tokenToChange.document ? tokenToChange.document : tokenToChange
          //const dimensions = getTokenDimensions(updateTarget, event.target.dataset.name)
          //let updateInfo = { img: event.target.dataset.name, ...dimensions }
          //updateTarget.update(updateInfo)
          API.addEffect();
      })
  });

  // Get the status of the three types of lights

  // let spellLight = new LightDataExt('light', 'spell', false, app);
  // let itemLight = new LightDataExt('lantern', 'consumable', false, app);
  // let macroLight = new LightDataExt('torch', 'consumable', false, app);

  // Initial button state when the HUD comes up
  // if (spellLight.state) tbuttonLight.addClass('active');
  // if (itemLight.state) tbuttonLantern.addClass('active');
  // if (macroLight.state) tbuttonTorch.addClass('active');
  // Check the permissions to manage the lights

  // if (!data.isGM && !game.settings.get(CONSTANTS.MODULE_NAME, 'playerActivation')) {
  //   // disableLightsHUDButton(tbuttonLight);
  //   // disableLightsHUDButton(tbuttonLantern);
  //   // disableLightsHUDButton(tbuttonTorch);
  //   disableLightsHUDButton(tbuttonItemLight);
  //   return;
  // } else {
  //   // If the a specific light is on, enable only that light otherwise enable all three of them
  //   // if (spellLight.state) {
  //   //   enableLightsHUDButton(tbuttonLight);
  //   //   disableLightsHUDButton(tbuttonLantern);
  //   //   disableLightsHUDButton(tbuttonTorch);
  //   // } else if (itemLight.state) {
  //   //   disableLightsHUDButton(tbuttonLight);
  //   //   enableLightsHUDButton(tbuttonLantern);
  //   //   disableLightsHUDButton(tbuttonTorch);
  //   // } else if (macroLight.state) {
  //   //   disableLightsHUDButton(tbuttonLight);
  //   //   disableLightsHUDButton(tbuttonLantern);
  //   //   enableLightsHUDButton(tbuttonTorch);
  //   // } else {
  //   //   disableLightsHUDButton(tbuttonLight);
  //   //   disableLightsHUDButton(tbuttonLantern);
  //   //   disableLightsHUDButton(tbuttonTorch);
  //   // }
  //   enableLightsHUDButton(tbuttonItemLight);
  // }
}

// // Returns true if the character can use the Light spell
// // This also returns true if the game system is not D&D 5e...
// function canCastLight() {
//   let actor = game.actors?.get(data.actorId);
//   if (actor === undefined) return false;
//   let hasLight = false;
//   actor.data.items.forEach((item) => {
//     if (item.type === "spell") {
//       if (item.name === "Light") hasLight = true;
//     }
//   });
//   return hasLight;
// }

// function enableLightsHUDButton(tbutton) {
//   // Remove the disabled status, if any
//   tbutton.find('i').removeClass('fa-disabled');
//   tbutton.addClass('active');
//   // Install a click handler if one is not already bound
//   if (!tbutton.hasClass('clickBound')) {
//     tbutton.click(async (ev) => onButtonClick(ev, tbutton));
//     tbutton.addClass('clickBound');
//   }
// }

// // Visually and functionally disable a LightsHUD button
// function disableLightsHUDButton(tbutton) {
//   tbutton.find('i').addClass('fa-disabled');
//   tbutton.off('click');
//   tbutton.removeClass('clickBound');
//   tbutton.removeClass('active');
// }

// async function onButtonClick(ev, tbutton) {
//   ev.preventDefault();
//   ev.stopPropagation();

//   // Are we dealing with the Light Button
//   if (tbutton.hasClass('lightSpell')) {
//     //
//   } else {
//     //
//   }
// }
