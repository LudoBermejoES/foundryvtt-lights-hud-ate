import { TokenData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import API from './api';
import CONSTANTS from './constants';
import Effect from './effects/effect';
import EffectInterface from './effects/effect-interface';
import {
  dialogWarning,
  i18n,
  i18nFormat,
  prepareTokenDataDropTheTorch,
  rollDependingOnSystem,
  updateTokenLighting,
  warn,
} from './lib/lib';
import {
  LightDataHud,
  VisionHUDElement,
  VisionHUDPreset,
  LightHUDPreset,
  LightHUDElement,
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

  const isGM = game.user?.isGM;

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
      let effectname = '';
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
          effectname = <string>effectFromActor.name ?? effectFromActor.data.label;
        }
      }
      if (!suppressedTmp) {
        appliedTmp = appliedTmp || (passiveTmp && !disabledTmp);
      } else {
        appliedTmp = !appliedTmp;
      }

      return <LightDataHud>{
        route: im,
        name: item.name,
        applied: appliedTmp,
        disabled: disabledTmp,
        suppressed: suppressedTmp,
        temporary: temporaryTmp,
        passive: passiveTmp,
        img: img,
        vid: vid,
        type: img || vid,
        itemid: item.id,
        effectid: effectid,
        effectname: effectname,
      };
    }),
  );

  const wildcardDisplay = await renderTemplate(`/modules/${CONSTANTS.MODULE_NAME}/templates/artSelect.hbs`, {
    tokenId,
    actorId,
    imagesParsed,
    imageDisplay,
    imageOpacity,
    isGM,
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

      // const controlled = <Token[]>canvas.tokens?.controlled;
      // const index = controlled.findIndex((x) => x.data._id === tokenD.id);
      // const tokenToChange = <Token>controlled[index];
      // const actorId = <string>tokenToChange.actor?.id;

      let actorId: string | null = null;
      let tokenId: string | null = null;
      let itemId: string | null = null;
      let effectId: string | null = null;
      let effectName: string | null = null;
      let isApplied: boolean | null = null;

      if (game.settings.get(CONSTANTS.MODULE_NAME, 'imageDisplay')) {
        actorId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-actor-id');
        tokenId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-token-id');
        itemId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-item-id');
        effectId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-effect-id');
        effectName = <string>$(this).find('.lights-hud-ate-button-image').attr('data-effect-name');
        isApplied = <string>$(this).find('.lights-hud-ate-button-image').attr('data-applied') == 'true';
      } else {
        actorId = <string>$(this).find('.lights-hud-ate-button-image-text').attr('data-actor-id');
        tokenId = <string>$(this).find('.lights-hud-ate-button-image-text').attr('data-token-id');
        itemId = <string>$(this).find('.lights-hud-ate-button-image-text').attr('data-item-id');
        effectId = <string>$(this).find('.lights-hud-ate-button-image-text').attr('data-effect-id');
        effectName = <string>$(this).find('.lights-hud-ate-button-image-text').attr('data-effect-name');
        isApplied = <string>$(this).find('.lights-hud-ate-button-image-text').attr('data-applied') == 'true';
      }

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

      confirmDialogATLEffectItem(actorId, itemId, effectId, actor.name, tokenD.name, effectName, isApplied).render(
        true,
      );
    });
    buttons[button].addEventListener('contextmenu', async function (event) {
      event.preventDefault();
      event.stopPropagation();
      const buttonClick = event.button; // 0 left click

      const actorId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-actor-id');
      const tokenId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-token-id');
      const itemId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-item-id');
      const effectId = <string>$(this).find('.lights-hud-ate-button-image').attr('data-effect-id');
      const effectName = <string>$(this).find('.lights-hud-ate-button-image').attr('data-effect-name');
      const isApplied = <string>$(this).find('.lights-hud-ate-button-image').attr('data-applied') == 'true';
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

      // TODO SET UP ANIMATION ?? MAYBE IN SOME FUTURE RELEASE

      // const animation = $(event.currentTarget.parentElement.parentElement)
      // .find(".anim-dropdown")
      // .val();

      const duplicates = 1; // number od dropped light

      const item = <Item>actor.items.get(itemId);
      let actorDropTheTorch: Actor | null = null;
      try {
        let tokenDataDropTheTorch = <TokenData>await prepareTokenDataDropTheTorch(item, _token?.data?.elevation ?? 0);
        actorDropTheTorch = <Actor>game.actors?.get(<string>tokenDataDropTheTorch.actorId);
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
        await warpgate.spawnAt(
          { x: posData.x, y: posData.y },
          tokenDataDropTheTorch,
          customTokenData || {},
          {},
          { duplicates },
        );
      } finally {
        if (actorDropTheTorch) {
          // Remove actor at the end
          await (<Actor>actorDropTheTorch).delete();
        }
      }
    });
  });

  buttonMacroPreset.on('click', async function (event) {
    event.preventDefault();
    event.stopPropagation();
    const buttonClick = event.button; // 0 left click
    const actorId = <string>$(this).attr('data-actor-id');
    const tokenId = <string>$(this).attr('data-token-id');
    // A macro for the Foundry virtual tabletop that lets a user configure their token's vision and lighting settings. This script is taken from Sky's foundry repo here: https://github.com/Sky-Captain-13/foundry/blob/master/scriptMacros/tokenVision.js.
    const applyChanges = false;
    presetDialog(applyChanges).render(true);
  });

  buttonMacroCustom.on('click', async function (event) {
    event.preventDefault();
    event.stopPropagation();
    const buttonClick = event.button; // 0 left click
    const actorId = <string>$(this).attr('data-actor-id');
    const tokenId = <string>$(this).attr('data-token-id');
    // A macro for the Foundry virtual tabletop that lets a user configure their token's vision and lighting settings. This script is taken from Sky's foundry repo here: https://github.com/Sky-Captain-13/foundry/blob/master/scriptMacros/tokenVision.js.
    const applyChanges = false;
    customDialog(applyChanges).render(true);
  });
}

