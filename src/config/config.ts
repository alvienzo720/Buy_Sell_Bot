import 'dotenv/config'

export const ConfigParams = {
    API_KEY: process.env.API_KEY || "",
    API_SECRET: process.env.API_SECRET || "",
    TEST_NET: true,
    MAIN_URL: process.env.MAIN_URL || "",
    TOKEN: process.env.TOKEN || "",
    TELEGRAM_DELETE_MESSAGE_INTERVAL: 10,
    WHITELISTED_USERS: [541365365,1946478135],
    CHAT_ID:process.env.CHATID || ""
}
