import CONSTANTS from './constants';
import { lightsHudAteSocket, SOCKET_HANDLERS } from './socket';
import { canvas, game } from './settings';
import { dialogWarning, error, i18n, warn } from './lib/lib';
import EffectInterface from './effects/effect-interface';
import EffectHandler from './effects/effect-handler';
import Effect from './effects/effect';
import HOOKS from './hooks';
import { EffectDefinitions } from './lights-hud-ate-effect-definition';
import { LightDataExt, LightHUDElement } from './lights-hud-ate-models';

export default class API {
  // static get effectInterface(): EffectInterface {
  //   return new EffectInterface(CONSTANTS.MODULE_NAME, senseWallsSocket);
  // }

  static effectInterface: EffectInterface;

  /**
   * The attributes used to track dynamic attributes in this system
   *
   * @returns {array}
   */
  static get LIGHTS(): LightHUDElement[] {
    return <any[]>game.settings.get(CONSTANTS.MODULE_NAME, 'lights');
  }

  /**
   * Sets the attributes used to track dynamic attributes in this system
   *
   * @param {array} inAttributes
   * @returns {Promise}
   */
  static async setLights(inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('setLights | inAttributes must be of type array');
    }
    inAttributes.forEach((attribute) => {
      if (typeof attribute !== 'object') {
        throw error('setLights | each entry in the inAttributes array must be of type object');
      }
      if (typeof attribute.name !== 'string') {
        throw error('setLights | attribute.name must be of type string');
      }
      if (typeof attribute.attribute !== 'string') {
        throw error('setLights | attribute.path must be of type string');
      }
      if (attribute.img && typeof attribute.img !== 'string') {
        throw error('setLights | attribute.img must be of type string');
      }
    });
    return game.settings.set(CONSTANTS.MODULE_NAME, 'lights', inAttributes);
  }

  static addEffect(actorId: string, effectName: string, effect: Effect) {
    return API.effectInterface.addEffectOnActor(effectName, <string>actorId, effect);
    // const actor = <Actor>game.actors?.get(actorNameOrId) || <Actor>game.actors?.getName(actorNameOrId);

    // if (!actor) {
    //   warn(`No actor found with reference '${actorNameOrId}'`, true);
    // }

    // let effect: Effect | undefined = undefined;
    // const lightsOrderByName = <LightHUDElement[]>API.LIGHTS.sort((a, b) => a.name.localeCompare(b.name));
    // lightsOrderByName.forEach((a: LightHUDElement) => {
    //   if (a.id == effectName || i18n(a.name) == effectName) {
    //     effect = <Effect>EffectDefinitions.all(lightData).find((e: Effect) => {
    //       return e.customId == a.id;
    //     });
    //   }
    // });

    // if (!effect) {
    //   warn(`No effect found with reference '${effectName}'`, true);
    // }

    // if (actor && effect) {
    //   API.effectInterface.addEffectOnActor(effectName, <string>actor.id, effect);
    // }
  }

  static async findEffectByNameOnActor(actorId: string, effectName: string): Promise<ActiveEffect | null> {
    return await API.effectInterface.findEffectByNameOnActor(effectName, <string>actorId);
  }

  static async hasEffectAppliedOnActor(actorId: string, effectName: string) {
    return await API.effectInterface.hasEffectAppliedOnActor(effectName, <string>actorId);
  }

  static async hasEffectAppliedFromIdOnActor(actorId: string, effectId: string) {
    return await API.effectInterface.hasEffectAppliedFromIdOnActor(effectId, <string>actorId);
  }

  static async toggleEffectOnActor(
    actorId: string,
    effectId: string,
    alwaysDelete: boolean,
    forceEnabled?: boolean,
    forceDisabled?: boolean,
  ) {
    return await API.effectInterface.toggleEffectFromIdOnActor(
      effectId,
      <string>actorId,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
  }
}
