interface CommandOptions {
    name: string;
    aliases: string[] | null;
    requiredPermissions: string[] | null;
    botPermissions: number;
    description: string;
    disabled: boolean;
}
export default CommandOptions;
