export class NotSupportedStateError extends Error {
  constructor(state: string) {
    super(`state '${state}' is not supported`);
  }

}