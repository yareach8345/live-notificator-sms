export class NotSupportedMessageError extends Error {
  constructor(topic: string, detail: string = '') {
    super(`'${topic}' is not supported. ${detail}`);
  }
}