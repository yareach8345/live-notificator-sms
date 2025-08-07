import { RequiredEnvNotFoundError } from '../error/RequiredEnvNotFoundError'

export function getRequiredEnv(envName: string) {
  const env = process.env[envName];
  if (!env) {
    throw new RequiredEnvNotFoundError(envName)
  }
  return env
}