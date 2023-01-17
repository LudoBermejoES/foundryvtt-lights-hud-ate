import API from "./api";
import CONSTANTS from "./constants";
import { dialogWarning, i18n, warn } from "./lib/lib";
import { SYSTEMS } from "./systems";

export const registerSettings = function (): void {
	game.settings.registerMenu(CONSTANTS.MODULE_NAME, "resetAllSettings", {
		name: `${CONSTANTS.MODULE_NAME}.setting.reset.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.reset.hint`,
		icon: "fas fa-coins",
		type: ResetSettingsDialog,
		restricted: true,
	});

	// ============================================================
	// OLD SETTINGS TO REMOVE PROBABLY
	// ===========================================================

	// game.settings.register(CONSTANTS.MODULE_NAME, 'useOnlyBasic', {
	//   name: i18n(`${CONSTANTS.MODULE_NAME}.setting.useOnlyBasic.name`),
	//   hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.useOnlyBasic.hint`),
	//   scope: 'world',
	//   config: true,
	//   type: Boolean,
	//   default: false,
	// });

	game.settings.register(CONSTANTS.MODULE_NAME, "applyOnATEItem", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.applyOnATEItem.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.applyOnATEItem.hint`),
		scope: "world",
		config: true,
		type: Boolean,
		default: true,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "applyOnFlagItem", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.applyOnFlagItem.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.applyOnFlagItem.hint`),
		scope: "world",
		config: true,
		type: Boolean,
		default: false,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "enableLightHUDOldInterface", {
		name: `${CONSTANTS.MODULE_NAME}.setting.enableLightHUDOldInterface.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.enableLightHUDOldInterface.hint`,
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "showATEFromNoItemOrigin", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.showATEFromNoItemOrigin.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.showATEFromNoItemOrigin.hint`),
		scope: "world",
		config: true,
		type: Boolean,
		default: false,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "imageDisplay", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.imageDisplay.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.imageDisplay.hint`),
		scope: "world",
		config: true,
		type: Boolean,
		default: true,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "imageOpacity", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.opacity.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.opacity.hint`),
		scope: "world",
		config: true,
		range: <any>{ min: 0, max: 100, step: 1 },
		type: Number,
		default: 50,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "rollItem", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.rollItem.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.rollItem.hint`),
		config: true,
		scope: "world",
		default: true,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "skipDialogLightHUD", {
		name: `${CONSTANTS.MODULE_NAME}.setting.skipDialogLightHUD.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.skipDialogLightHUD.hint`,
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	// game.settings.register(CONSTANTS.MODULE_NAME, 'tempEffectsAsStatus', {
	//   name: `${CONSTANTS.MODULE_NAME}.setting.tempEffectsAsStatus.name`,
	//   hint: `${CONSTANTS.MODULE_NAME}.setting.tempEffectsAsStatus.hint`,
	//   scope: 'world',
	//   config: true,
	//   default: false,
	//   type: Boolean,
	// });

	// game.settings.register(CONSTANTS.MODULE_NAME, 'tempEffectsAsStatusToggleDelete', {
	//   name: `${CONSTANTS.MODULE_NAME}.setting.tempEffectsAsStatusToggleDelete.name`,
	//   hint: `${CONSTANTS.MODULE_NAME}.setting.tempEffectsAsStatusToggleDelete.hint`,
	//   scope: 'world',
	//   config: true,
	//   default: false,
	//   type: Boolean,
	// });

	game.settings.register(CONSTANTS.MODULE_NAME, "enableHud", {
		name: `${CONSTANTS.MODULE_NAME}.setting.enableHud.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.enableHud.hint`,
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "enableHudOnlyGM", {
		name: `${CONSTANTS.MODULE_NAME}.setting.enableHudOnlyGM.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.enableHudOnlyGM.hint`,
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	/** Which column should the button be placed on */
	game.settings.register(CONSTANTS.MODULE_NAME, "hudColumn", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudColumn.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudColumn.hint`),
		scope: "client",
		config: true,
		type: String,
		default: "Right",
		choices: <any>{
			Left: "Left",
			Right: "Right",
		},
	});

	/** Whether the button should be placed on the top or bottom of the column */
	game.settings.register(CONSTANTS.MODULE_NAME, "hudTopBottom", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudTopBottom.name`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudTopBottom.hint`),
		scope: "client",
		config: true,
		type: String,
		default: "Bottom",
		choices: <any>{
			Top: "Top",
			Bottom: "Bottom",
		},
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "useMetricSystem", {
		name: `${CONSTANTS.MODULE_NAME}.setting.useMetricSystem.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.useMetricSystem.hint`,
		scope: "client",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "autoApplyEffectIfNotPresentOnActor", {
		name: `${CONSTANTS.MODULE_NAME}.setting.autoApplyEffectIfNotPresentOnActor.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.autoApplyEffectIfNotPresentOnActor.hint`,
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	// ===================================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "debug", {
		name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
		scope: "client",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "debugHooks", {
		name: `${CONSTANTS.MODULE_NAME}.setting.debugHooks.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.debugHooks.hint`,
		scope: "world",
		config: false,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "systemFound", {
		name: `${CONSTANTS.MODULE_NAME}.setting.systemFound.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.systemFound.hint`,
		scope: "world",
		config: false,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "systemNotFoundWarningShown", {
		name: `${CONSTANTS.MODULE_NAME}.setting.systemNotFoundWarningShown.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.systemNotFoundWarningShown.hint`,
		scope: "world",
		config: false,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "preconfiguredSystem", {
		name: `${CONSTANTS.MODULE_NAME}.setting.preconfiguredSystem.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.preconfiguredSystem.hint`,
		scope: "world",
		config: false,
		default: false,
		type: Boolean,
	});

	const settings = defaultSettings();
	for (const [name, data] of Object.entries(settings)) {
		game.settings.register(CONSTANTS.MODULE_NAME, name, <any>data);
	}
	// for (const [name, data] of Object.entries(otherSettings)) {
	//     game.settings.register(CONSTANTS.MODULE_NAME, name, data);
	// }
};

class ResetSettingsDialog extends FormApplication<FormApplicationOptions, object, any> {
	constructor(...args) {
		//@ts-ignore
		super(...args);
		//@ts-ignore
		return new Dialog({
			title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.title`),
			content:
				'<p style="margin-bottom:1rem;">' +
				game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.content`) +
				"</p>",
			buttons: {
				confirm: {
					icon: '<i class="fas fa-check"></i>',
					label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.confirm`),
					callback: async () => {
						await applyDefaultSettings();
						window.location.reload();
					},
				},
				cancel: {
					icon: '<i class="fas fa-times"></i>',
					label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.cancel`),
				},
			},
			default: "cancel",
		});
	}

	async _updateObject(event: Event, formData?: object): Promise<any> {
		// do nothing
	}
}

async function applyDefaultSettings() {
	const settings = defaultSettings(true);
	for (const [name, data] of Object.entries(settings)) {
		//@ts-ignore
		await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
	}
	const settings2 = otherSettings(true);
	for (const [name, data] of Object.entries(settings2)) {
		//@ts-ignore
		await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
	}
}

function defaultSettings(apply = false) {
	return {
		lights: {
			scope: "world",
			config: false,
			//@ts-ignore
			default: SYSTEMS.DATA ? <any[]>SYSTEMS.DATA.LIGHTS : <any[]>[],
			type: Array,
		},
		visions: {
			scope: "world",
			config: false,
			//@ts-ignore
			default: SYSTEMS.DATA ? <any[]>SYSTEMS.DATA.VISIONS : <any[]>[],
			type: Array,
		},
	};
}

function otherSettings(apply = false) {
	return {
		debug: {
			name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
			hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
			scope: "client",
			config: true,
			default: false,
			type: Boolean,
		},

		debugHooks: {
			name: `${CONSTANTS.MODULE_NAME}.setting.debugHooks.name`,
			hint: `${CONSTANTS.MODULE_NAME}.setting.debugHooks.hint`,
			scope: "world",
			config: false,
			default: false,
			type: Boolean,
		},

		systemFound: {
			name: `${CONSTANTS.MODULE_NAME}.setting.systemFound.name`,
			hint: `${CONSTANTS.MODULE_NAME}.setting.systemFound.hint`,
			scope: "world",
			config: false,
			default: false,
			type: Boolean,
		},

		systemNotFoundWarningShown: {
			name: `${CONSTANTS.MODULE_NAME}.setting.systemNotFoundWarningShown.name`,
			hint: `${CONSTANTS.MODULE_NAME}.setting.systemNotFoundWarningShown.hint`,
			scope: "world",
			config: false,
			default: false,
			type: Boolean,
		},

		applyOnATEItem: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.setting.applyOnATEItem.name`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.applyOnATEItem.hint`),
			scope: "world",
			config: true,
			type: Boolean,
			default: true,
		},

		applyOnFlagItem: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.setting.applyOnFlagItem.name`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.applyOnFlagItem.hint`),
			scope: "world",
			config: true,
			type: Boolean,
			default: false,
		},

		enableLightHUDOldInterface: {
			name: `${CONSTANTS.MODULE_NAME}.setting.enableLightHUDOldInterface.name`,
			hint: `${CONSTANTS.MODULE_NAME}.setting.enableLightHUDOldInterface.hint`,
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		imageDisplay: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.setting.imageDisplay.name`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.imageDisplay.hint`),
			scope: "world",
			config: true,
			type: Boolean,
			default: true,
		},

		imageOpacity: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.setting.opacity.name`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.opacity.hint`),
			scope: "world",
			config: true,
			range: <any>{ min: 0, max: 100, step: 1 },
			type: Number,
			default: 50,
		},

		rollItem: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.setting.rollItem.name`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.rollItem.hint`),
			config: true,
			scope: "world",
			default: true,
			type: Boolean,
		},

		skipDialogLightHUD: {
			name: `${CONSTANTS.MODULE_NAME}.setting.skipDialogLightHUD.name`,
			hint: `${CONSTANTS.MODULE_NAME}.setting.skipDialogLightHUD.hint`,
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		// tempEffectsAsStatus: {
		//   name: `${CONSTANTS.MODULE_NAME}.setting.tempEffectsAsStatus.name`,
		//   hint: `${CONSTANTS.MODULE_NAME}.setting.tempEffectsAsStatus.hint`,
		//   scope: 'world',
		//   config: true,
		//   default: false,
		//   type: Boolean,
		// },

		// tempEffectsAsStatusToggleDelete: {
		//   name: `${CONSTANTS.MODULE_NAME}.setting.tempEffectsAsStatusToggleDelete.name`,
		//   hint: `${CONSTANTS.MODULE_NAME}.setting.tempEffectsAsStatusToggleDelete.hint`,
		//   scope: 'world',
		//   config: true,
		//   default: false,
		//   type: Boolean,
		// },

		enableHud: {
			name: `${CONSTANTS.MODULE_NAME}.setting.enableHud.name`,
			hint: `${CONSTANTS.MODULE_NAME}.setting.enableHud.hint`,
			scope: "world",
			config: true,
			default: true,
			type: Boolean,
		},

		enableHudOnlyGM: {
			name: `${CONSTANTS.MODULE_NAME}.setting.enableHudOnlyGM.name`,
			hint: `${CONSTANTS.MODULE_NAME}.setting.enableHudOnlyGM.hint`,
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		hudColumn: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudColumn.name`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudColumn.hint`),
			scope: "client",
			config: true,
			type: String,
			default: "Right",
			choices: <any>{
				Left: "Left",
				Right: "Right",
			},
		},

		hudTopBottom: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudTopBottom.name`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.hudTopBottom.hint`),
			scope: "client",
			config: true,
			type: String,
			default: "Bottom",
			choices: <any>{
				Top: "Top",
				Bottom: "Bottom",
			},
		},

		useMetricSystem: {
			name: `${CONSTANTS.MODULE_NAME}.setting.useMetricSystem.name`,
			hint: `${CONSTANTS.MODULE_NAME}.setting.useMetricSystem.hint`,
			scope: "client",
			config: true,
			default: false,
			type: Boolean,
		},

		autoApplyEffectIfNotPresentOnActor: {
			name: `${CONSTANTS.MODULE_NAME}.setting.autoApplyEffectIfNotPresentOnActor.name`,
			hint: `${CONSTANTS.MODULE_NAME}.setting.autoApplyEffectIfNotPresentOnActor.hint`,
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

	};
}

export async function checkSystem() {
	if (!SYSTEMS.DATA) {
		if (game.settings.get(CONSTANTS.MODULE_NAME, "systemNotFoundWarningShown")) return;

		await game.settings.set(CONSTANTS.MODULE_NAME, "systemNotFoundWarningShown", true);

		return Dialog.prompt({
			title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.nosystemfound.title`),
			content: dialogWarning(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.nosystemfound.content`)),
			callback: () => {},
		});
	}

	if (game.settings.get(CONSTANTS.MODULE_NAME, "systemFound")) return;

	game.settings.set(CONSTANTS.MODULE_NAME, "systemFound", true);

	if (game.settings.get(CONSTANTS.MODULE_NAME, "systemNotFoundWarningShown")) {
		return new Dialog({
			title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.systemfound.title`),
			content: warn(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.systemfound.content`), true),
			buttons: {
				confirm: {
					icon: '<i class="fas fa-check"></i>',
					label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.systemfound.confirm`),
					callback: () => {
						applyDefaultSettings();
					},
				},
				cancel: {
					icon: '<i class="fas fa-times"></i>',
					label: game.i18n.localize("No"),
				},
			},
			default: "cancel",
		}).render(true);
	}

	return applyDefaultSettings();
}
