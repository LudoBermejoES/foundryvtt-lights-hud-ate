import CONSTANTS from "./constants";
import { dialogWarning, error, i18n, info, warn } from "./lib/lib";
import type { LightHUDElement, VisionHUDElement } from "./lights-hud-ate-models";
import type Effect from "./effects/effect";
import dnd5e from "./systems/dnd5e";
import generic from "./systems/generic";
import archmage from "./systems/archmage";
import demonlord from "./systems/demonlord";
import pf2e from "./systems/pf2e";
import pf1 from "./systems/pf1";

const API = {
	// effectInterface: EffectInterface,

	/**
	 * The attributes used to track dynamic attributes in this system
	 *
	 * @returns {array}
	 */
	get LIGHTS(): LightHUDElement[] {
		return <any[]>game.settings.get(CONSTANTS.MODULE_NAME, "lights");
	},

	/**
	 * The attributes used to track dynamic attributes in this system
	 *
	 * @returns {array}
	 */
	get VISIONS(): VisionHUDElement[] {
		return <any[]>game.settings.get(CONSTANTS.MODULE_NAME, "visions");
	},

	/**
	 * Sets the attributes used to track dynamic attributes in this system
	 *
	 * @param {array} inAttributes
	 * @returns {Promise}
	 */
	async setLights(inAttributes) {
		if (!Array.isArray(inAttributes)) {
			throw error("setLights | inAttributes must be of type array");
		}
		inAttributes.forEach((attribute) => {
			if (typeof attribute !== "object") {
				throw error("setLights | each entry in the inAttributes array must be of type object");
			}
			if (typeof attribute.name !== "string") {
				throw error("setLights | attribute.name must be of type string");
			}
			if (typeof attribute.attribute !== "string") {
				throw error("setLights | attribute.path must be of type string");
			}
			if (attribute.img && typeof attribute.img !== "string") {
				throw error("setLights | attribute.img must be of type string");
			}
		});
		return game.settings.set(CONSTANTS.MODULE_NAME, "lights", inAttributes);
	},

	/**
	 * Sets the attributes used to track dynamic attributes in this system
	 *
	 * @param {array} inAttributes
	 * @returns {Promise}
	 */
	async setVisions(inAttributes) {
		if (!Array.isArray(inAttributes)) {
			throw error("setVisions | inAttributes must be of type array");
		}
		inAttributes.forEach((attribute) => {
			if (typeof attribute !== "object") {
				throw error("setVisions | each entry in the inAttributes array must be of type object");
			}
			if (typeof attribute.name !== "string") {
				throw error("setVisions | attribute.name must be of type string");
			}
			if (typeof attribute.attribute !== "string") {
				throw error("setVisions | attribute.path must be of type string");
			}
			if (attribute.img && typeof attribute.img !== "string") {
				throw error("setVisions | attribute.img must be of type string");
			}
		});
		return game.settings.set(CONSTANTS.MODULE_NAME, "visions", inAttributes);
	},

	// =======================================================================================

	async cleanUpTokenSelected() {
		const tokens = <Token[]>canvas.tokens?.controlled;
		if (!tokens || tokens.length === 0) {
			warn(`No tokens are selected`, true);
			return;
		}
		for (const token of tokens) {
			if (token && token.document) {
				if (getProperty(token.document, `flags.${CONSTANTS.MODULE_NAME}`)) {
					const p = getProperty(token.document, `flags.${CONSTANTS.MODULE_NAME}`);
					for (const key in p) {
						const senseOrConditionIdKey = key;
						const senseOrConditionValue = <any>p[key];
						await token.document.unsetFlag(CONSTANTS.MODULE_NAME, senseOrConditionIdKey);
					}
					info(`Cleaned up token '${token.name}'`, true);
				}
				const items = <Item[]>token.actor?.items.contents;
				for (const item of items) {
					const p = getProperty(item, `flags.${CONSTANTS.MODULE_NAME}`);
					for (const key in p) {
						const senseOrConditionIdKey = key;
						const senseOrConditionValue = <any>p[key];
						await item.unsetFlag(CONSTANTS.MODULE_NAME, senseOrConditionIdKey);
					}
					info(`Cleaned up item '${item.name}'`, true);
				}
			} else {
				warn(`No token found on the canvas for id '${token.id}'`, true);
			}
		}
		for (const token of tokens) {
			if (token && token.actor) {
				if (getProperty(token.actor, `flags.${CONSTANTS.MODULE_NAME}`)) {
					const p = getProperty(token.actor, `flags.${CONSTANTS.MODULE_NAME}`);
					for (const key in p) {
						const senseOrConditionIdKey = key;
						const senseOrConditionValue = <any>p[key];
						await token.actor.unsetFlag(CONSTANTS.MODULE_NAME, senseOrConditionIdKey);
					}
					info(`Cleaned up actor '${token.name}'`, true);
				}
				const items = token.actor.items.contents;
				for (const item of items) {
					const p = getProperty(item, `flags.${CONSTANTS.MODULE_NAME}`);
					for (const key in p) {
						const senseOrConditionIdKey = key;
						const senseOrConditionValue = <any>p[key];
						await item.unsetFlag(CONSTANTS.MODULE_NAME, senseOrConditionIdKey);
					}
					info(`Cleaned up item '${item.name}'`, true);
				}
			} else {
				warn(`No token found on the canvas for id '${token.id}'`, true);
			}
		}
	},
	async retrieveAllItemsYouCanUseFromItems(items: Item[]): Promise<Item[]> {
		switch (game.system.id) {
			case "dnd5e": {
				return await dnd5e.retrieveAllItemsYouCanUseFromItems(items);
			}
			case "pf1": {
				return await pf1.retrieveAllItemsYouCanUseFromItems(items);
			}
			case "pf2e": {
				return await pf2e.retrieveAllItemsYouCanUseFromItems(items);
			}
			case "demonlord": {
				return await demonlord.retrieveAllItemsYouCanUseFromItems(items);
			}
			case "archmage": {
				return await archmage.retrieveAllItemsYouCanUseFromItems(items);
			}
			default: {
				return await generic.retrieveAllItemsYouCanUseFromItems(items);
			}
		}
	},
};

export default API;
