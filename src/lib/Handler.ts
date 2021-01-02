import { EventEmitter } from 'events';

import HandlerOptions from '../types/HandlerOptions'

import Command from "./Command";

const defaultOptions: HandlerOptions = {
  defaultPrefix: '!',
  prefixes: new Map()
}

class Handler {
  options: HandlerOptions;
  commands: Map<string, Command>;
  alaises: Map<string, Command>;
  constructor(options: HandlerOptions, client: EventEmitter) {
    this.options = Object.assign(options, defaultOptions)
    client.on('message', this.runMessage);
  }

  async runMessage(msg: any): Promise<undefined> {
    if (!msg) return;
    const prefix = this.options.prefixes.get(msg.guild ? msg.guild.id : null) || this.options.defaultPrefix;
    if (msg.content.startsWith(prefix)) {
      const contentArray = msg.content.slice(prefix.length).split(' ').filter((e: string) => e)
      const command = this.getCommand(contentArray);
      if (command) {
        try {
          await command.run(msg, contentArray.slice(1));
          return;
        } catch (err) {
          console.warn(err);
          msg.channel.send(err)
          return;
        }
      } else return;
    } else return;
  }

  getCommand(content: string[]): Command | undefined {
    return this.alaises.get(content[0]) || this.commands.get(content[0]) || undefined;
  }
}

export default Handler;
