import { i18n } from './lib/lib';
import CONSTANTS from './constants';
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

    // data.notes = this.entity.getFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notes);
    data.flags = this.entity.data.flags;
    data.owner = game.user?.id;
    data.isGM = game.user?.isGM;
    data.img = this.entity.img;
    data.name = this.entity.name;
    data.id = this.entity.id;

    // Added 2022-05-05
    // TODO INSERIRE I DATI DELLE OPTIONS


    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // html.find('.moveToNote').click(ev => this._moveToNotes());
    // html.find('.moveToDescription').click(ev => this._moveToDescription());
    // html.find('.ei-info').click((ev) => this._showInfo());

    /*
    if (game.modules.get('acelib')?.active) {

      this.editor = this._addAceLibEditorToElement(html, `div.form-group.stacked.command.${EnvironmentInteractionFlags.notes}`, this.entity.id, EnvironmentInteractionFlags.notes);
      this.editorCondition = this._addAceLibEditorToElement(
        html,
        `div.form-group.stacked.command.${EnvironmentInteractionFlags.notescondition}`,
        this.entity.id,
        EnvironmentInteractionFlags.notescondition, //"flags.environment-interaction.notes-condition",
      );
      this.editorSuccess = this._addAceLibEditorToElement(
        html,
        `div.form-group.stacked.command.${EnvironmentInteractionFlags.notessuccess}`,
        this.entity.id,
        EnvironmentInteractionFlags.notessuccess, //"flags.environment-interaction.notes-success",
      );
      this.editorFailure = this._addAceLibEditorToElement(
        html,
        `div.form-group.stacked.command.${EnvironmentInteractionFlags.notesfailure}`,
        this.entity.id,
        EnvironmentInteractionFlags.notesfailure, //"flags.environment-interaction.notes-failure",
      );
    }
    */
    //html.find('[data-toggle="tooltip"]').tooltip();
  }

  async _updateObject(event, formData) {
    if (game.user?.isGM) {
      const useei = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notesuseei}`];
      if (useei != null && useei != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesuseei, useei);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesuseei, null);
      }

      const useitemmacro = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notesuseitemmacro}`];
      if (useitemmacro != null && useitemmacro != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesuseitemmacro, useitemmacro);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesuseitemmacro, null);
      }

      const useitemenvironment = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notesuseitemenvironment}`];
      if (useitemenvironment != null && useitemenvironment != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesuseitemenvironment, useitemenvironment);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesuseitemenvironment, null);
      }

      const useasmacro = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notesuseasmacro}`];
      if (useasmacro != null && useasmacro != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesuseasmacro, useasmacro);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesuseasmacro, null);
      }

      const detail = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notesdetail}`];
      if (detail != null && detail != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesdetail, detail);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesdetail, null);
      }

      const info = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notesinfo}`];
      if (info != null && info != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesinfo, info);
      } else {
        // await this.entity.setFlag(CONSTANTS.MODULE_NAME, Flags.notesinfo, null);
      }

      const explicitdc = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notesexplicitdc}`];
      if (explicitdc != null && explicitdc != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesexplicitdc, explicitdc);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesexplicitdc, null);
      }

      const notes = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notes}`];
      if (notes != null && notes != undefined) {
        if (useasmacro) {
          let macroUseAsMacro = notes;
          if (macroUseAsMacro && !macroUseAsMacro?.startsWith('return')) {
            macroUseAsMacro = 'return ' + macroUseAsMacro;
          }
          await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notes, macroUseAsMacro);
        } else {
          await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notes, notes);
        }
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notes, null);
      }

      const notesargs = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notesargs}`];
      if (notesargs != null && notesargs != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesargs, notesargs);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesargs, null);
      }

      const notescondition = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notescondition}`];
      if (notescondition != null && notescondition != undefined) {
        let macroCondition = notescondition;
        if (macroCondition && !macroCondition?.startsWith('return')) {
          macroCondition = 'return ' + macroCondition;
        }
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notescondition, macroCondition);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notescondition, null);
      }

      const notesconditionargs = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notesconditionargs}`];
      if (notesconditionargs != null && notesconditionargs != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesconditionargs, notesconditionargs);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesconditionargs, null);
      }

      const notessuccess = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notessuccess}`];
      if (notessuccess != null && notessuccess != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notessuccess, notessuccess);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notessuccess, null);
      }

      const notessuccessargs = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notessuccessargs}`];
      if (notessuccessargs != null && notessuccessargs != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notessuccessargs, notessuccessargs);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notessuccessargs, null);
      }

      const notesfailure = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notesfailure}`];
      if (notesfailure != null && notesfailure != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesfailure, notesfailure);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesfailure, null);
      }

      const notesfailureargs = formData[`flags.${CONSTANTS.MODULE_NAME}.${EnvironmentInteractionFlags.notesfailureargs}`];
      if (notesfailureargs != null && notesfailureargs != undefined) {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesfailureargs, notesfailureargs);
      } else {
        await this.entity.setFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesfailureargs, null);
      }

      this.render();
    } else {
      ui.notifications?.error('You have to be GM to edit Environment Interaction Notes.');
    }
  }

  _retrieveVal(configElement, flagname) {
    return configElement.find(`[name="${flagname}"]`).val();
  }

  static _initEntityHook(app, html, data) {
    if (!app?.object?.document) {
      return;
    }
    if (game.user?.isGM) {
      const labelTxt = '';
      const labelStyle = '';
      const title = i18n(`${CONSTANTS.MODULE_NAME}.note.label`);
      const notesuseei = app.object.document.getFlag(CONSTANTS.MODULE_NAME, EnvironmentInteractionFlags.notesuseei);
      // if (game.settings.get(CONSTANTS.MODULE_NAME, 'hideLabel') === false) {
      //   labelTxt = ' ' + title;
      // }
      // if (game.settings.get(CONSTANTS.MODULE_NAME, 'colorLabel') === true && notes) {
      //   labelStyle = "style='color:green;'";
      // }

      // const openBtn = $(`<a class="lights-hud-ate-interaction-note" title="${title}" ${labelStyle} ><i class="fas fa-gripfire${notes ? '-check' : ''}"></i>${labelTxt}</a>`);
      let openBtn;
      if (notesuseei) {
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
          noteApp = new LightHUDAteNote(app.object, { submitOnClose: true, closeOnSubmit: false, submitOnUnfocus: true });
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
