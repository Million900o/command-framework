import { EventEmitter } from 'events';
import { readdir, statSync } from 'fs';
import { resolve } from 'path';

import HandlerOptions from '../types/HandlerOptions'
import Cooldown from '../types/CommandCooldown';

import Command from "./Command";

const defaultOptions: HandlerOptions = {
  defaultPrefix: '!',
  prefixes: new Map(),
  commandDir: 'commands',
  botPermissions: {}
}

class Handler {
  options: HandlerOptions;
  commands: Map<string, Command>;
  aliases: Map<string, Command>;
  client: EventEmitter;
  botPermissions: object;
  cooldownBucket: object;
  constructor(options: HandlerOptions, client: EventEmitter) {
    this.options = Object.assign(defaultOptions, options)
    this.botPermissions = options.botPermissions;
    this.commands = new Map();
    this.aliases = new Map();
    this.client = client;
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
            if (command.botPermissions) {
              if (this.botPermissions[command.botPermissions](msg, command)) return;
            }
            if(command.cooldown)  {
              const cooldown = command.cooldown as Cooldown;
              let userCooldown = this.cooldownBucket[`${msg.author.id}${command.name}`] || 0;
              if(userCooldown > cooldown.bucket) return;
              userCooldown++;
              this.cooldownBucket[`${msg.author.id}${command.name}`] = userCooldown
              setTimeout(() => {
                this.cooldownBucket[`${msg.author.id}${command.name}`]--;
              }, cooldown.time || 1000 * 60 * 1);
            }
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
          title: `Err: ${err}`
        }
      };
      msg.channel.send(response).catch(console.log);
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
            console.log('Loaded Command', command.name)
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
