import { error, i18n, log } from '../lib/lib';
import FoundryHelpers from '../lib/foundry-helpers';
import { canvas, game } from '../settings';
import Effect from './effect';

export default class EffectHandler {
  _customEffects: Effect[];
  moduleName: string;
  _foundryHelpers: FoundryHelpers;

  constructor(moduleName: string) {
    if (!game[moduleName]) {
      game[moduleName] = {};
    }
    if (!game[moduleName]?.effects) {
      game[moduleName].effects = {};
    }
    if (!game[moduleName].effects.customEffects) {
      game[moduleName].effects.customEffects = [];
    }
    this._customEffects = <Effect[]>game[moduleName].effects.customEffects || [];
    this.moduleName = moduleName;
    this._foundryHelpers = new FoundryHelpers();
  }

  // /**
  //  * Searches through the list of available effects and returns one matching the
  //  * effect name. Prioritizes finding custom effects first.
  //  *
  //  * @param {string} effectName - the effect name to search for
  //  * @returns {Effect} the found effect
  //  */
  // findEffectByName(effectName) {
  //   // const effect = this._customEffectsHandler
  //   //   .getCustomEffects()
  //   //   .find((effect) => effect.name == effectName);

  //   // if (effect) return effect;

  //   // return game.dfreds.effects.all.find((effect) => effect.name == effectName);
  //   const effect = <Effect>this._customEffects.find((effect: Effect) => effect.name == effectName);
  //   return effect;
  // }

  /**
   * Toggles an effect on or off by name on an actor by UUID
   *
   * @param {Effect} effect - name of the effect to toggle
   * @param {object} params - the effect parameters
   * @param {string} params.overlay - name of the effect to toggle
   * @param {string[]} params.uuids - UUIDS of the actors to toggle the effect on
   */
  async toggleEffect(effect, { overlay, uuids }) {
    for (const uuid of uuids) {
      if (await this.hasEffectApplied(effect.name, uuid)) {
        await this.removeEffect({ effect, uuid });
      } else {
        const actor = <Actor>await this._foundryHelpers.getActorByUuid(uuid);
        const origin = `Actor.${actor.data._id}`;
        await this.addEffect({ effect, uuid, origin, overlay });
      }
    }
  }

