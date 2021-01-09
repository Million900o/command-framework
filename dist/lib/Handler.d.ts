/// <reference types="node" />
import { EventEmitter } from 'events';
import HandlerOptions from '../types/HandlerOptions';
import Command from "./Command";
declare class Handler {
    options: HandlerOptions;
    commands: Map<string, Command>;
    aliases: Map<string, Command>;
    client: EventEmitter;
    botPermissions: object;
    constructor(options: HandlerOptions, client: EventEmitter);
    runMessage(msg: any): Promise<undefined>;
    getCommand(content: string[]): Command | undefined;
    loadCommands(dir: string): void;
}
export default Handler;
