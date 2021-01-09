interface HandlerOptions {
    defaultPrefix: string;
    prefixes: Map<string, string>;
    commandDir: string;
    botPermissions: object;
}
export default HandlerOptions;
