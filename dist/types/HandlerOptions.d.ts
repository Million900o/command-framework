import Logger from "./BasicLogger";
interface HandlerOptions {
    defaultPrefix: string;
    prefixes: Map<string, string>;
    commandDir: string;
    botPermissions: object;
    logger: Logger;
}
export default HandlerOptions;
