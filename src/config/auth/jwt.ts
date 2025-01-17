import * as jwt from 'jsonwebtoken'
import { env } from '../env/map-env-to-configuration'

const validateToken = (token: string) => {
  return jwt.verify(token, env.jwt.secret)
}

export { validateToken }
