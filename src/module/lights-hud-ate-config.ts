import { TokenData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import API from './api';
import CONSTANTS from './constants';
import Effect from './effects/effect';
import EffectInterface from './effects/effect-interface';
import { prepareTokenDataDropTheTorch, rollDependingOnSystem, updateTokenLighting, warn } from './lib/lib';
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
  if (!actor) {
    warn(`No actor id ${data.actorId} founded for the light hud`);
    return;
  }

  const tokenId = <string>tokenD.id;
  const actorId = <string>actor.id;

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
      let appliedTmp = false;
      let disabledTmp = false;
      let suppressedTmp = false;
      let temporaryTmp = false;
      let passiveTmp = false;
      let effectid = '';
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
          warn(`No active effect found on actor ${actor.name} with name ${nameToSearch}`);
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
            appliedTmp = true;
          }
          disabledTmp = isDisabled;
          suppressedTmp = isSuppressed;
          temporaryTmp = isTemporary;
          passiveTmp = isPassive;
          effectid = <string>effectFromActor.id;
        }
      }
      return <LightDataHud>{
        route: im,
        name: item.name,
        applied: appliedTmp || (passiveTmp && !disabledTmp),
        disabled: disabledTmp,
        suppressed: suppressedTmp,
        temporary: temporaryTmp,
        passive: passiveTmp,
        img: img,
        vid: vid,
        type: img || vid,
        itemid: item.id,
        effectid: effectid,
      };
    }),
  );

  const wildcardDisplay = await renderTemplate(`/modules/${CONSTANTS.MODULE_NAME}/templates/artSelect.hbs`, {
    tokenId,
    actorId,
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
  const buttonMacroPreset = $(html.find('.lights-hud-ate-button-macro-preset'));
  const buttonMacroCustom = $(html.find('.lights-hud-ate-button-macro-custom'));

  buttons.map((button) => {
    buttons[button].addEventListener('click', async function (event) {
      event.preventDefault();
      event.stopPropagation();
      const buttonClick = event.button; // 0 left click

      // const controlled = <Token[]>canvas.tokens?.controlled;
      // const index = controlled.findIndex((x) => x.data._id === tokenD.id);
      // const tokenToChange = <Token>controlled[index];
      // const actorId = <string>tokenToChange.actor?.id;

      const actorId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-actor-id');
      const itemId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-item-id');
      const effectId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-effect-id');
      const isApplied = !!(<string>$(this).find('.lights-hud-ate-button-image').attr('data-applied'));
      if (!itemId) {
        warn(`No item id ${itemId} founded for the light hud`);
        return;
      }
      if (!effectId) {
        warn(`No active effect id ${effectId} founded for the light hud`);
        return;
      }
      if (!actorId) {
        warn(`No actor id ${actorId} founded for the light hud`);
        return;
      }
      // const obj = <Actor>game.actors?.get(actorId) || <Actor>game.actors?.getName(actorId);
      // const obj = <Item>game.items?.get(uuid) || <Item>game.items?.getName(uuid);
      // const obj = tokenToChange.data;

      confirmDialog(actorId, itemId, effectId, isApplied).render(true);
    });
    buttons[button].addEventListener('contextmenu', async function (event) {
      event.preventDefault();
      event.stopPropagation();
      const buttonClick = event.button; // 0 left click

      const actorId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-actor-id');
      const itemId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-item-id');
      const effectId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-effect-id');
      const isApplied = !!(<string>$(this).find('.lights-hud-ate-button-image').attr('data-applied'));
      if (!itemId) {
        warn(`No item id ${itemId} founded for the light hud`);
        return;
      }
      if (!effectId) {
        warn(`No active effect id ${effectId} founded for the light hud`);
        return;
      }
      if (!actorId) {
        warn(`No actor id ${actorId} founded for the light hud`);
        return;
      }

      // TODO PREPARATION TOKEN DATA

      // TODO SET UP ANIMATION

      // const animation = $(event.currentTarget.parentElement.parentElement)
      // .find(".anim-dropdown")
      // .val();

      const duplicates = 1; // number od dropped light

      // TODO ADD CHECK FOR ACTOR AND TOKEN
      const item = <Item>actor.items.get(itemId);
      let tokenDataDropTheTorch = <TokenData>await prepareTokenDataDropTheTorch(item,_token?.data?.elevation ?? 0);
      const actorDropTheTorch = <Actor>game.actors?.get(<string>tokenDataDropTheTorch.actorId);
      tokenDataDropTheTorch = await actor.getTokenData(tokenDataDropTheTorch);
      //@ts-ignore
      const posData = await warpgate.crosshairs.show({
        size: Math.max(tokenDataDropTheTorch.width, tokenDataDropTheTorch.height) * tokenDataDropTheTorch.scale,
        icon: `modules/${CONSTANTS.MODULE_NAME}/assets/black-hole-bolas.webp`,
        label: '',
      });

      //get custom data macro
      const customTokenData = {};

      //@ts-ignore
      await warpgate.spawnAt({ x: posData.x, y: posData.y }, tokenDataDropTheTorch, customTokenData || {}, {}, { duplicates });

      // Remove actor at the end
      actorDropTheTorch.delete();
    });
  });

  buttonMacroPreset.on('click', async function (event) {
    event.preventDefault();
    event.stopPropagation();
    const buttonClick = event.button; // 0 left click
    const actorId = <string>$(this).attr('data-actor-id');
    // A macro for the Foundry virtual tabletop that lets a user configure their token's vision and lighting settings. This script is taken from Sky's foundry repo here: https://github.com/Sky-Captain-13/foundry/blob/master/scriptMacros/tokenVision.js.
    const applyChanges = false;
    presetDialog(applyChanges).render(true);
  });

  buttonMacroCustom.on('click', async function (event) {
    event.preventDefault();
    event.stopPropagation();
    const buttonClick = event.button; // 0 left click
    const actorId = <string>$(this).attr('data-actor-id');
    // A macro for the Foundry virtual tabletop that lets a user configure their token's vision and lighting settings. This script is taken from Sky's foundry repo here: https://github.com/Sky-Captain-13/foundry/blob/master/scriptMacros/tokenVision.js.
    const applyChanges = false;
    customDialog(applyChanges).render(true);
  });
}

export function presetDialog(applyChanges: boolean): Dialog {
  return new Dialog({
    title: `Token Vision Configuration`,
    content: `
    <form>
      <div class="form-group">
        <label>Vision Type:</label>
        <select id="vision-type" name="vision-type">
          <option value="nochange">No Change</option>
          <option value="dim0">Self</option>
          <option value="dim30">Darkvision (30 ft)</option>
          <option value="dim60">Darkvision (60 ft)</option>
          <option value="dim90">Darkvision (90 ft)</option>
          <option value="dim120">Darkvision (120 ft)</option>
          <option value="dim150">Darkvision (150 ft)</option>
          <option value="dim180">Darkvision (180 ft)</option>
          <option value="dim300">Eyes of Night (300 ft)</option>
          <option value="bright120">Devil's Sight (Warlock)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Light Source:</label>
        <select id="light-source" name="light-source">
          <option value="nochange">No Change</option>
          <option value="none">None</option>
          <option value="candle">Candle</option>
          <option value="lamp">Lamp</option>
          <option value="bullseye">Lantern (Bullseye)</option>
          <option value="hooded-dim">Lantern (Hooded - Dim)</option>
          <option value="hooded-bright">Lantern (Hooded - Bright)</option>
          <option value="light">Light (Cantrip)</option>
          <option value="torch">Torch</option>
          <option value="moon-touched">Moon-Touched</option>
        </select>
      </div>
    </form>
    `,
    buttons: {
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: `Apply Changes`,
        callback: () => (applyChanges = true),
      },
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: `Cancel Changes`,
      },
    },
    default: 'yes',
    close: (html: any) => {
      if (applyChanges) {
        for (const token of <Token[]>canvas.tokens?.controlled) {
          const visionType = html.find('[name="vision-type"]')[0].value || 'none';
          const lightSource = html.find('[name="light-source"]')[0].value || 'none';
          let dimSight = 0;
          let brightSight = 0;
          let dimLight = 0;
          let brightLight = 0;
          let lightAngle = 360;
          let lockRotation = token.data.lockRotation;
          let lightAnimation = token.data.lightAnimation;
          let lightAlpha = <number>token.data.lightAlpha;
          let lightColor = <string>token.data.lightColor;
          const colorFire = '#f8c377';
          const colorWhite = '#ffffff';
          const colorMoonGlow = '#f4f1c9';
          // Get Vision Type Values
          switch (visionType) {
            case 'dim0':
              dimSight = 1.5;
              brightSight = 0;
              break;
            case 'dim30':
              dimSight = 30;
              brightSight = 0;
              break;
            case 'dim60':
              dimSight = 60;
              brightSight = 0;
              break;
            case 'dim90':
              dimSight = 90;
              brightSight = 0;
              break;
            case 'dim120':
              dimSight = 120;
              brightSight = 0;
              break;
            case 'dim150':
              dimSight = 150;
              brightSight = 0;
              break;
            case 'dim180':
              dimSight = 180;
              brightSight = 0;
              break;
            case 'dim300':
              dimSight = 300;
              brightSight = 0;
              break;
            case 'bright120':
              dimSight = 0;
              brightSight = 120;
              break;
            case 'nochange':
            default:
              dimSight = token.data.dimSight;
              brightSight = token.data.brightSight;
          }
          // Get Light Source Values
          switch (lightSource) {
            case 'none':
              dimLight = 0;
              brightLight = 0;
              //@ts-ignore
              lightAnimation = { type: 'none' };
              break;
            case 'candle':
              dimLight = 10;
              brightLight = 5;
              //@ts-ignore
              lightAnimation = { type: 'torch', speed: 2, intensity: 2 };
              lightColor = colorFire;
              lightAlpha = 0.15;
              break;
            case 'lamp':
              dimLight = 45;
              brightLight = 15;
              //@ts-ignore
              lightAnimation = { type: 'torch', speed: 2, intensity: 2 };
              lightColor = colorFire;
              lightAlpha = 0.15;
              break;
            case 'bullseye':
              dimLight = 120;
              brightLight = 60;
              lockRotation = false;
              lightAngle = 52.5;
              //@ts-ignore
              lightAnimation = { type: 'torch', speed: 2, intensity: 2 };
              lightColor = colorFire;
              lightAlpha = 0.15;
              break;
            case 'hooded-dim':
              dimLight = 5;
              brightLight = 0;
              //@ts-ignore
              lightAnimation = { type: 'torch', speed: 2, intensity: 2 };
              lightColor = colorFire;
              lightAlpha = 0.15;
              break;
            case 'hooded-bright':
              dimLight = 60;
              brightLight = 30;
              //@ts-ignore
              lightAnimation = { type: 'torch', speed: 2, intensity: 2 };
              lightColor = colorFire;
              lightAlpha = 0.15;
              break;
            case 'light':
              dimLight = 40;
              brightLight = 20;
              //@ts-ignore
              lightAnimation = { type: 'none' };
              lightColor = colorWhite;
              lightAlpha = 0.15;
              break;
            case 'torch':
              dimLight = 40;
              brightLight = 20;
              //@ts-ignore
              lightAnimation = { type: 'torch', speed: 2, intensity: 2 };
              lightColor = colorFire;
              lightAlpha = 0.15;
              break;
            case 'moon-touched':
              dimLight = 30;
              brightLight = 15;
              //@ts-ignore
              lightAnimation = { type: 'none' };
              lightColor = colorMoonGlow;
              break;
            case 'nochange':
            default:
              dimLight = token.data.dimLight;
              brightLight = token.data.brightLight;
              lightAngle = token.data.lightAngle;
              lockRotation = token.data.lockRotation;
              lightAnimation = token.data.lightAnimation;
              lightAlpha = token.data.lightAlpha;
              lightColor = <string>token.data.lightColor;
          }
          // Update Token
          updateTokenLighting(
            token,
            dimSight,
            brightSight,
            dimLight,
            brightLight,
            lightColor,
            lightAlpha,
            lightAngle,
            <string>lightAnimation.type,
            <number>lightAnimation.speed,
            <number>lightAnimation.intensity,
          );
        }
      }
    },
  });
}

