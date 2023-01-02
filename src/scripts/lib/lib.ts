import type EmbeddedCollection from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs";
import type {
	ActorData,
	TokenData,
} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs";
import API from "../api";
import CONSTANTS from "../constants";
import { getATLEffectsFromItem } from "../lights-hud-ate-config";
import { LightHUDAteEffectDefinitions } from "../lights-hud-ate-effect-definition";
import { LightDataHud, LightHUDElement, LightHUDNoteFlags, LightHUDPreset } from "../lights-hud-ate-models";
import { aemlApiLigthsHudAte } from "../module";

// =============================
// Module Generic function
// =============================

export async function getToken(documentUuid) {
	const document = await fromUuid(documentUuid);
	//@ts-ignore
	return document?.token ?? document;
}

export function getOwnedTokens(priorityToControlledIfGM: boolean): Token[] {
	const gm = game.user?.isGM;
	if (gm) {
		if (priorityToControlledIfGM) {
			const arr = <Token[]>canvas.tokens?.controlled;
			if (arr && arr.length > 0) {
				return arr;
			} else {
				return <Token[]>canvas.tokens?.placeables;
			}
		} else {
			return <Token[]>canvas.tokens?.placeables;
		}
	}
	if (priorityToControlledIfGM) {
		const arr = <Token[]>canvas.tokens?.controlled;
		if (arr && arr.length > 0) {
			return arr;
		}
	}
	let ownedTokens = <Token[]>(
		canvas.tokens?.placeables.filter((token) => token.isOwner && (!token.document.hidden || gm))
	);
	if (ownedTokens.length === 0 || !canvas.tokens?.controlled[0]) {
		ownedTokens = <Token[]>(
			canvas.tokens?.placeables.filter(
				(token) => (token.observer || token.isOwner) && (!token.document.hidden || gm)
			)
		);
	}
	return ownedTokens;
}

export function is_UUID(inId) {
	return typeof inId === "string" && (inId.match(/\./g) || []).length && !inId.endsWith(".");
}

export function getUuid(target) {
	// If it's an actor, get its TokenDocument
	// If it's a token, get its Document
	// If it's a TokenDocument, just use it
	// Otherwise fail
	const document = getDocument(target);
	return document?.uuid ?? false;
}

export function getDocument(target) {
	if (target instanceof foundry.abstract.Document) return target;
	return target?.document;
}

export function is_real_number(inNumber) {
	return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
}

export function isGMConnected() {
	return !!Array.from(<Users>game.users).find((user) => user.isGM && user.active);
}

export function isGMConnectedAndSocketLibEnable() {
	return isGMConnected(); // && !game.settings.get(CONSTANTS.MODULE_NAME, 'doNotUseSocketLibFeature');
}

export function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isActiveGM(user) {
	return user.active && user.isGM;
}

export function getActiveGMs() {
	return game.users?.filter(isActiveGM);
}

export function isResponsibleGM() {
	if (!game.user?.isGM) return false;
	//@ts-ignore
	return !getActiveGMs()?.some((other) => other.document._id < <string>game.user?.document._id);
}

// ================================
// Logger utility
// ================================

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, args = "") {
	if (game.settings.get(CONSTANTS.MODULE_NAME, "debug")) {
		console.log(`DEBUG | ${CONSTANTS.MODULE_NAME} | ${msg}`, args);
	}
	return msg;
}

export function log(message) {
	message = `${CONSTANTS.MODULE_NAME} | ${message}`;
	console.log(message.replace("<br>", "\n"));
	return message;
}

export function notify(message) {
	message = `${CONSTANTS.MODULE_NAME} | ${message}`;
	ui.notifications?.notify(message);
	console.log(message.replace("<br>", "\n"));
	return message;
}

export function info(info, notify = false) {
	info = `${CONSTANTS.MODULE_NAME} | ${info}`;
	if (notify) ui.notifications?.info(info);
	console.log(info.replace("<br>", "\n"));
	return info;
}

export function warn(warning, notify = false) {
	warning = `${CONSTANTS.MODULE_NAME} | ${warning}`;
	if (notify) ui.notifications?.warn(warning);
	console.warn(warning.replace("<br>", "\n"));
	return warning;
}

export function error(error, notify = true) {
	error = `${CONSTANTS.MODULE_NAME} | ${error}`;
	if (notify) ui.notifications?.error(error);
	return new Error(error.replace("<br>", "\n"));
}

export function timelog(message): void {
	warn(Date.now(), message);
}

export const i18n = (key: string): string => {
	return game.i18n.localize(key)?.trim();
};

export const i18nFormat = (key: string, data = {}): string => {
	return game.i18n.format(key, data)?.trim();
};

// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = "fas fa-exclamation-triangle") {
	return `<p class="${CONSTANTS.MODULE_NAME}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_NAME}</strong>
        <br><br>${message}
    </p>`;
}

// =========================================================================================

export function cleanUpString(stringToCleanUp: string) {
	// regex expression to match all non-alphanumeric characters in string
	const regex = /[^A-Za-z0-9]/g;
	if (stringToCleanUp) {
		return i18n(stringToCleanUp).replace(regex, "").toLowerCase();
	} else {
		return stringToCleanUp;
	}
}

export function isStringEquals(stringToCheck1: string, stringToCheck2: string, startsWith = false): boolean {
	if (stringToCheck1 && stringToCheck2) {
		const s1 = cleanUpString(stringToCheck1) ?? "";
		const s2 = cleanUpString(stringToCheck2) ?? "";
		if (startsWith) {
			return s1.startsWith(s2) || s2.startsWith(s1);
		} else {
			return s1 === s2;
		}
	} else {
		return stringToCheck1 === stringToCheck2;
	}
}

/**
 * The duplicate function of foundry keep converting my stirng value to "0"
 * i don't know why this methos is a brute force solution for avoid that problem
 */
export function duplicateExtended(obj: any): any {
	try {
		//@ts-ignore
		if (structuredClone) {
			//@ts-ignore
			return structuredClone(obj);
		} else {
			// Shallow copy
			// const newObject = jQuery.extend({}, oldObject);
			// Deep copy
			// const newObject = jQuery.extend(true, {}, oldObject);
			return jQuery.extend(true, {}, obj);
		}
	} catch (e) {
		return duplicate(obj);
	}
}

// =========================================================================================

/**
 *
 * @param obj Little helper for loop enum element on typescript
 * @href https://www.petermorlion.com/iterating-a-typescript-enum/
 * @returns
 */
export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
	return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

/**
 * @href https://stackoverflow.com/questions/7146217/merge-2-arrays-of-objects
 * @param target
 * @param source
 * @param prop
 */
export function mergeByProperty(target: any[], source: any[], prop: any) {
	for (const sourceElement of source) {
		const targetElement = target.find((targetElement) => {
			return sourceElement[prop] === targetElement[prop];
		});
		targetElement ? Object.assign(targetElement, sourceElement) : target.push(sourceElement);
	}
	return target;
}

