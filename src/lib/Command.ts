import { EventEmitter } from 'events';
import CommandOptions from '../types/CommandOptions';
import Handler from './Handler'

const defaultOptions: CommandOptions = {
  name: null,
  aliases: [],
  requiredPermissions: null,
  botPermissions: 100,
  description: 'No description set.',
  disabled: true,
}

class Command {
  options: CommandOptions;
  handler: Handler;
  client: EventEmitter
  constructor(options: CommandOptions, handler: Handler, client: EventEmitter) {
    this.options = Object.assign(defaultOptions, options);
    this.handler = handler;
    this.client = client;
  };

  async run(message: any, args: string[]) {
    message.channel.send('This command does not have a specified run() function');
    return;
  }
};

export default Command;
