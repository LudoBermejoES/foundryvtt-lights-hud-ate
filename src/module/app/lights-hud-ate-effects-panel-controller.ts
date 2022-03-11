import { LightDataDialog, LightDataHud } from './../lights-hud-ate-models';
import CONSTANTS from '../constants';
import { info, isStringEquals, warn } from '../lib/lib';
import { canvas, game } from '../settings';
import EffectsPanelApp from './lights-hud-ate-effects-panel-app';
import API from '../api';
import { confirmDialogATLEffectItem } from '../lights-hud-ate-dialogs';

export default class EffectsPanelController {
  _viewMvc: EffectsPanelApp;

  // MOD 4535992
  temporaryEffectsRightClickBehavior = 'Disable';
  passiveEffectsRightClickBehavior = 'Disable';
  showPassiveEffects = true;
  refresh: any;
  _itemLights: LightDataHud[];
  // END MOD 4535992

  /**
   * Initializes the controller and its dependencies
   *
   * @param {EffectsPanelController} viewMvc - the app that the controller can interact with
   */
  constructor(viewMvc: EffectsPanelApp) {
    this._viewMvc = viewMvc;
    // this._settings = new Settings();
    this._itemLights = viewMvc._itemLights;
  }

  get data() {
    return {
      enabledEffects: this._enabledEffects,
      disabledEffects: this._disabledEffects,
      tokenId: this._token?.id,
      actorId: this._actor?.id,
      isGM: game.user?.isGM
    };
  }

  get _enabledEffects() {
    // return this._actorEffects.filter((effectData) => !effectData.disabled);
    return this._itemLights.filter((effectData) => !effectData.disabled);
  }

  get _disabledEffects() {
    // return this._actorEffects.filter((effectData) => effectData.disabled);
    return this._itemLights.filter((effectData) => effectData.disabled);
  }

  // get _actorEffects() {
  //   const actor = this._actor;

  //   if (!actor) return [];

  //   const ligthseffects = []
  //   return actor.effects
  //     .map((effect:ActiveEffect) => {
  //       //@ts-ignore
  //       const effectData = effect.clone({}, { keepId: true }).data;
  //       effectData.remainingSeconds = this._getSecondsRemaining(
  //         effectData.duration
  //       );
  //       effectData.turns = effectData.duration.turns;
  //       effectData.isTemporary = effect.isTemporary;
  //       effectData.isExpired = effectData.remainingSeconds < 0;
  //       return effectData;
  //     })
  //     .sort((a, b) => {
  //       if (a.isTemporary) return -1;
  //       if (b.isTemporary) return 1;
  //       return 0;
  //     })
  //     // MOD 4535992 FILTER ONLY FOR ATL
  //     .filter((effectData) => {
  //       return (
  //         !!effectData.data.changes.find((effect) => effect.key.includes('ATL'))
  //       );
  //     })
  //     // END MOD 4535992
  //     .filter((effectData) => {
  //       return (
  //         // this._settings.showPassiveEffects || effectData.document.isTemporary
  //         this.showPassiveEffects || effectData.document.isTemporary
  //       );
  //     });
  // }

  async onIconRightClick(event) {
    const $target = $(event.currentTarget);
    const actor = this._actor;
    const effect = actor?.effects.get($target.attr('data-effect-id') ?? '');

    if (!effect) return;

    // if (effect.isTemporary) {
    //   await this._handleEffectChange(
    //     effect,
    //     // this._settings.temporaryEffectsRightClickBehavior
    //     this.temporaryEffectsRightClickBehavior
    //   );
    // } else {
    //   await this._handleEffectChange(
    //     effect,
    //     // this._settings.passiveEffectsRightClickBehavior
    //     this.passiveEffectsRightClickBehavior
    //   );
    // }
  }