/**
 * Returns the first selected token
 */
export function getFirstPlayerTokenSelected(): Token | null {
	// Get first token ownted by the player
	const selectedTokens = <Token[]>canvas.tokens?.controlled;
	if (selectedTokens.length > 1) {
		//iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
		return null;
	}
	if (!selectedTokens || selectedTokens.length == 0) {
		//if(game.user.character.token){
		//  //@ts-ignore
		//  return game.user.character.token;
		//}else{
		return null;
		//}
	}
	return <Token>selectedTokens[0];
}

/**
 * Returns a list of selected (or owned, if no token is selected)
 * note: ex getSelectedOrOwnedToken
 */
export function getFirstPlayerToken(): Token | null {
	// Get controlled token
	let token: Token;
	const controlled: Token[] = <Token[]>canvas.tokens?.controlled;
	// Do nothing if multiple tokens are selected
	if (controlled.length && controlled.length > 1) {
		//iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
		return null;
	}
	// If exactly one token is selected, take that
	token = <Token>controlled[0];
	if (!token) {
		if (!controlled.length || controlled.length == 0) {
			// If no token is selected use the token of the users character
			token = <
				Token //@ts-ignore
			>canvas.tokens?.placeables.find((token) => token.document._id === game.user?.character?.document?._id);
		}
		// If no token is selected use the first owned token of the users character you found
		if (!token) {
			token = <Token>canvas.tokens?.ownedTokens[0];
		}
	}
	return token;
}

function getElevationToken(token: Token): number {
	const base = token.document;
	return getElevationPlaceableObject(base);
}

function getElevationWall(wall: Wall): number {
	const base = wall.document;
	return getElevationPlaceableObject(base);
}

function getElevationPlaceableObject(placeableObject: any): number {
	let base = placeableObject;
	if (base.document) {
		base = base.document;
	}
	const base_elevation =
		//@ts-ignore
		typeof _levels !== "undefined" &&
		//@ts-ignore
		_levels?.advancedLOS &&
		(placeableObject instanceof Token || placeableObject instanceof TokenDocument)
			? //@ts-ignore
			  _levels.getTokenLOSheight(placeableObject)
			: base.elevation ??
			  base.flags["levels"]?.elevation ??
			  base.flags["levels"]?.rangeBottom ??
			  base.flags["wallHeight"]?.wallHeightBottom ??
			  0;
	return base_elevation;
}

// =============================
// Module specific function
// =============================

/*
 * Returns the first GM id.
 */
export function firstGM() {
	const gmId = Array.from(<Users>game.users).find((user) => user.isGM && user.active)?.id;
	if (!gmId) {
		ui.notifications?.error("No GM available for Dancing Lights!");
	}
	return gmId;
}

/**
 * TODO if i need to manage the roll for specific system usually is enough item.use()
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
	return item.use();
}

// Update the relevant light parameters of a token
export async function updateTokenLighting(
	token: Token,
	//lockRotation: boolean,
	sightEnabled: boolean | null = null,
	dimSight: number,
	brightSight: number,
	sightAngle: number,
	sightVisionMode: string | null = null,
	dimLight: number,
	brightLight: number,
	lightColor: string,
	lightAlpha: number,
	lightAngle: number,

	lightColoration: number | null = null,
	lightLuminosity: number | null = null,
	lightGradual: boolean | null = null,
	lightSaturation: number | null = null,
	lightContrast: number | null = null,
	lightShadows: number | null = null,

	lightAnimationType: string | null,
	lightAnimationSpeed: number | null,
	lightAnimationIntensity: number | null,
	lightAnimationReverse: boolean | null,

	applyAsAtlEffect = false,
	effectName: string | null = "LightHUD+ATE Effect",
	effectIcon: string | null = `modules/${CONSTANTS.MODULE_NAME}/assets/lightbulb-solid.svg`,
	duration: number | null = null,

	vision = false,
	// id: string | null = null,
	// name: string | null = null,
	height: number | null = null,
	width: number | null = null,
	scale: number | null = null,
	alpha: number | null = null,

	isPreset: boolean
) {
	if (applyAsAtlEffect) {
		const efffectAtlToApply = await aemlApiLigthsHudAte.convertToATLEffect(
			//lockRotation,
			<boolean>sightEnabled,
			dimSight,
			brightSight,
			sightAngle,
			<string>sightVisionMode,

			dimLight,
			brightLight,
			lightColor,
			lightAlpha,
			lightAngle,

			lightColoration,
			lightLuminosity,
			lightGradual,
			lightSaturation,
			lightContrast,
			lightShadows,

			lightAnimationType,
			lightAnimationSpeed,
			lightAnimationIntensity,
			lightAnimationReverse,

			// applyAsAtlEffect,
			effectName,
			effectIcon,
			duration,

			// vision,
			// id,
			// name,
			height,
			width,
			scale,
			alpha
		);
		(efffectAtlToApply.customId = <string>token.actor?.id),
			await aemlApiLigthsHudAte.addEffectOnToken(<string>token.id, <string>effectName, efffectAtlToApply);
	} else {
		const tokenData = <any>token.document;
		// TODO FIND A BETTER WAY FOR THIS
		if (dimSight == null || dimSight == undefined) {
			dimSight = tokenData.dimSight;
		}
		if (brightSight == null || brightSight == undefined) {
			brightSight = tokenData.brightSight;
		}
		if (sightAngle == null || sightAngle == undefined) {
			sightAngle = tokenData.sightAngle;
		}

		// if (lockRotation == null || lockRotation == undefined) {
		//   lockRotation = tokenData.lockRotation;
		// }

		if (dimLight == null || dimLight == undefined) {
			dimLight = tokenData.light.dim;
		}
		if (brightLight == null || brightLight == undefined) {
			brightLight = tokenData.light.bright;
		}
		if (lightColor == null || lightColor == undefined) {
			lightColor = <string>tokenData.light.color;
		}
		if (lightAlpha == null || lightAlpha == undefined) {
			lightAlpha = tokenData.light.alpha;
		}
		if (lightAngle == null || lightAngle == undefined) {
			lightAngle = tokenData.light.angle;
		}

		if (lightColoration == null || lightColoration == undefined) {
			lightColoration = tokenData.light.angle;
		}
		if (lightLuminosity == null || lightLuminosity == undefined) {
			lightLuminosity = tokenData.light.angle;
		}
		if (lightGradual == null || lightGradual == undefined) {
			lightGradual = tokenData.light.gradual;
		}
		if (lightSaturation == null || lightSaturation == undefined) {
			lightSaturation = tokenData.light.saturation;
		}
		if (lightContrast == null || lightContrast == undefined) {
			lightContrast = tokenData.light.contrast;
		}
		if (lightShadows == null || lightShadows == undefined) {
			lightShadows = tokenData.light.shadows;
		}

		if (lightAnimationType == null || lightAnimationType == undefined) {
			lightAnimationType = <string>tokenData.light.animation.type;
		}
		if (lightAnimationSpeed == null || lightAnimationSpeed == undefined) {
			lightAnimationSpeed = tokenData.light.animation.speed;
		}
		if (lightAnimationIntensity == null || lightAnimationIntensity == undefined) {
			lightAnimationIntensity = tokenData.light.animation.intensity;
		}
		if (lightAnimationReverse == null || lightAnimationReverse == undefined) {
			lightAnimationReverse = tokenData.light.animation.reverse;
		}

		if (height == null || height == undefined) {
			height = tokenData.height;
		}
		if (width == null || width == undefined) {
			width = tokenData.width;
		}
		if (scale == null || scale == undefined) {
			scale = tokenData.texture.scaleX;
		}

		token.document.update({
			// lockRotation: lockRotation,
			vision: vision,
			// REMOVED ONLY ATL CAN CHANGE THESE
			// height: height,
			// width: width,
			// scale: scale,
			light: {
				dim: manageDist(dimLight, isPreset),
				bright: manageDist(brightLight, isPreset),
				color: lightColor,
				//@ts-ignore
				animation: {
					type: lightAnimationType,
					speed: lightAnimationSpeed,
					intensity: lightAnimationIntensity,
					reverse: lightAnimationReverse,
				},
				alpha: lightAlpha,
				angle: lightAngle,
				coloration: lightColoration,
				luminosity: lightLuminosity,
				gradual: lightGradual,
				saturation: lightSaturation,
				contrast: lightContrast,
				shadows: lightShadows,
			},
			dimSight: manageDist(dimSight, isPreset),
			brightSight: manageDist(brightSight, isPreset),
			sightAngle: sightAngle,
		});
	}
}

export async function updateTokenLightingFromData(token: Token, tokenData: any, isPreset: boolean) {
	await token.document.update({
		// lockRotation: lockRotation,
		vision: tokenData.vision,
		height: tokenData.height,
		width: tokenData.width,
		//@ts-ignore
		scale: tokenData.texture.scaleX,
		light: {
			dim: manageDist(tokenData.light.dim, isPreset),
			bright: manageDist(tokenData.light.bright, isPreset),
			color: tokenData.light.color,
			//@ts-ignore
			animation: {
				type: tokenData.light.animation.type,
				speed: tokenData.light.animation.speed,
				intensity: tokenData.light.animation.intensity,
				reverse: tokenData.light.animation.reverse,
			},
			alpha: tokenData.light.alpha,
			angle: tokenData.light.angle,
			coloration: tokenData.light.coloration,
			luminosity: tokenData.light.luminosity,
			gradual: tokenData.light.gradual,
			saturation: tokenData.light.saturation,
			contrast: tokenData.light.contrast,
			shadows: tokenData.light.shadows,
		},
		dimSight: manageDist(tokenData.dimSight, isPreset),
		brightSight: manageDist(tokenData.brightSight, isPreset),
		sightAngle: tokenData.sightAngle,
	});
}

/**
 * actor: Actor, di solito quello collegato al player `game.user.character`
 * data : {x, y} , le coordinate dove costruire il token
 * type : string , di solito `character` ,lista dei tipi accettati da Dnd5e [actorless,character,npc,vehicle]
 */
