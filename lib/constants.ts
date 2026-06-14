export const SESSION_COOKIE_NAME = "auth-token"
export const SECRET_KEY = new TextEncoder().encode(process.env.SESSION_SECRET || "default_secret_key_change_me")
