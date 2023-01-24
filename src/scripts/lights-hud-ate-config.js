import CONSTANTS from "./constants.js";
import { info, prepareTokenDataDropTheTorch, retrieveItemLights, retrieveItemLightsStatic, warn, } from "./lib/lib.js";
import { confirmDialogATLEffectItem, confirmDialogDropTheTorch, customATLDialog, manageActiveEffectATL, manageFlaggedActorLightsStatic, manageFlaggedItem, presetDialog, } from "./lights-hud-ate-dialogs.js";
import { LightDataDialog } from "./lights-hud-ate-models.js";
// export function getATLEffectsFromItem(actor: Actor, item: Item): ActiveEffect[] {
//   // const atlChanges = effect.changes.filter((changes) =>
//   //     changes.key.startsWith('ATL')
//   // );
//   const im = <Item>actor.items.contents.find((i: Item) => {
//     return i.id === item.id;
//   });
//   if (!im) {
//     const atlEffects =
//       item.effects.filter((entity) => !!entity.changes.find((effect) => effect.key.includes('ATL'))) ?? [];
//     return atlEffects;
//   } else {
//     const atlEffects = im.effects.filter((entity) => {
//       return entity.changes.find((effect) => effect.key.includes('ATL')) != undefined;
//     });
//     return atlEffects;
//   }
// }
export function getATLEffectsFromItem(item) {
    // const atlChanges = effect.changes.filter((changes) =>
    //     changes.key.startsWith('ATL')
    // );
    const atlEffects = 
    //@ts-ignore
    item.effects.filter((entity) => !!entity.changes.find((effect) => effect.key.includes("ATL"))) ?? [];
    return atlEffects;
}
export async function addLightsHUDButtons(app, html, tokenData) {
    if (!game.settings.get(CONSTANTS.MODULE_NAME, "applyOnFlagItem") &&
        !game.settings.get(CONSTANTS.MODULE_NAME, "applyOnATEItem") &&
        !game.settings.get(CONSTANTS.MODULE_NAME, "enableLightHUDOldInterface")) {
        // error(`YOU MUST DECIDE OR LIGHTHUD WITH FLAGS OR LIGHTHUD WITH ATE EFFECTS !!!`, true);
        return;
    }
    const tokenInfoObject = app.object;
    // let tokenInfo = new tokenInformations(tokenInfoObject);
    const token = app.object;
    const tokenD = app.object.document;
    const actorId = tokenData.actorData?._id || tokenData.actorId;
    const actor = game.actors?.get(actorId);
    if (!actor) {
        info(`No actor id ${tokenData.actorId} founded for the light hud`);
        return;
    }
    const tokenId = tokenD.id;
    // const actorId = <string>actor.id;
    const imageDisplay = game.settings.get(CONSTANTS.MODULE_NAME, "imageDisplay");
    const imageOpacity = game.settings.get(CONSTANTS.MODULE_NAME, "imageOpacity") / 100;
    const isGM = game.user?.isGM;
    // ================================
    // OLD CODE
    //=================================
    const imagesParsed = await retrieveItemLights(token);
    if (game.settings.get(CONSTANTS.MODULE_NAME, "enableLightHUDOldInterface")) {
        const imagesParsed2 = await retrieveItemLightsStatic(token);
        imagesParsed.push(...imagesParsed2);
    }
    const wildcardDisplay = await renderTemplate(`/modules/${CONSTANTS.MODULE_NAME}/templates/artSelect.hbs`, {
        tokenId,
        actorId,
        isGM,
        imagesParsed,
        imageDisplay,
        imageOpacity,
    });
    // const is080 = !isNewerVersion('0.8.0', <string>game.version);
    const settingHudColClass = game.settings.get(CONSTANTS.MODULE_NAME, "hudColumn") ?? "left";
    const settingHudTopBottomClass = game.settings.get(CONSTANTS.MODULE_NAME, "hudTopBottom") ?? "top";
    const buttonPos = "." + settingHudColClass.toLowerCase();
    const col = html.find(buttonPos);
    if (settingHudTopBottomClass.toLowerCase() === "top") {
        col.prepend(wildcardDisplay);
    }
    else {
        col.append(wildcardDisplay);
    }
    col
        // html
        // .find('div.right')
        // .append(wildcardDisplay)
        .click((event) => {
        let activeButton, clickedButton, tokenButton;
        for (const button of html.find("div.control-icon")) {
            if (button.classList.contains("active"))
                activeButton = button;
            if (button === event.target.parentElement)
                clickedButton = button;
            if (button.dataset.action === "lights-hud-ate-selector")
                tokenButton = button;
        }
        if (clickedButton === tokenButton && activeButton !== tokenButton) {
            tokenButton.classList.add("active");
            if (settingHudColClass.toLowerCase() === "left") {
                // (<HTMLElement>html.find('.lights-hud-ate-selector-wrap')[0]).style.left = token.width + 150 + 'px';
                const offsetLeft = 
                //@ts-ignore
                token.width / token.document.texture.scaleX +
                    //@ts-ignore
                    token.width / (token.document.texture.scaleX * 2) +
                    //@ts-ignore
                    token.width / (token.document.texture.scaleX * 2);
                html.find(".lights-hud-ate-selector-wrap")[0].style.left =
                    token.width / 2 + offsetLeft + "px";
            }
            html.find(".lights-hud-ate-selector-wrap")[0]?.classList.add("active");
            const effectSelector = '[data-action="effects"]'; //is080 ? '[data-action="effects"]' : '.effects';
            html.find(`.control-icon${effectSelector}`)[0].classList.remove("active");
            html.find(".status-effects")[0].classList.remove("active");
        }
        else {
            tokenButton.classList.remove("active");
            html.find(".lights-hud-ate-selector-wrap")[0]?.classList.remove("active");
        }
    });
    const buttons = html.find(".lights-hud-ate-button-select");
    const buttonMacroPreset = $(html.find(".lights-hud-ate-button-macro-preset"));
    const buttonMacroCustom = $(html.find(".lights-hud-ate-button-macro-custom"));
    buttons.map((button) => {
        buttons[button]?.addEventListener("click", async function (event) {
            event.preventDefault();
            event.stopPropagation();
            const buttonClick = event.button; // 0 left click
            const lightDataDialog = retrieveDataFromHtml(this);
            if (lightDataDialog) {
                if (game.settings.get(CONSTANTS.MODULE_NAME, "skipDialogLightHUD")) {
                    if (lightDataDialog.isactoreffect) {
                        await manageActiveEffectATL(lightDataDialog.tokenId, 
                        // lightDataDialog.actorId,
                        lightDataDialog.itemId, lightDataDialog.effectId, lightDataDialog.effectName, lightDataDialog.isApplied);
                    }
                    else if (lightDataDialog.isflag) {
                        await manageFlaggedItem(lightDataDialog.tokenId, lightDataDialog.itemId);
                    }
                    else if (lightDataDialog.isflaglight) {
                        await manageFlaggedActorLightsStatic(lightDataDialog.tokenId, lightDataDialog.itemId);
                    }
                    // If open we force the close of the panel after the update
                    //$('.lights-hud-ate-selector-wrap').remove();
                    // $('.lights-hud-ate-selector-wrap')[0]?.classList.remove('active');
                    // $('[data-action=lights-hud-ate-selector]')[0]?.classList.remove('active');
                    const token = canvas.tokens?.placeables.find((t) => {
                        return t.id === lightDataDialog.tokenId;
                    });
                    token?.release();
                }
                else {
                    confirmDialogATLEffectItem(lightDataDialog).render(true);
                }
            }
        });
        buttons[button]?.addEventListener("contextmenu", async function (event) {
            event.preventDefault();
            event.stopPropagation();
            const buttonClick = event.button; // 0 left click
            const lightDataDialog = retrieveDataFromHtml(this);
            if (lightDataDialog) {
                if (game.settings.get(CONSTANTS.MODULE_NAME, "skipDialogLightHUD")) {
                    const token = canvas.tokens?.placeables.find((t) => {
                        return t.id === lightDataDialog.tokenId;
                    });
                    if (!token) {
                        warn(`No token found for the token with id '${lightDataDialog.tokenId}'`, true);
                        return;
                    }
                    if (!token.actor) {
                        warn(`No actor found for the token with id '${lightDataDialog.tokenId}'`, true);
                        return;
                    }
                    const actor = token?.actor;
                    // TODO SET UP ANIMATION ?? MAYBE IN SOME FUTURE RELEASE
                    // const animation = $(event.currentTarget.parentElement.parentElement)
                    // .find(".anim-dropdown")
                    // .val();
                    const duplicates = 1; // number od dropped light
                    const item = actor.items.get(lightDataDialog.itemId);
                    // let tokenDataDropTheTorch: any | null = null;
                    const newActorDropped = 
                    //@ts-ignore
                    await prepareTokenDataDropTheTorch(item, token.document.elevation ?? 0);
                    const tokenDataDropTheTorch = await newActorDropped.getTokenDocument();
                    //@ts-ignore
                    // actor.updateSource({ prototypeToken: tokenDataDropTheTorchTmp });
                    // tokenDataDropTheTorch = <any>await actor.getTokenDocument(tokenDataDropTheTorchTmp);
                    //@ts-ignore
                    // await actor.update({
                    // 	//@ts-ignore
                    // 	effects: tokenDataDropTheTorchTmp.actorData.effects
                    // });
                    //@ts-ignore
                    const posData = await warpgate.crosshairs.show({
                        size: 
                        //@ts-ignore
                        Math.max((Math.max(tokenDataDropTheTorch.width, tokenDataDropTheTorch.height) *
                            (tokenDataDropTheTorch.texture.scaleX + tokenDataDropTheTorch.texture.scaleY)) /
                            2, 0.5),
                        icon: `modules/${CONSTANTS.MODULE_NAME}/assets/black-hole-bolas.webp`,
                        label: `Drop the ${lightDataDialog.itemName}`,
                    });
                    //get custom data macro
                    const customTokenData = {};
                    //@ts-ignore
                    customTokenData.elevation = posData.z ?? token?.document?.elevation ?? 0;
                    Hooks.on("preCreateToken", (tokenDoc, td) => {
                        td ??= {};
                        //@ts-ignore
                        td.elevation = customTokenData.elevation;
                        //@ts-ignore
                        tokenDoc.updateSource({ elevation: customTokenData.elevation });
                    });
                    //@ts-ignore
                    warpgate.spawnAt({ x: posData.x, y: posData.y }, tokenDataDropTheTorch, customTokenData || {}, {}, { duplicates });
                    // await newActorDropped.delete();
                }
                else {
                    confirmDialogDropTheTorch(lightDataDialog).render(true);
                }
            }
        });
    });
    buttonMacroPreset.on("click", async function (event) {
        event.preventDefault();
        event.stopPropagation();
        const buttonClick = event.button; // 0 left click
        const actorId = $(this).attr("data-actor-id");
        const tokenId = $(this).attr("data-token-id");
        // A macro for the Foundry virtual tabletop that lets a user configure their token's vision and lighting settings.
        // This script is taken from Sky's foundry repo here: https://github.com/Sky-Captain-13/foundry/blob/master/scriptMacros/tokenVision.js.
        const applyChanges = false;
        presetDialog(applyChanges).render(true);
    });
    buttonMacroCustom.on("click", async function (event) {
        event.preventDefault();
        event.stopPropagation();
        const buttonClick = event.button; // 0 left click
        const actorId = $(this).attr("data-actor-id");
        const tokenId = $(this).attr("data-token-id");
        // A macro for the Foundry virtual tabletop that lets a user configure their token's vision and lighting settings.
        // This script is taken from Sky's foundry repo here: https://github.com/Sky-Captain-13/foundry/blob/master/scriptMacros/tokenVision.js.
        const applyChanges = false;
        //customDialog(applyChanges).render(true);
        customATLDialog(applyChanges).render(true);
    });
    // }
}
// ================================
// OLD CODE
//=================================
function retrieveDataFromHtml(html) {
    const lightDataDialog = new LightDataDialog();
    if (game.settings.get(CONSTANTS.MODULE_NAME, "imageDisplay")) {
        lightDataDialog.actorId = $(html).find(".lights-hud-ate-button-image").attr("data-actor-id");
        lightDataDialog.tokenId = $(html).find(".lights-hud-ate-button-image").attr("data-token-id");
        lightDataDialog.itemId = $(html).find(".lights-hud-ate-button-image").attr("data-item-id");
        lightDataDialog.itemName = $(html).find(".lights-hud-ate-button-image").attr("data-item-name");
        lightDataDialog.effectId = $(html).find(".lights-hud-ate-button-image").attr("data-effect-id");
        lightDataDialog.effectName = $(html).find(".lights-hud-ate-button-image").attr("data-effect-name");
        lightDataDialog.isApplied = $(html).find(".lights-hud-ate-button-image").attr("data-applied") == "true";
        lightDataDialog.disabled = $(html).find(".lights-hud-ate-button-image").attr("data-disabled") == "true";
        lightDataDialog.suppressed =
            $(html).find(".lights-hud-ate-button-image").attr("data-suppressed") == "true";
        lightDataDialog.temporary =
            $(html).find(".lights-hud-ate-button-image").attr("data-temporary") == "true";
        lightDataDialog.passive = $(html).find(".lights-hud-ate-button-image").attr("data-passive") == "true";
        lightDataDialog.isflag = $(html).find(".lights-hud-ate-button-image").attr("data-isflag") == "true";
        lightDataDialog.isactoreffect =
            $(html).find(".lights-hud-ate-button-image").attr("data-isactoreffect") == "true";
        lightDataDialog.isflaglight =
            $(html).find(".lights-hud-ate-button-image").attr("data-isflaglight") == "true";
    }
    else {
        lightDataDialog.actorId = $(html).find(".lights-hud-ate-button-image-text").attr("data-actor-id");
        lightDataDialog.tokenId = $(html).find(".lights-hud-ate-button-image-text").attr("data-token-id");
        lightDataDialog.itemId = $(html).find(".lights-hud-ate-button-image-text").attr("data-item-id");
        lightDataDialog.itemName = $(html).find(".lights-hud-ate-button-image-text").attr("data-item-name");
        lightDataDialog.effectId = $(html).find(".lights-hud-ate-button-image-text").attr("data-effect-id");
        lightDataDialog.effectName = $(html).find(".lights-hud-ate-button-image-text").attr("data-effect-name");
        lightDataDialog.isApplied =
            $(html).find(".lights-hud-ate-button-image-text").attr("data-applied") == "true";
        lightDataDialog.disabled =
            $(html).find(".lights-hud-ate-button-image-text").attr("data-disabled") == "true";
        lightDataDialog.suppressed =
            $(html).find(".lights-hud-ate-button-image-text").attr("data-suppressed") == "true";
        lightDataDialog.temporary =
            $(html).find(".lights-hud-ate-button-image-text").attr("data-temporary") == "true";
        lightDataDialog.passive =
            $(html).find(".lights-hud-ate-button-image-text").attr("data-passive") == "true";
        lightDataDialog.isflag =
            $(html).find(".lights-hud-ate-button-image-text").attr("data-isflag") == "true";
        lightDataDialog.isactoreffect =
            $(html).find(".lights-hud-ate-button-image-text").attr("data-isactoreffect") == "true";
        lightDataDialog.isflaglight =
            $(html).find(".lights-hud-ate-button-image-text").attr("data-isflaglight") == "true";
    }
    // NO NEED THIS CAN BE A FLAGGED ITEM
    // if (!lightDataDialog.effectId) {
    //   warn(`No active effect id ${lightDataDialog.effectId} founded for the light hud`, true);
    //   return;
    // }
    // NO NEED THIS CAN BE A ACTOR AE
    // if (!lightDataDialog.itemId) {
    //   warn(`No item id ${lightDataDialog.itemId} founded for the light hud`, true);
    //   return;
    // }
    if (!lightDataDialog.actorId) {
        warn(`No actor id ${lightDataDialog.actorId} founded for the light hud`, true);
        return;
    }
    const currentActor = game.actors?.get(lightDataDialog.actorId);
    if (!currentActor) {
        warn(`No actor founded with id ${lightDataDialog.actorId} for the light hud`, true);
        return;
    }
    const currentToken = canvas.tokens?.placeables?.find((t) => t.id === lightDataDialog.tokenId);
    if (!currentToken) {
        warn(`No token founded with id ${lightDataDialog.tokenId} for the light hud`, true);
        return;
    }
    lightDataDialog.actorName = currentActor.name;
    lightDataDialog.tokenName = currentToken.name;
    return lightDataDialog;
}
