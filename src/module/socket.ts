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

export let lightsHUDSocket;

export function registerSocket() {
  debug('Registered lightsHUDSocket');
  //@ts-ignore
  lightsHUDSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

  /**
   * Generic socket
   */
  lightsHUDSocket.register(SOCKET_HANDLERS.CALL_HOOK, (hook, ...args) => callHook(hook, ...args));

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
  lightsHUDSocket.register('toggleEffect', (...args) => API.effectInterface._effectHandler.toggleEffectArr(...args));
  lightsHUDSocket.register('addEffect', (...args) => API.effectInterface._effectHandler.addEffectArr(...args));
  lightsHUDSocket.register('removeEffect', (...args) => API.effectInterface._effectHandler.removeEffectArr(...args));
  // senseWallsSocket.register('addActorDataChanges', (...args) => API._actorUpdater.addActorDataChanges(...args));
  // senseWallsSocket.register('removeActorDataChanges', (...args) => API._actorUpdater.removeActorDataChanges(...args));
  lightsHUDSocket.register('addEffectOnActor', (...args) =>
    API.effectInterface._effectHandler.addEffectOnActorArr(...args),
  );
  lightsHUDSocket.register('removeEffectOnActor', (...args) =>
    API.effectInterface._effectHandler.removeEffectOnActorArr(...args),
  );
  lightsHUDSocket.register('removeEffectFromIdOnActor', (...args) =>
    API.effectInterface._effectHandler.removeEffectFromIdOnActorArr(...args),
  );

  return lightsHUDSocket;
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
