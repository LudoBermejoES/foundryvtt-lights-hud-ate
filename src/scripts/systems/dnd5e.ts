import { VisionHUDElement, VisionHUDPreset } from "./../lights-hud-ate-models";
import CONSTANTS from "../constants";
import { LightHUDElement, LightHUDPreset } from "../lights-hud-ate-models";
import { is_real_number } from "../lib/lib";

export default {
	LIGHTS: <LightHUDElement[]>[
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
		{
			id: LightHUDPreset.LIGHT,
			name: `${CONSTANTS.MODULE_NAME}.lights.${LightHUDPreset.LIGHT}.name`,
			img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/light-sky-1.jpg`,
			lockRotation: false,
			dimLight: 40,
			brightLight: 20,
			lightColor: "#ffffff",
			lightAlpha: 0.15,
			lightAngle: 360,
			lightAnimationType: "none",
			lightAnimationSpeed: null,
			lightAnimationIntensity: null,
			isTemporary: true,
			duration: 3600,
		},
		{
			id: LightHUDPreset.MOON_TOUCHED,
			name: `${CONSTANTS.MODULE_NAME}.lights.${LightHUDPreset.MOON_TOUCHED}.name`,
			img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/explosion-sky-3.jpg`,
			lockRotation: false,
			dimLight: 30,
			brightLight: 15,
			lightColor: "#f4f1c9",
			lightAlpha: 0.5,
			lightAngle: 360,
			lightAnimationType: "none",
			lightAnimationSpeed: null,
			lightAnimationIntensity: null,
			isTemporary: false,
			duration: -1,
		},
	],
	VISIONS: <VisionHUDElement[]>[
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
			id: VisionHUDPreset.EYES_OF_NIGHT,
			name: `${CONSTANTS.MODULE_NAME}.visions.${VisionHUDPreset.EYES_OF_NIGHT}.name`,
			img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/shadow_12.jpg`,
			dimSight: 300,
			brightSight: 0,
			sightAngle: 360,
			isTemporary: false,
			duration: -1,
		},
		{
			id: VisionHUDPreset.DEVILS_SIGHT,
			name: `${CONSTANTS.MODULE_NAME}.visions.${VisionHUDPreset.DEVILS_SIGHT}.name`,
			img: `modules/${CONSTANTS.MODULE_NAME}/assets/icons/ae/blue_17.jpg`,
			dimSight: 0,
			brightSight: 120,
			sightAngle: 360,
			isTemporary: false,
			duration: -1,
		},
	],
	retrieveAllItemsYouCanUseFromActor(actor): Item[] {
		const weaponsItems = ["weapon", "spell", "tool"];
		// let totalWeight: number = actorEntity.items.reduce((weight, item) => {
		let aviableItems = <Item[]>[];
		for (let im of <Item[]>actor.items.contents) {
			if (im && weaponsItems.includes(im.type)) {
				//CHECK FOR SLOTS AND AMMUNITION
				const usesForItem = calculateUsesForItem(im);
				const available = usesForItem.available;
				const maximum = usesForItem.maximum;
				const isAmmunition = usesForItem.isAmmunition;
				if (is_real_number(available) && available > 0) {
					aviableItems.push(im);
				}
			}
		}
		return aviableItems;
	},
	retrieveAllItemsYouCanUseFromItems(items: Item[]): Item[] {
		const weaponsItems = ["weapon", "spell", "tool"];
		// let totalWeight: number = actorEntity.items.reduce((weight, item) => {
		let aviableItems = <Item[]>[];
		for (let im of items) {
			if (im && weaponsItems.includes(im.type)) {
				//CHECK FOR SLOTS AND AMMUNITION
				const usesForItem = calculateUsesForItem(im);
				const available = usesForItem.available;
				const maximum = usesForItem.maximum;
				const isAmmunition = usesForItem.isAmmunition;
				if (is_real_number(available) && available > 0) {
					aviableItems.push(im);
				}
			}
		}
		return aviableItems;
	},
};
