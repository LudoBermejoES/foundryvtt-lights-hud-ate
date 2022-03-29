import { LightHUDElement, LightHUDPreset } from './lights-hud-ate-models';
import API from './api';
import CONSTANTS from './constants';
import Effect, { Constants } from './effects/effect';
import { i18n, i18nFormat, warn } from './lib/lib';
import { canvas, game } from './settings';

/**
 * Defines all of the effect definitions
 */
export class LightHUDAteEffectDefinitions {
  constructor() {}

  /**
   * Get all effects
   *
   * @returns {Effect[]} all the effects
   */
  static all(): Effect[] {
    const effects: Effect[] = [];
    // const torch = EffectDefinitions.torch();
    // if (torch) {
    //   effects.push(torch);
    // }
    return effects;
  }

  static effect(name: string): Effect | undefined {
    const effect = <Effect>LightHUDAteEffectDefinitions.all().find((effect: Effect) => {
      return effect.name.toLowerCase() === name.toLowerCase();
    });
    // if (effect?.customId == LightHUDPreset.TORCH) {
    //   return EffectDefinitions.torch();
    // }
    return undefined;
  }

  // ===========================================
  // The source effect
  // =============================================

  // static stealthpassive(number: number) {
  //   return new Effect({
  //     name: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.stealthpassive.name`, { number : number}),
  //     description: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.stealthpassive.description`, { number : number}),
  //     icon: '',
  //     // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
  //     transfer: true,
  //     changes: [
  //       {
  //         key: 'data.attributes.senses.stealthpassive',
  //         mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
  //         value: number && number > 0 ? `${number}` : `@data.skills.ste.passive`,
  //         priority: 5,
  //       },
  //     ],
  //   });
  // }

  // static torch() {
  //   const effectSight = API.LIGHTS.find((a: LightHUDElement) => {
  //     // use replace() method to match and remove all the non-alphanumeric characters
  //     return isStringsEqual(a.id,LightHUDPreset.TORCH);
  //   });
  //   if (!effectSight) {
  //     warn(`Cannot find for system '${game.system.id}' the active effect with id '${LightHUDPreset.TORCH}'`);
  //     return;
  //   }
  //   return new Effect({
  //     customId: LightHUDPreset.TORCH,
  //     name:
  //       lightData?.dim > 0
  //         ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.torch.name2`, { number: lightData.dim })
  //         : i18n(`${CONSTANTS.MODULE_NAME}.effects.torch.name`),
  //     description:
  //       lightData?.dim > 0
  //         ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.torch.description2`, { number: lightData?.dim })
  //         : i18n(`${CONSTANTS.MODULE_NAME}.effects.torch.description`),
  //     icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/torch.jpg`,
  //     // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
  //     transfer: true,
  //     seconds: Constants.SECONDS.IN_ONE_HOUR,
  //     atlChanges: [
  //       {
  //         key: this._createAtlEffectKey('ATL.light.dim'),
  //         mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
  //         value: lightData?.dim && lightData?.dim > 0 ? String(lightData?.dim) : '40',
  //       },
  //       {
  //         key: this._createAtlEffectKey('ATL.light.bright'),
  //         mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
  //         value: lightData?.bright && lightData?.bright > 0 ? String(lightData?.bright / 2) : '20',
  //       },
  //       {
  //         key: this._createAtlEffectKey('ATL.light.color'),
  //         mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
  //         value: lightData.tintColor ? lightData.tintColor : Constants.COLORS.FIRE,
  //       },
  //       {
  //         key: this._createAtlEffectKey('ATL.light.alpha'),
  //         mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
  //         value: lightData.tintAlpha ? lightData.tintAlpha : 0.4,
  //       },
  //       {
  //         key: this._createAtlEffectKey('ATL.light.animation'),
  //         mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
  //         value:
  //           lightData.lightAnimation.type &&
  //           lightData.lightAnimation.speed > 0 &&
  //           lightData.lightAnimation.intensity > 0
  //             ? `{"type": "${lightData.lightAnimation.type}","speed": ${lightData.lightAnimation.speed},"intensity": ${lightData.lightAnimation.intensity}}`
  //             : '{"type": "torch","speed": 1,"intensity": 1}',
  //       },
  //     ],
  //   });
  // }

  // ===========================================
  // Utility Effect
  // =============================================

  static _createAtlEffectKey(key) {
    let result = key;
    //@ts-ignore
    const version = (game.version ?? game.data.version).charAt(0);

    if (version == '9') {
      switch (key) {
        case 'ATL.preset':
          break;
        case 'ATL.brightSight':
          break;
        case 'ATL.dimSight':
          break;
        case 'ATL.height':
          break;
        case 'ATl.img':
          break;
        case 'ATL.mirrorX':
          break;
        case 'ATL.mirrorY':
          break;
        case 'ATL.rotation':
          break;
        case 'ATL.scale':
          break;
        case 'ATL.width':
          break;
        case 'ATL.dimLight':
          result = 'ATL.light.dim';
          break;
        case 'ATL.brightLight':
          result = 'ATL.light.bright';
          break;
        case 'ATL.lightAnimation':
          result = 'ATL.light.animation';
          break;
        case 'ATL.lightColor':
          result = 'ATL.light.color';
          break;
        case 'ATL.lightAlpha':
          result = 'ATL.light.alpha';
          break;
        case 'ATL.lightAngle':
          result = 'ATL.light.angle';
          break;
      }
    }
    return result;
  }
}
