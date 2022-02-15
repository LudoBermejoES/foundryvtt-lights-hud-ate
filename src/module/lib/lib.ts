import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import {
  ActorData,
  TokenData,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import API from '../api.js';
import CONSTANTS from '../constants';
import Effect, { Constants } from '../effects/effect.js';
import { EffectDefinitions } from '../lights-hud-ate-effect-definition.js';
import { canvas, game } from '../settings';

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

/*
 * Returns the first GM id.
 */
export function firstGM() {
  const gmId = Array.from(<Users>game.users).find((user) => user.isGM && user.active)?.id;
  if (!gmId) {
    ui.notifications?.error('No GM available for Dancing Lights!');
  }
  return gmId;
}

// =============================
// Module specific function
// =============================

/**
 * @href https://github.com/itamarcu/roll-from-compendium/blob/master/scripts/roll-from-compendium.js
 */
export async function rollDependingOnSystem(item: Item) {
  // if (game.system.id === 'pf2e') {
  //   if (item.type === 'spell') {
  //     return pf2eCastSpell(item, actor, dummyActor)
  //   } else {
  //     return pf2eItemToMessage(item)
  //   }
  // }
  // if (game.system.id === 'dnd5e') {
  //   const actorHasItem = !!actor.items.get(item.id)
  //   return dnd5eRollItem(item, actor, actorHasItem)
  // }
  //@ts-ignore
  return item.roll();
}

// Update the relevant light parameters of a token
export async function updateTokenLighting(
  token: Token,
  lockRotation: boolean,
  dimSight: number,
  brightSight: number,
  sightAngle: number,
  dimLight: number,
  brightLight: number,
  lightColor: string,
  lightAlpha: number,
  lightAngle: number,
  lightAnimationType: string,
  lightAnimationSpeed: number,
  lightAnimationIntensity: number,
  applyAsAtlEffect = false,
  effectName: string | null = null,
  effectIcon: string | null = null,
  duration: number | null = null,
) {
  if (dimSight == null || dimSight == undefined) {
    dimSight = token.data.dimSight;
  }
  if (brightSight == null || brightSight == undefined) {
    brightSight = token.data.brightSight;
  }
  if (sightAngle == null || sightAngle == undefined) {
    sightAngle = token.data.sightAngle;
  }

  if (lockRotation == null || lockRotation == undefined) {
    lockRotation = token.data.lockRotation;
  }

  if (dimLight == null || dimLight == undefined) {
    dimLight = token.data.light.dim;
  }
  if (brightLight == null || brightLight == undefined) {
    brightLight = token.data.light.bright;
  }
  if (lightColor == null || lightColor == undefined) {
    lightColor = <string>token.data.light.color;
  }
  if (lightAlpha == null || lightAlpha == undefined) {
    lightAlpha = token.data.light.alpha;
  }
  if (lightAngle == null || lightAngle == undefined) {
    lightAngle = token.data.light.angle;
  }

  if (lightAnimationType == null || lightAnimationType == undefined) {
    lightAnimationType = <string>token.data.light.animation.type;
  }
  if (lightAnimationSpeed == null || lightAnimationSpeed == undefined) {
    lightAnimationSpeed = token.data.light.animation.speed;
  }
  if (lightAnimationIntensity == null || lightAnimationIntensity == undefined) {
    lightAnimationIntensity = token.data.light.animation.intensity;
  }

  if (applyAsAtlEffect) {
    const efffectAtlToApply = new Effect({
      customId: <string>token.actor?.id,
      name: <string>effectName,
      description: ``,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      seconds: <number>duration * 60, // minutes to seconds
      atlChanges: [
        {
          key: EffectDefinitions._createAtlEffectKey('ATL.dimSight'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: dimSight && dimSight > 0 ? dimSight : token.data.dimSight,
        },
        {
          key: EffectDefinitions._createAtlEffectKey('ATL.brightSight'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: brightSight && brightSight > 0 ? brightSight : token.data.brightSight,
        },
        {
          key: EffectDefinitions._createAtlEffectKey('ATL.light.dim'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: dimLight && dimLight > 0 ? dimLight : token.data.light.dim,
        },
        {
          key: EffectDefinitions._createAtlEffectKey('ATL.light.bright'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: brightLight && brightLight > 0 ? brightLight : token.data.light.bright,
        },
        {
          key: EffectDefinitions._createAtlEffectKey('ATL.light.angle'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: lightAngle ? lightAngle : token.data.light.angle,
        },
        {
          key: EffectDefinitions._createAtlEffectKey('ATL.light.color'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: lightColor ? lightColor : token.data.light.color,
        },
        {
          key: EffectDefinitions._createAtlEffectKey('ATL.light.alpha'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: lightAlpha ? lightAlpha : token.data.light.alpha,
        },
        {
          key: EffectDefinitions._createAtlEffectKey('ATL.light.animation'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value:
            lightAnimationType && lightAnimationSpeed > 0 && lightAnimationIntensity > 0
              ? `{"type": "${lightAnimationType}","speed": ${lightAnimationSpeed},"intensity": ${lightAnimationIntensity}}`
              : token.data.light.animation,
        },
      ],
    });
    await API.addEffect(<string>token.actor?.id, <string>effectName, efffectAtlToApply);
  } else {
    token.document.update({
      vision: true,
      dimSight: dimSight,
      brightSight: brightSight,
      sightAngle: sightAngle,
      lockRotation: lockRotation,
      // dimLight: dimLight,
      // brightLight: brightLight,
      // lightAngle: lightAngle,
      // lightColor: lightColor,
      // lightAlpha: lightAlpha,
      // lightAnimation: {
      //   type: lightAnimationType,
      //   speed: lightAnimationSpeed,
      //   intensity: lightAnimationIntensity,
      // },
      light: {
        dim: dimLight,
        bright: brightLight,
        angle: lightAngle,
        color: lightColor,
        alpha: lightAlpha, //** 2, // need  this ?
        animation: {
          type: lightAnimationType,
          speed: lightAnimationSpeed,
          intensity: lightAnimationIntensity,
        },
      },
    });
  }
}

/**
 * actor: Actor, di solito quello collegato al player `game.user.character`
 * data : {x, y} , le coordinate dove costruire il token
 * type : string , di solito `character` ,lista dei tipi accettati da Dnd5e [actorless,character,npc,vehicle]
 */
export async function dropTheToken(item: Item, data: { x; y }, type = 'character') {
  // if (!Array.isArray(inAttributes)) {
  //   throw Error('deleteAndcreateToken | inAttributes must be of type array');
  // }
  // const [actor, data, type, scene] = inAttributes;
  // if (!actor) {
  //   error('No actor is present');
  //   return;
  // }
  // if (!scene) {
  //   error('No scene is present');
  //   return;
  // }
  if (!type) {
    error('No type is present');
    return;
  }
  if (!data) {
    error('No data is present');
    return;
  }
  if (data.x == undefined || data.x == null || isNaN(data.x)) {
    error('No data.x is present');
    return;
  }
  if (data.y == undefined || data.y == null || isNaN(data.y)) {
    error('No data.y is present');
    return;
  }
  // Before anything delete all token linked to that actor
  // from the scene currenlty loaded
  // BE AWARE IF YOU PUT THE WRONG ACTOR YOU REMOVE ALL THE TOKEN ASSOCIATED
  // TO THAT ACTOR AND WHERE THE CURRENT USER IS OWNER
  //const tokensToDelete = canvas.tokens.controlled.filter(token => token.owner).map(token => ({
  // const tokensToDelete = scene.tokens.contents
  //   .filter((token) => token.isOwner)
  //   .map((token) => ({
  //     id: token.id,
  //     sceneId: scene.id, //token.scene.id,
  //     actorId: token.actor?.id === actor.id ? token.actor?.id : undefined,
  //   }));
  // await Promise.all(
  //   tokensToDelete.map(async ({ id, sceneId, actorId }) => {
  //     if (actorId) {
  //       game.scenes?.get(sceneId)?.deleteEmbeddedDocuments('Token', [id]);
  //     }
  //   }),
  // );

  // START CREATION
  let createdType = type;
  if (type === 'actorless') {
    createdType = Object.keys(CONFIG.Actor.typeLabels)[0];
  }

  let actorName = <string>item.name;
  if (actorName.includes('.')) {
    actorName = actorName.split('.')[0];
  }

  const actor = <Actor>await Actor.create({
    name: actorName,
    type: createdType,
    img: item.img,
  });
  const actorData = foundry.utils.duplicate(actor.data);

  // Prepare Token data specific to this placement
  const td = actor.data.token;
  const hg = <number>canvas.dimensions?.size / 2;
  data.x -= td.width * hg;
  data.y -= td.height * hg;

  // Snap the dropped position and validate that it is in-bounds
  // NOTE THE HIDDEN
  const tokenData = { x: data.x, y: data.y, hidden: false, img: actor.data.img };
  // Snap to grid
  foundry.utils.mergeObject(tokenData, canvas.grid?.getSnappedPosition(data.x, data.y, 1));
  if (!canvas.grid?.hitArea.contains(tokenData.x, tokenData.y)) {
    // warn('End scene:' + scene.name);
    return undefined;
  }
  // Get the Token image
  // if ( actorData.token.randomImg ) {
  //     let images = await actor.getTokenImages();
  //     images = images.filter(i => (images.length === 1) || !(i === this._lastWildcard));
  //     const image = images[Math.floor(Math.random() * images.length)];
  //     tokenData.img = this._lastWildcard = image;
  // }

  // Merge Token data with the default for the Actor
  //@ts-ignore
  const tokenData2: TokenData = foundry.utils.mergeObject(actorData.token, tokenData, { inplace: true });
  tokenData2.actorId = <string>actor.data._id;
  tokenData2.actorLink = true;

  const atlEffects = item.effects.filter((entity) => {
    return entity.data.changes.find((effect) => effect.key.includes('ATL')) != undefined;
  });
  atlEffects.forEach((ae: ActiveEffect) => {
    // Make sure is enabled
    ae.data.disabled = false;
    API.addActiveEffectOnActor(<string>tokenData2.actorId, ae);
  });

  // Submit the Token creation request and activate the Tokens layer (if not already active)
  canvas.getLayerByEmbeddedName('Token')?.activate();
  //@ts-ignore
  await canvas.scene?.createEmbeddedDocuments('Token', [tokenData2], {});
  // await scene?.createEmbeddedDocuments('Token', [tokenData2], {});

  // delete actor if it's actorless
  if (type === 'actorless') {
    actor.delete();
  }

  // FINALLY RECOVER THE TOKEN
  const token = canvas.tokens?.placeables.find((token) => {
    return token.document.actor?.id === actor.id;
  });
  // warn('End scene:' + scene.name);
  return token;
}

/**
 * actor: Actor, di solito quello collegato al player `game.user.character`
 * data : {x, y} , le coordinate dove costruire il token
 * type : string , di solito `character` ,lista dei tipi accettati da Dnd5e [actorless,character,npc,vehicle]
 */
export async function prepareTokenDataDropTheTorch(item: Item, elevation: number, type = 'character') {
  if (!type) {
    error('No type is present');
    return;
  }
  // START CREATION
  let createdType = type;
  if (type === 'actorless') {
    createdType = Object.keys(CONFIG.Actor.typeLabels)[0];
  }

  let actorName = <string>item.name;
  if (actorName.includes('.')) {
    actorName = actorName.split('.')[0];
  }

  const actor = <Actor>await Actor.create({
    name: actorName,
    type: createdType,
    img: item.img,
  });
  const actorData = foundry.utils.duplicate(actor.data);

  const tokenData = { hidden: false, img: actor.data.img, elevation: elevation };

  // Merge Token data with the default for the Actor
  //@ts-ignore
  const tokenData2: TokenData = foundry.utils.mergeObject(actorData.token, tokenData, { inplace: true });
  tokenData2.actorId = <string>actor.data._id;
  tokenData2.actorLink = true;

  const atlEffects = item.effects.filter((entity) => {
    return entity.data.changes.find((effect) => effect.key.includes('ATL')) != undefined;
  });
  atlEffects.forEach(async (ae: ActiveEffect) => {
    // Make sure is enabled
    // ae.data.disabled = false;
    await API.addActiveEffectOnActor(<string>tokenData2.actorId, ae);
  });
  return tokenData2;
}
