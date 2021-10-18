declare module '@dnpr/cli' {
  enum FlagTypes {
    boolean = 'boolean',
    number = 'number',
    string = 'string',
    json = 'json',
  }

  function parseArgv(argv: string[]): {
    flags: string[]
    args: string[]
  }

  function parseFlagVal(
    flags: string[],
    findPrefix: string,
    valType: FlagTypes,
    defaultVal: unknown
  ): unknown
}