  // async _handleEffectChange(effect, rightClickBehavior) {
  //   if (
  //     rightClickBehavior === CONSTANTS.RIGHT_CLICK_BEHAVIOR.DELETE_WITH_DIALOG
  //   ) {
  //     return Dialog.confirm({
  //       title: 'Delete Effect',
  //       content: `<h4>Delete ${effect.data.label}?</h4>`,
  //       yes: async () => {
  //         await effect.delete();
  //         this._viewMvc.refresh();
  //       },
  //     });
  //   } else if (
  //     rightClickBehavior === CONSTANTS.RIGHT_CLICK_BEHAVIOR.DELETE_IMMEDIATELY
  //   ) {
  //     await effect.delete();
  //     this._viewMvc.refresh();
  //   } else if (rightClickBehavior === CONSTANTS.RIGHT_CLICK_BEHAVIOR.DISABLE) {
  //     await effect.update({ disabled: !effect.data.disabled });
  //   }
  // }

  onIconClick(event) {
    const $target = $(event.currentTarget);
    const actor = this._actor;
    const effect = actor?.effects.get($target.attr('data-effect-id') ?? '');

    if (!effect) return;

    // MOD 4535992
    const lightDataDialog = this.retrieveDataFromHtml(event.currentTarget);
    if (!lightDataDialog) return;
    confirmDialogATLEffectItem(lightDataDialog).render(true);
    // END MOD 4535992
  }

  onIconDoubleClick(event) {
    const $target = $(event.currentTarget);
    // MOD 4535992
    const lightDataDialog = this.retrieveDataFromHtml(event.currentTarget);
    if (!lightDataDialog) return;
    // END MOD 4535992
    const actor = this._actor;
    const effect = actor?.effects.get($target.attr('data-effect-id') ?? '');

    if (!effect) return;

    effect.sheet.render(true);
  }

  get _actor() {
    return canvas.tokens?.controlled[0]?.actor ?? game.user?.character ?? null;
  }

  // MOD 4535992
  get _token() {
    return canvas.tokens?.controlled[0] ?? null;
  }
  // END MOD 4535992

  // TODO consider handling rounds/seconds/turns based on whatever is defined for the effect rather than do conversions
  _getSecondsRemaining(duration) {
    if (duration.seconds || duration.rounds) {
      const seconds = duration.seconds ?? duration.rounds * (CONFIG.time?.roundTime ?? 6);
      return duration.startTime + seconds - game.time.worldTime;
    } else {
      return Infinity;
    }
  }

  // MOD 4535992

  retrieveDataFromHtml(html): LightDataDialog | undefined {
    const lightDataDialog = new LightDataDialog();
    lightDataDialog.actorId = <string>$(html).attr('data-actor-id');
    lightDataDialog.tokenId = <string>$(html).attr('data-token-id');
    lightDataDialog.itemId = <string>$(html).attr('data-item-id');
    lightDataDialog.itemName = <string>$(html).attr('data-item-name');
    lightDataDialog.effectId = <string>$(html).attr('data-effect-id');
    lightDataDialog.effectName = <string>$(html).attr('data-effect-name');
    lightDataDialog.isApplied = <string>$(html).attr('data-applied') == 'true';

    if (!lightDataDialog.itemId) {
      warn(`No item id ${lightDataDialog.itemId} founded for the light hud`, true);
      return;
    }
    if (!lightDataDialog.effectId) {
      warn(`No active effect id ${lightDataDialog.effectId} founded for the light hud`, true);
      return;
    }
    if (!lightDataDialog.actorId) {
      warn(`No actor id ${lightDataDialog.actorId} founded for the light hud`, true);
      return;
    }

    const currentActor = game.actors?.get(lightDataDialog.actorId);
    if (!currentActor) {
      warn(`No actor founded with id ${lightDataDialog.actorId} for the light hud`, true);
      return;
    }

    const currentToken = canvas.tokens?.placeables?.find((t: Token) => t.id === lightDataDialog.tokenId);
    if (!currentToken) {
      warn(`No token founded with id ${lightDataDialog.tokenId} for the light hud`, true);
      return;
    }

    lightDataDialog.actorName = <string>currentActor.name;
    lightDataDialog.tokenName = <string>currentToken.name;
    return lightDataDialog;
  }

  // END MOD 4535992
}
