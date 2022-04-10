import CONSTANTS from './constants';
import API from './api';
import { debug } from './lib/lib';
import { setSocket } from '../main';

export const SOCKET_HANDLERS = {
  /**
   * Generic sockets
   */
  CALL_HOOK: 'callHook',

  /**
   * Item pile sockets
   */

  /**
   * UI sockets
   */

  /**
   * Item & attribute sockets
   */
};

export let lightHudAteSocket;

export function registerSocket() {
  debug('Registered lightHudAteSocket');
  if (lightHudAteSocket) {
    return lightHudAteSocket;
  }
  //@ts-ignore
  lightHudAteSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

  /**
   * Generic socket
   */
  lightHudAteSocket.register(SOCKET_HANDLERS.CALL_HOOK, (hook, ...args) => callHook(hook, ...args));

  // /**
  //  * Light Hud Ate sockets
  //  */
  // lightHudAteSocket.register(SOCKET_HANDLERS.ON_RENDER_TOKEN_CONFIG, (...args) =>
  //   API._onRenderTokenConfig(...args),
  // );

  /**
   * UI sockets
   */

  /**
   * Item & attribute sockets
   */

  /**
   * Effects
   */

  // lightHudAteSocket.register('addActorDataChanges', (...args) => API._actorUpdater.addActorDataChanges(...args));
  // lightHudAteSocket.register('removeActorDataChanges', (...args) => API._actorUpdater.removeActorDataChanges(...args));
  lightHudAteSocket.register('toggleEffect', (...args) => API.toggleEffectArr(...args));
  lightHudAteSocket.register('hasEffectApplied', (...args) => API.hasEffectAppliedArr(...args));
  lightHudAteSocket.register('addEffect', (...args) => API.addEffectArr(...args));
  lightHudAteSocket.register('removeEffect', (...args) => API.removeEffectArr(...args));

  // Actor

  lightHudAteSocket.register('toggleEffectFromIdOnActor', (...args) => API.toggleEffectFromIdOnActorArr(...args));
  lightHudAteSocket.register('hasEffectAppliedOnActor', (...args) => API.hasEffectAppliedOnActorArr(...args));
  lightHudAteSocket.register('hasEffectAppliedFromIdOnActor', (...args) =>
    API.hasEffectAppliedFromIdOnActorArr(...args),
  );
  lightHudAteSocket.register('addEffectOnActor', (...args) => API.addEffectOnActorArr(...args));
  lightHudAteSocket.register('removeEffectOnActor', (...args) => API.removeEffectOnActorArr(...args));
  lightHudAteSocket.register('removeEffectFromIdOnActor', (...args) => API.removeEffectFromIdOnActorArr(...args));
  lightHudAteSocket.register('findEffectByNameOnActor', (...args) => API.findEffectByNameOnActorArr(...args));
  lightHudAteSocket.register('addActiveEffectOnActor', (...args) => API.addActiveEffectOnActorArr(...args));

  // Token

  lightHudAteSocket.register('toggleEffectFromIdOnToken', (...args) => API.toggleEffectFromIdOnTokenArr(...args));
  lightHudAteSocket.register('hasEffectAppliedFromIdOnToken', (...args) =>
    API.hasEffectAppliedFromIdOnTokenArr(...args),
  );
  lightHudAteSocket.register('hasEffectAppliedOnToken', (...args) => API.hasEffectAppliedOnTokenArr(...args));
  lightHudAteSocket.register('addEffectOnToken', (...args) => API.addEffectOnTokenArr(...args));
  lightHudAteSocket.register('removeEffectOnToken', (...args) => API.removeEffectOnTokenArr(...args));
  lightHudAteSocket.register('removeEffectFromIdOnToken', (...args) => API.removeEffectFromIdOnTokenArr(...args));
  lightHudAteSocket.register('removeEffectFromIdOnTokenMultiple', (...args) =>
    API.removeEffectFromIdOnTokenMultipleArr(...args),
  );
  lightHudAteSocket.register('findEffectByNameOnToken', (...args) => API.findEffectByNameOnTokenArr(...args));
  lightHudAteSocket.register('updateEffectFromIdOnToken', (...args) => API.updateEffectFromIdOnTokenArr(...args));
  lightHudAteSocket.register('updateEffectFromNameOnToken', (...args) => API.updateEffectFromNameOnTokenArr(...args));
  lightHudAteSocket.register('updateActiveEffectFromIdOnToken', (...args) =>
    API.updateActiveEffectFromIdOnTokenArr(...args),
  );
  lightHudAteSocket.register('updateActiveEffectFromNameOnToken', (...args) =>
    API.updateActiveEffectFromNameOnTokenArr(...args),
  );

  setSocket(lightHudAteSocket);
  return lightHudAteSocket;
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
