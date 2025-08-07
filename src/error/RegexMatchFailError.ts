export class RegexMatchFailError extends Error {
  constructor(originString: string, regex: RegExp) {
    super(`Failed to match the string '${originString}' with the regular expression '${regex}'`)
  }
}