import { EventEmitter } from 'events';
import { readdir, statSync } from 'fs';
import { resolve } from 'path';

import HandlerOptions from '../types/HandlerOptions'
import Logger from '../types/BasicLogger';

import Command from "./Command";

const defaultOptions: HandlerOptions = {
  defaultPrefix: '!',
  prefixes: new Map(),
  commandDir: 'commands',
  botPermissions: {},
  logger: {
    log: () => { },
    warn: () => { },
    error: () => { },
  }
}

class Handler {
  options: HandlerOptions;
  commands: Map<string, Command>;
  aliases: Map<string, Command>;
  client: EventEmitter;
  botPermissions: object;
  cooldownBucket: object;
  logger: Logger;
  constructor(options: HandlerOptions, client: EventEmitter) {
    this.options = Object.assign(defaultOptions, options)
    this.botPermissions = options.botPermissions;
    this.commands = new Map();
    this.aliases = new Map();
    this.client = client;
    this.cooldownBucket = {};
    this.logger = options.logger
    this.loadCommands(resolve(this.options.commandDir))
    client.on('message', (m) => this.runMessage(m));
  }

  async runMessage(msg: any): Promise<undefined> {
    try {
      if (!msg || !msg.content) return;
      const prefix = this.options.defaultPrefix;
      if (msg.content.startsWith(prefix)) {
        const contentArray = msg.content.slice(prefix.length).split(' ').filter((e: string) => e)
        const command = this.getCommand(contentArray);
        if (command) {
          try {
            if (command.botPermissions && !this.botPermissions[command.botPermissions](msg, command)) return;
            if (command.cooldown) {
              const cooldown = command.cooldown;
              let userCooldown = this.cooldownBucket[`${msg.author.id}${command.name}`] || [];
              if (userCooldown.length >= cooldown.bucket) {
                this.logger.log(`${msg.author.username} (${msg.author.id})`, 'triggered ratelimit for command', command.name)
                const cooldownTime = ((userCooldown[0] - Date.now()) / 1000).toFixed(2);
                const response = {
                  embed: {
                    title: `Slow down. You must wait ${cooldownTime}s to use this command again.`,
                    color: 0xFF0000
                  }
                }
                msg.reply(response)
                return;
              };
              userCooldown.push(Date.now() + cooldown.time);
              this.cooldownBucket[`${msg.author.id}${command.name}`] = userCooldown
              setTimeout(() => {
                this.cooldownBucket[`${msg.author.id}${command.name}`].length == 1 ? delete this.cooldownBucket[`${msg.author.id}${command.name}`] : this.cooldownBucket[`${msg.author.id}${command.name}`].shift();
              }, cooldown.time || 1000 * 60 * 1);
            }
            this.logger.log(`${msg.author.username} (${msg.author.id})`, 'ran command', command.name)
            await command.run(msg, contentArray.slice(1));
            return;
          } catch (err) {
            console.warn(err);
            msg.channel.send(err)
            return;
          }
        } else return;
      } else return;
    } catch (err) {
      const response = {
        embed: {
          title: `Err: ${err}`,
          color: 0xFF0000
        }
      };
      msg.reply(response).catch(console.log);
    }
  }

  getCommand(content: string[]): Command | undefined {
    return this.aliases.get(content[0]) || this.commands.get(content[0]) || undefined;
  }

  loadCommands(dir: string) {
    readdir(dir, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        const stat = statSync(dir + '/' + file)
        if (stat.isDirectory()) return this.loadCommands(dir + '/' + file);
        else {
          const path = dir + '/' + file;
          try {
            const command: Command = new (require(resolve(path)))(this, this.client);
            this.commands.set(command.name, command)
            command.aliases.forEach((alias: string) => {
              this.aliases.set(alias, command);
            })
            this.logger.log('Loaded Command', command.name)
            return true;
          } catch (err) {
            console.warn(err);
            return false;
          }
        }
      });
    })
  }
}

export default Handler;
