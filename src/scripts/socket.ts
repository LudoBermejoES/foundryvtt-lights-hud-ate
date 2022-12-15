import CONSTANTS from "./constants";
import API from "./api";
import { debug } from "./lib/lib";
import { setSocket } from "../main";

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
