import type EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs";
import type {
  ActorData,
  TokenData
} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import API from "./api";
import CONSTANTS from "./constants";
import {
  checkBooleanFromString,
  checkNumberFromString,
  i18n,
  i18nFormat,
  isStringEquals,
  prepareTokenDataDropTheTorch,
  retrieveItemLightsWithFlag,
  retrieveItemLightsWithFlagAndDisableThem,
  retrieveItemLightsWithFlagAndDisableThemLightsStatic,
  retrieveItemLightsWithFlagLightsStatic,
  rollDependingOnSystem,
  updateTokenLighting,
  updateTokenLightingFromData,
  warn
} from "./lib/lib";
import { getATLEffectsFromItem } from "./lights-hud-ate-config";
import {
  LightDataDialog,
  LightHUDElement,
  LightHUDNoteFlags,
  LightHUDPreset,
  VisionHUDElement,
  VisionHUDPreset
} from "./lights-hud-ate-models";
import { aemlApiLigthsHudAte } from "./module";

/**
 *
 * @param applyChanges
 */
export function presetDialog(applyChanges: boolean): Dialog {
  return new Dialog({
    title: "Token Vision Configuration (Preset)",
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
          ${API.VISIONS.map(vision => {
    return `\t<option data-image="${vision.img}" value=${vision.id}>${i18n(vision.name)}</option>`;
  }).join("\n")}
        </select>
      </div>
      <div class="form-group">
        <label>Light Source:</label>
        <select id="light-source" name="light-source" is="ms-dropdown-ligthhudate">
          ${API.LIGHTS.map(lightSource => {
    return `\t<option data-image="${lightSource.img}" value=${lightSource.id}>${i18n(
      lightSource.name
    )}</option>`;
  }).join("\n")}
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
        label: "Apply Changes",
        callback: () => (applyChanges = true)
      },
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: "Cancel Changes"
      }
    },
    default: "yes",
    close: async (html: any) => {
      if (applyChanges) {
        for (const token of <Token[]>canvas.tokens?.controlled) {
          // @ts-ignore
          const tokenIcon = token.document.texture?.src;
          const actorId = <string>token.actor?.id;
          const tokenId = <string>token.id;
          const applyAsAtlAteEffect = String(html.find('[name="apply-as-atl-ate"]')[0].value) === "true";
          const visionType = <string>html.find('[name="vision-type"]')[0].value || VisionHUDPreset.NONE;
          const lightSource = <string>html.find('[name="light-source"]')[0].value || LightHUDPreset.NONE;
          const visionIndex = <VisionHUDElement>API.VISIONS.find(e => e.id === visionType); // ParseInt(html.find('[name="vision-type"]')[0].value) || 0;
          const lightIndex = <LightHUDElement>API.LIGHTS.find(e => e.id === lightSource); // ParseInt(html.find('[name="light-source"]')[0].value) || 0;
          const duration = parseInt(html.find('[name="duration"]')[0].value) || 0;
          const lockRotation =
						// @ts-ignore
						html.find('[name="lock-rotation"]')[0].value === "true" ?? token.document.lockRotation;

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

          // Configure new token vision
          const tokenData = <any>token.document;

          const dimSight = visionIndex.dimSight ?? tokenData.dimSight;
          const brightSight = visionIndex.brightSight ?? tokenData.brightSight;
          const sightAngle = visionIndex.sightAngle ?? tokenData.sightAngle;

          const dimLight = lightIndex.dimLight ?? tokenData.light.dim;
          const brightLight = lightIndex.brightLight ?? tokenData.light.bright;
          const lightAngle = lightIndex.lightAngle ?? tokenData.light.angle;

          // Common settings for all 'torch-like' options
          // Feel free to change the values to your liking
          const lightAnimation = {
            type: lightIndex.lightAnimationType ?? tokenData.light.animation.type,
            speed: lightIndex.lightAnimationSpeed ?? tokenData.light.animation.speed,
            intensity: lightIndex.lightAnimationIntensity ?? tokenData.light.animation.intensity
          };
          const lightColor = lightIndex.lightColor ?? <string>tokenData.light.color;
          const lightAlpha = lightIndex.lightAlpha ?? <number>tokenData.light.alpha;

          const height = null;
          const width = null;
          const scale = null;
          const isPreset = true;
          const hasVision =
						visionType !== null
						&& visionType !== undefined
						&& visionType !== VisionHUDPreset.NONE
						&& visionType !== VisionHUDPreset.NO_CHANGE;

          const hasLight =
						lightSource !== null
						&& lightSource !== undefined
						&& lightSource !== LightHUDPreset.NONE
						&& lightSource !== LightHUDPreset.NO_CHANGE;

          const effectNameForVisionOrLight = hasVision
            ? visionIndex.name
            : hasLight
              ? lightIndex.name
              : "Unknown Vision";
          const effectIconForVisionOrLight = hasVision
            ? visionIndex.img
            : // @ts-ignore
            hasLight
              ? lightIndex.img
              : tokenIcon;

          // TODO
          const alpha = null;
          // TODO
          const sightEnabled = null;
          // TODO
          const sightVisionMode = null;

          // Update Token
          await updateTokenLighting(
            token,
            // LockRotation,
            sightEnabled,
            dimSight,
            brightSight,
            sightAngle,
            sightVisionMode,

            dimLight,
            brightLight,
            lightColor,
            lightAlpha,
            lightAngle,

            null, // Coloration: coloration,
            null, // Luminosity: luminosity,
            null, // Gradual: gradual,
            null, // Saturation: saturation,
            null, // Contrast: contrast,
            null, // Shadows: shadows,

						<string>lightAnimation.type,
						<number>lightAnimation.speed,
						<number>lightAnimation.intensity,
						false, // <boolean>lightAnimation.reverse,

						applyAsAtlAteEffect,
						effectNameForVisionOrLight,
						effectIconForVisionOrLight,
						duration,

						hasVision,
						// Id,
						// name,
						height,
						width,
						scale,
						alpha,
						isPreset
          );
        }
      }
    }
  });
}

