import { RequiredEnvNotFound } from '../error/RequiredEnvNotFound'

export function getRequiredEnv(envName: string) {
  const env = process.env[envName];
  if (!env) {
    throw new RequiredEnvNotFound(envName)
  }
  return env
}