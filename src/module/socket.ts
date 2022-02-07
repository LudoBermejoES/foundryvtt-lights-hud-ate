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

export let senseWallsSocket;

export function registerSocket() {
  debug('Registered senseWallsSocket');
  //@ts-ignore
  senseWallsSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

  /**
   * Generic socket
   */
  senseWallsSocket.register(SOCKET_HANDLERS.CALL_HOOK, (hook, ...args) => callHook(hook, ...args));

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
  senseWallsSocket.register('toggleEffect', (...args) => API.effectInterface._effectHandler.toggleEffectArr(...args));
  senseWallsSocket.register('addEffect', (...args) => API.effectInterface._effectHandler.addEffectArr(...args));
  senseWallsSocket.register('removeEffect', (...args) => API.effectInterface._effectHandler.removeEffectArr(...args));
  // senseWallsSocket.register('addActorDataChanges', (...args) => API._actorUpdater.addActorDataChanges(...args));
  // senseWallsSocket.register('removeActorDataChanges', (...args) => API._actorUpdater.removeActorDataChanges(...args));
  senseWallsSocket.register('addEffectOnActor', (...args) =>
    API.effectInterface._effectHandler.addEffectOnActorArr(...args),
  );
  senseWallsSocket.register('removeEffectOnActor', (...args) =>
    API.effectInterface._effectHandler.removeEffectOnActorArr(...args),
  );
  senseWallsSocket.register('removeEffectFromIdOnActor', (...args) =>
    API.effectInterface._effectHandler.removeEffectFromIdOnActorArr(...args),
  );

  return senseWallsSocket;
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
