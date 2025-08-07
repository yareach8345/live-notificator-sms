export class RequiredEnvNotFoundError extends Error {
  constructor(envName: string) {
    super(`required environment variables '${envName}' is not defined`)
  }
}