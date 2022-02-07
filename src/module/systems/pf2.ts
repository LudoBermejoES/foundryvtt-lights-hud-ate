import CONSTANTS from '../constants';
import { LightElement, LigthPredefined } from '../lights-hud-models';

export default {
  LIGHTS: <LightElement[]>[
    {
      id: LigthPredefined.TORCH,
      name: `${CONSTANTS.MODULE_NAME}.${LigthPredefined.TORCH}`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_01.jpg`,
    },
  ],
};
