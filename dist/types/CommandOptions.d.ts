import Cooldown from "./CommandCooldown";
interface CommandOptions {
    name: string;
    aliases: string[] | null;
    requiredPermissions: string[] | null;
    botPermissions: number;
    description: string;
    disabled: boolean;
    cooldown: Cooldown | null;
}
export default CommandOptions;
