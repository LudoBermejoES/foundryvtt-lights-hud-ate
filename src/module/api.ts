import CONSTANTS from './constants';
import { lightsHudAteSocket, SOCKET_HANDLERS } from './socket';
import { canvas, game } from './settings';
import { dialogWarning, error, i18n, warn } from './lib/lib';
import EffectInterface from './effects/effect-interface';
import EffectHandler from './effects/effect-handler';
import Effect from './effects/effect';
import HOOKS from './hooks';
import { EffectDefinitions } from './lights-hud-ate-effect-definition';
import { LightHUDElement, VisionHUDElement } from './lights-hud-ate-models';

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
   * The attributes used to track dynamic attributes in this system
   *
   * @returns {array}
   */
  static get VISIONS(): VisionHUDElement[] {
    return <any[]>game.settings.get(CONSTANTS.MODULE_NAME, 'visions');
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

  static async addEffect(actorId: string, effectName: string, effect: Effect) {
    // const entity = <Actor>game.actors?.get(actorId);
    // if (entity.documentName !== 'Actor') {
    //   return;
    // }
    // let link = getProperty(entity, 'data.token.actorLink');
    // if (link === undefined) {
    //   link = true;
    // }
    // let tokenArray: any[] = [];
    // if (!link) {
    //   //@ts-ignore
    //   tokenArray = [entity.token?.object];
    // } else {
    //   tokenArray = entity.getActiveTokens();
    // }
    // if (tokenArray === []) {
    //   return;
    // }
    // const originals = link
    //   ? (await entity.getFlag('ATL', 'originals')) || {}
    //   : (await entity.token?.getFlag('ATL', 'originals')) || {};

    const result = await API.effectInterface.addEffectOnActor(effectName, <string>actorId, effect);

    // if (link) {
    //   await entity.setFlag('ATL', 'originals', originals);
    // } else {
    //   await entity.token?.setFlag('ATL', 'originals', originals);
    // }

    return result;
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
    // const entity = <Actor>game.actors?.get(actorId);
    // if (entity.documentName !== 'Actor') {
    //   return;
    // }
    // let link = getProperty(entity, 'data.token.actorLink');
    // if (link === undefined) {
    //   link = true;
    // }
    // let tokenArray: any[] = [];
    // if (!link) {
    //   //@ts-ignore
    //   tokenArray = [entity.token?.object];
    // } else {
    //   tokenArray = entity.getActiveTokens();
    // }
    // if (tokenArray === []) {
    //   return;
    // }
    // const originals = link
    //   ? (await entity.getFlag('ATL', 'originals')) || {}
    //   : (await entity.token?.getFlag('ATL', 'originals')) || {};

    const result = await API.effectInterface.toggleEffectFromIdOnActor(
      effectId,
      <string>actorId,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );

    // if (link) {
    //   await entity.setFlag('ATL', 'originals', originals);
    // } else {
    //   await entity.token?.setFlag('ATL', 'originals', originals);
    // }

    return result;
  }

  static async addActiveEffectOnActor(actorId: string, activeEffect: ActiveEffect) {
    // const entity = <Actor>game.actors?.get(actorId);
    // if (entity.documentName !== 'Actor') {
    //   return;
    // }
    // let link = getProperty(entity, 'data.token.actorLink');
    // if (link === undefined) {
    //   link = true;
    // }
    // let tokenArray: any[] = [];
    // if (!link) {
    //   //@ts-ignore
    //   tokenArray = [entity.token?.object];
    // } else {
    //   tokenArray = entity.getActiveTokens();
    // }
    // if (tokenArray === []) {
    //   return;
    // }
    // const originals = link
    //   ? (await entity.getFlag('ATL', 'originals')) || {}
    //   : (await entity.token?.getFlag('ATL', 'originals')) || {};

    const result = API.effectInterface.addActiveEffectOnActor(<string>actorId, activeEffect.data);

    // if (link) {
    //   await entity.setFlag('ATL', 'originals', originals);
    // } else {
    //   await entity.token?.setFlag('ATL', 'originals', originals);
    // }

    return result;
  }
}