export async function dropTheToken(item: Item, data: { x; y }, type = "character") {
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
		error("No type is present");
		return;
	}
	if (!data) {
		error("No data is present");
		return;
	}
	if (data.x == undefined || data.x == null || isNaN(data.x)) {
		error("No data.x is present");
		return;
	}
	if (data.y == undefined || data.y == null || isNaN(data.y)) {
		error("No data.y is present");
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
	if (type === "actorless") {
		createdType = <string>Object.keys(CONFIG.Actor.typeLabels)[0];
	}

	let actorName = <string>item.name;
	if (actorName.includes(".")) {
		actorName = <string>actorName.split(".")[0];
	}

	const actor = <Actor>await Actor.create({
		name: actorName,
		type: createdType,
		img: item.img,
	});
	const actorData = foundry.utils.duplicate(actor.toObject());

	// Prepare Token data specific to this placement
	const td = <any>actor.token;
	const hg = <number>canvas.dimensions?.size / 2;
	data.x -= td.width * hg;
	data.y -= td.height * hg;

	// Snap the dropped position and validate that it is in-bounds
	// NOTE THE HIDDEN
	const tokenData = { x: data.x, y: data.y, hidden: false, img: actor.img };
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
	const tokenData2: any = foundry.utils.mergeObject(actorData.token, tokenData, { inplace: true });
	tokenData2.actorId = <string>actor.id;
	tokenData2.actorLink = true;

	const atlEffects = item.effects.filter((entity) => {
		//@ts-ignore
		return entity.changes.find((effect) => effect.key.includes("ATL")) != undefined;
	});
	await Promise.all(
		atlEffects.map(async (ae: ActiveEffect) => {
			// Make sure is enabled
			//@ts-ignore
			ae.disabled = false;
			//@ts-ignore
			await aemlApiLigthsHudAte.addActiveEffectOnToken(<string>actor.token?.id, ae);
		})
	);

	// Submit the Token creation request and activate the Tokens layer (if not already active)
	canvas.getLayerByEmbeddedName("Token")?.activate();
	//@ts-ignore
	await canvas.scene?.createEmbeddedDocuments("Token", [tokenData2], {});
	// await scene?.createEmbeddedDocuments('Token', [tokenData2], {});

	// delete actor if it's actorless
	if (type === "actorless") {
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
export async function prepareTokenDataDropTheTorch(
	item: Item,
	elevation: number,
	type = "character"
): Promise<Actor | undefined> {
	if (!type) {
		error("No type is present for this option", true);
		return undefined;
	}
	if (!item) {
		error("No item is present for this option", true);
		return undefined;
	}
	// START CREATION
	let createdType = type;
	if (type === "actorless") {
		createdType = <string>Object.keys(CONFIG.Actor.typeLabels)[0];
	}

	let actorName = <string>item.name;
	if (actorName.includes(".")) {
		actorName = <string>actorName.split(".")[0];
	}

	let actorDataEffects: any[] = [];
	const atlEffects = item.effects.filter((entity) => {
		//@ts-ignore
		return entity.changes.find((effect) => effect.key.includes("ATL")) != undefined;
	});
	// for (const ae of atlEffects) {
	// 	// Make sure is enabled
	// 	//@ts-ignore
	// 	ae.disabled = false;
	// 	//@ts-ignore
	// 	ae.transfer = true;
	// 	//await API.addActiveEffectOnToken(<string>actor.token?.id, ae);
	// 	// Strange bug fix
	// 	//@ts-ignore
	// 	delete ae._id
	// 	actorDataEffects.push(ae);
	// }

	// Strange bug with fvtt10

	const tokenEffectsCleaned: any[] = [];
	for (const effect of atlEffects) {
		let effectTmp: any | undefined = undefined;
		try {
			effectTmp = effect.toObject(false);
		} catch (e) {
			effectTmp = effect.toJSON();
		}
		//@ts-ignore
		delete effectTmp._id;
		tokenEffectsCleaned.push(effectTmp);
	}
	actorDataEffects = tokenEffectsCleaned;

	const newActorDropped = <Actor>await Actor.create({
		name: actorName,
		type: createdType,
		img: item.img,
		effects: actorDataEffects,
		hidden: false,
		elevation: elevation,
		prototypeToken: undefined,
	});

	const atlActorEffects = newActorDropped.effects.filter((entity) => {
		//@ts-ignore
		return entity.changes.find((effect) => effect.key.includes("ATL")) != undefined;
	});
	for (const ae of atlActorEffects) {
		// Make sure is enabled
		//@ts-ignore
		ae.disabled = false;
		//@ts-ignore
		ae.transfer = true;
		//@ts-ignore
		if (!ae.origin) {
			//@ts-ignore
			ae.origin = await aemlApiLigthsHudAte.prepareOriginForActor(newActorDropped.id);
		}
		// await actor.createEmbeddedDocuments('ActiveEffect', [<Record<string, any>>ae]);
		await ae.update({
			disabled: false,
			transfer: true,
		});

		// TODO how can i do this
		// await API.addActiveEffectOnActor(<string>actor.id, ae);
		// await API.toggleEffectFromIdOnActor(<string>actor.id, <string>ae.id, false, true, false);
	}

	// WTF ???? THIS CONVERT SOME FALSE TO TRUE ????
	//const actorData = foundry.utils.duplicate(actor);
	// const actorData = newActorDropped;
	// SET ALL PLAYERS HAS OWNER
	await newActorDropped.update({ permission: { default: 3 } });
	/*
	const tokenData = {
		hidden: false,
		img: newActorDropped.img,
		elevation: elevation,
		actorData: newActorDropped,
		// effects: actorDataEffects
		actorLink: false,
	};

	// Merge Token data with the default for the Actor
	//@ts-ignore
	const tokenData2 = foundry.utils.mergeObject(actorData.prototypeToken, tokenData, { inplace: true });
	// tokenData2.actorId = <string>actor._id;
	// tokenData2.actorLink = false; // if actorless is false
	// tokenData2.name = actorName;
	// tokenData2._id = tokenId;
	*/
	//@ts-ignore
	// const tokenDataDropTheTorch = <any>await newActorDropped.getTokenDocument();
	// return <any>tokenDataDropTheTorch;
	return newActorDropped;
}

export function checkNumberFromString(value) {
	if (value === null || value === undefined || value === "") {
		return "";
	} else {
		return Number(value);
	}
}

export function checkBooleanFromString(value) {
	if (value === null || value === undefined || value === "") {
		return false;
	} else {
		return Boolean(value);
	}
}

export async function retrieveItemLightsStatic(token: Token): Promise<LightDataHud[]> {
	const actor = token.actor;
	if (!actor || !token) {
		return [];
	}
	const lightItems: LightHUDElement[] = API.LIGHTS.filter((light) => {
		return light.id != LightHUDPreset.NONE && light.id != LightHUDPreset.NO_CHANGE;
	});

	// let lightItemsYouCanUse = <Item[]>[];
	// if (game.settings.get(CONSTANTS.MODULE_NAME, "rollItem")) {
	// 	lightItemsYouCanUse = await API.retrieveAllItemsYouCanUseFromItems(lightItems);
	// }

	let imagesParsed: LightDataHud[] = [];

	// Convert item to LightHudData
	imagesParsed = await Promise.all(
		lightItems.map(async (lightHUDElement: LightHUDElement) => {
			const im = <string>lightHUDElement.img || "modules/lights-hud-ate/assets/lightbulb-solid.svg";
			const split = im.split("/");
			const extensions = im.split(".");
			const extension = <string>extensions[extensions.length - 1];
			const img = ["jpg", "jpeg", "png", "svg", "webp"].includes(extension);
			const vid = ["webm", "mp4", "m4v"].includes(extension);
			let appliedTmp = false;
			let disabledTmp = false;
			let suppressedTmp = false;
			let temporaryTmp = false;
			let passiveTmp = false;
			let effectidTmp = "";
			let effectnameTmp = "";
			let turnsTmp = 0;
			let isExpiredTmp = false;
			let remainingSecondsTmp = -1;
			let labelTmp = "";
			let _idTmp = "";
			let flagsTmp = {};
			let tokenidTmp = "";
			let actoridTmp = "";
			const isFlagTmp = false;
			const isActorEffectTmp = false;
			const isFlagLightTmp = true;

			const applied =
				actor.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HUD_ENABLED + "_" + lightHUDElement.id) || false;
			disabledTmp = !applied;
			suppressedTmp = false; // always false
			// temporaryTmp = <number>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.DURATION)
			//   ? <number>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.DURATION) > 0
			//   : false;
			temporaryTmp = lightHUDElement.isTemporary;
			passiveTmp = !temporaryTmp;
			if (applied && !disabledTmp && !suppressedTmp) {
				appliedTmp = true;
			}
			effectidTmp = "";
			effectnameTmp = lightHUDElement.name;
			tokenidTmp = <string>token.id;
			actoridTmp = <string>actor.id;
			// ADDED
			remainingSecondsTmp =
				lightHUDElement.isTemporary && lightHUDElement.duration > 0
					? _getSecondsRemaining(lightHUDElement.duration)
					: 0;
			turnsTmp = 0;
			isExpiredTmp = false;
			labelTmp = lightHUDElement.name;
			_idTmp = <string>lightHUDElement.id;
			// TODO filter this
			//@ts-ignore
			flagsTmp = actor?.flags || {};

			if (!suppressedTmp) {
				appliedTmp = appliedTmp || (passiveTmp && !disabledTmp);
			} else {
				appliedTmp = !appliedTmp;
			}

			// if (game.settings.get(CONSTANTS.MODULE_NAME, "rollItem")) {
			// 	if (!(lightItemsYouCanUse.filter(e => e.id === item.id).length > 0)) {
			// 		if(!appliedTmp){
			// 			return new LightDataHud();
			// 		}
			// 	}
			// }

			return <LightDataHud>{
				icon: im,
				name: i18n(lightHUDElement.name),
				applied: appliedTmp,
				disabled: disabledTmp,
				suppressed: suppressedTmp,
				isTemporary: temporaryTmp,
				passive: passiveTmp,
				img: img,
				vid: vid,
				type: img || vid,
				itemid: lightHUDElement.id,
				itemname: i18n(lightHUDElement.name),
				effectid: effectidTmp,
				effectname: i18n(effectnameTmp),
				tokenid: tokenidTmp,
				actorid: actoridTmp,
				// Added for dfred panel
				remainingSeconds: remainingSecondsTmp,
				turns: turnsTmp,
				isExpired: isExpiredTmp,
				label: i18n(labelTmp),
				_id: _idTmp,
				flags: flagsTmp,
				isflag: isFlagTmp,
				isactoreffect: isActorEffectTmp,
				isflaglight: isFlagLightTmp,
			};
		})
	);
	const imagesParsedFilter = imagesParsed.filter((i: LightDataHud) => {
		return i.effectname;
	});
	return imagesParsedFilter;
}

export async function retrieveItemLights(token: Token): Promise<LightDataHud[]> {
	// const actor = <Actor>this._actor;
	// const token = <Token>this._token;
	const actor = token.actor;
	//const actor = <Actor>canvas.tokens?.controlled[0]?.actor ?? game.user?.character ?? null;
	//const token = <Token>canvas.tokens?.controlled[0] ?? null;

	if (!actor || !token) {
		return [];
	}
	let lightItems: Item[] = [];
	let imagesParsed: LightDataHud[] = [];

	//const physicalItems = ['weapon', 'equipment', 'consumable', 'tool', 'backpack', 'loot'];
	// const spellsItems = ['spell','feat'];
	// For every itemwith a ATL/ATE effect
	for (const im of actor.items.contents) {
		// TODO ADD CHECK ONLY FOR PHYSICAL ITEM
		// if (im && physicalItems.includes(im.type)) {}
		if (game.settings.get(CONSTANTS.MODULE_NAME, "applyOnATEItem")) {
			const atlEffects = im.effects.filter((entity) => {
				//@ts-ignore
				return entity.changes.find((effect) => effect.key.includes("ATL")) != undefined;
			});
			if (atlEffects.length > 0) {
				lightItems.push(im);
				continue;
			}
		}
		if (game.settings.get(CONSTANTS.MODULE_NAME, "applyOnFlagItem")) {
			if (im.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ENABLE)) {
				lightItems.push(im);
				continue;
			}
		}
	}

	let lightItemsYouCanUse = <Item[]>[];
	if (game.settings.get(CONSTANTS.MODULE_NAME, "rollItem")) {
		lightItemsYouCanUse = await API.retrieveAllItemsYouCanUseFromItems(lightItems);
	}

	// Strange case no item with ATL but we have some active effect
	let actorAtlEffects = <ActiveEffect[]>[];
	if (game.settings.get(CONSTANTS.MODULE_NAME, "showATEFromNoItemOrigin")) {
		actorAtlEffects = (<Actor>token.actor).effects.filter((entity) => {
			//@ts-ignore
			return entity.changes.find((effect) => effect.key.includes("ATL")) != undefined;
		});
	}

	// Convert item to LightHudData
	imagesParsed = await Promise.all(
		lightItems.map(async (item: Item) => {
			const im = <string>item.img || "modules/lights-hud-ate/assets/lightbulb-solid.svg";
			const split = im.split("/");
			const extensions = im.split(".");
			const extension = <string>extensions[extensions.length - 1];
			const img = ["jpg", "jpeg", "png", "svg", "webp"].includes(extension);
			const vid = ["webm", "mp4", "m4v"].includes(extension);
			// TODO for now we check if at least one active effect has the atl/ate changes on him
			const aeAtl = <ActiveEffect[]>getATLEffectsFromItem(item) || [];
			let appliedTmp = false;
			let disabledTmp = false;
			let suppressedTmp = false;
			let temporaryTmp = false;
			let passiveTmp = false;
			let effectidTmp = "";
			let effectnameTmp = "";
			let turnsTmp = 0;
			let isExpiredTmp = false;
			let remainingSecondsTmp = -1;
			let labelTmp = "";
			let _idTmp = "";
			let flagsTmp = {};
			let tokenidTmp = "";
			let actoridTmp = "";
			let isFlagTmp = false;
			let isActorEffectTmp = false;
			const isFlagLightTmp = false;
			// ========================================================
			// IMPORTANT PRIORITY TO THE ATL EFFECT PRESENT ON THE ITEM
			// ========================================================
			if (aeAtl.length > 0) {
				isFlagTmp = false;
				isActorEffectTmp = true;
				const aeAtl0 = <any>aeAtl[0];
				const nameToSearch = <string>aeAtl0.name || aeAtl0.label;
				//@ts-ignore
				let effectFromActor = <any>actor.effects.find((ae: ActiveEffect) => {
					//@ts-ignore
					return isStringEquals(nameToSearch, ae.label);
				});
				// Check if someone has delete the active effect but the item with the ATL changes is still on inventory
				if (
					!effectFromActor &&
					game.settings.get(CONSTANTS.MODULE_NAME, "autoApplyEffectIfNotPresentOnActor")
				) {
					info(`No active effect found on token ${token.document.name} with name ${nameToSearch}`);
					const activeEffectDataToUpdate = aeAtl0.toObject();
					activeEffectDataToUpdate.transfer = false;
					activeEffectDataToUpdate.disabled = true;
					activeEffectDataToUpdate.origin = await aemlApiLigthsHudAte.prepareOriginFromEntity(aeAtl0);
					// activeEffectDataToUpdate.origin =
					// 	aeAtl0.parent instanceof Item ? `Item.${aeAtl0.parent.id}` : `Actor.${aeAtl0.parent.id}`;
					await aemlApiLigthsHudAte.addActiveEffectOnToken(
						<string>token.document.id,
						<any>activeEffectDataToUpdate
					);
					//@ts-ignore
					effectFromActor = <any>token.document.actor?.effects.find((ae: ActiveEffect) => {
						//@ts-ignore
						return isStringEquals(nameToSearch, ae.label);
					});
				}
				// TRY TO GET FROM ITEM
				if (!effectFromActor) {
					const atlEffects = item.effects.filter((entity) => {
						//@ts-ignore
						return entity.changes.find((effect) => effect.key.includes("ATL")) != undefined;
					});
					// FOR MY OWN SANITY ONLY THE FIRST
					if (atlEffects.length > 0) {
						effectFromActor = atlEffects[0];
					}
				}
				if (!effectFromActor) {
					warn(`No active effect found on token ${token.document.name} with name ${nameToSearch}`);
					return new LightDataHud();
				}
				effectidTmp = <string>effectFromActor.id;
				effectnameTmp = <string>effectFromActor.name ?? effectFromActor.label;
				_idTmp = <string>effectFromActor._id;

				const applied = await aemlApiLigthsHudAte.hasEffectAppliedOnToken(
					<string>token.document.id,
					nameToSearch,
					true
				);
				// If the active effect is disabled or is supressed
				disabledTmp = effectFromActor.disabled || false;
				//@ts-ignore
				suppressedTmp = effectFromActor.isSuppressed || false;
				temporaryTmp = aeAtl0.isTemporary || false;
				passiveTmp = !temporaryTmp;
				if (applied && !disabledTmp && !suppressedTmp) {
					appliedTmp = true;
				}
				tokenidTmp = <string>token.id;
				actoridTmp = <string>actor.id;
				// ADDED
				remainingSecondsTmp = _getSecondsRemaining(aeAtl0.duration);
				turnsTmp = <number>aeAtl0.duration.turns;
				isExpiredTmp = remainingSecondsTmp < 0;
				labelTmp = aeAtl0.label;
				flagsTmp = aeAtl0?.flags || {};
				// Little trick if
				if (!aeAtl0?.flags?.convenientDescription) {
					flagsTmp["convenientDescription"] = item.name;
				}
				if (!effectFromActor?.flags?.convenientDescription) {
					flagsTmp["convenientDescription"] = item.name;
				}

				if (!suppressedTmp) {
					appliedTmp = appliedTmp || (passiveTmp && !disabledTmp);
				} else {
					appliedTmp = !appliedTmp;
				}

				if (aeAtl.length > 0 && !effectidTmp) {
					warn(`No ATL active effect found on actor ${token.name} from item ${item.name}`, true);
					return new LightDataHud();
				}
			}
			// ========================================================
			// WE CHECK THE FLAG
			// ========================================================
			else if (item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ENABLE)) {
				isFlagTmp = true;
				isActorEffectTmp = false;
				const applied = item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HUD_ENABLED) || false;
				disabledTmp = !applied;
				suppressedTmp = false; // always false
				temporaryTmp = <number>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.DURATION)
					? <number>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.DURATION) > 0
					: false;
				passiveTmp = !temporaryTmp;
				if (applied && !disabledTmp && !suppressedTmp) {
					appliedTmp = true;
				}
				effectidTmp = "";
				effectnameTmp = <string>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.NAME) ?? item.name;
				tokenidTmp = <string>token.id;
				actoridTmp = <string>actor.id;
				// ADDED
				remainingSecondsTmp = _getSecondsRemaining(
					temporaryTmp ? <number>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.DURATION) : 0
				);
				turnsTmp = 0;
				isExpiredTmp = false;
				labelTmp = <string>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.NAME) ?? item.name;
				_idTmp = <string>item.id;
				// TODO filter this
				//@ts-ignore
				flagsTmp = item?.flags || {};

				if (!suppressedTmp) {
					appliedTmp = appliedTmp || (passiveTmp && !disabledTmp);
				} else {
					appliedTmp = !appliedTmp;
				}
			}
			// ========================================================
			// DO NOTHING
			// ========================================================
			else {
				return new LightDataHud();
			}

			if (game.settings.get(CONSTANTS.MODULE_NAME, "rollItem")) {
				if (!(lightItemsYouCanUse.filter((e) => e.id === item.id).length > 0)) {
					if (!appliedTmp) {
						return new LightDataHud();
					}
				}
			}

			return <LightDataHud>{
				icon: im,
				name: item.name,
				applied: appliedTmp,
				disabled: disabledTmp,
				suppressed: suppressedTmp,
				isTemporary: temporaryTmp,
				passive: passiveTmp,
				img: img,
				vid: vid,
				type: img || vid,
				itemid: item.id,
				itemname: item.name,
				effectid: effectidTmp,
				effectname: effectnameTmp,
				tokenid: tokenidTmp,
				actorid: actoridTmp,
				// Added for dfred panel
				remainingSeconds: remainingSecondsTmp,
				turns: turnsTmp,
				isExpired: isExpiredTmp,
				label: labelTmp,
				_id: _idTmp,
				flags: flagsTmp,
				isflag: isFlagTmp,
				isactoreffect: isActorEffectTmp,
				isflaglight: isFlagLightTmp,
			};
		})
	);

	if (actorAtlEffects.length > 0) {
		for (const aeAtl0 of <any[]>actorAtlEffects) {
			let effectFromActorToIgnore = imagesParsed.find((ldu: LightDataHud) => {
				//@ts-ignore
				return isStringEquals(ldu._id, aeAtl0._id);
			});
			if (effectFromActorToIgnore) {
				continue;
			}
			//@ts-ignore
			const im = <string>aeAtl0.icon || token.img || "modules/lights-hud-ate/assets/lightbulb-solid.svg";
			const split = im.split("/");
			const extensions = im.split(".");
			const extension = <string>extensions[extensions.length - 1];
			const img = ["jpg", "jpeg", "png", "svg", "webp"].includes(extension);
			const vid = ["webm", "mp4", "m4v"].includes(extension);

			let appliedTmp = false;
			let disabledTmp = false;
			let suppressedTmp = false;
			let temporaryTmp = false;
			let passiveTmp = false;
			let effectidTmp = "";
			let effectnameTmp = "";
			let turnsTmp = 0;
			let isExpiredTmp = false;
			let remainingSecondsTmp = -1;
			let labelTmp = "";
			let _idTmp = "";
			let flagsTmp = {};
			let tokenidTmp = "";
			let actoridTmp = "";
			const isFlagTmp = false;
			const isActorEffectTmp = true;
			const isFlagLightTmp = false;
			// const aeAtl0 = <ActiveEffect>aeAtl[0];
			const nameToSearch = <string>aeAtl0.name || aeAtl0.label;
			// TODO How this is work ???
			// let effectFromActor = aeAtl0;
			let effectFromActor = <ActiveEffect>actor.effects.find((ae: ActiveEffect) => {
				//@ts-ignore
				return isStringEquals(nameToSearch, ae.label);
			});
			// Check if someone has delete the active effect but the item with the ATL changes is still on inventory
			if (!effectFromActor && game.settings.get(CONSTANTS.MODULE_NAME, "autoApplyEffectIfNotPresentOnActor")) {
				info(`No active effect found on token ${token.document.name} with name ${nameToSearch}`);
				const activeEffectDataToUpdate = aeAtl0.toObject();
				activeEffectDataToUpdate.transfer = false;
				activeEffectDataToUpdate.disabled = true;
				activeEffectDataToUpdate.origin = await aemlApiLigthsHudAte.prepareOriginFromEntity(aeAtl0);
				// activeEffectDataToUpdate.origin =
				// 	aeAtl0.parent instanceof Item ? `Item.${aeAtl0.parent.id}` : `Actor.${aeAtl0.parent.id}`;
				await aemlApiLigthsHudAte.addActiveEffectOnToken(
					<string>token.document.id,
					<any>activeEffectDataToUpdate
				);
				// ???
				effectFromActor = <ActiveEffect>token.document.actor?.effects.find((ae: ActiveEffect) => {
					//@ts-ignore
					return isStringEquals(nameToSearch, ae.label);
				});
				// await API.toggleEffectFromIdOnToken(<string>token.document.id, <string>effectFromActor.id, false, false, true);
			}
			if (!effectFromActor) {
				warn(`No active effect found on token ${token.document.name} with name ${nameToSearch}`);
				continue;
			}
			effectidTmp = <string>effectFromActor.id;
			//@ts-ignore
			effectnameTmp = <string>effectFromActor.name ?? effectFromActor.label;
			//@ts-ignore
			_idTmp = <string>effectFromActor._id;

			const applied = await aemlApiLigthsHudAte.hasEffectAppliedOnToken(
				<string>token.document.id,
				nameToSearch,
				true
			);
			// If the active effect is disabled or is supressed
			//@ts-ignore
			disabledTmp = effectFromActor.disabled || false;
			//@ts-ignore
			suppressedTmp = effectFromActor.isSuppressed || false;
			temporaryTmp = aeAtl0.isTemporary || false;
			passiveTmp = !temporaryTmp;
			if (applied && !disabledTmp && !suppressedTmp) {
				appliedTmp = true;
			}
			tokenidTmp = <string>token.id;
			actoridTmp = <string>actor.id;
			// ADDED
			remainingSecondsTmp = _getSecondsRemaining(aeAtl0.duration);
			turnsTmp = <number>aeAtl0.duration.turns;
			isExpiredTmp = remainingSecondsTmp < 0;
			labelTmp = aeAtl0.label;
			flagsTmp = aeAtl0?.flags || {};
			// Little trick if
			if (!aeAtl0?.flags?.convenientDescription) {
				flagsTmp["convenientDescription"] = aeAtl0.label;
			}
			//@ts-ignore
			if (!effectFromActor?.flags?.convenientDescription) {
				//@ts-ignore
				flagsTmp["convenientDescription"] = effectFromActor.label;
			}

			if (!suppressedTmp) {
				appliedTmp = appliedTmp || (passiveTmp && !disabledTmp);
			} else {
				appliedTmp = !appliedTmp;
			}

			imagesParsed.push(<LightDataHud>{
				icon: im,
				name: aeAtl0.label,
				applied: appliedTmp,
				disabled: disabledTmp,
				suppressed: suppressedTmp,
				isTemporary: temporaryTmp,
				passive: passiveTmp,
				img: img,
				vid: vid,
				type: img || vid,
				itemid: "",
				itemname: aeAtl0.label,
				effectid: effectidTmp,
				effectname: effectnameTmp,
				tokenid: tokenidTmp,
				actorid: actoridTmp,
				// Added for dfred panel
				remainingSeconds: remainingSecondsTmp,
				turns: turnsTmp,
				isExpired: isExpiredTmp,
				label: labelTmp,
				_id: _idTmp,
				flags: flagsTmp,
				isflag: isFlagTmp,
				isactoreffect: isActorEffectTmp,
				isflaglight: isFlagLightTmp,
			});
		}
	}

	const imagesParsedFilter = imagesParsed.filter((i: LightDataHud) => {
		return i.effectname;
	});
	return imagesParsedFilter;
}