/**
 *
 * @param applyChanges
 * @param preset
 * @param copy
 */
export function customATLDialog(applyChanges: boolean, preset: any = undefined, copy = false): Dialog {
  let { light, dimSight, brightSight, sightAngle, name, height, width, scale, id } = preset ? preset : 0;
  let {
    dim,
    bright,
    color,
    animation,
    alpha,
    angle,
    coloration,
    contrast,
    gradual,
    luminosity,
    saturation,
    shadows
  } = light ? light : 0;
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
      name = "";
    }
  }

  if (name === undefined) name = "";
  if (light === undefined) light = undefined;

  if (!id) id = randomID();
  if (id === undefined) id = "";
  if (height === undefined) height = "";
  if (width === undefined) width = "";
  if (scale === undefined) scale = "";
  if (dim === undefined) dim = "";
  if (bright === undefined) bright = "";
  if (dimSight === undefined) dimSight = "";
  if (brightSight === undefined) brightSight = "";
  if (sightAngle === undefined) sightAngle = "";
  if (color === undefined) color = "";
  if (angle === undefined) angle = "";
  if (alpha === undefined) alpha = "";
  if (animation === undefined) animation = {};
  if (coloration === undefined) coloration = "";
  if (contrast === undefined) contrast = "";
  if (gradual === undefined) gradual = false;
  if (luminosity === undefined) luminosity = "";
  if (saturation === undefined) saturation = "";
  if (shadows === undefined) shadows = "";

  let colorationTypes = "";
  // @ts-ignore
  for (const [k, v] of Object.entries(AdaptiveLightingShader.SHADER_TECHNIQUES)) {
    // @ts-ignore
    const name = game.i18n.localize(v.label);
    // @ts-ignore
    colorationTypes += `<option value="${v.id}" ${coloration === v.id ? "selected" : ""}>${name}</option>`;
  }

  let animationTypes = '<option value="none">None</option>';
  for (const [k, v] of Object.entries(CONFIG.Canvas.lightAnimations)) {
    const name = game.i18n.localize(v.label);
    animationTypes += `<option value="${k.toLocaleLowerCase()}" ${
      animation.type === k ? "selected" : ""
    }>${name}</option>`;
  }

  if (game.modules.get("CommunityLighting")?.active) {
    animationTypes += `
      <optgroup label= "Blitz" id="animationType">
        <option value="BlitzFader"
          ${animation.type === "BlitzFader" ? "selected" : ""}>Fader
        </option>
        <option value="BlitzLightning"
          ${animation.type === "BlitzLightning" ? "selected" : ""}>Lightning (experimental)
        </option>
        <option value="BlitzElectric Fault"
          ${animation.type === "BlitzElectric Fault" ? "selected" : ""}>Electrical Fault</option>
        <option value="BlitzSimple Flash"
          ${animation.type === "BlitzSimple Flash" ? "selected" : ""}>Simple Flash
        </option>
        <option value="BlitzRBG Flash"
          ${animation.type === "BlitzRBG Flash" ? "selected" : ""}>RGB Flash
        </option>
        <option value="BlitzPolice Flash"
          ${animation.type === "BlitzPolice Flash" ? "selected" : ""}>Police Flash
        </option>
        <option value="BlitzStatic Blur"
          ${animation.type === "BlitzStatic Blur" ? "selected" : ""}>Static Blur
        </option>
        <option value="BlitzAlternate Torch"
          ${animation.type === "BlitzAlternate Torch" ? "selected" : ""}>Alternate Torch
        </option>
        <option value="BlitzBlurred Torch"
          ${animation.type === "BlitzBlurred Torch" ? "selected" : ""}>Blurred Torch
        </option>
        <option value="BlitzGrid Force-Field Colorshift"
          ${animation.type === "BlitzGrid Force-Field Colorshift" ? "selected" : ""}>Grid Force-Field Colorshift
        </option>
      </optgroup>
      <optgroup label="SecretFire" id="animationType">
        <option value="SecretFireGrid Force-Field"
          ${animation.type === "SecretFireGrid Force-Field" ? "selected" : ""}>Grid Force-Field
        </option>
        <option value="SecretFireSmoke Patch"
          ${animation.type === "SecretFireSmoke Patch" ? "selected" : ""}>Smoke Patch
        </option>
        <option value="SecretFireStar Light"
          ${animation.type === "SecretFireStar Light" ? "selected" : ""}>Star Light
        </option>
        <option value="SecretFireStar Light Disco"
          ${animation.type === "SecretFireStar Light Disco" ? "selected" : ""}>Star Light Disco
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
              <select id="animationType" name="animationType" >${animationTypes}</select>
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
              ${animation?.reverse ? "checked" : ""}
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
              ${gradual ? "checked" : ""}
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
    title: "Token Vision Configuration (Custom)",
    content: dialogContent,
    buttons: {
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: "Apply Changes",
        callback: () => (applyChanges = true)
      },
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: "Cancel Changes"
      }
    },
    default: "no",
    close: async (html: any) => {
      if (applyChanges) {
        const id = <string>html.find("#name")[0].name || randomID();
        const effectName = <string>html.find("#name")[0].value || "";

        const height = <number>checkNumberFromString(html.find("#height")[0].value);
        const width = <number>checkNumberFromString(html.find("#width")[0].value);
        const scale = <number>checkNumberFromString(html.find("#scale")[0].value);
        // TODO
        const alpha = <number>checkNumberFromString(html.find("#alpha")[0].value);
        // TODO
        const sightEnabled = <boolean>checkBooleanFromString(html.find("#enabled")[0].value);
        // TODO
        const sightVisionMode = <string>html.find("#visionMode")[0].value;
        const dimSight = <number>checkNumberFromString(html.find("#dimSight")[0].value);
        const brightSight = <number>checkNumberFromString(html.find("#brightSight")[0].value);
        const sightAngle = <number>checkNumberFromString(html.find("#sightAngle")[0].value);

        const dimLight = <number>checkNumberFromString(html.find("#dim")[0].value);
        const brightLight = <number>checkNumberFromString(html.find("#bright")[0].value);
        const lightColor = <string>html.find("#color")[0].value;
        const lightAlpha = <number>checkNumberFromString(html.find("#alpha")[0].value);
        const lightAngle = <number>checkNumberFromString(html.find("#angle")[0].value);
        const lightAnimationType = <string>html.find("#animationType")[0].value;
        const lightAnimationSpeed = <number>checkNumberFromString(html.find("#animationSpeed")[0].value);
        const lightAnimationIntensity = <number>(
					checkNumberFromString(html.find("#animationIntensity")[0].value)
				);
        const lightAnimationReverse = <boolean>html.find("#animationIntensity").is(":checked");
        const coloration = <number>checkNumberFromString(html.find("#lightColoration")[0].value);
        const luminosity = <number>checkNumberFromString(html.find("#lightLuminosity")[0].value);
        const gradual = <boolean>html.find("#lightGradual").is(":checked");
        const saturation = <number>checkNumberFromString(html.find("#lightSaturation")[0].value);
        const contrast = <number>checkNumberFromString(html.find("#lightContrast")[0].value);
        const shadows = <number>checkNumberFromString(html.find("#lightShadows")[0].value);
        const vision = !!(dimSight > 0 || brightSight > 0);

        const isPreset = false;

        const applyAsAtlAteEffect = <boolean>html.find("#apply-as-atl-ate").is(":checked") ?? false;
        const duration = <number>checkNumberFromString(html.find("#duration")[0].value);
        // Const final = Object.fromEntries(Object.entries(object).filter(([_, v]) => v !== ""));
        // ATL.AddPreset(tempName, final)
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

          // Update Token
          await updateTokenLighting(
            token,
            // LockRotation,
            sightEnabled,
            dimSight,
            brightSight,
            sightAngle,
            sightVisionMode,

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
						"",
						duration,

						vision,
						// Token.id,
						// alias,
						height,
						width,
						scale,
						alpha,
						isPreset
          );
        }
      }
    }
  });
}

/**
 *
 * @param lightDataDialog
 */
export function confirmDialogATLEffectItem(lightDataDialog: LightDataDialog): Dialog {
  return new Dialog({
    title: i18n("lights-hud-ate.windows.dialogs.confirm.apply.title"),
    // Content: `<div><h2>Are you sure to ${
    //   isApplied ? 'disabled' : 'enabled'
    // } the active effect '${effectName}' on actor '${actorname}' (token name is '${tokenName}')?</h2><div>`,
    content: `<div><h2>${i18nFormat("lights-hud-ate.windows.dialogs.confirm.apply.content", {
      isApplied: lightDataDialog.isApplied ? "disabled" : "enabled",
      effectName: i18n(lightDataDialog.effectName),
      itemName: i18n(lightDataDialog.itemName),
      actorName: lightDataDialog.actorName,
      tokenName: lightDataDialog.tokenName
    })}</h2><div>`,
    buttons: {
      yes: {
        label: i18n("lights-hud-ate.windows.dialogs.confirm.apply.choice.yes"),
        callback: async html => {
          if (lightDataDialog.isactoreffect) {
            await manageActiveEffectATL(
              lightDataDialog.tokenId,
              // LightDataDialog.actorId,
              lightDataDialog.itemId,
              lightDataDialog.effectId,
              lightDataDialog.effectName,
              lightDataDialog.isApplied
            );
          } else if (lightDataDialog.isflag) {
            await manageFlaggedItem(lightDataDialog.tokenId, lightDataDialog.itemId);
          } else if (lightDataDialog.isflaglight) {
            await manageFlaggedActorLightsStatic(lightDataDialog.tokenId, lightDataDialog.itemId);
          }
          // If open we force the close of the panel after the update
          // $('.lights-hud-ate-selector-wrap').remove();
          // $('.lights-hud-ate-selector-wrap')[0]?.classList.remove('active');
          // $('[data-action=lights-hud-ate-selector]')[0]?.classList.remove('active');
          const token = canvas.tokens?.placeables.find(t => {
            return t.id === lightDataDialog.tokenId;
          });
          token?.release();
        }
      },
      no: {
        label: i18n("lights-hud-ate.windows.dialogs.confirm.apply.choice.no"),
        callback: html => {
          // Do nothing
        }
      }
    },
    default: "no"
  });
}

