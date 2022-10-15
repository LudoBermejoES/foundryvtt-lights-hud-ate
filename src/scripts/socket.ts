import CONSTANTS from './constants';
import API from './api';
import { debug } from './lib/lib';
import { setSocket } from '../main';

export let lightHudAteSocket;

export function registerSocket() {
  debug('Registered lightHudAteSocket');
  if (lightHudAteSocket) {
    return lightHudAteSocket;
  }
  //@ts-ignore
  lightHudAteSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

  // // lightHudAteSocket.register('addActorDataChanges', (...args) => API._actorUpdater.addActorDataChanges(...args));
  // // lightHudAteSocket.register('removeActorDataChanges', (...args) => API._actorUpdater.removeActorDataChanges(...args));
  // lightHudAteSocket.register('toggleEffect', (...args) => API.toggleEffectArr(...args));
  // lightHudAteSocket.register('hasEffectApplied', (...args) => API.hasEffectAppliedArr(...args));
  // lightHudAteSocket.register('addEffect', (...args) => API.addEffectArr(...args));
  // lightHudAteSocket.register('removeEffect', (...args) => API.removeEffectArr(...args));

  // // Actor

  // lightHudAteSocket.register('toggleEffectFromIdOnActor', (...args) => API.toggleEffectFromIdOnActorArr(...args));
  // lightHudAteSocket.register('hasEffectAppliedOnActor', (...args) => API.hasEffectAppliedOnActorArr(...args));
  // lightHudAteSocket.register('hasEffectAppliedFromIdOnActor', (...args) =>
  //   API.hasEffectAppliedFromIdOnActorArr(...args),
  // );
  // lightHudAteSocket.register('addEffectOnActor', (...args) => API.addEffectOnActorArr(...args));
  // lightHudAteSocket.register('removeEffectOnActor', (...args) => API.removeEffectOnActorArr(...args));
  // lightHudAteSocket.register('removeEffectFromIdOnActor', (...args) => API.removeEffectFromIdOnActorArr(...args));
  // lightHudAteSocket.register('findEffectByNameOnActor', (...args) => API.findEffectByNameOnActorArr(...args));
  // lightHudAteSocket.register('addActiveEffectOnActor', (...args) => API.addActiveEffectOnActorArr(...args));

  // // Token

  // lightHudAteSocket.register('toggleEffectFromIdOnToken', (...args) => API.toggleEffectFromIdOnTokenArr(...args));
  // lightHudAteSocket.register('hasEffectAppliedFromIdOnToken', (...args) =>
  //   API.hasEffectAppliedFromIdOnTokenArr(...args),
  // );
  // lightHudAteSocket.register('hasEffectAppliedOnToken', (...args) => API.hasEffectAppliedOnTokenArr(...args));
  // lightHudAteSocket.register('addEffectOnToken', (...args) => API.addEffectOnTokenArr(...args));
  // lightHudAteSocket.register('removeEffectOnToken', (...args) => API.removeEffectOnTokenArr(...args));
  // lightHudAteSocket.register('removeEffectFromIdOnToken', (...args) => API.removeEffectFromIdOnTokenArr(...args));
  // lightHudAteSocket.register('removeEffectFromIdOnTokenMultiple', (...args) =>
  //   API.removeEffectFromIdOnTokenMultipleArr(...args),
  // );
  // lightHudAteSocket.register('findEffectByNameOnToken', (...args) => API.findEffectByNameOnTokenArr(...args));
  // lightHudAteSocket.register('addActiveEffectOnToken', (...args) => API.addActiveEffectOnTokenArr(...args));
  // lightHudAteSocket.register('updateEffectFromIdOnToken', (...args) => API.updateEffectFromIdOnTokenArr(...args));
  // lightHudAteSocket.register('updateEffectFromNameOnToken', (...args) => API.updateEffectFromNameOnTokenArr(...args));
  // lightHudAteSocket.register('updateActiveEffectFromIdOnToken', (...args) =>
  //   API.updateActiveEffectFromIdOnTokenArr(...args),
  // );
  // lightHudAteSocket.register('updateActiveEffectFromNameOnToken', (...args) =>
  //   API.updateActiveEffectFromNameOnTokenArr(...args),
  // );
  // lightHudAteSocket.register('onManageActiveEffectFromEffectId', (...args) =>
  //   API.onManageActiveEffectFromEffectIdArr(...args),
  // );
  // lightHudAteSocket.register('onManageActiveEffectFromEffect', (...args) =>
  //   API.onManageActiveEffectFromEffectArr(...args),
  // );
  // lightHudAteSocket.register('onManageActiveEffectFromActiveEffect', (...args) =>
  //   API.onManageActiveEffectFromActiveEffectArr(...args),
  // );

  setSocket(lightHudAteSocket);
  return lightHudAteSocket;
}