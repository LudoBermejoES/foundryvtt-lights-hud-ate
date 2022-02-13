import CONSTANTS from '../constants';
import { LightHUDElement, LightHUDPreset } from '../lights-hud-ate-models';

export default {
  LIGHTS: <LightHUDElement[]>[
    {
      id: LightHUDPreset.TORCH,
      name: `${CONSTANTS.MODULE_NAME}.${LightHUDPreset.TORCH}`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/torch.jpg`,
    },
  ],
};
