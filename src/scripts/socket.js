import CONSTANTS from "./constants.js";
import "./api.js";
import { debug } from "./lib/lib.js";
import { setSocket } from "../main.js";
export let lightHudAteSocket;
export function registerSocket() {
    debug("Registered lightHudAteSocket");
    if (lightHudAteSocket) {
        return lightHudAteSocket;
    }
    //@ts-ignore
    lightHudAteSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);
    setSocket(lightHudAteSocket);
    return lightHudAteSocket;
}
