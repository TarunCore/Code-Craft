interface LanguageMap {
    [key: string]: string;
}
export const BASE_URL = "http://localhost:3000";
export const BASE_WS_URL = "ws://localhost:3000";
export const LANGUAGE_MAP:LanguageMap = {
    js:"javascript",
    ts:"typescript",
    py:"python",
    cpp:"cpp"
}