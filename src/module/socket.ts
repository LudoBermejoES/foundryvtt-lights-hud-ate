import CONSTANTS from './constants';
import API from './api';
import { debug } from './lib/lib';

export const SOCKET_HANDLERS = {
  /**
   * Generic sockets
   */
  CALL_HOOK: 'callHook',

  /**
   * Sense Walls sockets
   */

  /**
   * UI sockets
   */

  /**
   * Item & attribute sockets
   */
};

export let lightsHudAteSocket;

export function registerSocket() {
  debug('Registered lightsHUDSocket');
  //@ts-ignore
  lightsHudAteSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

  /**
   * Generic socket
   */
  lightsHudAteSocket.register(SOCKET_HANDLERS.CALL_HOOK, (hook, ...args) => callHook(hook, ...args));

  /**
   * Sense walls sockets
   */

  /**
   * UI sockets
   */

  /**
   * Item & attribute sockets
   */

  /**
   * Effects
   */
  lightsHudAteSocket.register('toggleEffect', (...args) => API.effectInterface._effectHandler.toggleEffectArr(...args));
  lightsHudAteSocket.register('addEffect', (...args) => API.effectInterface._effectHandler.addEffectArr(...args));
  lightsHudAteSocket.register('removeEffect', (...args) => API.effectInterface._effectHandler.removeEffectArr(...args));
  // senseWallsSocket.register('addActorDataChanges', (...args) => API._actorUpdater.addActorDataChanges(...args));
  // senseWallsSocket.register('removeActorDataChanges', (...args) => API._actorUpdater.removeActorDataChanges(...args));
  lightsHudAteSocket.register('addEffectOnActor', (...args) =>
    API.effectInterface._effectHandler.addEffectOnActorArr(...args),
  );
  lightsHudAteSocket.register('removeEffectOnActor', (...args) =>
    API.effectInterface._effectHandler.removeEffectOnActorArr(...args),
  );
  lightsHudAteSocket.register('removeEffectFromIdOnActor', (...args) =>
    API.effectInterface._effectHandler.removeEffectFromIdOnActorArr(...args),
  );
  lightsHudAteSocket.register('toggleEffectFromIdOnActor', (...args) =>
    API.effectInterface._effectHandler.toggleEffectFromIdOnActorArr(...args),
  );
  lightsHudAteSocket.register('findEffectByNameOnActor', (...args) =>
    API.effectInterface._effectHandler.findEffectByNameOnActorArr(...args),
  );
  lightsHudAteSocket.register('addActiveEffectOnActor', (...args) =>
    API.effectInterface._effectHandler.addActiveEffectOnActorArr(...args),
  );
  return lightsHudAteSocket;
}

async function callHook(inHookName, ...args) {
  const newArgs: any[] = [];
  for (let arg of args) {
    if (typeof arg === 'string') {
      const testArg = await fromUuid(arg);
      if (testArg) {
        arg = testArg;
      }
    }
    newArgs.push(arg);
  }
  return Hooks.callAll(inHookName, ...newArgs);
}
