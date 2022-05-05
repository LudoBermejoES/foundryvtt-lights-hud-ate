import { convertToATLEffect, i18n, updateTokenLighting } from './lib/lib';
import CONSTANTS from './constants';
import { LightHUDNoteFlags, OptionSelectData } from './lights-hud-ate-models';
import { EffectSupport } from './effects/effect';
import API from './api';
export class LightHUDAteNote extends FormApplication {
  constructor(object, options) {
    super(object, options);
    //@ts-ignore
    this.entity.apps[this.appId] = this;
  }

  get entity(): any {
    return this.object;
  }

  // editor;
  // editorCondition;
  // editorSuccess;
  // editorFailure;

  static get defaultOptions() {
    const options = <any>super.defaultOptions;
    options.template = `modules/${CONSTANTS.MODULE_NAME}/templates/light-hud-ate-note.hbs`;
    options.width = '600';
    options.height = '700';
    options.classes = ['macro-sheet', 'sheet'];
    options.title = i18n(`${CONSTANTS.MODULE_NAME}.note.label`);
    options.resizable = true;
    options.editable = true;
    return options;
  }

  getData() {
    const data = <any>super.getData();

    // data.notes = this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.notes);
    data.flags = this.entity.data.flags;
    data.owner = game.user?.id;
    data.isGM = game.user?.isGM;
    data.img = this.entity.img;
    data.name = this.entity.name;
    data.id = this.entity.id;

    // Added 2022-05-05
    const visions:OptionSelectData[] = [];
    for(const vision of API.VISIONS){
      visions.push(
        {
          img: vision.img,
          id: vision.id,
          name: vision.name
        }
      );
    }
    data.visions = visions;

    const lights:OptionSelectData[] = [];
    for(const light of API.LIGHTS){
      lights.push(
        {
          img: light.img,
          id: light.id,
          name: light.name
        }
      );
    }
    data.lights = lights;
    
    const colorationTypes:OptionSelectData[] = [];
    colorationTypes.push(
      {
        img: '',
        id: 'none',
        name: 'None'
      }
    );
    for (const [k, v] of Object.entries(AdaptiveLightingShader.COLORATION_TECHNIQUES)) {
      const name = game.i18n.localize(v.label);
      const id = String(v.id);
      const img = '';
      colorationTypes.push(
        {
          img: img,
          id: id,
          name: name
        }
      );
    }
    data.colorationTypes = colorationTypes;

    const animationTypes:OptionSelectData[] = [];
    animationTypes.push(
      {
        img: '',
        id: 'none',
        name: 'None'
      }
    );
    for (const [k, v] of Object.entries(CONFIG.Canvas.lightAnimations)) {
      const name = game.i18n.localize(v.label);
      const id = String(k.toLocaleLowerCase());
      const img = '';

      animationTypes.push(
        {
          img: img,
          id: id,
          name: name
        }
      );
    }
    data.animationTypes = animationTypes;

  // TODO to integrate

  // if (game.modules.get('CommunityLighting')?.active) {
  //   animationTypes += `
  //     <optgroup label= "Blitz" id="animationType">
  //       <option value="BlitzFader"
  //         ${animation.type === 'BlitzFader' ? 'selected' : ''}>Fader
  //       </option>
  //       <option value="BlitzLightning"
  //         ${animation.type === 'BlitzLightning' ? 'selected' : ''}>Lightning (experimental)
  //       </option>
  //       <option value="BlitzElectric Fault"
  //         ${animation.type === 'BlitzElectric Fault' ? 'selected' : ''}>Electrical Fault</option>
  //       <option value="BlitzSimple Flash"
  //         ${animation.type === 'BlitzSimple Flash' ? 'selected' : ''}>Simple Flash
  //       </option>
  //       <option value="BlitzRBG Flash"
  //         ${animation.type === 'BlitzRBG Flash' ? 'selected' : ''}>RGB Flash
  //       </option>
  //       <option value="BlitzPolice Flash"
  //         ${animation.type === 'BlitzPolice Flash' ? 'selected' : ''}>Police Flash
  //       </option>
  //       <option value="BlitzStatic Blur"
  //         ${animation.type === 'BlitzStatic Blur' ? 'selected' : ''}>Static Blur
  //       </option>
  //       <option value="BlitzAlternate Torch"
  //         ${animation.type === 'BlitzAlternate Torch' ? 'selected' : ''}>Alternate Torch
  //       </option>
  //       <option value="BlitzBlurred Torch"
  //         ${animation.type === 'BlitzBlurred Torch' ? 'selected' : ''}>Blurred Torch
  //       </option>
  //       <option value="BlitzGrid Force-Field Colorshift"
  //         ${animation.type === 'BlitzGrid Force-Field Colorshift' ? 'selected' : ''}>Grid Force-Field Colorshift
  //       </option>
  //     </optgroup>
  //     <optgroup label="SecretFire" id="animationType">
  //       <option value="SecretFireGrid Force-Field"
  //         ${animation.type === 'SecretFireGrid Force-Field' ? 'selected' : ''}>Grid Force-Field
  //       </option>
  //       <option value="SecretFireSmoke Patch"
  //         ${animation.type === 'SecretFireSmoke Patch' ? 'selected' : ''}>Smoke Patch
  //       </option>
  //       <option value="SecretFireStar Light"
  //         ${animation.type === 'SecretFireStar Light' ? 'selected' : ''}>Star Light
  //       </option>
  //       <option value="SecretFireStar Light Disco"
  //         ${animation.type === 'SecretFireStar Light Disco' ? 'selected' : ''}>Star Light Disco
  //       </option>
  //     </optgroup>
  // `;
  // }
    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // html.find('.moveToNote').click(ev => this._moveToNotes());
    // html.find('.moveToDescription').click(ev => this._moveToDescription());
    // html.find('.ei-info').click((ev) => this._showInfo());

    /*
    if (game.modules.get('acelib')?.active) {

      this.editor = this._addAceLibEditorToElement(html, `div.form-group.stacked.command.${LightHUDNoteFlags.notes}`, this.entity.id, LightHUDNoteFlags.notes);
      this.editorCondition = this._addAceLibEditorToElement(
        html,
        `div.form-group.stacked.command.${LightHUDNoteFlags.notescondition}`,
        this.entity.id,
        LightHUDNoteFlags.notescondition, //"flags.environment-interaction.notes-condition",
      );
      this.editorSuccess = this._addAceLibEditorToElement(
        html,
        `div.form-group.stacked.command.${LightHUDNoteFlags.notessuccess}`,
        this.entity.id,
        LightHUDNoteFlags.notessuccess, //"flags.environment-interaction.notes-success",
      );
      this.editorFailure = this._addAceLibEditorToElement(
        html,
        `div.form-group.stacked.command.${LightHUDNoteFlags.notesfailure}`,
        this.entity.id,
        LightHUDNoteFlags.notesfailure, //"flags.environment-interaction.notes-failure",
      );
    }
    */
    //html.find('[data-toggle="tooltip"]').tooltip();
  }

