import CONSTANTS from '../constants';
import { LightHUDElement, LightHUDPreset, VisionHUDElement, VisionHUDPreset } from '../lights-hud-ate-models';

export default {
  LIGHTS: <LightHUDElement[]>[
    {
      id: LightHUDPreset.NO_CHANGE,
      name: `No Change`,
      img: ``,
    },
    {
      id: LightHUDPreset.NONE,
      name: `None`,
      img: ``,
    },
    {
      id: LightHUDPreset.CANDLE,
      name: `Candle`,
      img: ``,
    },
    {
      id: LightHUDPreset.LAMP,
      name: `Lamp`,
      img: ``,
    },
    {
      id: LightHUDPreset.LANTERN_BULLSEYE,
      name: `Lantern (Bullseye)`,
      img: ``,
    },
    {
      id: LightHUDPreset.LANTERN_HOODED_DIM,
      name: `Lantern (Hooded - Dim)`,
      img: ``,
    },
    {
      id: LightHUDPreset.LANTERN_HOODED_BRIGHT,
      name: `Lantern (Hooded - Bright)`,
      img: ``,
    },
    {
      id: LightHUDPreset.LIGHT,
      name: `Light`,
      img: ``,
    },
    {
      id: LightHUDPreset.TORCH,
      name: `Torch`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/torch.jpg`,
    },
  ],
  VISIONS: <VisionHUDElement[]>[
    { id: VisionHUDPreset.NO_CHANGE  , name: `No Change`,  img: ``, dimSight: null, brightSight: null, sightAngle:null},
    { id: VisionHUDPreset.NONE  , name: `None`, img: ``, dimSight: 0, brightSight: 0, sightAngle:360},
    { id: VisionHUDPreset.SELF  , name: `Self`, img: ``, dimSight: 5, brightSight: 0, sightAngle:360},
    { id: VisionHUDPreset.DARKVISION_30, name: `Darkvision (30 ft)`, img: ``, dimSight: 30, brightSight: 0, sightAngle:360},
    { id: VisionHUDPreset.DARKVISION_60  , name: `Darkvision (60 ft)`, img: ``, dimSight: 60, brightSight: 0, sightAngle:360},
    { id: VisionHUDPreset.DARKVISION_90  , name: `Darkvision (90 ft)`, img: ``, dimSight: 90, brightSight: 0, sightAngle:360},
    { id: VisionHUDPreset.DARKVISION_120  , name: `Darkvision (120 ft)`, img: ``, dimSight: 120, brightSight: 0, sightAngle:360},
    { id: VisionHUDPreset.DARKVISION_150  , name: `Darkvision (150 ft)`, img: ``, dimSight: 150, brightSight: 0, sightAngle:360},
    { id: VisionHUDPreset.DARKVISION_180  , name: `Darkvision (180 ft)`, img: ``, dimSight: 180, brightSight: 0, sightAngle:360},
  ],
};
