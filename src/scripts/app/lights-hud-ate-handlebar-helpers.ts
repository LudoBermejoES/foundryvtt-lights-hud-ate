import CONSTANTS from "../constants.js";

/**
 * Handles setting up all handlebar helpers
 */
export default class HandlebarHelpers {
	showDisabledEffects = true;
	showPassiveEffects = true;
	viewPermission = true;
	viewDetailsPermission = true;

	constructor() {
		//this._settings = new Settings();
	}

	/**
	 * Registers the handlebar helpers
	 */
	registerHelpers() {
		this._registerCanShowDisabledEffectsHelper();
		this._registerCanShowPassiveEffectsHelper();
		this._registerCanViewEffectDetailsHelper();
		this._registerCanViewEffectsPanelHelper();
		this._registerRemainingTimeLabelHelper();

		this._registerCheckedIfHelper();
		// this._registerSelectHelper();
		// this._registerMultiSelectHelper();
		this._registerOptionsIsSelectedHelper();
	}

	// https://stackoverflow.com/questions/13046401/how-to-set-selected-select-option-in-handlebars-template
	_registerOptionsIsSelectedHelper() {
		Handlebars.registerHelper("isOptionSelected", function (value, options) {
			const optionValueToCheck = <string>options.fn(this);
			const currentValue = getProperty(options.data.root, value);
			if (currentValue && optionValueToCheck.toLowerCase().indexOf(currentValue?.toLowerCase()) >= 1) {
				return `${optionValueToCheck} selected='selected'`;
			} else {
				return `${optionValueToCheck}`;
			}
		});
	}

	// https://gist.github.com/LukeChannings/6173ab951d8b1dc4602e
	_registerMultiSelectHelper() {
		Handlebars.registerHelper("option", function (selected, option) {
			if (selected == undefined) {
				return "";
			}
			return selected.indexOf(option) !== -1 ? "selected" : "";
		});
	}

	// https://gist.github.com/LukeChannings/6173ab951d8b1dc4602e
	_registerSelectHelper() {
		Handlebars.registerHelper("select", function (value, options) {
			return options
				.fn()
				.split("\n")
				.map(function (v) {
					const t = 'value="' + value + '"';
					return RegExp(t).test(v) ? v.replace(t, t + ' selected="selected"') : v;
				})
				.join("\n");
		});
	}

	_registerCheckedIfHelper() {
		Handlebars.registerHelper("checkedIf", function (condition) {
			return condition ? "checked" : "";
		});
	}

	_registerCanShowDisabledEffectsHelper() {
		Handlebars.registerHelper("canShowDisabledEffects", () => {
			// return this._settings.showDisabledEffects;
			return this.showDisabledEffects;
		});
	}

	_registerCanShowPassiveEffectsHelper() {
		Handlebars.registerHelper("canShowPassiveEffects", () => {
			// return this._settings.showPassiveEffects;
			return this.showPassiveEffects;
		});
	}

	_registerCanViewEffectDetailsHelper() {
		Handlebars.registerHelper("canViewEffectDetails", () => {
			//return game.user.role >= this._settings.viewDetailsPermission;
			return this.viewDetailsPermission;
		});
	}

	_registerCanViewEffectsPanelHelper() {
		Handlebars.registerHelper("canViewEffectsPanel", () => {
			//return game.user.role >= this._settings.viewPermission;
			return this.viewPermission;
		});
	}

	_registerRemainingTimeLabelHelper() {
		Handlebars.registerHelper("remainingTimeLabel", (effect, _options) => {
			const remainingSeconds = effect.remainingSeconds;
			if (remainingSeconds == Infinity && effect.turns) {
				if (effect.turns == 1) {
					return "1 turn";
				} else {
					return `${effect.turns} turns`;
				}
			} else if (remainingSeconds == Infinity) {
				return "Unlimited";
			} else if (remainingSeconds >= CONSTANTS.SECONDS.IN_TWO_YEARS) {
				return `${Math.floor(remainingSeconds / CONSTANTS.SECONDS.IN_ONE_YEAR)} years`;
			} else if (remainingSeconds >= CONSTANTS.SECONDS.IN_ONE_YEAR) {
				return "1 year";
			} else if (remainingSeconds >= CONSTANTS.SECONDS.IN_TWO_WEEKS) {
				return `${Math.floor(remainingSeconds / CONSTANTS.SECONDS.IN_ONE_WEEK)} weeks`;
			} else if (remainingSeconds > CONSTANTS.SECONDS.IN_ONE_WEEK) {
				return "1 week";
			} else if (remainingSeconds >= CONSTANTS.SECONDS.IN_TWO_DAYS) {
				return `${Math.floor(remainingSeconds / CONSTANTS.SECONDS.IN_ONE_DAY)} days`;
			} else if (remainingSeconds > CONSTANTS.SECONDS.IN_TWO_HOURS) {
				return `${Math.floor(remainingSeconds / CONSTANTS.SECONDS.IN_ONE_HOUR)} hours`;
			} else if (remainingSeconds > CONSTANTS.SECONDS.IN_TWO_MINUTES) {
				return `${Math.floor(remainingSeconds / CONSTANTS.SECONDS.IN_ONE_MINUTE)} minutes`;
			} else if (remainingSeconds >= 2) {
				return `${remainingSeconds} seconds`;
			} else if (remainingSeconds === 1) {
				return "1 second";
			} else {
				return "Expired";
			}
		});
	}
}