  async _updateObject(event, formData) {
    if (game.user?.isGM) {
      const effectIcon = this.entity.data.img || this.entity.data.data.img;

      let applyAsAtlEffect = false;

      const applyAsAtlAte = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.APPLY_AS_ATL_ATE}`];
      if (applyAsAtlAte != null && applyAsAtlAte != undefined) {
        applyAsAtlEffect = true;
      } else {
        applyAsAtlEffect = false;
      }

      const enable = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.ENABLE}`];
      if (enable != null && enable != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ENABLE, enable);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ENABLE, null);
      }

      const lightAnimationIntensity =
        formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.ANIMATION_INTENSITY}`];
      if (lightAnimationIntensity != null && lightAnimationIntensity != undefined) {
        await this.entity.setFlag(
          CONSTANTS.MODULE_NAME,
          LightHUDNoteFlags.ANIMATION_INTENSITY,
          lightAnimationIntensity,
        );
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_INTENSITY, null);
      }

      const lightAnimationReverse = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.ANIMATION_REVERSE}`];
      if (lightAnimationReverse != null && lightAnimationReverse != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_REVERSE, lightAnimationReverse);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_REVERSE, null);
      }

      const lightAnimationSpeed = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.ANIMATION_SPEED}`];
      if (lightAnimationSpeed != null && lightAnimationSpeed != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_SPEED, lightAnimationSpeed);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_SPEED, null);
      }

      const lightAnimationType = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.ANIMATION_TYPE}`];
      if (lightAnimationType != null && lightAnimationType != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_TYPE, lightAnimationType);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_TYPE, null);
      }

      const duration = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.DURATION}`];
      if (duration != null && duration != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.DURATION, duration);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.DURATION, null);
      }

      const height = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.HEIGHT}`];
      if (height != null && height != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HEIGHT, height);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HEIGHT, null);
      }

      const lightAlpha = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_ALPHA}`];
      if (lightAlpha != null && lightAlpha != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ALPHA, lightAlpha);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ALPHA, null);
      }

      const lightAngle = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_ANGLE}`];
      if (lightAngle != null && lightAngle != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ANGLE, lightAngle);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ANGLE, null);
      }

      const brightLight = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_BRIGHT}`];
      if (brightLight != null && brightLight != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_BRIGHT, brightLight);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_BRIGHT, null);
      }

      const lightColor = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_COLOR}`];
      if (lightColor != null && lightColor != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLOR, lightColor);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLOR, null);
      }

      const lightColoration = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_COLORATION}`];
      if (lightColoration != null && lightColoration != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLORATION, lightColoration);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLORATION, null);
      }

      const lightContrast = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_CONTRAST}`];
      if (lightContrast != null && lightContrast != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_CONTRAST, lightContrast);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_CONTRAST, null);
      }

      const dimLight = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_DIM}`];
      if (dimLight != null && dimLight != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_DIM, dimLight);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_DIM, null);
      }

      const lightGradual = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_GRADUAL}`];
      if (lightGradual != null && lightGradual != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_GRADUAL, lightGradual);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_GRADUAL, null);
      }

      const lightLuminosity = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_LUMINOSITY}`];
      if (lightLuminosity != null && lightLuminosity != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_LUMINOSITY, lightLuminosity);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_LUMINOSITY, null);
      }

      const lightSaturation = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_SATURATION}`];
      if (lightSaturation != null && lightSaturation != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SATURATION, lightSaturation);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SATURATION, null);
      }

      const lightShadows = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_SHADOWS}`];
      if (lightShadows != null && lightShadows != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SHADOWS, lightShadows);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SHADOWS, null);
      }

      const lightSource = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_SOURCE}`];
      if (lightSource != null && lightSource != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SOURCE, lightSource);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SOURCE, null);
      }

      const lockRotation = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LOCK_ROTATION}`];
      if (lockRotation != null && lockRotation != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LOCK_ROTATION, lockRotation);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LOCK_ROTATION, null);
      }

      const effectName = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.NAME}`];
      if (effectName != null && effectName != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.NAME, effectName);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.NAME, null);
      }

      const scale = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.SCALE}`];
      if (scale != null && scale != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SCALE, scale);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SCALE, null);
      }

      const sightAngle = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.SIGHT_ANGLE}`];
      if (sightAngle != null && sightAngle != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_ANGLE, sightAngle);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_ANGLE, null);
      }

      const brightSight = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.SIGHT_BRIGHT}`];
      if (brightSight != null && brightSight != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_BRIGHT, brightSight);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_BRIGHT, null);
      }

      const dimSight = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.SIGHT_DIM}`];
      if (dimSight != null && dimSight != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_DIM, dimSight);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_DIM, null);
      }

      const visionType = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.VISION_TYPE}`];
      if (visionType != null && visionType != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.VISION_TYPE, visionType);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.VISION_TYPE, null);
      }

      const width = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.WIDTH}`];
      if (width != null && width != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.WIDTH, width);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.WIDTH, null);
      }

      if (applyAsAtlEffect) {
        const efffectAtlToApply = convertToATLEffect(
          //lockRotation,
          dimSight,
          brightSight,
          sightAngle,
          dimLight,
          brightLight,
          lightColor,
          lightAlpha,
          lightAngle,

          lightColoration,
          lightLuminosity,
          lightGradual,
          lightSaturation,
          lightContrast,
          lightShadows,

          lightAnimationType,
          lightAnimationSpeed,
          lightAnimationIntensity,
          lightAnimationReverse,

          // applyAsAtlEffect,
          effectName,
          effectIcon,
          duration,

          // vision,
          // id,
          // name,
          height,
          width,
          scale,
        );
        efffectAtlToApply.customId = <string>this.entity?.id;

        const origin = `Item.${this.entity.id}`;
        efffectAtlToApply.origin = origin;
        efffectAtlToApply.overlay = false;
        const activeEffectData = EffectSupport.convertToActiveEffectData(efffectAtlToApply);
        await this.entity.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);
      }

      this.render();
    } else {
      ui.notifications?.error('You have to be GM to edit LightHUD+ATE Notes.');
    }
  }

  _retrieveVal(configElement, flagname) {
    return configElement.find(`[name="${flagname}"]`).val();
  }

  static _initEntityHook(app, html, data) {
    if (!app?.object) {
      return;
    }
    if (game.user?.isGM) {
      const labelTxt = '';
      const labelStyle = '';
      const title = i18n(`${CONSTANTS.MODULE_NAME}.note.label`);
      const lightHUDEnabled = 
        app.object.document
        ? app.object.document.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ENABLE)
        : app.object.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ENABLE);
      
      // if (game.settings.get(CONSTANTS.MODULE_NAME, 'hideLabel') === false) {
      //   labelTxt = ' ' + title;
      // }
      // if (game.settings.get(CONSTANTS.MODULE_NAME, 'colorLabel') === true && notes) {
      //   labelStyle = "style='color:green;'";
      // }

      // const openBtn = $(`<a class="lights-hud-ate-interaction-note" title="${title}" ${labelStyle} ><i class="fas fa-gripfire${notes ? '-check' : ''}"></i>${labelTxt}</a>`);
      let openBtn;
      if (lightHUDEnabled) {
        openBtn = $(`<a class="lights-hud-ate-interaction-note" title="${title}" ${labelStyle} >
          <i class="fas fa-gripfire"></i>${labelTxt}</a>`);
      } else {
        openBtn = $(`<a class="lights-hud-ate-interaction-note" title="${title}" ${labelStyle} >
          <i class="fas fa-fire"></i>${labelTxt}</a>`);
      }
      openBtn.click((ev) => {
        let noteApp: any = null;
        for (const key in app.object.apps) {
          const obj = app.object.apps[key];
          if (obj instanceof LightHUDAteNote) {
            noteApp = obj;
            break;
          }
        }
        if (!noteApp) {
          noteApp = new LightHUDAteNote(app.object, {
            submitOnClose: true,
            closeOnSubmit: false,
            submitOnUnfocus: true,
          });
        }
        noteApp.render(true);
      });
      html.closest('.app').find('.lights-hud-ate-interaction-note').remove();
      const titleElement = html.closest('.app').find('.window-title');
      openBtn.insertAfter(titleElement);
    }
  }

  async close(...args) {
    super.close(...args);
    /*
    if (this.editor) {
      this.editor.destroy();
    }
    if (this.editorCondition) {
      this.editorCondition.destroy();
    }
    if (this.editorSuccess) {
      this.editorSuccess.destroy();
    }
    if (this.editorFailure) {
      this.editorFailure.destroy();
    }
    */
  }
}
