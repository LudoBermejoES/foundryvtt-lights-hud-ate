import type { CalculatedUsesData } from "../calculated-uses-data";

export default class ItemSystem {
	_systemID: string;

	constructor(systemID, macroRegexArray) {
		this._systemID = systemID;
		// setDefaultMacroRegexArray(systemID, macroRegexArray);
	}

	// canCalculateUses(command) {
	// 	return getItemLookupDetailsForCommand(this._systemID, command) !== null;
	// }

	// async calculateUses(command) {
	// 	const itemLookupDetails = getItemLookupDetailsForCommand(this._systemID, command);
	// 	if (!itemLookupDetails) {
	// 		// Not an item command, assume infinite uses.
	// 		return null;
	// 	}
	// 	const actor = getActor(itemLookupDetails);
	// 	if (!actor) {
	// 		// It's an item, but there's no actor, so it can't be used.
	// 		return { available: 0 };
	// 	}
	// 	const items = getItems(actor, itemLookupDetails);
	// 	if (itemLookupDetails.generic) {
	// 		return genericCalculateUses(actor, items, itemLookupDetails);
	// 	}
	// 	return this.calculateUsesForItems(items);
	// }

	async calculateUsesForItems(items): Promise<CalculatedUsesData | null> {
		if (!items || items.length === 0) {
			return { available: 0 };
		}
		let uses: CalculatedUsesData | null = {
			available: 0,
			showZeroUses: true,
		};
		for (let item of items) {
			let thisItemUses = await this.calculateUsesForItem(item);
			if (thisItemUses === null) {
				uses = null;
				break;
			}
			if (thisItemUses.isAmmunition) {
				// If there are multiple items of the same name, chances are they use the same ammunition
				// Adding the uses together from multiple items would count the ammunition multiple times
				uses = thisItemUses;
				break;
			}
			if (typeof thisItemUses.available === "number") {
				if (typeof uses.available === "number") {
					uses.available += thisItemUses.available;
				} else {
					uses.available = thisItemUses.available;
				}
			}
			if (typeof thisItemUses.consumed === "number") {
				if (typeof uses.consumed === "number") {
					uses.consumed += thisItemUses.consumed;
				} else {
					uses.consumed = thisItemUses.consumed;
				}
			}
			if (typeof thisItemUses.maximum === "number") {
				if (typeof uses.maximum === "number") {
					uses.maximum += thisItemUses.maximum;
				} else {
					uses.maximum = thisItemUses.maximum;
				}
			}
		}
		return uses;
	}

	async calculateUsesForItem(item): Promise<CalculatedUsesData | null> {
		throw new Error("ItemSystem for " + this._systemID + " did not implement calculateUsesForItem");
	}

	// async setDefaultMacroRegexArray(systemID, macroRegexArray) {
	// 	throw new Error("ItemSystem for " + this._systemID + " did not implement calculateUsesForItem");
	// }
}
