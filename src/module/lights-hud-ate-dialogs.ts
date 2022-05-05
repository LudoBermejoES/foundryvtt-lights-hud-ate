import type { TokenData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import API from './api';
import CONSTANTS from './constants';
import {
  checkNumberFromString,
  dialogWarning,
  error,
  i18n,
  i18nFormat,
  prepareTokenDataDropTheTorch,
  rollDependingOnSystem,
  updateTokenLighting,
  warn,
} from './lib/lib';
import {
  LightDataDialog,
  LightHUDElement,
  LightHUDPreset,
  VisionHUDElement,
  VisionHUDPreset,
} from './lights-hud-ate-models';

export function presetDialog(applyChanges: boolean): Dialog {
  return new Dialog({
    title: `Token Vision Configuration (Preset)`,
    content: `
    <form>
      <div class="form-group">
        <label>Apply as ATE/ATL Effect:</label>
        <div class="form-fields">
          <input type="checkbox" id="apply-as-atl-ate" name="apply-as-atl-ate" value="false" onclick="$(this).attr('value', this.checked ? true : false)"/>
        </div>
      </div>
      <div class="form-group">
        <label>Lock rotation:</label>
        <div class="form-fields">
          <input type="checkbox" id="lock-rotation" name="lock-rotation" value="false" onclick="$(this).attr('value', this.checked ? true : false)"/>
        </div>
      </div>
      <div class="form-group">
        <label>Vision Type:</label>
        <select id="vision-type" name="vision-type" is="ms-dropdown-ligthhudate">
          ${API.VISIONS.map((vision) => {
            return `\t<option data-image="${vision.img}" value=${vision.id}>${i18n(vision.name)}</option>`;
          }).join('\n')}
        </select>
      </div>
      <div class="form-group">
        <label>Light Source:</label>
        <select id="light-source" name="light-source" is="ms-dropdown-ligthhudate">
          ${API.LIGHTS.map((lightSource) => {
            return `\t<option data-image="${lightSource.img}" value=${lightSource.id}>${i18n(
              lightSource.name,
            )}</option>`;
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
          const vision = visionType != VisionHUDPreset.NONE;
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
                    //backup.lockRotation,
                    backup.dimSight,
                    backup.brightSight,
                    backup.sightAngle,
                    backup.light.dim,
                    backup.light.bright,
                    <string>backup.light.color,
                    backup.light.alpha,
                    backup.light.angle,

                    null, //coloration: coloration,
                    null, //luminosity: luminosity,
                    null, //gradual: gradual,
                    null, //saturation: saturation,
                    null, //contrast: contrast,
                    null, //shadows: shadows,

                    <string>backup.light.animation.type,
                    backup.light.animation.speed,
                    backup.light.animation.intensity,
                    backup.light.animation.reverse,

                    applyAsAtlAteEffect,
                    lightIndex.name,
                    lightIndex.img,
                    duration,

                    vision,
                    //id,
                    // backup.name,
                    backup.height,
                    backup.width,
                    backup.scale,
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
            //lockRotation,
            dimSight,
            brightSight,
            sightAngle,
            dimLight,
            brightLight,
            lightColor,
            lightAlpha,
            lightAngle,

            null, //coloration: coloration,
            null, //luminosity: luminosity,
            null, //gradual: gradual,
            null, //saturation: saturation,
            null, //contrast: contrast,
            null, //shadows: shadows,

            <string>lightAnimation.type,
            <number>lightAnimation.speed,
            <number>lightAnimation.intensity,
            false, // <boolean>lightAnimation.reverse,

            applyAsAtlAteEffect,
            lightIndex.name,
            lightIndex.img,
            duration,

            vision,
            //id,
            // name,
            // height,
            // width,
            // scale,
          );
        }
      }
    },
  });
}

export function customATLDialog(applyChanges: boolean, preset: any = undefined, copy = false): Dialog {
  let { light, dimSight, brightSight, sightAngle, name, height, width, scale, id } = preset ? preset : 0;
  let { dim, bright, color, animation, alpha, angle, coloration, contrast, gradual, luminosity, saturation, shadows } =
    light ? light : 0;
  switch (copy) {
    case true: {
      name = `${name} (copy)`;
      break;
    }
    case false: {
      name = `${name}`;
      break;
    }
    default: {
      name = '';
    }
  }


  if (name === undefined) name = '';
  if (light === undefined) light = undefined;

  if (!id) id = randomID();
  if (id === undefined) id = '';
  if (height === undefined) height = '';
  if (width === undefined) width = '';
  if (scale === undefined) scale = '';
  if (dim === undefined) dim = '';
  if (bright === undefined) bright = '';
  if (dimSight === undefined) dimSight = '';
  if (brightSight === undefined) brightSight = '';
  if (sightAngle === undefined) sightAngle = '';
  if (color === undefined) color = '';
  if (angle === undefined) angle = '';
  if (alpha === undefined) alpha = '';
  if (animation === undefined) animation = {};
  if (coloration === undefined) coloration = '';
  if (contrast === undefined) contrast = '';
  if (gradual === undefined) gradual = false;
  if (luminosity === undefined) luminosity = '';
  if (saturation === undefined) saturation = '';
  if (shadows === undefined) shadows = '';

  let colorationTypes = ``;
  for (const [k, v] of Object.entries(AdaptiveLightingShader.COLORATION_TECHNIQUES)) {
    const name = game.i18n.localize(v.label);
    colorationTypes += `<option value="${v.id}" ${coloration === v.id ? 'selected' : ''}>${name}</option>`;
  }

  let lightTypes = `<option value="none">None</option>`;
  for (const [k, v] of Object.entries(CONFIG.Canvas.lightAnimations)) {
    const name = game.i18n.localize(v.label);
    lightTypes += `<option value="${k.toLocaleLowerCase()}" ${animation.type === k ? 'selected' : ''}>${name}</option>`;
  }

  if (game.modules.get('CommunityLighting')?.active) {
    lightTypes += `
      <optgroup label= "Blitz" id="animationType">
        <option value="BlitzFader"
          ${animation.type === 'BlitzFader'
          ? 'selected' : ''}>Fader
        </option>
        <option value="BlitzLightning"
          ${animation.type === 'BlitzLightning'
          ? 'selected' : ''}>Lightning (experimental)
        </option>
        <option value="BlitzElectric Fault"
          ${animation.type === 'BlitzElectric Fault'
          ? 'selected'
          : ''}>Electrical Fault</option>
        <option value="BlitzSimple Flash"
          ${animation.type === 'BlitzSimple Flash'
          ? 'selected'
          : ''}>Simple Flash
        </option>
        <option value="BlitzRBG Flash"
          ${animation.type === 'BlitzRBG Flash'
          ? 'selected'
          : ''}>RGB Flash
        </option>
        <option value="BlitzPolice Flash"
          ${animation.type === 'BlitzPolice Flash'
          ? 'selected'
          : ''}>Police Flash
        </option>
        <option value="BlitzStatic Blur"
          ${animation.type === 'BlitzStatic Blur'
          ? 'selected'
          : ''}>Static Blur
        </option>
        <option value="BlitzAlternate Torch"
          ${animation.type === 'BlitzAlternate Torch'
          ? 'selected'
          : ''}>Alternate Torch
        </option>
        <option value="BlitzBlurred Torch"
          ${animation.type === 'BlitzBlurred Torch'
          ? 'selected'
          : ''}>Blurred Torch
        </option>
        <option value="BlitzGrid Force-Field Colorshift"
          ${animation.type === 'BlitzGrid Force-Field Colorshift'
          ? 'selected'
          : ''}>Grid Force-Field Colorshift
        </option>
      </optgroup>
      <optgroup label="SecretFire" id="animationType">
        <option value="SecretFireGrid Force-Field"
          ${animation.type === 'SecretFireGrid Force-Field'
          ? 'selected'
          : ''}>Grid Force-Field
        </option>
        <option value="SecretFireSmoke Patch"
          ${animation.type === 'SecretFireSmoke Patch'
          ? 'selected'
          : ''}>Smoke Patch
        </option>
        <option value="SecretFireStar Light"
          ${animation.type === 'SecretFireStar Light'
          ? 'selected'
          : ''}>Star Light
        </option>
        <option value="SecretFireStar Light Disco"
          ${animation.type === 'SecretFireStar Light Disco'
          ? 'selected'
          : ''}>Star Light Disco
        </option>
      </optgroup>
  `;
  }

  // TODO ma l'id di sotto deve essere sostituito con il name ????

  const dialogContent = `
  <form>
      <div class="form-group">
          <label>Effect Name</label>
          <div class="form-fields">
            <input id="name" name="${id}" type="text" value="${name}"></input>
          </div>
      </div>
      <div class="form-group">
        <label>Apply as ATE/ATL Effect:</label>
        <div class="form-fields">
          <input type="checkbox" id="apply-as-atl-ate" name="apply-as-atl-ate" value="false" onclick="$(this).attr('value', this.checked ? true : false)"/>
        </div>
      </div>
      <div class="form-group">
        <label>Duration in Minutes:</label>
        <input type="number" id="duration" name="duration" min="0">
      </div>
      <h3>Token Data</h3>
      <div class="form-group slim lights-hud-ate-sub-group">
          <label>Size</label>
          <div class="form-fields">
                  <label>Height</label>
                  <input id="height" name="height" type="number" value="${height}"></input>
                  <label>Width</label>
                  <input id="width" name="width" type="number" value="${width}"></input>
                  <label>Scale</label>
                  <input id="scale" name="scale" type="number" value="${scale}"></input>

          </div>
      </div>
      <div class="form-group slim lights-hud-ate-sub-group">
          <label>Vision</label>
          <div class="form-fields">
                  <label>Dim</label>
                  <input id="dimSight" name="dimSight" type="number" value="${dimSight}"></input>
                  <label>Bright</label>
                  <input id="brightSight" name="brightSight" type="number" value="${brightSight}"></input>
          </div>
      </div>
      <div class="form-group slim lights-hud-ate-sub-group">
      <label>Vision Angle</label>
          <div class="form-fields">
              <input id="sightAngle" name="sightAngle" type="number" min="0" max="360" step="1" value="${sightAngle}"></input>
          </div>
      </div>
      <h3>Lighting</h3>
      <div class="form-group slim lights-hud-ate-sub-group">
          <label>Light Radius</label>
          <div class="form-fields ">
                  <label>Dim</label>
                  <input id="dim" name="dim" type="number" value="${dim}"></input>
                  <label>Bright</label>
                  <input id="bright" name="bright" type="number" value="${bright}"></input>
          </div>
      </div>
      <div class="form-group slim lights-hud-ate-sub-group">
          <label>Emission Angle</label>
          <div class="form-fields">
              <input id="angle" name="angle" type="number" min="0" max="360" step="1" value="${angle}"></input>
          </div>
      </div>
      <div class="form-group slim lights-hud-ate-sub-group">
          <label>Light Color</label>
          <div class="form-fields">
            <input type="color" id="color" name="color" value="${color}">
          </div>
      </div>
      <div class="form-group slim lights-hud-ate-sub-group">
      <label>Color Intensity</label>
          <div class="form-fields">
              <input id="alpha" name="alpha" type="number" min="0" max="1" placeholder="0-1" value="${alpha}"></input>
          </div>
      </div>
      <h3>Animation</h3>
      <div class="form-group lights-hud-ate-sub-group">
          <label>Animation Type</label>
          <div class="form-fields">
              <select id="animationType" name="animationType" >${lightTypes}</select>
          </div>
      </div>
      <div class="form-group lights-hud-ate-sub-group">
          <label>Animation Speed</label>
          <div class="form-fields">
              <input id="animationSpeed" name="animationSpeed" type="range" min="1" max="10" step="1"
              value="${animation?.speed}"></input>
          </div>
      </div>
      <div class="form-group lights-hud-ate-sub-group">
          <label>Reverse Direction</label>
          <div class="form-fields">
              <input type="checkbox" id="animationReverse" name="animationReverse"
              ${animation?.reverse ? 'checked' : ''}
              onclick="$(this).attr('value', this.checked ? true : false)">
          </div>
      </div>
      <div class="form-group lights-hud-ate-sub-group">
          <label>Animation Intensity</label>
          <div class="form-fields">
              <input id="animationIntensity" name="animationIntensity" type="range" min="1" max="10" step="1"
              value="${animation?.intensity}"></input>
          </div>
      </div>
      <h3>Advanced Animation</h3>
      <div class="form-group lights-hud-ate-sub-group">
          <label>Coloration Technique</label>
          <div class="form-fields">
              <select id="lightColoration" name="lightColoration" data-dtype="Number">
              ${colorationTypes}
              </select>
          </div>
      </div>

      <div class="form-group lights-hud-ate-sub-group">
          <label>Luminosity</label>
          <div class="form-fields">
              <input type="range" id="lightLuminosity" name="lightLuminosity" value="${luminosity}" min="-1" max="1" step="0.05">
              <span class="range-value">0.5</span>
          </div>
      </div>

      <div class="form-group lights-hud-ate-sub-group">
          <label>Gradual Illumination</label>
          <div class="form-fields">
              <input type="checkbox" id="lightGradual" name="lightGradual"
              ${gradual ? 'checked' : ''}
              onclick="$(this).attr('value', this.checked ? true : false)">
          </div>
      </div>

      <div class="form-group lights-hud-ate-sub-group">
          <label>Background Saturation</label>
          <div class="form-fields">
              <input type="range" id="lightSaturation" name="lightSaturation" value="${saturation}" min="-1" max="1" step="0.05">
          </div>
      </div>

      <div class="form-group lights-hud-ate-sub-group">
          <label>Background Contrast</label>
          <div class="form-fields">
              <input type="range" id="lightContrast" name="lightContrast" value="${contrast}" min="-1" max="1" step="0.05">
          </div>
      </div>

      <div class="form-group lights-hud-ate-sub-group">
          <label>Background Shadows</label>
          <div class="form-fields">
              <input type="range" id="lightShadows" name="lightShadows" value="${shadows}" min="0" max="1" step="0.05">
          </div>
      </div>
  `;

  return new Dialog({
    title: `Token Vision Configuration (Custom)`,
    content: dialogContent,
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
    default: 'no',
    close: async (html: any) => {
      if (applyChanges) {
        const id = <string>html.find('#name')[0].name || randomID();
        const effectName = <string>html.find('#name')[0].value || '';
        const height = <number>await checkNumberFromString(html.find('#height')[0].value);
        const width = <number>await checkNumberFromString(html.find('#width')[0].value);
        const scale = <number>await checkNumberFromString(html.find('#scale')[0].value);
        const dimLight = <number>await checkNumberFromString(html.find('#dim')[0].value);
        const brightLight = <number>await checkNumberFromString(html.find('#bright')[0].value);
        const dimSight = <number>await checkNumberFromString(html.find('#dimSight')[0].value);
        const brightSight = <number>await checkNumberFromString(html.find('#brightSight')[0].value);
        const lightColor = <string>html.find('#color')[0].value;
        const sightAngle = <number>await checkNumberFromString(html.find('#sightAngle')[0].value);
        const lightAlpha = <number>await checkNumberFromString(html.find('#alpha')[0].value);
        const lightAngle = <number>await checkNumberFromString(html.find('#angle')[0].value);
        const lightAnimationType = <string>html.find('#animationType')[0].value;
        const lightAnimationSpeed = <number>await checkNumberFromString(html.find('#animationSpeed')[0].value);
        const lightAnimationIntensity = <number>await checkNumberFromString(html.find('#animationIntensity')[0].value);
        const lightAnimationReverse = <boolean>html.find('#animationIntensity').is(':checked');
        const coloration = <number>await checkNumberFromString(html.find('#lightColoration')[0].value);
        const luminosity = <number>await checkNumberFromString(html.find('#lightLuminosity')[0].value);
        const gradual = <boolean>html.find('#lightGradual').is(':checked');
        const saturation = <number>await checkNumberFromString(html.find('#lightSaturation')[0].value);
        const contrast = <number>await checkNumberFromString(html.find('#lightContrast')[0].value);
        const shadows = <number>await checkNumberFromString(html.find('#lightShadows')[0].value);
        const vision = dimSight > 0 || brightSight > 0 ? true : false;

        const applyAsAtlAteEffect = <boolean>html.find('#apply-as-atl-ate').is(':checked') ?? false;
        const duration = <number>html.find('#duration')[0].value;

        // const tokenData:TokenData = {
        //     name: effectName,
        //     height: height,
        //     width: width,
        //     scale: scale,
        //     light: {
        //         dim: dimLight,
        //         bright: brightLight,
        //         color: lightColor,
        //         //@ts-ignore
        //         animation: {
        //             type: lightAnimationType,
        //             speed: lightAnimationSpeed,
        //             intensity: lightAnimationIntensity,
        //             reverse: lightAnimationReverse
        //         },
        //         alpha: lightAlpha,
        //         angle: lightAngle,
        //         coloration: coloration,
        //         luminosity: luminosity,
        //         gradual: gradual,
        //         saturation: saturation,
        //         contrast: contrast,
        //         shadows: shadows,
        //     },
        //     dimSight: dimSight,
        //     brightSight: brightSight,
        //     sightAngle: sightAngle,

        //     id: id
        // }
        //const final = Object.fromEntries(Object.entries(object).filter(([_, v]) => v != ""));
        //ATL.AddPreset(tempName, final)
        for (const token of <Token[]>canvas.tokens?.controlled) {
          const actorId = <string>token.actor?.id;
          const tokenId = token.id;

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
                  dialogWarning(`The ${effectName} burns low...`);
                  ChatMessage.create(
                    {
                      user: game.user?.id,
                      content: `The ${effectName} burns low...`,
                      speaker: speaker,
                    },
                    {},
                  );
                });
              })(Object.assign({}, token.data));
              ((backup) => {
                //@ts-ignore
                game.Gametime.doIn({ minutes: duration }, () => {
                  dialogWarning(`The ${effectName} burns low...`);
                  ChatMessage.create(
                    {
                      user: game.user?.id,
                      content: `The ${effectName} goes out, leaving you in darkness.`,
                      speaker: speaker,
                    },
                    {},
                  );
                  updateTokenLighting(
                    token,
                    //backup.lockRotation,
                    backup.dimSight,
                    backup.brightSight,
                    backup.sightAngle,
                    backup.light.dim,
                    backup.light.bright,
                    <string>backup.light.color,
                    backup.light.alpha,
                    backup.light.angle,

                    backup.light.coloration,
                    backup.light.luminosity,
                    backup.light.gradual,
                    backup.light.saturation,
                    backup.light.contrast,
                    backup.light.shadows,

                    <string>backup.light.animation.type,
                    backup.light.animation.speed,
                    backup.light.animation.intensity,
                    backup.light.animation.reverse,

                    applyAsAtlAteEffect,
                    effectName,
                    '',
                    duration,

                    backup.vision,
                    //id,
                    // backup.name,
                    backup.height,
                    backup.width,
                    backup.scale,
                  );
                });
              })(Object.assign({}, token.data));
            }
          }

          // Update Token
          updateTokenLighting(
            token,
            //lockRotation,
            dimSight,
            brightSight,
            sightAngle,
            dimLight,
            brightLight,
            lightColor,
            lightAlpha,
            lightAngle,

            coloration,
            luminosity,
            gradual,
            saturation,
            contrast,
            shadows,

            <string>lightAnimationType,
            <number>lightAnimationSpeed,
            <number>lightAnimationIntensity,
            lightAnimationReverse,

            applyAsAtlAteEffect,
            effectName,
            '',
            duration,

            vision,
            // token.id,
            // alias,
            height,
            width,
            scale,
          );
        }
      }
    },
  });
}

export function confirmDialogATLEffectItem(lightDataDialog: LightDataDialog): Dialog {
  return new Dialog({
    title: i18n(`lights-hud-ate.windows.dialogs.confirm.apply.title`),
    // content: `<div><h2>Are you sure to ${
    //   isApplied ? 'disabled' : 'enabled'
    // } the active effect '${effectName}' on actor '${actorname}' (token name is '${tokenName}')?</h2><div>`,
    content: `<div><h2>${i18nFormat(`lights-hud-ate.windows.dialogs.confirm.apply.content`, {
      isApplied: lightDataDialog.isApplied ? 'disabled' : 'enabled',
      effectName: lightDataDialog.effectName,
      itemName: lightDataDialog.itemName,
      actorName: lightDataDialog.actorName,
      tokenName: lightDataDialog.tokenName,
    })}</h2><div>`,
    buttons: {
      yes: {
        label: i18n(`lights-hud-ate.windows.dialogs.confirm.apply.choice.yes`),
        callback: (html) => {
          manageActiveEffectATL(
            lightDataDialog.tokenId,
            // lightDataDialog.actorId,
            lightDataDialog.itemId,
            lightDataDialog.effectId,
            lightDataDialog.isApplied,
          );
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

export function confirmDialogDropTheTorch(lightDataDialog: LightDataDialog): Dialog {
  return new Dialog({
    title: i18n(`lights-hud-ate.windows.dialogs.confirm.dropthetorch.title`),
    content: `<div><h2>${i18nFormat(`lights-hud-ate.windows.dialogs.confirm.dropthetorch.content`, {
      isApplied: lightDataDialog.isApplied ? 'disabled' : 'enabled',
      effectName: lightDataDialog.effectName,
      itemName: lightDataDialog.itemName,
      actorName: lightDataDialog.actorName,
      tokenName: lightDataDialog.tokenName,
    })}</h2><div>`,
    buttons: {
      yes: {
        label: i18n(`lights-hud-ate.windows.dialogs.confirm.dropthetorch.choice.yes`),
        callback: async (html) => {
          // const actor = <Actor>game.actors?.get(lightDataDialog.actorId);
          const token = canvas.tokens?.placeables.find((t) => {
            return t.id === lightDataDialog.tokenId;
          });
          if (!token) {
            warn(`No token found for the token with id '${lightDataDialog.tokenId}'`, true);
            return;
          }
          if (!token.actor) {
            warn(`No actor found for the token with id '${lightDataDialog.tokenId}'`, true);
            return;
          }
          const actor = token?.actor;

          // TODO SET UP ANIMATION ?? MAYBE IN SOME FUTURE RELEASE

          // const animation = $(event.currentTarget.parentElement.parentElement)
          // .find(".anim-dropdown")
          // .val();

          const duplicates = 1; // number od dropped light

          const item = <Item>actor.items.get(lightDataDialog.itemId);
          // let actorDropTheTorch: Actor | null = null;
          let tokenDataDropTheTorch: TokenData | null = null;
          // const tokenId = <string>randomID();
          try {
            const tokenDataDropTheTorchTmp = <TokenData>(
              await prepareTokenDataDropTheTorch(item, _token?.data?.elevation ?? 0)
            );
            // actorDropTheTorch = <Actor>game.actors?.get(<string>tokenDataDropTheTorchTmp.actorId);
            tokenDataDropTheTorch = await actor.getTokenData(tokenDataDropTheTorchTmp);
            // actorDropTheTorch = <Actor>await prepareTokenDataDropTheTorch(item, tokenId, _token?.data?.elevation ?? 0);
            // tokenDataDropTheTorch = await actor.getTokenData();
            //@ts-ignore
            const posData = await warpgate.crosshairs.show({
              size: Math.max(tokenDataDropTheTorch.width, tokenDataDropTheTorch.height) * tokenDataDropTheTorch.scale,
              icon: `modules/${CONSTANTS.MODULE_NAME}/assets/black-hole-bolas.webp`,
              label: `Drop the ${lightDataDialog.itemName}`,
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

            // TODO find a way to add this on the creation onf the token
            // Added atl effect to created token

            // const token = <Token>canvas.tokens?.placeables.find((t:Token) => {
            //   return t.id === tokenId;
            // });
            // if(!token){
            //   error(`No token is been created for the drop ATL item , this is probably a bug`)
            // }else{
            //   const atlEffects = item.effects.filter((entity) => {
            //     return entity.data.changes.find((effect) => effect.key.includes('ATL')) != undefined;
            //   });
            //   atlEffects.forEach(async (ae: ActiveEffect) => {
            //     // Make sure is enabled
            //     ae.data.disabled = false;
            //     ae.data.transfer = true;
            //     await API.addActiveEffectOnToken(<string>token.id, ae.data);
            //   });
            // }

            // 0 = None
            // 1 = Limited
            // 2 = Observer
            // 3 = Owner

            // Get the current permission level for the selected token.
            // const currentPermissions = <number>(<Actor>actorDropTheTorch).data.permission.default;
            // (<Actor>actorDropTheTorch).update({ permission: { default: 3 } });

            // const tokenPlaced = <Token>canvas.tokens?.placeables.find((t) => {
            //   return t.id === tokenDataDropTheTorch?._id;
            // });
            // const currentPermissions = <number>tokenPlaced.actor?.data.permission.default;
            // tokenPlaced.actor?.update({ permission: { default: 3 } });

            // If the current permission level is anything above 'None' then reset it to 'None'
            // if (currentPermissions > 0)
            // {
            //   (<Actor>actorDropTheTorch).update({permission:{default:0}});
            // }
            // // Otherwise, set it to 'Owner'
            // else
            // {
            //   (<Actor>actorDropTheTorch).update({permission:{default:3}});
            // }
          } finally {
            // if (actorDropTheTorch) {
            //   // Remove actor at the end
            //   await (<Actor>actorDropTheTorch).delete();
            // }
          }
        },
      },
      no: {
        label: i18n(`lights-hud-ate.windows.dialogs.confirm.dropthetorch.choice.no`),
        callback: (html) => {
          // Do nothing
        },
      },
    },
    default: 'no',
  });
}

function manageActiveEffectATL(tokenId, itemId, effectId, isApplied) {
  //const actor = <Actor>game.actors?.get(actorId);
  // if (actor.getActiveTokens().length <= 0) {
  //   warn(`No token found for the actor with id '${actorId}'`);
  //   return;
  // }
  // const tokenId = <string>actor.getActiveTokens()[0]?.id;
  const token = <Token>canvas.tokens?.placeables.find((t) => {
    return t.id === tokenId;
  });
  if (!token) {
    warn(`No token found for the token with id '${tokenId}'`, true);
    return;
  }
  if (!token.actor) {
    warn(`No actor found for the token with id '${tokenId}'`, true);
    return;
  }
  // We roll the item ???
  try {
    if (game.settings.get(CONSTANTS.MODULE_NAME, 'rollItem') && !isApplied) {
      const item = <Item>token.actor?.items.find((entity: Item) => {
        return <string>entity.id == itemId;
      });
      if (item) {
        // TODO if i need to manage the roll for specific system usually is enough item.roll()
        rollDependingOnSystem(item);
      } else {
        warn(`No item found for the id ${itemId}`, true);
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
      API.toggleEffectFromIdOnToken(tokenId, <string>effectId, false, false, true);
    } else {
      API.toggleEffectFromIdOnToken(tokenId, <string>effectId, false, true, false);
    }
  }
}