// TODO consider handling rounds/seconds/turns based on whatever is defined for the effect rather than do conversions
function _getSecondsRemaining(duration) {
	if (duration.seconds || duration.rounds) {
		const seconds = duration.seconds ?? duration.rounds * (CONFIG.time?.roundTime ?? 6);
		return duration.startTime + seconds - game.time.worldTime;
	} else {
		if (is_real_number(duration)) {
			const seconds = duration;
			return game.time.worldTime + seconds - game.time.worldTime;
		} else {
			return Infinity;
		}
	}
}

export async function retrieveItemLightsWithFlagAndDisableThemLightsStatic(
	token: Token,
	itemId: string
): Promise<void> {
	const actor = token.actor;
	if (!actor || !token) {
		return;
	}
	const p = getProperty(actor, `data.flags.${CONSTANTS.MODULE_NAME}`);
	for (const key in p) {
		const senseOrConditionIdKey = key;
		const senseOrConditionValue = <any>p[key];
		if (
			senseOrConditionIdKey.startsWith(LightHUDNoteFlags.HUD_ENABLED + "_") &&
			senseOrConditionIdKey != LightHUDNoteFlags.HUD_ENABLED + "_" + itemId
		) {
			await actor.unsetFlag(CONSTANTS.MODULE_NAME, senseOrConditionIdKey);
		}
	}
}

