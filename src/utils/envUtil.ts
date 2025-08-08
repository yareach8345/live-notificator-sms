import { RequiredEnvNotFoundError } from '../error/RequiredEnvNotFoundError'

export function getRequiredEnv(envName: string) {
  const env = process.env[envName];
  if (!env) {
    throw new RequiredEnvNotFoundError(envName)
  }
  return env.trim()
}

export function getRequiredEnvs(envName: string, separator: string = ',') {
  const env = getRequiredEnv(envName)
  return env.split(separator).map(env => env.trim())
}