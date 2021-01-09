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
const fs_1 = require("fs");
const path_1 = require("path");
const defaultOptions = {
    defaultPrefix: '!',
    prefixes: new Map(),
    commandDir: 'commands',
    botPermissions: {}
};
class Handler {
    constructor(options, client) {
        this.options = Object.assign(defaultOptions, options);
        this.botPermissions = options.botPermissions;
        this.commands = new Map();
        this.aliases = new Map();
        this.client = client;
        this.loadCommands(path_1.resolve(this.options.commandDir));
        client.on('message', (m) => this.runMessage(m));
    }
    runMessage(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!msg || !msg.content)
                    return;
                const prefix = this.options.defaultPrefix;
                if (msg.content.startsWith(prefix)) {
                    const contentArray = msg.content.slice(prefix.length).split(' ').filter((e) => e);
                    const command = this.getCommand(contentArray);
                    if (command) {
                        try {
                            if (command.botPermissions) {
                                if (!this.botPermissions[command.botPermissions](msg, command))
                                    return;
                            }
                            if (command.cooldown) {
                                const cooldown = command.cooldown;
                                let userCooldown = this.cooldownBucket[`${msg.author.id}${command.name}`] || 0;
                                if (userCooldown > cooldown.bucket)
                                    return;
                                userCooldown++;
                                this.cooldownBucket[`${msg.author.id}${command.name}`] = userCooldown;
                                setTimeout(() => {
                                    this.cooldownBucket[`${msg.author.id}${command.name}`]--;
                                }, cooldown.time || 1000 * 60 * 1);
                            }
                            yield command.run(msg, contentArray.slice(1));
                            return;
                        }
                        catch (err) {
                            console.warn(err);
                            msg.channel.send(err);
                            return;
                        }
                    }
                    else
                        return;
                }
                else
                    return;
            }
            catch (err) {
                const response = {
                    embed: {
                        title: `Err: ${err}`
                    }
                };
                msg.channel.send(response).catch(console.log);
            }
        });
    }
    getCommand(content) {
        return this.aliases.get(content[0]) || this.commands.get(content[0]) || undefined;
    }
    loadCommands(dir) {
        fs_1.readdir(dir, (err, files) => {
            if (err)
                throw err;
            files.forEach(file => {
                const stat = fs_1.statSync(dir + '/' + file);
                if (stat.isDirectory())
                    return this.loadCommands(dir + '/' + file);
                else {
                    const path = dir + '/' + file;
                    try {
                        const command = new (require(path_1.resolve(path)))(this, this.client);
                        this.commands.set(command.name, command);
                        command.aliases.forEach((alias) => {
                            this.aliases.set(alias, command);
                        });
                        console.log('Loaded Command', command.name);
                        return true;
                    }
                    catch (err) {
                        console.warn(err);
                        return false;
                    }
                }
            });
        });
    }
}
exports.default = Handler;