export async function retrieveItemLightsWithFlagAndDisableThem(token: Token, itemId: string): Promise<void> {
	const actor = token.actor;
	if (!actor || !token) {
		return;
	}
	// For every itemwith a ATL/ATE effect
	for (const im of actor.items.contents) {
		if (game.settings.get(CONSTANTS.MODULE_NAME, "applyOnFlagItem")) {
			if (
				im.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ENABLE) &&
				im.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HUD_ENABLED) &&
				im.id != itemId
			) {
				await im.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HUD_ENABLED, false);
			}
		}
	}
}

export async function retrieveItemLightsWithFlagLightsStatic(token: Token): Promise<LightDataHud[]> {
	const actor = token.actor;
	if (!actor || !token) {
		return [];
	}

	const lightItems: LightHUDElement[] = API.LIGHTS.filter((light) => {
		return light.id != LightHUDPreset.NONE && light.id != LightHUDPreset.NO_CHANGE;
	});

	// let lightItemsYouCanUse = <Item[]>[];
	// if (game.settings.get(CONSTANTS.MODULE_NAME, "rollItem")) {
	// 	lightItemsYouCanUse = await API.retrieveAllItemsYouCanUseFromItems(lightItems);
	// }

	let imagesParsed: LightDataHud[] = [];
	// Convert item to LightHudData
	imagesParsed = await Promise.all(
		lightItems.map(async (lightHUDElement: LightHUDElement) => {
			const im = <string>lightHUDElement.img || "modules/lights-hud-ate/assets/lightbulb-solid.svg";
			const split = im.split("/");
			const extensions = im.split(".");
			const extension = <string>extensions[extensions.length - 1];
			const img = ["jpg", "jpeg", "png", "svg", "webp"].includes(extension);
			const vid = ["webm", "mp4", "m4v"].includes(extension);
			// TODO for now we check if at least one active effect has the atl/ate changes on him
			// const aeAtl = <ActiveEffect[]>getATLEffectsFromItem(actor, item) || [];
			let appliedTmp = false;
			let disabledTmp = false;
			let suppressedTmp = false;
			let temporaryTmp = false;
			let passiveTmp = false;
			let effectidTmp = "";
			let effectnameTmp = "";
			let turnsTmp = 0;
			let isExpiredTmp = false;
			let remainingSecondsTmp = -1;
			let labelTmp = "";
			let _idTmp = "";
			let flagsTmp = {};
			let tokenidTmp = "";
			let actoridTmp = "";
			const isFlagTmp = false;
			const isActorEffectTmp = false;
			const isFlagLightTmp = true;
			const isApplied = <boolean>(
				actor.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HUD_ENABLED + "_" + lightHUDElement.id)
			);
			const applied = isApplied || false;
			disabledTmp = !applied;
			suppressedTmp = false; // always false
			temporaryTmp = lightHUDElement.isTemporary;
			passiveTmp = !temporaryTmp;
			if (applied && !disabledTmp && !suppressedTmp) {
				appliedTmp = true;
			}
			effectidTmp = "";
			effectnameTmp = lightHUDElement.name;
			tokenidTmp = <string>token.id;
			actoridTmp = <string>actor.id;
			// ADDED
			remainingSecondsTmp =
				lightHUDElement.isTemporary && lightHUDElement.duration > 0 ? _getSecondsRemaining(temporaryTmp) : 0;
			turnsTmp = 0;
			isExpiredTmp = false;
			labelTmp = lightHUDElement.name;
			_idTmp = <string>lightHUDElement.id;
			// TODO filter this
			//@ts-ignore
			flagsTmp = token.actor?.flags || {};

			if (!suppressedTmp) {
				appliedTmp = appliedTmp || (passiveTmp && !disabledTmp);
			} else {
				appliedTmp = !appliedTmp;
			}

			// if (game.settings.get(CONSTANTS.MODULE_NAME, "rollItem")) {
			// 	if (!(lightItemsYouCanUse.filter(e => e.id === item.id).length > 0)) {
			// 		if(!appliedTmp){
			// 			return new LightDataHud();
			// 		}
			// 	}
			// }

			return <LightDataHud>{
				icon: im,
				name: i18n(lightHUDElement.name),
				applied: appliedTmp,
				disabled: disabledTmp,
				suppressed: suppressedTmp,
				isTemporary: temporaryTmp,
				passive: passiveTmp,
				img: img,
				vid: vid,
				type: img || vid,
				itemid: lightHUDElement.id,
				itemname: i18n(lightHUDElement.name),
				effectid: effectidTmp,
				effectname: i18n(effectnameTmp),
				tokenid: tokenidTmp,
				actorid: actoridTmp,
				// Added for dfred panel
				remainingSeconds: remainingSecondsTmp,
				turns: turnsTmp,
				isExpired: isExpiredTmp,
				label: i18n(labelTmp),
				_id: _idTmp,
				flags: flagsTmp,
				isflag: isFlagTmp,
				isactoreffect: isActorEffectTmp,
				isflaglight: isFlagLightTmp,
			};
		})
	);

	const imagesParsedFilter = imagesParsed.filter((i: LightDataHud) => {
		return i.effectname;
	});
	return imagesParsedFilter;
}

