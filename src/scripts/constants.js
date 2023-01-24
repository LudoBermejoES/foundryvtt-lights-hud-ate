const CONSTANTS = {
    MODULE_NAME: "lights-hud-ate",
    PATH: `modules/lights-hud-ate/`,
    RIGHT_CLICK_BEHAVIOR: {
        DELETE_WITH_DIALOG: "delete-with-dialog",
        DELETE_IMMEDIATELY: "delete-immediately",
        DISABLE: "disable",
    },
    SECONDS: {
        IN_ONE_ROUND: 6,
        IN_ONE_MINUTE: 60,
        IN_TWO_MINUTES: 120,
        IN_ONE_HOUR: 3600,
        IN_TWO_HOURS: 7200,
        IN_ONE_DAY: 86400,
        IN_TWO_DAYS: 172800,
        IN_ONE_WEEK: 604800,
        IN_TWO_WEEKS: 1209600,
        IN_ONE_YEAR: 31536000,
        IN_TWO_YEARS: 63072000,
    },
};
CONSTANTS.PATH = `modules/${CONSTANTS.MODULE_NAME}/`;
export default CONSTANTS;