export function presetDialog(applyChanges: boolean): Dialog {
  return new Dialog({
    title: `Token Vision Configuration (Preset)`,
    content: `
    <form>
      <div class="form-group">
        <label>Apply as ATE/ATL Effect:</label>
        <div class="form-fields">
          <input type="checkbox" name="apply-as-atl-ate" value="false" onclick="$(this).attr('value', this.checked ? true : false)"/>
        </div>
      </div>
      <div class="form-group">
        <label>Lock rotation:</label>
        <div class="form-fields">
          <input type="checkbox" name="lock-rotation" value="false" onclick="$(this).attr('value', this.checked ? true : false)"/>
        </div>
      </div>
      <div class="form-group">
        <label>Vision Type:</label>
        <select id="vision-type" name="vision-type">
          ${API.VISIONS.map((vision) => {
            return `\t<option value=${vision.id}>${i18n(vision.name)}</option>`;
          }).join('\n')}
        </select>
      </div>
      <div class="form-group">
        <label>Light Source:</label>
        <select id="light-source" name="light-source">
          ${API.LIGHTS.map((lightSource) => {
            return `\t<option value=${lightSource.id}>${i18n(lightSource.name)}</option>`;
          }).join('\n')}
        </select>
      </div>
      <div class="form-group">
        <label>Duration in Minutes:</label>
        <input type="number" id="duration" name="duration" min="0">
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
          const actorId = <string>token.actor?.id;
          const tokenId = token.id;
          const applyAsAtlAteEffect = html.find('[name="apply-as-atl-ate"]')[0].value == 'true' ?? false;
          const visionType = html.find('[name="vision-type"]')[0].value || VisionHUDPreset.NONE;
          const lightSource = html.find('[name="light-source"]')[0].value || LightHUDPreset.NONE;
          const visionIndex = <VisionHUDElement>API.VISIONS.find((e) => e.id == visionType); // parseInt(html.find('[name="vision-type"]')[0].value) || 0;
          const lightIndex = <LightHUDElement>API.LIGHTS.find((e) => e.id == lightSource); // parseInt(html.find('[name="light-source"]')[0].value) || 0;
          const duration = parseInt(html.find('[name="duration"]')[0].value) || 0;
          const lockRotation = html.find('[name="lock-rotation"]')[0].value == 'true' ?? token.data.lockRotation;
          let alias: string | null = null;
          if (actorId || tokenId) {
            if (!alias) {
              if (token) {
                alias = <string>token.name;
              } else {
                alias = <string>game.actors?.get(actorId)?.name;
              }
            }
          }
          const speaker = { scene: game.scenes?.current?.id, actor: actorId, token: tokenId, alias: alias };

          // About time configuration
          if (duration > 0) {
            if (game.modules.get('about-time')?.active != true) {
              ui.notifications?.error("About Time isn't loaded");
            } else {
              ((backup) => {
                //@ts-ignore
                game.Gametime.doIn({ minutes: Math.floor((3 * duration) / 4) }, () => {
                  dialogWarning(`The ${i18n(lightIndex.name)} burns low...`);
                  ChatMessage.create(
                    {
                      user: game.user?.id,
                      content: `The ${i18n(lightIndex.name)} burns low...`,
                      speaker: speaker,
                    },
                    {},
                  );
                });
              })(Object.assign({}, token.data));
              ((backup) => {
                //@ts-ignore
                game.Gametime.doIn({ minutes: duration }, () => {
                  dialogWarning(`The ${i18n(lightIndex.name)} burns low...`);
                  ChatMessage.create(
                    {
                      user: game.user?.id,
                      content: `The ${i18n(lightIndex.name)} goes out, leaving you in darkness.`,
                      speaker: speaker,
                    },
                    {},
                  );
                  updateTokenLighting(
                    token,
                    backup.lockRotation,
                    backup.dimSight,
                    backup.brightSight,
                    backup.sightAngle,
                    backup.light.dim,
                    backup.light.bright,
                    <string>backup.light.color,
                    backup.light.alpha,
                    backup.light.angle,
                    <string>backup.light.animation.type,
                    backup.light.animation.speed,
                    backup.light.animation.intensity,
                    applyAsAtlAteEffect,
                    lightIndex.name,
                    lightIndex.img,
                  );
                });
              })(Object.assign({}, token.data));
            }
          }

          // Configure new token vision
          const dimSight = visionIndex.dimSight ?? token.data.dimSight;
          const brightSight = visionIndex.brightSight ?? token.data.brightSight;
          const sightAngle = visionIndex.sightAngle ?? token.data.sightAngle;

          const dimLight = lightIndex.dimLight ?? token.data.light.dim;
          const brightLight = lightIndex.brightLight ?? token.data.light.bright;
          const lightAngle = lightIndex.lightAngle ?? token.data.light.angle;

          // Common settings for all 'torch-like' options
          // Feel free to change the values to your liking
          const lightAnimation = {
            type: lightIndex.lightAnimationType ?? token.data.light.animation.type,
            speed: lightIndex.lightAnimationSpeed ?? token.data.light.animation.speed,
            intensity: lightIndex.lightAnimationIntensity ?? token.data.light.animation.intensity,
          };
          const lightColor = lightIndex.lightColor ?? <string>token.data.light.color;
          const lightAlpha = lightIndex.lightAlpha ?? <number>token.data.light.alpha;
          // Update Token
          updateTokenLighting(
            token,
            lockRotation,
            dimSight,
            brightSight,
            sightAngle,
            dimLight,
            brightLight,
            lightColor,
            lightAlpha,
            lightAngle,
            <string>lightAnimation.type,
            <number>lightAnimation.speed,
            <number>lightAnimation.intensity,
            applyAsAtlAteEffect,
            lightIndex.name,
            lightIndex.img,
          );
        }
      }
    },
  });
}

export function customDialog(applyChanges: boolean): Dialog {
  let lightTypes = `<option selected value="none"> None</option>`;
  for (const [k, v] of Object.entries(CONFIG.Canvas.lightAnimations)) {
    if (v) {
      const name = game.i18n.localize(v.label);
      lightTypes += `<option value="${k.toLocaleLowerCase()}">${name}</option>`;
    }
  }

  if (game.modules.get('CommunityLighting')?.active) {
    lightTypes += `
      <optgroup label= "Blitz" id="animationType">
      <option value="BlitzFader">Fader</option>
      <option value="BlitzLightning"}>Lightning (experimental)</option>
      <option value="BlitzElectric Fault">Electrical Fault</option>
      <option value="BlitzSimple Flash">Simple Flash</option>
      <option value="BlitzRBG Flash">RGB Flash</option>
      <option value="BlitzPolice Flash">Police Flash</option>
      <option value="BlitzStatic Blur"> Static Blur</option>
      <option value="BlitzAlternate Torch">Alternate Torch</option>
      <option value="BlitzBlurred Torch">Blurred Torch</option>
      <option value="BlitzGrid Force-Field Colorshift">Grid Force-Field Colorshift</option>
      </optgroup>
      <optgroup label="SecretFire" id="animationType">
      <option value="SecretFireGrid Force-Field">Grid Force-Field</option>
      <option value="SecretFireSmoke Patch">Smoke Patch</option>
      <option value="SecretFireStar Light">Star Light</option>
      <option value="SecretFireStar Light Disco">Star Light Disco</option>
      </optgroup>
  `;
  }

  $('.myCheckbox').prop('checked', true);
  $('.myCheckbox').prop('checked', false);

  return new Dialog({
    title: `Token Vision Configuration (Custom)`,
    content: `
  <form>
    <div class="form-group">
      <label>Temporary name for the light:</label>
      <div class="form-fields">
        <input type="text" name="temp-name" value="Custom Light"/>
      </div>
    </div>
    <div class="form-group">
      <label>Apply as ATE/ATL Effect:</label>
      <div class="form-fields">
        <input type="checkbox" name="apply-as-atl-ate" value="false" onclick="$(this).attr('value', this.checked ? true : false)"/>
      </div>
    </div>
    <div class="form-group">
      <label>Lock rotation:</label>
      <div class="form-fields">
        <input type="checkbox" name="lock-rotation" value="false" onclick="$(this).attr('value', this.checked ? true : false)"/>
      </div>
    </div>
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
      <label>Sight angle:</label>
      <div class="form-fields">
        <input type="number" name="sight-angle" value="360" />
      </div>
    </div>
    <div class="form-group">
      <label>Dim Light:</label>
      <div class="form-fields">
        <input type="number" name="light-dim" value="0" />
      </div>
    </div>
    <div class="form-group">
      <label>Bright Light:</label>
      <div class="form-fields">
        <input type="number" name="light-bright" value="0" />
      </div>
    </div>
    <div class="form-group">
      <label>Light angle:</label>
      <div class="form-fields">
        <input type="number" name="light-angle" value="360" />
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
        <input type="range" name="light-alpha" value="0.5  min="0" max="1"  step="0.15" />
      </div>
    </div>
    <div class="form-group">
      <label>Light animation type:</label>
      <div class="form-fields">
        <select id="light-source" name="light-animation-type" >${lightTypes}</select>
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
      <label>Duration in Minutes:</label>
      <input type="number" id="duration" name="duration" min="0">
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
          const actorId = <string>token.actor?.id;
          const tokenId = token.id;
          const applyAsAtlAteEffect = html.find('[name="apply-as-atl-ate"]')[0].value == 'true' ?? false;
          const tempName = <string>html.find('[name="temp-name"]')[0].value || '';
          // const tempImage = <string>html.find('[name="temp-image"]')[0].value || '';
          // const visionType = html.find('[name="vision-type"]')[0].value || 'none';
          // const lightSource = html.find('[name="light-source"]')[0].value || 'none';
          const dimSight = html.find('[name="dim-sight"]')[0].value || 0;
          const brightSight = html.find('[name="bright-sight"]')[0].value || 0;
          const sightAngle = html.find('[name="sight-angle"]')[0].value || 360;
          const dimLight = html.find('[name="light-dim"]')[0].value || 0;
          const brightLight = html.find('[name="light-bright"]')[0].value || 0;
          const lightAngle = html.find('[name="light-angle"]')[0].value || 360;
          const duration = parseInt(html.find('[name="duration"]')[0].value) || 0;
          const lockRotation = html.find('[name="lock-rotation"]')[0].value == 'true' || token.data.lockRotation;

          let alias: string | null = null;
          if (actorId || tokenId) {
            if (!alias) {
              if (token) {
                alias = <string>token.name;
              } else {
                alias = <string>game.actors?.get(actorId)?.name;
              }
            }
          }
          const speaker = { scene: game.scenes?.current?.id, actor: actorId, token: tokenId, alias: alias };

          // About time configuration
          if (duration > 0) {
            if (game.modules.get('about-time')?.active != true) {
              ui.notifications?.error("About Time isn't loaded");
            } else {
              ((backup) => {
                //@ts-ignore
                game.Gametime.doIn({ minutes: Math.floor((3 * duration) / 4) }, () => {
                  dialogWarning(`The ${tempName} burns low...`);
                  ChatMessage.create(
                    {
                      user: game.user?.id,
                      content: `The ${tempName} burns low...`,
                      speaker: speaker,
                    },
                    {},
                  );
                });
              })(Object.assign({}, token.data));
              ((backup) => {
                //@ts-ignore
                game.Gametime.doIn({ minutes: duration }, () => {
                  dialogWarning(`The ${tempName} burns low...`);
                  ChatMessage.create(
                    {
                      user: game.user?.id,
                      content: `The ${tempName} goes out, leaving you in darkness.`,
                      speaker: speaker,
                    },
                    {},
                  );
                  updateTokenLighting(
                    token,
                    backup.lockRotation,
                    backup.dimSight,
                    backup.brightSight,
                    backup.sightAngle,
                    backup.light.dim,
                    backup.light.bright,
                    <string>backup.light.color,
                    backup.light.alpha,
                    backup.light.angle,
                    <string>backup.light.animation.type,
                    backup.light.animation.speed,
                    backup.light.animation.intensity,
                    applyAsAtlAteEffect,
                    tempName,
                    '',
                  );
                });
              })(Object.assign({}, token.data));
            }
          }

          // const lightAnimation = token.data.lightAnimation;
          // Enable the Light Source type according to the type
          // "torch" / "pulse" / "chroma" / "wave" / "fog" / "sunburst" / "dome"
          // "emanation" / "hexa" / "ghost" / "energy" / "roiling" / "hole"
          const lightAnimationType =
            html.find('[name="light-animation-type"]')[0].value || token.data.light.animation.type || 'none';
          const lightAnimationSpeed =
            html.find('[name="light-animation-speed"]')[0].value || token.data.light.animation.speed;
          const lightAnimationIntensity =
            html.find('[name="light-animation-intensity"]')[0].value || token.data.light.animation.intensity;
          const lightAlpha = html.find('[name="light-alpha"]')[0].value || token.data.light.alpha;
          const lightColor = html.find('[name="light-color"]')[0].value || token.data.light.color;
          // Update Token
          updateTokenLighting(
            token,
            lockRotation,
            dimSight,
            brightSight,
            sightAngle,
            dimLight,
            brightLight,
            lightColor,
            lightAlpha,
            lightAngle,
            <string>lightAnimationType,
            <number>lightAnimationSpeed,
            <number>lightAnimationIntensity,
            applyAsAtlAteEffect,
            tempName,
            '',
          );
        }
      }
    },
  });
}

