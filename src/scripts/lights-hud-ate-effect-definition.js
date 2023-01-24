/**
 * Defines all of the effect definitions
 */
export class LightHUDAteEffectDefinitions {
    constructor() { }
    /**
     * Get all effects
     *
     * @returns {Effect[]} all the effects
     */
    static all() {
        const effects = [];
        // const torch = EffectDefinitions.torch();
        // if (torch) {
        //   effects.push(torch);
        // }
        return effects;
    }
    static effect(name) {
        const effectDefinition = LightHUDAteEffectDefinitions.all().find((effect) => {
            return effect.name.toLowerCase() === name.toLowerCase();
        });
        // if (effectDefinition?.customId == LightHUDPreset.TORCH) {
        //   return EffectDefinitions.torch();
        // }
        return undefined;
    }
}