export function customDialog(applyChanges: boolean): Dialog {
  return new Dialog({
    title: `Token Vision Configuration custom`,
    content: `
  <form>
    <div class="form-group">
      <label>Dim sight:</label>
      <div class="form-fields">
        <input type="number" name="dim-sight" value="0" />
      </div>
    </div>
    <div class="form-group">
      <label>Bright sight:</label>
      <div class="form-fields">
        <input type="number" name="bright-sight" value="0" />
      </div>
    </div>
    <div class="form-group">
      <label>Dim Light:</label>
      <div class="form-fields">
        <input type="number" name="ligh-dimt" value="0" />
      </div>
    </div>
    <div class="form-group">
      <label>Bright Light:</label>
      <div class="form-fields">
        <input type="number" name="light-bright" value="0" />
      </div>
    </div>
    <div class="form-group">
      <label>Light animation type:</label>
      <div class="form-fields">
        <select id="light-source" name="light-animation-type">
          <option selected value="none">None</option>
          <option value="torch">Torch</option>
          <option value="pulse">Pulse</option>
          <option value="chroma">Chroma</option>
          <option value="wave">Wave</option>
          <option value="fog">Fog</option>
          <option value="sunburst">Sunburst</option>
          <option value="dome">Dome</option>
          <option value="emanation">Emanation</option>
          <option value="hexa">Hexa</option>
          <option value="ghost">Ghost</option>
          <option value="energy">Energy</option>
          <option value="roiling">Roiling</option>
          <option value="hole">Hole</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Light animation speed:</label>
      <div class="form-fields">
        <input type="range" name="light-animation-speed" value="5  min="0" max="10"  step="1" />
      </div>
    </div>
    <div class="form-group">
      <label>Light animation intensity:</label>
      <div class="form-fields">
        <input type="range" name="light-animation-intensity" value="5  min="0" max="10"  step="1" />
      </div>
    </div>
    <div class="form-group">
      <label>Light lock rotation:</label>
      <div class="form-fields">
        <input type="checkbox" name="light-lock-rotation" value="true" checked/>
      </div>
    </div>
    <div class="form-group">
      <label>Light Color:</label>
      <div class="form-fields">
        <input type="color" name="light-color" value="#f8c377" />
      </div>
    </div>
    <div class="form-group">
      <label>Light Alpha:</label>
      <div class="form-fields">
        <input type="range" name="light-alpha" value="0.5  min="0" max="1"  step="0.1" />
      </div>
    </div>
  </form>
  `,
    buttons: {
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: `Apply Changes`,
        callback: () => (applyChanges = true),
      },
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: `Cancel Changes`,
      },
    },
    default: 'yes',
    close: (html: any) => {
      if (applyChanges) {
        for (const token of <Token[]>canvas.tokens?.controlled) {
          // const visionType = html.find('[name="vision-type"]')[0].value || 'none';
          // const lightSource = html.find('[name="light-source"]')[0].value || 'none';
          const dimSight = html.find('[name="dim-sight"]')[0].value || 0;
          const brightSight = html.find('[name="bright-sight"]')[0].value || 0;
          const dimLight = html.find('[name="light-source"]')[0].value || 0;
          const brightLight = html.find('[name="light-source"]')[0].value || 0;
          const lightAngle = html.find('[name="light-source"]')[0].value || 360;
          const lockRotation = html.find('[name="light-lock-rotation"]')[0].value || token.data.lockRotation;
          const lightAnimation = token.data.lightAnimation;
          // Enable the Light Source type according to the type
          // "torch" / "pulse" / "chroma" / "wave" / "fog" / "sunburst" / "dome"
          // "emanation" / "hexa" / "ghost" / "energy" / "roiling" / "hole"
          const lightAnimationType = html.find('[name="light-animation-type"]')[0].value || 'none';
          const lightAnimationIntensity = html.find('[name="light-animation-intensity"]')[0].value || 5;
          const lightAnimationSpeed = html.find('[name="light-animation-speed"]')[0].value || 5;
          const lightAlpha = html.find('[name="light-alpha"]')[0].value || token.data.lightAlpha;
          const lightColor = html.find('[name="light-color"]')[0].value || token.data.lightColor;
          // Update Token
          updateTokenLighting(
            token,
            dimSight,
            brightSight,
            dimLight,
            brightLight,
            lightColor,
            lightAlpha,
            lightAngle,
            lightAnimationType,
            lightAnimationSpeed,
            lightAnimationIntensity,
          );
        }
      }
    },
  });
}

