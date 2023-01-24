import { checkNumberFromString, error, i18n } from "./lib/lib.js";
import CONSTANTS from "./constants.js";
import { LightHUDNoteFlags } from "./lights-hud-ate-models.js";
import API from "./api.js";
import { aemlApiLigthsHudAte } from "./module.js";
export class LightHUDAteNote extends FormApplication {
    constructor(object, options) {
        super(object, options);
        // @ts-ignore
        this.entity.apps[this.appId] = this;
    }
    get entity() {
        return this.object;
    }
    // Editor;
    // editorCondition;
    // editorSuccess;
    // editorFailure;
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = `modules/${CONSTANTS.MODULE_NAME}/templates/light-hud-ate-note.hbs`;
        options.width = "600";
        options.height = "700";
        options.classes = ["macro-sheet", "sheet"];
        options.title = i18n(`${CONSTANTS.MODULE_NAME}.note.label`);
        options.resizable = true;
        options.editable = true;
        return options;
    }
    getData() {
        const data = super.getData();
        // Data.notes = this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.notes);
        data.flags = this.entity.flags;
        data.owner = game.user?.id;
        data.isGM = game.user?.isGM;
        data.imgitem = this.entity.img;
        data.nameitem = this.entity.name;
        data.iditem = this.entity.id;
        data.isATEActive = game.settings.get(CONSTANTS.MODULE_NAME, "applyOnATEItem") ?? false;
        // Added 2022-05-05
        const visions = [];
        for (const vision of API.VISIONS) {
            visions.push({
                img: vision.img,
                id: vision.id,
                name: vision.name
            });
        }
        data.visions = visions;
        const lights = [];
        for (const light of API.LIGHTS) {
            lights.push({
                img: light.img,
                id: light.id,
                name: light.name
            });
        }
        data.lights = lights;
        const colorationTypes = [];
        colorationTypes.push({
            img: "",
            id: "none",
            name: "None"
        });
        // @ts-ignore
        for (const [k, v] of Object.entries(AdaptiveLightingShader.SHADER_TECHNIQUES)) {
            // @ts-ignore
            const name = game.i18n.localize(v.label);
            // @ts-ignore
            const id = String(v.id);
            const img = "";
            colorationTypes.push({
                img: img,
                id: id,
                name: name
            });
        }
        data.colorationTypes = colorationTypes;
        const animationTypes = [];
        animationTypes.push({
            img: "",
            id: "none",
            name: "None"
        });
        for (const [k, v] of Object.entries(CONFIG.Canvas.lightAnimations)) {
            const name = game.i18n.localize(v.label);
            const id = String(k.toLocaleLowerCase());
            const img = "";
            animationTypes.push({
                img: img,
                id: id,
                name: name
            });
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
        // CONTROL CONFIGURATION
        const useBasic = getProperty(data, `flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.USE_BASIC}`);
        const useAdvanced = getProperty(data, `flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.USE_ADVANCED}`);
        if (!useBasic && !useAdvanced) {
            setProperty(data, `flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.USE_BASIC}`, true);
        }
        return data;
    }
    activateListeners(html) {
        super.activateListeners(html);
        // Html.find('.moveToNote').click(ev => this._moveToNotes());
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
        // html.find('[data-toggle="tooltip"]').tooltip();
    }
    async _updateObject(event, formData) {
        if (game.user?.isGM) {
            const enable = $(`input[name="flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.ENABLE}"]`).is(":checked");
            if (enable !== null && enable !== undefined && enable) {
                await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ENABLE, enable);
            }
            else {
                await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ENABLE, null);
            }
            const useBasic = $(`input[name="flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.USE_BASIC}"]`).is(":checked");
            const useAdvanced = $(`input[name="flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.USE_ADVANCED}"]`).is(":checked");
            if (useAdvanced && useBasic) {
                error("You can't enabled both basic and adavnced configuration", true);
                throw new Error("You can't enabled both basic and adavnced configuration");
            }
            if (!useAdvanced && !useBasic) {
                error("You can't disabled both basic and adavnced configuration", true);
                throw new Error("You can't disabled both basic and adavnced configuration");
            }
            if (useBasic !== null && useBasic !== undefined && useBasic) {
                await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC, useBasic);
            }
            else {
                await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC, null);
            }
            if (useAdvanced !== null && useAdvanced !== undefined && useAdvanced) {
                await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_ADVANCED, useAdvanced);
            }
            else {
                await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_ADVANCED, null);
            }
            // ===========================================================================================
            if (useBasic) {
                // ======================================================================================
                // BASIC SETTING
                // ======================================================================================
                const visionType = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.VISION_TYPE}`];
                if (visionType !== null && visionType !== undefined && visionType) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.VISION_TYPE, visionType);
                    for (const vision of API.VISIONS) {
                        if (vision.id === visionType) {
                            await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_BRIGHT_BASIC, vision.brightSight);
                            await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_DIM_BASIC, vision.dimSight);
                            await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_ANGLE_BASIC, vision.sightAngle);
                            break;
                        }
                    }
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.VISION_TYPE, null);
                }
                const lightSource = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_SOURCE}`];
                if (lightSource !== null && lightSource !== undefined && lightSource) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SOURCE, lightSource);
                    for (const light of API.LIGHTS) {
                        if (light.id === lightSource) {
                            await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_BRIGHT_BASIC, light.brightLight);
                            await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_DIM_BASIC, light.dimLight);
                            await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ALPHA_BASIC, light.lightAlpha);
                            await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ANGLE_BASIC, light.lightAngle);
                            await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_LUMINOSITY, light.lightAnimationIntensity);
                            await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_SPEED, light.lightAnimationSpeed);
                            await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_TYPE, light.lightAnimationType);
                            await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLOR_BASIC, light.lightColor);
                            await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LOCK_ROTATION, light.lockRotation);
                            break;
                        }
                    }
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SOURCE, null);
                }
                const lightColorBasic = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_COLOR_BASIC}`];
                if (lightColorBasic !== null
                    && lightColorBasic !== undefined
                    && lightColorBasic !== "#000000"
                    && lightColorBasic) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLOR_BASIC, lightColorBasic);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLOR_BASIC, null);
                }
                const lightAlphaBasic = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_ALPHA_BASIC}`];
                if (lightAlphaBasic !== null
                    && lightAlphaBasic !== undefined
                    && lightAlphaBasic > 0
                    && lightAlphaBasic) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ALPHA_BASIC, lightAlphaBasic);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ALPHA_BASIC, null);
                }
            }
            else {
                // ======================================================================================
                // ADVANCED SETTING
                // ======================================================================================
                const lightAnimationIntensity = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.ANIMATION_INTENSITY}`];
                if (lightAnimationIntensity !== null
                    && lightAnimationIntensity !== undefined
                    && lightAnimationIntensity) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_INTENSITY, lightAnimationIntensity);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_INTENSITY, null);
                }
                const lightAnimationReverse = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.ANIMATION_REVERSE}`];
                if (lightAnimationReverse !== null && lightAnimationReverse !== undefined && lightAnimationReverse) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_REVERSE, lightAnimationReverse);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_REVERSE, null);
                }
                const lightAnimationSpeed = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.ANIMATION_SPEED}`];
                if (lightAnimationSpeed !== null && lightAnimationSpeed !== undefined && lightAnimationSpeed) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_SPEED, lightAnimationSpeed);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_SPEED, null);
                }
                const lightAnimationType = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.ANIMATION_TYPE}`];
                if (lightAnimationType !== null && lightAnimationType !== undefined && lightAnimationType) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_TYPE, lightAnimationType);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_TYPE, null);
                }
                const duration = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.DURATION}`];
                if (duration !== null && duration !== undefined && duration) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.DURATION, duration);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.DURATION, null);
                }
                const height = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.HEIGHT}`];
                if (height !== null && height !== undefined && height) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HEIGHT, height);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HEIGHT, null);
                }
                const lightAlpha = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_ALPHA}`];
                if (lightAlpha !== null && lightAlpha !== undefined && lightAlpha) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ALPHA, lightAlpha);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ALPHA, null);
                }
                const lightAngle = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_ANGLE}`];
                if (lightAngle !== null && lightAngle !== undefined && lightAngle) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ANGLE, lightAngle);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ANGLE, null);
                }
                const brightLight = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_BRIGHT}`];
                if (brightLight !== null && brightLight !== undefined && brightLight) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_BRIGHT, brightLight);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_BRIGHT, null);
                }
                const lightColor = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_COLOR}`];
                if (lightColor !== null && lightColor !== undefined && lightColor !== "#000000" && lightColor) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLOR, lightColor);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLOR, null);
                }
                const lightColoration = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_COLORATION}`];
                if (lightColoration !== null && lightColoration !== undefined && lightColoration) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLORATION, lightColoration);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLORATION, null);
                }
                const lightContrast = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_CONTRAST}`];
                if (lightContrast !== null && lightContrast !== undefined && lightContrast) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_CONTRAST, lightContrast);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_CONTRAST, null);
                }
                const dimLight = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_DIM}`];
                if (dimLight !== null && dimLight !== undefined && dimLight) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_DIM, dimLight);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_DIM, null);
                }
                const lightGradual = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_GRADUAL}`];
                if (lightGradual !== null && lightGradual !== undefined && lightGradual) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_GRADUAL, lightGradual);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_GRADUAL, null);
                }
                const lightLuminosity = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_LUMINOSITY}`];
                if (lightLuminosity !== null && lightLuminosity !== undefined && lightLuminosity) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_LUMINOSITY, lightLuminosity);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_LUMINOSITY, null);
                }
                const lightSaturation = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_SATURATION}`];
                if (lightSaturation !== null && lightSaturation !== undefined && lightSaturation) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SATURATION, lightSaturation);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SATURATION, null);
                }
                const lightShadows = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LIGHT_SHADOWS}`];
                if (lightShadows !== null && lightShadows !== undefined && lightShadows) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SHADOWS, lightShadows);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SHADOWS, null);
                }
                const scale = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.SCALE}`];
                if (scale !== null && scale !== undefined && scale) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SCALE, scale);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SCALE, null);
                }
                const sightAngle = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.SIGHT_ANGLE}`];
                if (sightAngle !== null && sightAngle !== undefined && sightAngle) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_ANGLE, sightAngle);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_ANGLE, null);
                }
                const brightSight = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.SIGHT_BRIGHT}`];
                if (brightSight !== null && brightSight !== undefined && brightSight) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_BRIGHT, brightSight);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_BRIGHT, null);
                }
                const dimSight = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.SIGHT_DIM}`];
                if (dimSight !== null && dimSight !== undefined && dimSight) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_DIM, dimSight);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_DIM, null);
                }
                const width = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.WIDTH}`];
                if (width !== null && width !== undefined && width) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.WIDTH, width);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.WIDTH, null);
                }
            }
            // ======================================================================================
            // COMMON SETTING
            // ======================================================================================
            const effectIcon = this.entity.img || "";
            let applyAsAtlAte = false;
            if (game.settings.get(CONSTANTS.MODULE_NAME, "applyOnATEItem")) {
                applyAsAtlAte = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.APPLY_AS_ATL_ATE}`];
                if (applyAsAtlAte !== null && applyAsAtlAte !== undefined) {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.APPLY_AS_ATL_ATE, applyAsAtlAte);
                }
                else {
                    await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.APPLY_AS_ATL_ATE, null);
                }
            }
            const effectName = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.NAME}`] ?? this.entity.name;
            if (effectName !== null && effectName !== undefined && effectName) {
                await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.NAME, effectName);
            }
            else {
                await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.NAME, null);
            }
            const lockRotation = formData[`flags.${CONSTANTS.MODULE_NAME}.${LightHUDNoteFlags.LOCK_ROTATION}`];
            if (lockRotation !== null && lockRotation !== undefined && lockRotation) {
                await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LOCK_ROTATION, lockRotation);
            }
            else {
                await this.entity.setFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LOCK_ROTATION, null);
            }
            if (applyAsAtlAte) {
                const effectName = this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.NAME) || this.entity.name;
                const height = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.HEIGHT)));
                const width = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.WIDTH)));
                const scale = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SCALE)));
                let brightSight = null;
                if (this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
                    brightSight = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_BRIGHT_BASIC)));
                }
                else {
                    brightSight = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_BRIGHT)));
                }
                // If (!brightSight || brightSight === 0) {
                //   brightSight = tokenData.brightSight;
                // }
                let dimSight = null;
                if (this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
                    dimSight = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_DIM_BASIC)));
                }
                else {
                    dimSight = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_DIM)));
                }
                // If (!dimSight || dimSight === 0) {
                //   dimSight = tokenData.dimSight;
                // }
                let sightAngle = null;
                if (this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
                    sightAngle = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_ANGLE_BASIC)));
                }
                else {
                    sightAngle = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.SIGHT_ANGLE)));
                }
                // If (!sightAngle || sightAngle === 0) {
                //   sightAngle = tokenData.sightAngle;
                // }
                let dimLight = null;
                if (this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
                    dimLight = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_DIM_BASIC)));
                }
                else {
                    dimLight = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_DIM)));
                }
                // If (!dimLight || dimLight === 0) {
                //   dimLight = tokenData.light.dim;
                // }
                let brightLight = null;
                if (this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
                    brightLight = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_BRIGHT_BASIC)));
                }
                else {
                    brightLight = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_BRIGHT)));
                }
                // If (!brightLight || brightLight === 0) {
                //   brightLight = tokenData.light.bright;
                // }
                let lightColor = null;
                if (this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
                    lightColor = (this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLOR_BASIC));
                }
                else {
                    lightColor = this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLOR);
                }
                // If (!lightColor || lightColor === '#000000') {
                //   lightColor = <string>tokenData.light.color;
                // }
                let lightAlpha = null;
                if (this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
                    lightAlpha = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ALPHA_BASIC)));
                }
                else {
                    lightAlpha = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ALPHA)));
                }
                // If (!lightAlpha || lightAlpha === 0) {
                //   lightAlpha = tokenData.alpha;
                // }
                let lightAngle = null;
                if (this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.USE_BASIC)) {
                    lightAngle = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ANGLE_BASIC)));
                }
                else {
                    lightAngle = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_ANGLE)));
                }
                // If (!lightAngle || lightAngle === 0) {
                //   lightAngle = tokenData.sightAngle;
                // }
                const lightAnimationType = (this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_TYPE));
                const lightAnimationSpeed = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_SPEED)));
                const lightAnimationIntensity = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_INTENSITY)));
                const lightAnimationReverse = (this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ANIMATION_REVERSE));
                const lightColoration = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_COLORATION)));
                const lightLuminosity = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_LUMINOSITY)));
                const lightGradual = (this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_GRADUAL));
                const lightSaturation = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SATURATION)));
                const lightContrast = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_CONTRAST)));
                const lightShadows = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.LIGHT_SHADOWS)));
                const vision = true; //!!(dimSight > 0 || brightSight > 0);
                const duration = (checkNumberFromString(this.entity.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.DURATION))) || 0;
                // TODO
                const alpha = null;
                // TODO
                const sightEnabled = true;
                // TODO
                const sightVisionMode = "";
                const efffectAtlToApply = await aemlApiLigthsHudAte.convertToATLEffect(
                // LockRotation,
                sightEnabled, dimSight, brightSight, sightAngle, sightVisionMode, dimLight, brightLight, lightColor, lightAlpha, lightAngle, lightColoration, lightLuminosity, lightGradual, lightSaturation, lightContrast, lightShadows, lightAnimationType, lightAnimationSpeed, lightAnimationIntensity, lightAnimationReverse, effectName, effectIcon, duration, height, width, scale, alpha);
                efffectAtlToApply.customId = this.entity?.id;
                efffectAtlToApply.origin = await aemlApiLigthsHudAte.prepareOriginFromEntity(this.entity);
                // Const origin = `Item.${this.entity.id}`;
                // efffectAtlToApply.origin = origin;
                efffectAtlToApply.overlay = false;
                // @ts-ignore
                const activeEffectData = EffectSupport.convertToActiveEffectData(efffectAtlToApply);
                // EffectOwnedItem.createEffectOnOwnedItem(activeEffectData,<Item>this.entity);
                // await this.entity.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);
                // await item.update({effects: [new ActiveEffect().toObject()]})
                await this.entity.update({
                    effects: [activeEffectData]
                });
            }
            this.render();
        }
        else {
            error("You have to be GM to edit LightHUD+ATE Notes.", true);
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
            const labelTxt = "";
            const labelStyle = "";
            const title = i18n(`${CONSTANTS.MODULE_NAME}.note.label`);
            const lightHUDEnabled = app.object.document
                ? app.object.document.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ENABLE)
                : app.object.getFlag(CONSTANTS.MODULE_NAME, LightHUDNoteFlags.ENABLE);
            // If (game.settings.get(CONSTANTS.MODULE_NAME, 'hideLabel') === false) {
            //   labelTxt = ' ' + title;
            // }
            // if (game.settings.get(CONSTANTS.MODULE_NAME, 'colorLabel') === true && notes) {
            //   labelStyle = "style='color:green;'";
            // }
            // const openBtn = $(`<a class="lights-hud-ate-interaction-note" title="${title}" ${labelStyle} ><i class="fas fa-gripfire${notes ? '-check' : ''}"></i>${labelTxt}</a>`);
            let openBtn;
            if (lightHUDEnabled) {
                openBtn = $(`<a class="lights-hud-ate-interaction-note" title="${title}" ${labelStyle} >
          <i class="fas fa-fire"></i>${labelTxt}</a>`);
            }
            else {
                openBtn = $(`<a class="lights-hud-ate-interaction-note" title="${title}" ${labelStyle} >
          <i class="fas fa-fire-alt"></i>${labelTxt}</a>`);
            }
            openBtn.click(ev => {
                let noteApp = null;
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
                        submitOnUnfocus: true
                    });
                }
                noteApp.render(true);
            });
            html.closest(".app").find(".lights-hud-ate-interaction-note").remove();
            const titleElement = html.closest(".app").find(".window-title");
            openBtn.insertAfter(titleElement);
        }
    }
    async close(...args) {
        super.close(...args);
    }
}
