import FoundryHelpers from '../lib/foundry-helpers';
import { registerSocket } from '../socket';
import Effect from './effect';
import EffectHandler from './effect-handler';
import { game } from '../settings';

/**
 * Interface for working with effects and executing them as a GM via sockets
 */
export default class EffectInterface {
  //   _actorUpdater: ActorUpdater;
  _effectHandler: EffectHandler;
  _foundryHelpers: FoundryHelpers;

  _socket: any;
  moduleName: string;

  constructor(moduleName) {
    this.moduleName = moduleName;
    // this._actorUpdater = new ActorUpdater();
    this._effectHandler = new EffectHandler(moduleName);
    this._foundryHelpers = new FoundryHelpers();
    // this._socket = socket;
  }

  /**
   * Initializes the socket and registers the socket functions
   */
  initialize() {
    // this._socket = socketlib.registerModule(Constants.MODULE_ID);
    // this._registerFunctions();
    this._socket = registerSocket();
  }

  // _registerFunctions() {
  //   this._socket.register(
  //     'toggleEffect',
  //     this._effectHandler.toggleEffect.bind(this._effectHandler)
  //   );
  //   this._socket.register(
  //     'addEffect',
  //     this._effectHandler.addEffect.bind(this._effectHandler)
  //   );
  //   this._socket.register(
  //     'removeEffect',
  //     this._effectHandler.removeEffect.bind(this._effectHandler)
  //   );
  //   this._socket.register(
  //     'addActorDataChanges',
  //     this._actorUpdater.addActorDataChanges.bind(this._actorUpdater)
  //   );
  //   this._socket.register(
  //     'removeActorDataChanges',
  //     this._actorUpdater.removeActorDataChanges.bind(this._actorUpdater)
  //   );
  // }

  /**
   * Searches through the list of available effects and returns one matching the
   * effect name. Prioritizes finding custom effects first.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {Effect} the found effect
   */
  /**
   * Toggles the effect on the provided actor UUIDS as the GM via sockets
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {object} params - the effect parameters
   * @param {string} params.overlay - name of the effect to toggle
   * @param {string[]} params.uuids - UUIDS of the actors to toggle the effect on
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async findEffectByName(effectName: string) {
    const effect = this.findEffectByName(effectName);

    if (!effect) {
      ui.notifications?.error(`Effect ${effectName} was not found`);
      return;
    }
    return effect;
  }

  /**
   * Toggles the effect on the provided actor UUIDS as the GM via sockets
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {object} params - the effect parameters
   * @param {string} params.overlay - name of the effect to toggle
   * @param {string[]} params.uuids - UUIDS of the actors to toggle the effect on
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async toggleEffect(effectName, { overlay = false, uuids = <string[]>[] } = {}) {
    if (uuids.length == 0) {
      uuids = this._foundryHelpers.getActorUuidsFromCanvas();
    }

    if (uuids.length == 0) {
      ui.notifications?.error(`Please select or target a token to toggle ${effectName}`);
      return;
    }

    const effect = this.findEffectByName(effectName);

    if (!effect) {
      ui.notifications?.error(`Effect ${effectName} was not found`);
      return;
    }

    // if (effect.nestedEffects.length > 0) {
    //   effect = await this.getNestedEffectSelection(effect);
    //   if (!effect) return; // dialog closed without selecting one
    // }

    return this._socket.executeAsGM('toggleEffect', effect.name, {
      overlay,
      uuids,
    });
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {Promise<boolean>} true if the effect is applied, false otherwise
   */
  async hasEffectApplied(effectName: string, uuid: string) {
    return this._effectHandler.hasEffectApplied(effectName, uuid);
  }

