import type { LightHUDElement, VisionHUDElement } from "../lights-hud-ate-models";
import Toolkit13ItemSystem from "../lib/item-system/item-system-archmage";
import type { CalculatedUsesData } from "../lib/calculated-uses-data";

export default {
	LIGHTS: <LightHUDElement[]>[],
	VISIONS: <VisionHUDElement[]>[],
	async retrieveAllItemsYouCanUseFromItems(items: Item[]): Promise<Item[]> {
		const itemFilteredByUse = <Item[]>[];
		if (!items || items.length === 0) {
			return items;
		}
		for (let item of items) {
			let uses: CalculatedUsesData | null = {
				available: 0,
				showZeroUses: true,
			};
			let thisItemUses = await Toolkit13ItemSystem.calculateUsesForItem(item);
			if (thisItemUses === null) {
				// uses = null;
				uses = uses;
				uses.showZeroUses = true;
			} else if (thisItemUses.isAmmunition) {
				// If there are multiple items of the same name, chances are they use the same ammunition
				// Adding the uses together from multiple items would count the ammunition multiple times
				uses = thisItemUses;
				uses.showZeroUses = false;
			} else {
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
				uses.showZeroUses = false;
			}

			if ((!uses.available || uses.available <= 0) && uses.showZeroUses) {
				itemFilteredByUse.push(item);
			} else if (!!uses.available && uses.available > 0 && !uses.showZeroUses) {
				itemFilteredByUse.push(item);
			}
		}
		return itemFilteredByUse;
	},
};
