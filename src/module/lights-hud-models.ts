export class LightHUDElement {
  id: string;
  name: string;
  img: string;
}

export enum LightHUDPreset {
  TORCH = 'torch',
  LIGHT = 'light',
  // LIGHT = 'lightSpell',
  LANTERN = 'lantern',
}

export enum LightHUDPresetType {
  SPELL = 'spell',
  CONSUMABLE = 'consumable'
}

export enum LightHUDFlags {
  Initial_Bright_Radius = 'InitialBrightRadius',
  Initial_Dim_Radius = 'InitialDimRadius',
  Initial_Light_Color = 'InitialLightColor',
  Initial_Color_Intensity = 'InitialColorIntensity',
  Initial_Light_Angle = 'Initiallight.angle',
  Initial_Animation_Type = 'InitialAnimationType',
  Initial_Animation_Speed = 'InitialAnimationSpeed',
  Initial_Animation_Intensity = 'InitialAnimationIntensity',
}