export async function retrieveItemLightsWithFlag(token: Token): Promise<LightDataHud[]> {
	const actor = token.actor;
	if (!actor || !token) {
		return [];
	}
	const lightItems: Item[] = [];
	let imagesParsed: LightDataHud[] = [];
	for (const im of actor.items.contents) {
		if (game.settings.get(CONSTANTS.MODULE_NAME, "applyOnFlagItem")) {
			if (im.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ENABLE)) {
				lightItems.push(im);
				continue;
			}
		}
	}

	// let lightItemsYouCanUse = <Item[]>[];
	// if (game.settings.get(CONSTANTS.MODULE_NAME, "rollItem")) {
	// 	lightItemsYouCanUse = await API.retrieveAllItemsYouCanUseFromItems(lightItems);
	// }

	// Convert item to LightHudData
	imagesParsed = await Promise.all(
		lightItems.map(async (item: Item) => {
			const im = <string>item.img || "modules/lights-hud-ate/assets/lightbulb-solid.svg";
			const split = im.split("/");
			const extensions = im.split(".");
			const extension = <string>extensions[extensions.length - 1];
			const img = ["jpg", "jpeg", "png", "svg", "webp"].includes(extension);
			const vid = ["webm", "mp4", "m4v"].includes(extension);
			// TODO for now we check if at least one active effect has the atl/ate changes on him
			// const aeAtl = <ActiveEffect[]>getATLEffectsFromItem(actor, item) || [];
			let appliedTmp = false;
			let disabledTmp = false;
			let suppressedTmp = false;
			let temporaryTmp = false;
			let passiveTmp = false;
			let effectidTmp = "";
			let effectnameTmp = "";
			let turnsTmp = 0;
			let isExpiredTmp = false;
			let remainingSecondsTmp = -1;
			let labelTmp = "";
			let _idTmp = "";
			let flagsTmp = {};
			let tokenidTmp = "";
			let actoridTmp = "";
			let isFlagTmp = false;
			const isActorEffectTmp = false;
			const isFlagLightTmp = false;
			// ========================================================
			// WE CHECK THE FLAG
			// ========================================================
			if (item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ENABLE)) {
				isFlagTmp = true;
				const applied = item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HUD_ENABLED) || false;
				disabledTmp = !applied;
				suppressedTmp = false; // always false
				temporaryTmp = <number>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.DURATION)
					? <number>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.DURATION) > 0
					: false;
				passiveTmp = !temporaryTmp;
				if (applied && !disabledTmp && !suppressedTmp) {
					appliedTmp = true;
				}
				effectidTmp = "";
				effectnameTmp = <string>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.NAME) ?? item.name;
				tokenidTmp = <string>token.id;
				actoridTmp = <string>actor.id;
				// ADDED
				remainingSecondsTmp = _getSecondsRemaining(
					temporaryTmp ? <number>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.DURATION) : 0
				);
				turnsTmp = 0;
				isExpiredTmp = false;
				labelTmp = <string>item.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.NAME) ?? item.name;
				_idTmp = <string>item.id;
				// TODO filter this
				//@ts-ignore
				flagsTmp = item?.flags || {};

				if (!suppressedTmp) {
					appliedTmp = appliedTmp || (passiveTmp && !disabledTmp);
				} else {
					appliedTmp = !appliedTmp;
				}
			}
			// ========================================================
			// DO NOTHING
			// ========================================================
			else {
				return new LightDataHud();
			}

			// if (game.settings.get(CONSTANTS.MODULE_NAME, "rollItem")) {
			// 	if (!(lightItemsYouCanUse.filter(e => e.id === item.id).length > 0)) {
			// 		if(!appliedTmp){
			// 			return new LightDataHud();
			// 		}
			// 	}
			// }

			return <LightDataHud>{
				icon: im,
				name: item.name,
				applied: appliedTmp,
				disabled: disabledTmp,
				suppressed: suppressedTmp,
				isTemporary: temporaryTmp,
				passive: passiveTmp,
				img: img,
				vid: vid,
				type: img || vid,
				itemid: item.id,
				itemname: item.name,
				effectid: effectidTmp,
				effectname: effectnameTmp,
				tokenid: tokenidTmp,
				actorid: actoridTmp,
				// Added for dfred panel
				remainingSeconds: remainingSecondsTmp,
				turns: turnsTmp,
				isExpired: isExpiredTmp,
				label: labelTmp,
				_id: _idTmp,
				flags: flagsTmp,
				isflag: isFlagTmp,
				isactoreffect: isActorEffectTmp,
				isflaglight: isFlagLightTmp,
			};
		})
	);

	const imagesParsedFilter = imagesParsed.filter((i: LightDataHud) => {
		return i.effectname;
	});
	return imagesParsedFilter;
}

export function manageDist(feetInput: number, isPreset: boolean): number {
	let valueDist = feetInput;
	if (isPreset && game.ready && game.settings.get(CONSTANTS.MODULE_NAME, "useMetricSystem")) {
		valueDist = convertFeetToMeter(valueDist);
	}
	return valueDist;
}

export function convertFeetToMeter(feetInput: number): number {
	return Math.floor(feetInput / 3.2808);
}

export function convertMeterToFeet(meterInput: number): number {
	return Math.floor(meterInput * 3.2808);
}
