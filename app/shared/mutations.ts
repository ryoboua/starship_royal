enum Mutations {
    SET_CLIENT = "SET_CLIENT",
    CREATE_GAME = "CREATE_GAME",
    JOIN_GAME = "JOIN_GAME",
    DISCONNECT = "disconnect",

    ADD_PLAYER = "ADD_PLAYER",
    REMOVE_PLAYER = "REMOVE_PLAYER",

    START_ROUND = "START_ROUND",
    END_ROUND = "END_ROUND",
    ROUND_ACTIVE = "ROUND_ACTIVE",
    GAME_ACTIVE = "GAME_ACTIVE",
    ROUND_OVER = "ROUND_OVER", //*****/

    KEY_DOWN = "KEY_DOWN",
    KEY_UP = "KEY_UP",

    SET_GAME_TYPE = "SET_GAME_TYPE",
    DISPLAY_MSG = "DISPLAY_MSG",

    GAME_STATE_UPDATE = "GAME_STATE_UPDATE",
    LOAD_LEVEL = "LOAD_LEVEL",
    PLAYER_DEAD = "PLAYER_DEAD",
    PLAYER_POSITION_UPDATE = "PLAYER_POSITION_UPDATE",

    COUNTDOWN = "COUNTDOWN",
    GAME_OVER = "GAME_OVER",

    RESET_GAME_STORE = "RESET_GAME_STORE",
    LEAVE_ROOM = "LEAVE_ROOM"
}

export default Mutations