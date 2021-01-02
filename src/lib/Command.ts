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
  client: EventEmitter;
  // Options
  name: string;
  aliases: string[];
  requiredPermissions: string[] | null;
  botPermissions: number;
  description: string;
  disabled: boolean;
  constructor(options: CommandOptions, handler: Handler, client: EventEmitter) {
    // Options
    this.name = options.name;
    this.aliases = options.aliases;
    this.requiredPermissions = options.requiredPermissions;
    this.botPermissions = options.botPermissions;
    this.description = options.description;
    this.disabled = options.disabled;
    // Other
    this.handler = handler;
    this.client = client;
  };

  async run(message: any, args: string[]) {
    message.channel.send('This command does not have a specified run() function');
    return;
  }
};

export default Command;
