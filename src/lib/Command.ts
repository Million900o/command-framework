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
  constructor(options: CommandOptions, Handler: Handler) {
    this.options = Object.assign(options, defaultOptions)
  };

  async run(message: any, args: string[]) {
    message.channel.send('This command does not have a specified run() function');
    return;
  }
};

export default Command;