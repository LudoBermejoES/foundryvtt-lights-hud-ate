export class LightHUDElement {
}
export class OptionSelectData {
}
export class VisionHUDElement {
}
export var VisionHUDPreset;
(function (VisionHUDPreset) {
    // additional generic
    VisionHUDPreset["NO_CHANGE"] = "nochange";
    VisionHUDPreset["NONE"] = "none";
    VisionHUDPreset["SELF"] = "normal";
    VisionHUDPreset["NORMAL"] = "normal";
    // additional dnd5e and pf2e
    VisionHUDPreset["DARKVISION"] = "darkvision";
    VisionHUDPreset["SEE_INVISIBLE"] = "seeinvisible";
    VisionHUDPreset["BLIND_SIGHT"] = "blindsight";
    VisionHUDPreset["TREMOR_SENSE"] = "tremorsense";
    VisionHUDPreset["TRUE_SIGHT"] = "truesight";
    VisionHUDPreset["DEVILS_SIGHT"] = "devilssight";
    VisionHUDPreset["PASSIVE_STEALTH"] = "_ste";
    VisionHUDPreset["PASSIVE_PERCEPTION"] = "_prc";
    // additional PF2E
    VisionHUDPreset["GREATER_DARKVISION"] = "greaterdarkvision";
    VisionHUDPreset["LOW_LIGHT_VISION"] = "lowlightvision";
    VisionHUDPreset["BLINDED"] = "blinded";
    // additional LIGHT HUD
    VisionHUDPreset["DARKVISION_30"] = "darkvision30";
    VisionHUDPreset["DARKVISION_60"] = "darkvision60";
    VisionHUDPreset["DARKVISION_90"] = "darkvision90";
    VisionHUDPreset["DARKVISION_120"] = "darkvision120";
    VisionHUDPreset["DARKVISION_150"] = "darkvision150";
    VisionHUDPreset["DARKVISION_180"] = "darkvision180";
    VisionHUDPreset["EYES_OF_NIGHT"] = "eyesofnight";
})(VisionHUDPreset || (VisionHUDPreset = {}));
export var LightHUDPreset;
(function (LightHUDPreset) {
    LightHUDPreset["NO_CHANGE"] = "nochange";
    LightHUDPreset["NONE"] = "none";
    LightHUDPreset["CANDLE"] = "candle";
    LightHUDPreset["LAMP"] = "lamp";
    LightHUDPreset["LANTERN_BULLSEYE"] = "lantern-bullseye";
    LightHUDPreset["LANTERN_HOODED_DIM"] = "lantern-hooded-dim";
    LightHUDPreset["LANTERN_HOODED_BRIGHT"] = "lantern-hooded-bright";
    LightHUDPreset["LIGHT"] = "light";
    LightHUDPreset["TORCH"] = "torch";
    LightHUDPreset["MOON_TOUCHED"] = "moon-touched";
})(LightHUDPreset || (LightHUDPreset = {}));
export class LightDataHud {
}
export class LightDataDialog {
}
export var LightHUDNoteFlags;
(function (LightHUDNoteFlags) {
    // SUPPORT NO FORM
    LightHUDNoteFlags["INITIAL_DATA"] = "initial-data";
    LightHUDNoteFlags["HUD_ENABLED"] = "hud-enabled";
    // SUPPORT
    LightHUDNoteFlags["ENABLE"] = "enable";
    LightHUDNoteFlags["APPLY_AS_ATL_ATE"] = "apply-as-atl-ate";
    LightHUDNoteFlags["USE_BASIC"] = "use-basic";
    LightHUDNoteFlags["USE_ADVANCED"] = "use-advanced";
    // BASIC SETTINGS
    LightHUDNoteFlags["VISION_TYPE"] = "vision-type";
    LightHUDNoteFlags["LIGHT_SOURCE"] = "light-source";
    LightHUDNoteFlags["LIGHT_DIM_BASIC"] = "dim-basic";
    LightHUDNoteFlags["LIGHT_BRIGHT_BASIC"] = "bright-basic";
    LightHUDNoteFlags["LIGHT_ANGLE_BASIC"] = "angle-basic";
    LightHUDNoteFlags["LIGHT_COLOR_BASIC"] = "color-basic";
    LightHUDNoteFlags["LIGHT_ALPHA_BASIC"] = "alpha-basic";
    LightHUDNoteFlags["SIGHT_DIM_BASIC"] = "dim-sight-basic";
    LightHUDNoteFlags["SIGHT_BRIGHT_BASIC"] = "bright-sight-basic";
    LightHUDNoteFlags["SIGHT_ANGLE_BASIC"] = "sight-angle-basic";
    // ADVANCED SETTINGS
    LightHUDNoteFlags["LOCK_ROTATION"] = "lock-rotation";
    LightHUDNoteFlags["NAME"] = "name";
    LightHUDNoteFlags["DURATION"] = "duration";
    LightHUDNoteFlags["HEIGHT"] = "height";
    LightHUDNoteFlags["WIDTH"] = "width";
    LightHUDNoteFlags["SCALE"] = "scale";
    LightHUDNoteFlags["SIGHT_DIM"] = "dim-sight";
    LightHUDNoteFlags["SIGHT_BRIGHT"] = "bright-sight";
    LightHUDNoteFlags["SIGHT_ANGLE"] = "sight-angle";
    LightHUDNoteFlags["LIGHT_DIM"] = "dim";
    LightHUDNoteFlags["LIGHT_BRIGHT"] = "bright";
    LightHUDNoteFlags["LIGHT_ANGLE"] = "angle";
    LightHUDNoteFlags["LIGHT_COLOR"] = "color";
    LightHUDNoteFlags["LIGHT_ALPHA"] = "alpha";
    LightHUDNoteFlags["ANIMATION_TYPE"] = "animation-type";
    LightHUDNoteFlags["ANIMATION_SPEED"] = "animation-speed";
    LightHUDNoteFlags["ANIMATION_REVERSE"] = "animation-reverse";
    LightHUDNoteFlags["ANIMATION_INTENSITY"] = "animation-intensity";
    // VERY ADVANCED SETTINGS
    LightHUDNoteFlags["LIGHT_COLORATION"] = "light-coloration";
    LightHUDNoteFlags["LIGHT_LUMINOSITY"] = "light-luminosity";
    LightHUDNoteFlags["LIGHT_GRADUAL"] = "light-gradual";
    LightHUDNoteFlags["LIGHT_SATURATION"] = "light-saturation";
    LightHUDNoteFlags["LIGHT_CONTRAST"] = "light-contrast";
    LightHUDNoteFlags["LIGHT_SHADOWS"] = "light-shadows";
})(LightHUDNoteFlags || (LightHUDNoteFlags = {}));
// export const predefinedColors = {
//   "Candles, Torches" : "#a2642a",
//   "Fire (orange)": "#7f4a14",
//   "Fire (yellow)": "#a2642a",
//   "Daylight (warm)" : "#b79471",
//   "Daylight (cold)" : "#94a6bc",
//   "Full Moonlight (warm) ": "#ab9c8c",
//   "Full Moonlight (cold) ": "#647080",
//   "Magical Fire / Neon Red" : "#800000",
//   "Magical Fire (Blue) / Neon Blue ": "#000080",
//   "Magical Fire (Green) / Neon Green" : "#008000",
//   "Magical Fire (Purple) / Black Light (Purple)" : "#540080",
//   "Reflective Gold ": "#f0be35",
//   "Reflective Water" : "#6dcab4",
//   "Magma" : "#c27a29"
// }
// export enum EffectActions {
// 	create = "create",
// 	edit = "edit",
// 	delete = "delete",
// 	toggle = "toggle",
// 	update = "update",
// }