  /**
   * Toggles an effect on or off by name on an actor by UUID
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {object} params - the effect parameters
   * @param {string} params.overlay - name of the effect to toggle
   * @param {string[]} params.uuids - UUIDS of the actors to toggle the effect on
   */
  async toggleEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('toggleEffectArr | inAttributes must be of type array');
    }
    const [effectName, params] = inAttributes;
    return this.toggleEffect(effectName, params);
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectApplied(effectName, uuid) {
    const actor = await this._foundryHelpers.getActorByUuid(uuid);
    return actor?.data?.effects?.some(
      // (activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?.label == effectName,
      (activeEffect) => <string>activeEffect?.data?.label == effectName && !activeEffect?.data?.disabled,
    );
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    return this.hasEffectApplied(effectName, uuid);
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {object} params - the effect parameters
   * @param {string} params.effect - the name of the effect to remove
   * @param {string} params.uuid - the uuid of the actor to remove the effect from
   */
  async removeEffect({ effect, uuid }) {
    const actor = await this._foundryHelpers.getActorByUuid(uuid);
    const effectToRemove = actor.data.effects.find(
      //(activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && activeEffect?.data?.label == effect.name,
      (activeEffect) => activeEffect?.data?.label == effect.name,
    );

    if (!effectToRemove) return;

    await actor.deleteEmbeddedDocuments('ActiveEffect', [<string>effectToRemove.id]);
    log(`Removed effect ${effect.name} from ${actor.name} - ${actor.id}`);
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectArr | inAttributes must be of type array');
    }
    const [params] = inAttributes;
    return this.removeEffect(params);
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {object} params - the effect parameters
   * @param {Effect} params.effect - the name of the effect to add
   * @param {string} params.uuid - the uuid of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   */
  async addEffect({ effect, uuid, origin, overlay }) {
    const actor = await this._foundryHelpers.getActorByUuid(uuid);

    if (!origin) {
      origin = `Actor.${actor.data._id}`;
    }

    // if (effect.name.startsWith('Exhaustion')) {
    //   await this._removeAllExhaustionEffects(uuid);
    // }

    // if (effect.isDynamic) {
    //   await this._dynamicEffectsAdder.addDynamicEffects(effect, actor);
    // }

    this._handleIntegrations(effect);

    const activeEffectData = effect.convertToActiveEffectData({
      origin,
      overlay,
    });
    await actor.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);

    log(`Added effect ${effect.name} to ${actor.name} - ${actor.id}`);
  }

  // async _removeAllExhaustionEffects(uuid) {
  //   await this.removeEffect({ effectName: 'Exhaustion 1', uuid });
  //   await this.removeEffect({ effectName: 'Exhaustion 2', uuid });
  //   await this.removeEffect({ effectName: 'Exhaustion 3', uuid });
  //   await this.removeEffect({ effectName: 'Exhaustion 4', uuid });
  //   await this.removeEffect({ effectName: 'Exhaustion 5', uuid });
  // }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {object} params - the effect parameters
   * @param {string} params.effectName - the name of the effect to add
   * @param {string} params.uuid - the uuid of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   */
  async addEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectArr | inAttributes must be of type array');
    }
    const [params] = inAttributes;
    return this.addEffect(params);
  }

  _handleIntegrations(effect) {
    if (effect.atlChanges.length > 0) {
      this._addAtlChangesToEffect(effect);
    }

    if (effect.tokenMagicChanges.length > 0) {
      this._addTokenMagicChangesToEffect(effect);
    }
  }

  _addAtlChangesToEffect(effect) {
    effect.changes.push(...effect.atlChanges);
  }

  _addTokenMagicChangesToEffect(effect) {
    effect.changes.push(...effect.tokenMagicChanges);
  }

  // ============================================================
  // Additional feature for retrocompatibility
  // ============================================================

  convertToEffectClass(effect: ActiveEffect): Effect {
    const atlChanges = effect.data.changes.filter((changes) => changes.key.startsWith('ATL'));
    const tokenMagicChanges = effect.data.changes.filter((changes) => changes.key === 'macro.tokenMagic');
    const changes = effect.data.changes.filter(
      (change) => !change.key.startsWith('ATL') && change.key !== 'macro.tokenMagic',
    );

    return new Effect({
      customId: <string>effect.id,
      name: effect.data.label,
      description: <string>effect.data.flags.customEffectDescription,
      icon: <string>effect.data.icon,
      tint: <string>effect.data.tint,
      seconds: effect.data.duration.seconds,
      rounds: effect.data.duration.rounds,
      turns: effect.data.duration.turns,
      flags: effect.data.flags,
      changes,
      atlChanges,
      tokenMagicChanges,
    });
  }

  /**
   * Searches through the list of available effects and returns one matching the
   * effect name. Prioritizes finding custom effects first.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {Effect} the found effect
   */
  async findEffectByNameOnActor(effectName, uuid): Promise<ActiveEffect> {
    if (effectName) {
      effectName = i18n(effectName);
    }
    const actor = <Actor>await this._foundryHelpers.getActorByUuid(uuid);
    return await (<ActiveEffect>(
      actor?.data?.effects?.find((activeEffect) => <string>activeEffect?.data?.label == effectName)
    ));
  }

  /**
   * Searches through the list of available effects and returns one matching the
   * effect name. Prioritizes finding custom effects first.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {Effect} the found effect
   */
  async findEffectByNameOnActorArr(...inAttributes: any[]): Promise<ActiveEffect> {
    if (!Array.isArray(inAttributes)) {
      throw error('findEffectByNameOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    return this.findEffectByNameOnActor(effectName, uuid);
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedOnActor(effectName, uuid): Promise<boolean> {
    if (effectName) {
      effectName = i18n(effectName);
    }
    const actor = await this._foundryHelpers.getActorByUuid(uuid);
    return actor?.data?.effects?.some(
      // (activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?.label == effectName,
      (activeEffect) => <string>activeEffect?.data?.label == effectName,
    );
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedOnActorArr(...inAttributes: any[]): Promise<boolean> {
    if (!Array.isArray(inAttributes)) {
      throw error('hasEffectAppliedOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    return this.hasEffectAppliedOnActor(effectName, uuid);
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectId - the id of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedFromIdOnActor(effectId, uuid): Promise<boolean> {
    const actor = await this._foundryHelpers.getActorByUuid(uuid);
    return actor?.data?.effects?.some(
      // (activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?._id == effectId,
      (activeEffect) => <string>activeEffect?.data?._id == effectId,
    );
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectId - the id of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedFromIdOnActorArr(...inAttributes: any[]): Promise<boolean> {
    if (!Array.isArray(inAttributes)) {
      throw error('hasEffectAppliedFromIdOnActorArr | inAttributes must be of type array');
    }
    const [effectId, uuid] = inAttributes;
    return this.hasEffectAppliedFromIdOnActor(effectId, uuid);
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectOnActor(effectName, uuid) {
    if (effectName) {
      effectName = i18n(effectName);
    }
    const actor = <Actor>await this._foundryHelpers.getActorByUuid(uuid);
    const effectToRemove = <ActiveEffect>actor.data.effects.find(
      // (activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?.label == effectName,
      (activeEffect) => <string>activeEffect?.data?.label == effectName,
    );

    if (!effectToRemove) return;

    // actor.deleteEmbeddedDocuments('ActiveEffect', [<string>effectToRemove.id]);
    // Why i need this ??? for avoid the double AE
    await effectToRemove.update({ disabled: true });
    await effectToRemove.delete();
    log(`Removed effect ${effectName} from ${actor.name} - ${actor.id}`);
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectOnActorArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    return this.removeEffectOnActor(effectName, uuid);
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectId - the id of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectFromIdOnActor(effectToRemoveId, uuid) {
    if (effectToRemoveId) {
      const actor = <Actor>await this._foundryHelpers.getActorByUuid(uuid);
      //actor.deleteEmbeddedDocuments('ActiveEffect', [<string>effectToRemoveId]);
      // Why i need this ??? for avoid the double AE
      const effectToRemove = <ActiveEffect>actor.data.effects.find(
        //(activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect.id == effectToRemoveId,
        (activeEffect) => <string>activeEffect.id == effectToRemoveId,
      );
      await effectToRemove.update({ disabled: true });
      await effectToRemove.delete();
      log(`Removed effect ${effectToRemove?.data?.label} from ${actor.name} - ${actor.id}`);
    }
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectId - the id of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectFromIdOnActorArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectFromIdOnActor | inAttributes must be of type array');
    }
    const [effectToRemoveId, uuid] = inAttributes;
    return this.removeEffectFromIdOnActor(effectToRemoveId, uuid);
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {object} params - the effect parameters
   * @param {string} params.effectName - the name of the effect to add
   * @param {string} params.uuid - the uuid of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   */
  async addEffectOnActor(effectName, uuid, origin, overlay, effect: Effect | null) {
    if (effectName) {
      effectName = i18n(effectName);
    }
    if (effect) {
      const actor = <Actor>await this._foundryHelpers.getActorByUuid(uuid);
      if (!origin) {
        origin = `Actor.${actor.data._id}`;
      }
      const activeEffectData = effect.convertToActiveEffectData({
        origin,
        overlay,
      });
      actor.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);
      log(`Added effect ${effect.name ? effect.name : effectName} to ${actor.name} - ${actor.id}`);
    }
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {string} effectName - the name of the effect to add
   * @param {string} uuid - the uuid of the actor to add the effect to
   */
  async addEffectOnActorArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid, origin, overlay, effect] = inAttributes;
    return this.addEffectOnActor(effectName, uuid, origin, overlay, effect);
  }
}
