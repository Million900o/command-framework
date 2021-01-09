"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const defaultOptions = {
    name: null,
    aliases: [],
    requiredPermissions: null,
    botPermissions: 100,
    description: 'No description set.',
    disabled: true,
    cooldown: null,
};
class Command {
    constructor(options, handler, client) {
        // Options
        this.name = options.name;
        this.aliases = options.aliases;
        this.requiredPermissions = options.requiredPermissions;
        this.botPermissions = options.botPermissions;
        this.description = options.description;
        this.disabled = options.disabled;
        this.cooldown = options.cooldown;
        // Other
        this.handler = handler;
        this.client = client;
    }
    ;
    run(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            message.channel.send('This command does not have a specified run() function');
            return;
        });
    }
}
;
exports.default = Command;