export function confirmDialogATLEffectItem(
  actorId,
  itemId,
  effectId,
  actorname,
  tokenName,
  effectName,
  isApplied,
): Dialog {
  return new Dialog({
    title: i18n(`lights-hud-ate.windows.dialogs.confirm.apply.title`),
    // content: `<div><h2>Are you sure to ${
    //   isApplied ? 'disabled' : 'enabled'
    // } the active effect '${effectName}' on actor '${actorname}' (token name is '${tokenName}')?</h2><div>`,
    content: `<div><h2>${i18nFormat(`lights-hud-ate.windows.dialogs.confirm.apply.content`, {
      isApplied: isApplied ? 'disabled' : 'enabled' ,
      effectName: effectName,
      actorname: actorname,
      tokenName: tokenName,
    })}</h2><div>`,
    buttons: {
      yes: {
        label: i18n(`lights-hud-ate.windows.dialogs.confirm.apply.choice.yes`),
        callback: (html) => {
          manageActiveEffectATL(actorId, itemId, effectId, isApplied);
        },
      },
      no: {
        label: i18n(`lights-hud-ate.windows.dialogs.confirm.apply.choice.no`),
        callback: (html) => {
          // Do nothing
        },
      },
    },
    default: 'no',
  });
}

export function manageActiveEffectATL(actorId, itemId, effectId, isApplied) {
  // We roll the item ???
  try {
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
  } finally {
    if (isApplied) {
      // const atlEffectsS = obj.effects.filter((entity: ActiveEffect) => {
      //   return entity.data.changes.find((effect) => effect.key.includes('ATL')) != undefined;
      // });
      // const effectFromActor = <ActiveEffect>actor.data.effects.find((ae: ActiveEffect) => {
      //   return effectId == ae.id;
      // });
      API.toggleEffectOnActor(actorId, <string>effectId, false, false, true);
    } else {
      API.toggleEffectOnActor(actorId, <string>effectId, false, true, false);
    }
  }
}
