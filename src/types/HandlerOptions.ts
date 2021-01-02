interface HandlerOptions {
  defaultPrefix: string;
  prefixes: Map<string, string>;
  commandDir: string;
}

export default HandlerOptions;
