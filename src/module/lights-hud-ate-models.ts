export class LightHUDElement {
  id: string;
  name: string;
  img: string;
  lockRotation: boolean | null;
  dimLight: number | null;
  brightLight: number | null;
  lightColor: string | null;
  lightAlpha: number | null;
  lightAngle: number | null;
  lightAnimationType: string | null;
  lightAnimationSpeed: string | null;
  lightAnimationIntensity: string | null;
}

export class VisionHUDElement {
  id: string;
  name: string;
  img: string;
  dimSight: number | null;
  brightSight: number | null;
  sightAngle: number | null;
}

export enum VisionHUDPreset {
  // additional generic
  NO_CHANGE = 'nochange',
  NONE = 'none',
  SELF = 'normal', // this is not a error is a retrocompatibility feature
  NORMAL = 'normal',
  // additional dnd5e and pf2e
  DARKVISION = 'darkvision',
  SEE_INVISIBLE = 'seeinvisible',
  BLIND_SIGHT = 'blindsight',
  TREMOR_SENSE = 'tremorsense',
  TRUE_SIGHT = 'truesight',
  DEVILS_SIGHT = 'devilssight',
  PASSIVE_STEALTH = '_ste',
  PASSIVE_PERCEPTION = '_prc',
  // additional PF2E
  GREATER_DARKVISION = 'greaterdarkvision',
  LOW_LIGHT_VISION = 'lowlightvision',
  BLINDED = 'blinded',
  // additional LIGHT HUD
  DARKVISION_30 = 'darkvision30',
  DARKVISION_60 = 'darkvision60',
  DARKVISION_90 = 'darkvision90',
  DARKVISION_120 = 'darkvision120',
  DARKVISION_150 = 'darkvision150',
  DARKVISION_180 = 'darkvision180',
  EYES_OF_NIGHT = 'eyesofnight',
}

export enum LightHUDPreset {
  NO_CHANGE = 'nochange',
  NONE = 'none',
  CANDLE = 'candle',
  LAMP = 'lamp',
  LANTERN_BULLSEYE = 'lantern-bullseye',
  LANTERN_HOODED_DIM = 'lantern-hooded-dim',
  LANTERN_HOODED_BRIGHT = 'lantern-hooded-bright',
  LIGHT = 'light',
  TORCH = 'torch',
  MOON_TOUCHED = 'moon-touched',
}

// export enum LightHUDPresetType {
//   SPELL = 'spell',
//   CONSUMABLE = 'consumable'
// }

// export enum LightHUDFlags {
//   Initial_Bright_Radius = 'InitialBrightRadius',
//   Initial_Dim_Radius = 'InitialDimRadius',
//   Initial_Light_Color = 'InitialLightColor',
//   Initial_Color_Intensity = 'InitialColorIntensity',
//   Initial_Light_Angle = 'Initiallight.angle',
//   Initial_Animation_Type = 'InitialAnimationType',
//   Initial_Animation_Speed = 'InitialAnimationSpeed',
//   Initial_Animation_Intensity = 'InitialAnimationIntensity',
// }

export class LightDataHud {
  route: string;
  name: string;
  applied: boolean;
  disabled: boolean;
  suppressed: boolean;
  temporary: boolean;
  passive: boolean;
  img: boolean;
  vid: boolean;
  type: boolean;
  itemid: string;
  itemname: string;
  effectid: string;
  effectname: string;
}

// export class LightDataExt extends foundry.data.AmbientLightData {

// }
