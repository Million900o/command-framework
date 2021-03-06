/// <reference types="node" />
import { EventEmitter } from 'events';
import CommandOptions from '../types/CommandOptions';
import Cooldown from '../types/CommandCooldown';
import Handler from './Handler';
declare class Command {
    options: CommandOptions;
    handler: Handler;
    client: EventEmitter;
    name: string;
    aliases: string[];
    requiredPermissions: string[] | null;
    botPermissions: number;
    description: string;
    disabled: boolean;
    cooldown: Cooldown | null;
    constructor(options: CommandOptions, handler: Handler, client: EventEmitter);
    run(message: any, args: string[]): Promise<void>;
}
export default Command;
