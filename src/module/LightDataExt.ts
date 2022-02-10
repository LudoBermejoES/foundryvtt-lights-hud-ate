import { LightHUDPreset, LightHUDPresetType } from './lights-hud-models';
import CONSTANTS from './constants';

export class LightDataExt extends foundry.data.AmbientLightData {
  name;
  tokenID;
  type;
  state;

  constructor(name:LightHUDPreset, type: LightHUDPresetType, state:boolean, app) {
    super();
    this.name = name ?? 'SampleName';
    this.type = type ?? 'LightType';
    this.state = state ?? 'false';
    this.tokenID = app.object.id ?? '';
    // this._initFlag(app);
  }

  // async _initFlag(app) {
  //   this.state = app.object.document.getFlag(CONSTANTS.MODULE_NAME, this._getFlagName()) ?? false;
  //   await app.object.document.setFlag(CONSTANTS.MODULE_NAME, this._getFlagName(), this.state);
  // }

  // _getFlagName() {
  //   return this.name + this.type + 'state';
  // }

  // async turnOff() {
  //   this.state = false;
  //   await game.actor.setFlag(CONSTANTS.MODULE_NAME, _getFlagName(), false);
  //   tbuttonLantern.removeClass("active");
  //   // Lantern is inactive, enable the relevant light sources according to parameters
  //   enableRelevantButtons();
  //   // Restore the initial light source
  //   updateTokenLighting(
  //     tokenD.getFlag(CONSTANTS.MODULE_NAME, "InitialBrightRadius"),
  //     tokenD.getFlag(CONSTANTS.MODULE_NAME, "InitialDimRadius"),
  //     tokenD.getFlag(CONSTANTS.MODULE_NAME, "InitialLightColor"),
  //     tokenD.getFlag(CONSTANTS.MODULE_NAME, "InitialColorIntensity"),
  //     tokenD.getFlag(CONSTANTS.MODULE_NAME, "Initiallight.angle"),
  //     tokenD.getFlag(CONSTANTS.MODULE_NAME, "InitialAnimationType"),
  //     tokenD.getFlag(CONSTANTS.MODULE_NAME, "InitialAnimationSpeed"),
  //     tokenD.getFlag(CONSTANTS.MODULE_NAME, "InitialAnimationIntensity")
  //   );
  // }
}