export function confirmDialog(actorId, itemId, effectId, isApplied): Dialog {
  return new Dialog({
    title: 'Confirm the action',
    content: `<div><h2>Are you sure to apply this effect ?</h2><div>`,
    buttons: {
      yes: {
        label: 'Yes',
        callback: (html) => {
          manageActiveEffectATL(actorId, itemId, effectId, isApplied);
        },
      },
      no: {
        label: 'No',
        callback: (html) => {
          // Do nothing
        },
      },
    },
    default: 'no',
  });
}

export function manageActiveEffectATL(actorId, itemId, effectId, isApplied) {
  if (isApplied) {
    // const atlEffectsS = obj.effects.filter((entity: ActiveEffect) => {
    //   return entity.data.changes.find((effect) => effect.key.includes('ATL')) != undefined;
    // });
    // const effectFromActor = <ActiveEffect>actor.data.effects.find((ae: ActiveEffect) => {
    //   return effectId == ae.id;
    // });
    API.toggleEffectOnActor(actorId, <string>effectId, false, false, false);
  }

  // We roll the item ???
  if (game.settings.get(CONSTANTS.MODULE_NAME, 'rollItem') && !isApplied) {
    const actor = <Actor>game.actors?.get(actorId);
    const item = <Item>actor.items.find((entity: Item) => {
      return <string>entity.id == itemId;
    });
    if (item) {
      // TODO if i need to manage the roll for specific system usually is enough item.roll()
      rollDependingOnSystem(item);
    } else {
      warn(`No item found for the id ${itemId}`);
    }
  }
}
