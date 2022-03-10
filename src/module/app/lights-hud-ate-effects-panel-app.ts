import CONSTANTS from '../constants.js';
import EffectsPanelController from './lights-hud-ate-effects-panel-controller.js';
import { canvas, game } from '../settings';
import { LightDataHud } from '../lights-hud-ate-models.js';
import { getATLEffectsFromItem } from '../lights-hud-ate-config.js';
import { info, isStringEquals, retrieveItemLights, warn } from '../lib/lib.js';
import API from '../api.js';

/**
 * Application class for handling the UI of the effects panel
 */
export default class EffectsPanelApp extends Application {
  _controller: EffectsPanelController;
  refresh: any;
  _rootView;
  _itemLights: LightDataHud[];

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: 'lights-hud-ate-effects-panel',
      popOut: false,
      template: `modules/${CONSTANTS.MODULE_NAME}/templates/effects-panel.html`,
    });
  }

  /**
   * Initializes the application and its dependencies
   */
  constructor(itemLights) {
    super();
    // MOD 4535992
    this._itemLights = itemLights;
    // END MOD 4535992
    this._controller = new EffectsPanelController(this);
    /**
     * Debounce and slightly delayed request to re-render this panel. Necessary for situations where it is not possible
     * to properly wait for promises to resolve before refreshing the UI.
     */
    this.refresh = foundry.utils.debounce(this.render.bind(this), 100);
  }

  /** @override */
  getData(options) {
    return this._controller.data;
  }

  /** @override */
  activateListeners($html) {
    this._rootView = $html;

    this._icons.on('contextmenu', this._controller.onIconRightClick.bind(this._controller));
    this._icons.on('dblclick', this._controller.onIconDoubleClick.bind(this._controller));
    // MOD 4535992
    this._icons.on('click', this._controller.onIconClick.bind(this._controller));
    // END MOD 4535992
  }

  /**
   * Handles when the sidebar expands
   */
  handleExpand() {
    this.element.animate({ right: '310px' }, 150, () => {
      this.element.css({ right: '' });
    });
  }

  /**
   * Handles when the sidebar collapses
   */
  handleCollapse() {
    this.element.delay(250).animate({ right: '50px' }, 150);
  }

  /** @inheritdoc */
  async _render(force = false, options = {}) {
    await super._render(force, options);
    // if (ui.sidebar?._collapsed) {
    //   this.element.css('right', '50px');
    // }
  }

  get _icons() {
    return this._rootView.find('div[data-effect-id]');
  }
}