/**
 *
 * @param lightDataDialog
 */
export function confirmDialogDropTheTorch(lightDataDialog: LightDataDialog): Dialog {
  return new Dialog({
    title: i18n("lights-hud-ate.windows.dialogs.confirm.dropthetorch.title"),
    content: `<div><h2>${i18nFormat("lights-hud-ate.windows.dialogs.confirm.dropthetorch.content", {
      isApplied: lightDataDialog.isApplied ? "disabled" : "enabled",
      effectName: lightDataDialog.effectName,
      itemName: lightDataDialog.itemName,
      actorName: lightDataDialog.actorName,
      tokenName: lightDataDialog.tokenName
    })}</h2><div>`,
    buttons: {
      yes: {
        label: i18n("lights-hud-ate.windows.dialogs.confirm.dropthetorch.choice.yes"),
        callback: async html => {
          // Const actor = <Actor>game.actors?.get(lightDataDialog.actorId);
          const token = canvas.tokens?.placeables.find(t => {
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

          const duplicates = 1; // Number od dropped light

          const item = <Item>actor.items.get(lightDataDialog.itemId);

          try {
            // Let tokenDataDropTheTorch: any | null = null;
            const newActorDropped =
							// @ts-ignore
							<any> await prepareTokenDataDropTheTorch(item, token.document.elevation ?? 0);

            const tokenDataDropTheTorch = <any> await newActorDropped.getTokenDocument();

            // @ts-ignore
            // actor.updateSource({ prototypeToken: tokenDataDropTheTorchTmp });

            // tokenDataDropTheTorch = await actor.getTokenDocument(tokenDataDropTheTorchTmp);

            // //@ts-ignore
            // await actor.update({
            // 	//@ts-ignore
            // 	effects: tokenDataDropTheTorchTmp.actorData.effects
            // });

            // @ts-ignore
            const posData = await warpgate.crosshairs.show({
              size:
								// @ts-ignore
								Math.max(
								  (Math.max(tokenDataDropTheTorch.width, tokenDataDropTheTorch.height)
										// @ts-ignore
										* (tokenDataDropTheTorch.texture.scaleX + tokenDataDropTheTorch.texture.scaleY))
										/ 2,
								  0.5
								),
              icon: `modules/${CONSTANTS.MODULE_NAME}/assets/black-hole-bolas.webp`,
              label: `Drop the ${lightDataDialog.itemName}`
            });

            // Get custom data macro
            const customTokenData = {};
            // @ts-ignore
            customTokenData.elevation = posData.z ?? token?.document?.elevation ?? 0;

            Hooks.on("preCreateToken", (tokenDoc, td) => {
              td ??= {};
              // @ts-ignore
              td.elevation = customTokenData.elevation;
              // @ts-ignore
              tokenDoc.updateSource({ elevation: customTokenData.elevation });
            });
            // @ts-ignore
            warpgate.spawnAt(
              { x: posData.x, y: posData.y },
              tokenDataDropTheTorch,
              customTokenData || {},
              {},
              { duplicates }
            );

            // Await newActorDropped.delete();
          } finally {
            // If (actorDropTheTorch) {
            //   // Remove actor at the end
            //   await (<Actor>actorDropTheTorch).delete();
            // }
          }
        }
      },
      no: {
        label: i18n("lights-hud-ate.windows.dialogs.confirm.dropthetorch.choice.no"),
        callback: html => {
          // Do nothing
        }
      }
    },
    default: "no"
  });
}

/**
 *
 * @param tokenId
 * @param itemId
 * @param effectId
 * @param effectName
 * @param isApplied
 */
export async function manageActiveEffectATL(tokenId, itemId, effectId, effectName, isApplied) {
  // Const actor = <Actor>game.actors?.get(actorId);
  // if (actor.getActiveTokens().length <= 0) {
  //   warn(`No token found for the actor with id '${actorId}'`);
  //   return;
  // }
  // const tokenId = <string>actor.getActiveTokens()[0]?.id;
  const token = <Token>canvas.tokens?.placeables.find(t => {
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
  // TODO MADE A BETTER CODE THAN THIS
  if (!itemId && !game.settings.get(CONSTANTS.MODULE_NAME, "showATEFromNoItemOrigin")) {
    return;
  }
  const item = <Item>token.actor?.items.find((entity: Item) => {
    return <string>entity.id === itemId;
  });
  if (!item && !game.settings.get(CONSTANTS.MODULE_NAME, "showATEFromNoItemOrigin")) {
    warn(`No valid item found for the token with id '${tokenId}'`, true);
    return;
  }
  // We roll the item ???
  try {
    if (game.settings.get(CONSTANTS.MODULE_NAME, "rollItem") && !isApplied) {
      if (item) {
        rollDependingOnSystem(item);
      } else {
        warn(`No item found for the id ${itemId}`, true);
      }
    }
  } finally {
    if (isApplied) {
      await aemlApiLigthsHudAte.onManageActiveEffectFromEffectId(
        "toggle",
        token.actor,
        effectId,
        false,
        false,
        true
      );
    } else {
      const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>token.actor?.effects;
      // @ts-ignore
      const effect = <ActiveEffect>actorEffects.find((activeEffect: ActiveEffect) =>
      // @ts-ignore
        isStringEquals(<string>activeEffect?.label, effectName)
      );
      if (!effect && itemId) {
        const aeAtl = <ActiveEffect[]>getATLEffectsFromItem(item) || [];
        let aeAtl0: any | undefined = undefined;
        if (aeAtl && aeAtl.length > 0) {
          aeAtl0 = aeAtl[0];
        } else {
          warn(`No valid effect is found on item found for the token with id '${tokenId}'`, true);
          return;
        }
        const activeEffectDataToUpdate = aeAtl0.toObject();
        activeEffectDataToUpdate.transfer = true;
        activeEffectDataToUpdate.disabled = false;
        activeEffectDataToUpdate.origin = await aemlApiLigthsHudAte.prepareOriginFromEntity(aeAtl0);
        // ActiveEffectDataToUpdate.origin =
        // 	aeAtl0.parent instanceof Item ? `Item.${aeAtl0.parent.id}` : `Actor.${aeAtl0.parent.id}`;
        await aemlApiLigthsHudAte.addActiveEffectOnToken(
					<string>token.document.id,
					<any>activeEffectDataToUpdate
        );
      } else {
        await aemlApiLigthsHudAte.onManageActiveEffectFromEffectId(
          "toggle",
          token.actor,
          effectId,
          false,
          true,
          false
        );
      }
    }
  }
}

/**
 *
 * @param tokenId
 * @param itemId
 */
export async function manageFlaggedItem(tokenId, itemId) {
  const token = <Token>canvas.tokens?.placeables.find(t => {
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
  // TODO MADE A BETTER CODE THAN THIS
  if (!itemId && !game.settings.get(CONSTANTS.MODULE_NAME, "showATEFromNoItemOrigin")) {
    return;
  }
  const item = <Item>token.actor?.items.find((entity: Item) => {
    return <string>entity.id === itemId;
  });
  if (!item) {
    warn(`No valid item found for the token with id '${tokenId}'`, true);
    return;
  }
  const isApplied = <boolean>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HUD_ENABLED) ?? false;
  // We roll the item ???
  try {
    if (game.settings.get(CONSTANTS.MODULE_NAME, "rollItem") && !isApplied) {
      if (item) {
        rollDependingOnSystem(item);
      } else {
        warn(`No item found for the id ${itemId}`, true);
      }
    }
  } finally {
    applyFlagsOnToken(tokenId, itemId, isApplied);
  }
}

/**
 *
 * @param tokenId
 * @param itemId
 */
export async function manageFlaggedActorLightsStatic(tokenId, itemId) {
  const token = <Token>canvas.tokens?.placeables.find(t => {
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
  const isApplied =
		<boolean>token.actor.getFlag(CONSTANTS.MODULE_NAME, `${LightHUDNoteFlags.HUD_ENABLED}_${itemId}`) ?? false;
  applyFlagsOnTokenLightsStatic(tokenId, itemId, isApplied);
}

/**
 *
 * @param tokenId
 * @param itemId
 * @param isApplied
 */
async function applyFlagsOnTokenLightsStatic(tokenId: string, itemId: string, isApplied: boolean) {
  const token = <Token>canvas.tokens?.placeables.find(t => {
    return t.id === tokenId;
  });
  const lightHUDElement = <LightHUDElement>API.LIGHTS.find((entity: LightHUDElement) => {
    return <string>entity.id === itemId;
  });

  const tokenData = <any>token.document;

  // =======================================
  await retrieveItemLightsWithFlagAndDisableThemLightsStatic(token, <string>lightHUDElement.id);

  // Store the initial status of illumination for the token to restore if all light sources are extinguished
  // const tokenData = tokenData;
  if (game.settings.get(CONSTANTS.MODULE_NAME, "enableLightHUDOldInterface")) {
    if (!token.actor?.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.INITIAL_DATA)) {
      await token.actor?.setFlag(
        CONSTANTS.MODULE_NAME,
        LightHUDNoteFlags.INITIAL_DATA,
        await duplicate(tokenData)
      );
    }
  } else if (token.actor?.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.INITIAL_DATA)) {
    await token.actor?.unsetFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.INITIAL_DATA);
  }

  // Await token.actor?.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HUD_ENABLED + '_' + itemId, !isApplied);
  if (!isApplied) {
    await token.actor?.setFlag(CONSTANTS.MODULE_NAME, `${LightHUDNoteFlags.HUD_ENABLED}_${itemId}`, true);
  } else {
    await token.actor?.unsetFlag(CONSTANTS.MODULE_NAME, `${LightHUDNoteFlags.HUD_ENABLED}_${itemId}`);
  }

  const imagesParsed = await retrieveItemLightsWithFlagLightsStatic(token);

  // CHECK IF ANY LIGHT IS ACTIVE THEN IF APPLY ON FLAG IS TRUE
  let atLeastOneLightIsApplied = false;
  for (const light of imagesParsed) {
    if (light.applied) {
      atLeastOneLightIsApplied = true;
      break;
    }
  }

  if (
    !atLeastOneLightIsApplied
		&& isApplied
		&& game.settings.get(CONSTANTS.MODULE_NAME, "enableLightHUDOldInterface")
  ) {
    if (token.actor?.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.INITIAL_DATA)) {
      await updateTokenLightingFromData(
        token,
				<TokenData>token.actor?.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.INITIAL_DATA),
				false // TODO is preset is always false ?
      );
      await token.actor?.unsetFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.INITIAL_DATA);
      return;
    }
  }

  if (isApplied) {
    return;
  }
  // =======================================

  const id = <string>lightHUDElement.id;
  const effectName = lightHUDElement.name || tokenData.name;
  const height = tokenData.height;
  const width = tokenData.width;
  const scale = tokenData.texture.scaleX;

  const brightSight: number = tokenData.brightSight;
  const dimSight: number = tokenData.dimSight;
  const sightAngle: number = tokenData.sightAngle;

  const dimLight: number = lightHUDElement.dimLight || tokenData.light.dim;
  const brightLight: number = lightHUDElement.brightLight || tokenData.light.bright;
  const lightColor: string = lightHUDElement.lightColor || tokenData.light.color || "#000000";
  const lightAlpha: number = lightHUDElement.lightAlpha || tokenData.light.angle;
  const lightAngle: number = <number>lightHUDElement.lightAngle;
  const lightAnimationType = lightHUDElement.lightAnimationType || tokenData.light.animation.type;
  const lightAnimationSpeed = lightHUDElement.lightAnimationSpeed || tokenData.light.animation.speed;
  const lightAnimationIntensity = lightHUDElement.lightAnimationIntensity || tokenData.light.animation.intensity;

  const lightAnimationReverse = tokenData.light.animation.reverse;
  const coloration = tokenData.light.coloration;
  const lightLuminosity = tokenData.light.luminosity;
  const lightGradual = tokenData.light.gradual;
  const saturation = tokenData.light.saturation;
  const lightContrast = tokenData.light.contrast;
  const lightShadows = tokenData.light.shadows;
  const vision = !!(dimSight > 0 || brightSight > 0);

  const duration = lightHUDElement.duration || 0;

  // Support values
  const isPreset = true;
  const applyAsAtlAteEffect = false;

  const actorId = <string>token.actor?.id;
  // Const tokenId = token.id;

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

  // TODO
  const alpha = null;
  // TODO
  const sightEnabled = null;
  // TODO
  const sightVisionMode = null;

  // Update Token
  await updateTokenLighting(
    token,
    // LockRotation,
    sightEnabled,
    dimSight,
    brightSight,
    sightAngle,
    sightVisionMode,

    dimLight,
    brightLight,
    lightColor,
    lightAlpha,
		<number>lightAngle,

		coloration,
		lightLuminosity,
		lightGradual,
		saturation,
		lightContrast,
		lightShadows,

		<string>lightAnimationType,
		<number>lightAnimationSpeed,
		<number>lightAnimationIntensity,
		lightAnimationReverse,

		applyAsAtlAteEffect,
		effectName,
		"",
		duration,

		vision,
		// Token.id,
		// alias,
		height,
		width,
		scale,
		alpha,
		isPreset
  );
}

/**
 *
 * @param tokenId
 * @param itemId
 * @param isApplied
 */
async function applyFlagsOnToken(tokenId: string, itemId: string, isApplied: boolean) {
  const token = <Token>canvas.tokens?.placeables.find(t => {
    return t.id === tokenId;
  });
  const item = <Item>token.actor?.items.find((entity: Item) => {
    return <string>entity.id === itemId;
  });

  const tokenData = <any>token.document;

  // =======================================
  await retrieveItemLightsWithFlagAndDisableThem(token, <string>item.id);

  // Store the initial status of illumination for the token to restore if all light sources are extinguished
  // const tokenData = tokenData;
  if (game.settings.get(CONSTANTS.MODULE_NAME, "applyOnFlagItem")) {
    if (!token.actor?.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.INITIAL_DATA)) {
      const document = tokenData.document || tokenData;
      await token.actor?.setFlag(
        CONSTANTS.MODULE_NAME,
        LightHUDNoteFlags.INITIAL_DATA,
        // @ts-ignore
        await duplicate(document.toObject())
      );
    }
  } else if (token.actor?.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.INITIAL_DATA)) {
    await token.actor?.unsetFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.INITIAL_DATA);
  }

  await item.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HUD_ENABLED, !isApplied);

  const imagesParsed = await retrieveItemLightsWithFlag(token);

  // CHECK IF ANY LIGHT IS ACTIVE THEN IF APPLY ON FLAG IS TRUE
  let atLeastOneLightIsApplied = false;
  for (const light of imagesParsed) {
    if (light.applied) {
      atLeastOneLightIsApplied = true;
      break;
    }
  }

  if (!atLeastOneLightIsApplied && isApplied && game.settings.get(CONSTANTS.MODULE_NAME, "applyOnFlagItem")) {
    if (token.actor?.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.INITIAL_DATA)) {
      await updateTokenLightingFromData(
        token,
				<TokenData>token.actor?.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.INITIAL_DATA),
				false // TODO is preset is always false ?
      );
      await token.actor?.unsetFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.INITIAL_DATA);
      return;
    }
  }

  if (isApplied) {
    return;
  }
  // =======================================

  const id = <string>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.NAME);
  const effectName = <string>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.NAME) || tokenData.name;
  const height =
		<number>checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HEIGHT))
		// @ts-ignore
		|| tokenData.height;
  const width =
		<number>checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.WIDTH)) || tokenData.width;
  const scale =
		<number>checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SCALE))
		|| tokenData.texture.scaleX;

  let brightSight: number | null = null;
  if (item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
    brightSight = <number>(
			checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_BRIGHT_BASIC))
		);
  } else {
    brightSight = <number>(
			checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_BRIGHT))
		);
  }
  if (!brightSight || brightSight === 0) {
    brightSight = tokenData.brightSight;
  }

  let dimSight: number | null = null;
  if (item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
    dimSight = <number>(
			checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_DIM_BASIC))
		);
  } else {
    dimSight = <number>checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_DIM));
  }
  if (!dimSight || dimSight === 0) {
    dimSight = tokenData.dimSight;
  }

  let sightAngle: number | null = null;
  if (item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
    sightAngle = <number>(
			checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_ANGLE_BASIC))
		);
  } else {
    sightAngle = <number>checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_ANGLE));
  }
  if (!sightAngle || sightAngle === 0) {
    sightAngle = tokenData.sightAngle;
  }

  let dimLight: number | null = null;
  if (item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
    dimLight = <number>(
			checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_DIM_BASIC))
		);
  } else {
    dimLight = <number>checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_DIM));
  }
  if (!dimLight || dimLight === 0) {
    dimLight = tokenData.light.dim;
  }

  let brightLight: number | null = null;
  if (item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
    brightLight = <number>(
			checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_BRIGHT_BASIC))
		);
  } else {
    brightLight = <number>(
			checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_BRIGHT))
		);
  }
  if (!brightLight || brightLight === 0) {
    brightLight = tokenData.light.bright;
  }

  let lightColor: string | null = null;
  if (item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
    lightColor = <string>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLOR_BASIC);
  } else {
    lightColor = <string>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLOR);
  }
  if (!lightColor || lightColor === "#000000") {
    lightColor = <string>tokenData.light.color;
  }

  let lightAlpha: number | null = null;
  if (item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
    lightAlpha = <number>(
			checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ALPHA_BASIC))
		);
  } else {
    lightAlpha = <number>checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ALPHA));
  }
  if (!lightAlpha || lightAlpha === 0) {
    lightAlpha = tokenData.alpha;
  }

  let lightAngle: number | null = null;
  if (item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
    lightAngle = <number>(
			checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ANGLE_BASIC))
		);
  } else {
    lightAngle = <number>checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ANGLE));
  }
  if (!lightAngle || lightAngle === 0) {
    lightAngle = tokenData.light.angle;
  }

  const lightAnimationType =
		<string>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_TYPE) || tokenData.light.animation.type;
  const lightAnimationSpeed = <number>(
		(checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_SPEED))
			|| tokenData.light.animation.speed)
	);
  const lightAnimationIntensity = <number>(
		(checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_INTENSITY))
			|| tokenData.light.animation.intensity)
	);
  const lightAnimationReverse =
		<boolean>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_REVERSE)
		|| tokenData.light.animation.reverse;
  const coloration = <number>(
		(checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLORATION))
			|| tokenData.light.coloration)
	);
  const lightLuminosity = <number>(
		(checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_LUMINOSITY))
			|| tokenData.light.luminosity)
	);
  const lightGradual =
		<boolean>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_GRADUAL) || tokenData.light.gradual;
  const saturation = <number>(
		(checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SATURATION))
			|| tokenData.light.saturation)
	);
  const lightContrast =
		<number>checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_CONTRAST))
		|| tokenData.light.contrast;
  const lightShadows =
		<number>checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SHADOWS))
		|| tokenData.light.shadows;
  const vision = !!(<number>dimSight > 0 || <number>brightSight > 0);

  const duration =
		<number>checkNumberFromString(item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.DURATION)) || 0;

  // Support values
  const isPreset = !!item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC);
  const applyAsAtlAteEffect =
		<boolean>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.APPLY_AS_ATL_ATE) ?? false;

  const actorId = <string>token.actor?.id;
  // Const tokenId = token.id;

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

  // TODO
  const alpha = null;
  // TODO
  const sightEnabled = null;
  // TODO
  const sightVisionMode = null;

  // Update Token
  await updateTokenLighting(
    token,
    // LockRotation,
    sightEnabled,
		<number>dimSight,
		<number>brightSight,
		<number>sightAngle,
		sightVisionMode,

		<number>dimLight,
		<number>brightLight,
		<string>lightColor,
		<number>lightAlpha,
		<number>lightAngle,

		coloration,
		lightLuminosity,
		lightGradual,
		saturation,
		lightContrast,
		lightShadows,

		<string>lightAnimationType,
		<number>lightAnimationSpeed,
		<number>lightAnimationIntensity,
		lightAnimationReverse,

		applyAsAtlAteEffect,
		effectName,
		"",
		duration,

		vision,
		// Token.id,
		// alias,
		height,
		width,
		scale,
		alpha,
		isPreset
  );
}