  /**
   * Removes the effect from the provided actor UUID as the GM via sockets
   *
   * @param {object} params - the effect params
   * @param {string} params.effectName - the name of the effect to remove
   * @param {string} params.uuid - the UUID of the actor to remove the effect from
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async removeEffect({ effectName, uuid }) {
    const effect = this.findEffectByName(effectName);

    if (!effect) {
      ui.notifications?.error(`Effect ${effectName} could not be found`);
      return;
    }

    const actor = await this._foundryHelpers.getActorByUuid(uuid);

    if (!actor) {
      ui.notifications?.error(`Actor ${uuid} could not be found`);
      return;
    }

    // if (effect.nestedEffects.length > 0) {
    //   effect = await this.getNestedEffectSelection(effect);
    // }

    return this._socket.executeAsGM('removeEffect', {
      effectName: effect.name,
      uuid,
    });
  }

  /**
   * Adds the effect to the provided actor UUID as the GM via sockets
   *
   * @param {object} params - the params for adding an effect
   * @param {string} params.effectName - the name of the effect to add
   * @param {string} params.uuid - the UUID of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async addEffect({ effectName, uuid, origin }) {
    const effect = this.findEffectByName(effectName);

    if (!effect) {
      ui.notifications?.error(`Effect ${effectName} could not be found`);
      return;
    }

    const actor = await this._foundryHelpers.getActorByUuid(uuid);

    if (!actor) {
      ui.notifications?.error(`Actor ${uuid} could not be found`);
      return;
    }

    // if (effect.nestedEffects.length > 0) {
    //   effect = await this.getNestedEffectSelection(effect);
    // }

    return this._socket.executeAsGM('addEffect', {
      effectName: effect.name,
      uuid,
      origin,
    });
  }

  /**
   * Adds the defined effect to the provided actor UUID as the GM via sockets
   *
   * @param {object} params - the params for adding an effect
   * @param {object} params.effectData - the object containing all of the relevant effect data
   * @param {string} params.uuid - the UUID of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async addEffectWith({ effectData, uuid, origin, overlay }) {
    const effect = new Effect(effectData);

    const actor = await this._foundryHelpers.getActorByUuid(uuid);

    if (!actor) {
      ui.notifications?.error(`Actor ${uuid} could not be found`);
      return;
    }

    // if (effect.nestedEffects.length > 0) {
    //   effect = await this._getNestedEffectSelection(effect);
    // }

    return this._socket.executeAsGM('addEffect', {
      effectName: null,
      effectData,
      uuid,
      origin,
      overlay,
    });
  }

  /**
   * Adds data changes to the provided actor UUID as the GM via sockets
   *
   * @param {string} effectName - the name of the effect that is adding actor data changes
   * @param {string} uuid - the UUID of the actor to add the data changes to
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  addActorDataChanges(effectName, uuid) {
    return this._socket.executeAsGM('addActorDataChanges', effectName, uuid);
  }

  /**
   * Removes data changes from the provided actor UUID as the GM via sockets
   *
   * @param {string} effectName - the name of the effect that is removing actor data changes
   * @param {string} uuid - the UUID of the actor to remove the data changes from
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  removeActorDataChanges(effectName, uuid) {
    return this._socket.executeAsGM('removeActorDataChanges', effectName, uuid);
  }

  // /**
  //  * Prompts the user to select a nested effect from the choices available
  //  *
  //  * @param {Effect} effect - the parent effect
  //  * @returns {Effect} the chosen nested effect
  //  */
  // async getNestedEffectSelection(effect) {
  //   const content = await renderTemplate(
  //     'modules/dfreds-convenient-effects/templates/nested-effects-dialog.html',
  //     { parentEffect: effect }
  //   );
  //   const choice = await Dialog.prompt(
  //     {
  //       title: effect.name,
  //       content: content,
  //       label: 'Select Effect',
  //       callback: (html) => {
  //         const htmlChoice = html.find('select[name="effect-choice"]').val();
  //         return htmlChoice;
  //       },
  //       rejectClose: false,
  //     },
  //     { width: 300 }
  //   );

  //   return effect.nestedEffects.find(
  //     (nestedEffect) => nestedEffect.name == choice
  //   );
  // }

  // ============================================================
  // Additional feature for retrocompatibility
  // ============================================================

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedOnActor(effectName: string, uuid: string): Promise<boolean> {
    return this._effectHandler.hasEffectAppliedOnActor(effectName, uuid);
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
  async hasEffectAppliedFromIdOnActor(effectId: string, uuid: string): Promise<boolean> {
    return this._effectHandler.hasEffectAppliedFromIdOnActor(effectId, uuid);
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectOnActor(effectName: string, uuid: string) {
    return this._socket.executeAsGM('removeEffectOnActor', effectName, uuid);
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectFromIdOnActor(effectToRemoveId: string, uuid: string) {
    return this._socket.executeAsGM('removeEffectFromIdOnActor', effectToRemoveId, uuid);
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {string} effectName - the name of the effect to add
   * @param {string} uuid - the uuid of the actor to add the effect to
   */
  async addEffectOnActor(effectName: string, uuid: string, effect: Effect) {
    if (!uuid) {
      ui.notifications?.error(`Actor ${uuid} could not be found`);
      return;
    }

    if (!effect) {
      ui.notifications?.error(`Effect ${effectName} could not be found`);
      return;
    }

    // if (effect.nestedEffects.length > 0) {
    //   effect = await this.getNestedEffectSelection(effect);
    // }

    return this._socket.executeAsGM('addEffectOnActor', effect.name, uuid, undefined, false, effect);
  }

  async toggleEffectFromIdOnActor(
    effectId: string,
    uuid: string,
    alwaysDelete: boolean,
    forceEnabled: boolean,
    forceDisabled: boolean,
  ) {
    if (effectId.length == 0) {
      ui.notifications?.error(`Please select or target a active effect to toggle ${effectId}`);
      return;
    }

    const actor = <Actor>game.actors?.get(uuid) || <Actor>game.actors?.getName(uuid);
    const effect = <ActiveEffect>actor.effects.find((entity: ActiveEffect) => {
      return <string>entity.id == effectId;
    });

    if (!effect) {
      ui.notifications?.error(`Effect ${effectId} was not found`);
      return;
    }

    return this._socket.executeAsGM('toggleEffectFromIdOnActor', effect.id, uuid, alwaysDelete, forceEnabled, forceDisabled);
  }

  /**
   * Toggles the effect on the provided actor UUIDS as the GM via sockets
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {object} params - the effect parameters
   * @param {string} params.overlay - name of the effect to toggle
   * @param {string[]} params.uuids - UUIDS of the actors to toggle the effect on
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async findEffectByNameOnActor(effectName: string, overlay = false, uuids = <string[]>[]) {
    if (uuids.length == 0) {
      uuids = this._foundryHelpers.getActorUuidsFromCanvas();
    }

    if (uuids.length == 0) {
      ui.notifications?.error(`Please select or target a token to toggle ${effectName}`);
      return;
    }

    const effect = this.findEffectByName(effectName);

    if (!effect) {
      ui.notifications?.error(`Effect ${effectName} was not found`);
      return;
    }
    return effect;
  }
}
