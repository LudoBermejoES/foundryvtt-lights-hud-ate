import CONSTANTS from "../constants.js";
import { LightHUDPreset, VisionHUDPreset } from "../lights-hud-ate-models.js";
import Pf2eItemSystem from "../lib/item-system/item-system-pf2e.js";
export default {
    LIGHTS: [
        {
            id: LightHUDPreset.NO_CHANGE,
            name: `${CONSTANTS.MODULE_NAME}.lights.${LightHUDPreset.NO_CHANGE}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/token-icon.svg`,
            lockRotation: null,
            dimLight: null,
            brightLight: null,
            lightColor: null,
            lightAlpha: null,
            lightAngle: null,
            lightAnimationType: null,
            lightAnimationSpeed: null,
            lightAnimationIntensity: null,
            isTemporary: false,
            duration: -1,
        },
        {
            id: LightHUDPreset.NONE,
            name: `${CONSTANTS.MODULE_NAME}.lights.${LightHUDPreset.NONE}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/light_01.jpg`,
            lockRotation: false,
            dimLight: 0,
            brightLight: 0,
            lightColor: null,
            lightAlpha: null,
            lightAngle: null,
            lightAnimationType: "none",
            lightAnimationSpeed: null,
            lightAnimationIntensity: null,
            isTemporary: false,
            duration: -1,
        },
        {
            id: LightHUDPreset.CANDLE,
            name: `${CONSTANTS.MODULE_NAME}.lights.${LightHUDPreset.CANDLE}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/candle.jpg`,
            lockRotation: false,
            dimLight: 10,
            brightLight: 5,
            lightColor: "#f8c377",
            lightAlpha: 0.15,
            lightAngle: 360,
            lightAnimationType: "torch",
            lightAnimationSpeed: 2,
            lightAnimationIntensity: 2,
            isTemporary: true,
            duration: 3600,
        },
        {
            id: LightHUDPreset.LAMP,
            name: `${CONSTANTS.MODULE_NAME}.lights.${LightHUDPreset.LAMP}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/lamp.jpg`,
            lockRotation: false,
            dimLight: 45,
            brightLight: 15,
            lightColor: "#f8c377",
            lightAlpha: 0.15,
            lightAngle: 360,
            lightAnimationType: "torch",
            lightAnimationSpeed: 2,
            lightAnimationIntensity: 2,
            isTemporary: true,
            duration: 21600,
        },
        {
            id: LightHUDPreset.LANTERN_BULLSEYE,
            name: `${CONSTANTS.MODULE_NAME}.lights.${LightHUDPreset.LANTERN_BULLSEYE}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/lantern.jpg`,
            lockRotation: false,
            dimLight: 120,
            brightLight: 60,
            lightColor: "#f8c377",
            lightAlpha: 0.15,
            lightAngle: 52.5,
            lightAnimationType: "torch",
            lightAnimationSpeed: 2,
            lightAnimationIntensity: 2,
            isTemporary: true,
            duration: 21600,
        },
        {
            id: LightHUDPreset.LANTERN_HOODED_DIM,
            name: `${CONSTANTS.MODULE_NAME}.lights.${LightHUDPreset.LANTERN_HOODED_DIM}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/lantern.jpg`,
            lockRotation: false,
            dimLight: 5,
            brightLight: 0,
            lightColor: "#f8c377",
            lightAlpha: 0.15,
            lightAngle: 360,
            lightAnimationType: "torch",
            lightAnimationSpeed: 2,
            lightAnimationIntensity: 2,
            isTemporary: true,
            duration: 21600,
        },
        {
            id: LightHUDPreset.LANTERN_HOODED_BRIGHT,
            name: `${CONSTANTS.MODULE_NAME}.lights.${LightHUDPreset.LANTERN_HOODED_BRIGHT}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/lantern.jpg`,
            lockRotation: false,
            dimLight: 60,
            brightLight: 30,
            lightColor: "#f8c377",
            lightAlpha: 0.15,
            lightAngle: 360,
            lightAnimationType: "torch",
            lightAnimationSpeed: 2,
            lightAnimationIntensity: 2,
            isTemporary: true,
            duration: 21600,
        },
        {
            id: LightHUDPreset.TORCH,
            name: `${CONSTANTS.MODULE_NAME}.lights.${LightHUDPreset.TORCH}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/torch.jpg`,
            lockRotation: false,
            dimLight: 40,
            brightLight: 20,
            lightColor: "#f8c377",
            lightAlpha: 0.15,
            lightAngle: 360,
            lightAnimationType: "torch",
            lightAnimationSpeed: 2,
            lightAnimationIntensity: 2,
            isTemporary: true,
            duration: 3600,
        },
    ],
    VISIONS: [
        {
            id: VisionHUDPreset.NO_CHANGE,
            name: `${CONSTANTS.MODULE_NAME}.visions.${VisionHUDPreset.NO_CHANGE}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/token-icon.svg`,
            dimSight: null,
            brightSight: null,
            sightAngle: null,
            isTemporary: false,
            duration: -1,
        },
        {
            id: VisionHUDPreset.NONE,
            name: `${CONSTANTS.MODULE_NAME}.visions.${VisionHUDPreset.NONE}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/light_01.jpg`,
            dimSight: 0,
            brightSight: 0,
            sightAngle: 360,
            isTemporary: false,
            duration: -1,
        },
        {
            id: VisionHUDPreset.SELF,
            name: `${CONSTANTS.MODULE_NAME}.visions.${VisionHUDPreset.SELF}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/light_02.jpg`,
            dimSight: 5,
            brightSight: 0,
            sightAngle: 360,
            isTemporary: false,
            duration: -1,
        },
        {
            id: VisionHUDPreset.DARKVISION_30,
            name: `${CONSTANTS.MODULE_NAME}.visions.${VisionHUDPreset.DARKVISION_30}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/evil-eye-red-1.jpg`,
            dimSight: 30,
            brightSight: 0,
            sightAngle: 360,
            isTemporary: false,
            duration: -1,
        },
        {
            id: VisionHUDPreset.DARKVISION_60,
            name: `${CONSTANTS.MODULE_NAME}.visions.${VisionHUDPreset.DARKVISION_60}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/evil-eye-red-2.jpg`,
            dimSight: 60,
            brightSight: 0,
            sightAngle: 360,
            isTemporary: false,
            duration: -1,
        },
        {
            id: VisionHUDPreset.DARKVISION_90,
            name: `${CONSTANTS.MODULE_NAME}.visions.${VisionHUDPreset.DARKVISION_90}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/evil-eye-red-3.jpg`,
            dimSight: 90,
            brightSight: 0,
            sightAngle: 360,
            isTemporary: false,
            duration: -1,
        },
        {
            id: VisionHUDPreset.DARKVISION_120,
            name: `${CONSTANTS.MODULE_NAME}.visions.${VisionHUDPreset.DARKVISION_120}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/evil-eye-eerie-1.jpg`,
            dimSight: 120,
            brightSight: 0,
            sightAngle: 360,
            isTemporary: false,
            duration: -1,
        },
        {
            id: VisionHUDPreset.DARKVISION_150,
            name: `${CONSTANTS.MODULE_NAME}.visions.${VisionHUDPreset.DARKVISION_150}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/evil-eye-eerie-2.jpg`,
            dimSight: 150,
            brightSight: 0,
            sightAngle: 360,
            isTemporary: false,
            duration: -1,
        },
        {
            id: VisionHUDPreset.DARKVISION_180,
            name: `${CONSTANTS.MODULE_NAME}.visions.${VisionHUDPreset.DARKVISION_180}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/evil-eye-eerie-3.jpg`,
            dimSight: 180,
            brightSight: 0,
            sightAngle: 360,
            isTemporary: false,
            duration: -1,
        },
        {
            id: VisionHUDPreset.LOW_LIGHT_VISION,
            name: `${CONSTANTS.MODULE_NAME}.visions.${VisionHUDPreset.LOW_LIGHT_VISION}.name`,
            img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/violet_09.jpg`,
            dimSight: 0,
            brightSight: 60,
            sightAngle: 360,
            isTemporary: false,
            duration: -1,
        },
    ],
    async retrieveAllItemsYouCanUseFromItems(items) {
        const itemFilteredByUse = [];
        if (!items || items.length === 0) {
            return items;
        }
        for (let item of items) {
            let uses = {
                available: 0,
                showZeroUses: true,
            };
            let thisItemUses = await Pf2eItemSystem.calculateUsesForItem(item);
            if (thisItemUses === null) {
                // uses = null;
                uses = uses;
                uses.showZeroUses = true;
            }
            else if (thisItemUses.isAmmunition) {
                // If there are multiple items of the same name, chances are they use the same ammunition
                // Adding the uses together from multiple items would count the ammunition multiple times
                uses = thisItemUses;
                uses.showZeroUses = false;
            }
            else {
                if (typeof thisItemUses.available === "number") {
                    if (typeof uses.available === "number") {
                        uses.available += thisItemUses.available;
                    }
                    else {
                        uses.available = thisItemUses.available;
                    }
                }
                if (typeof thisItemUses.consumed === "number") {
                    if (typeof uses.consumed === "number") {
                        uses.consumed += thisItemUses.consumed;
                    }
                    else {
                        uses.consumed = thisItemUses.consumed;
                    }
                }
                if (typeof thisItemUses.maximum === "number") {
                    if (typeof uses.maximum === "number") {
                        uses.maximum += thisItemUses.maximum;
                    }
                    else {
                        uses.maximum = thisItemUses.maximum;
                    }
                }
                uses.showZeroUses = false;
            }
            if ((!uses.available || uses.available <= 0) && uses.showZeroUses) {
                itemFilteredByUse.push(item);
            }
            else if (!!uses.available && uses.available > 0 && !uses.showZeroUses) {
                itemFilteredByUse.push(item);
            }
        }
        return itemFilteredByUse;
    },
};
