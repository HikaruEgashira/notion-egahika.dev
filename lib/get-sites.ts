import { getSite } from './get-site'
import * as types from './types'

export const getSites = async (): Promise<types.Site[]> => {
  return [await getSite()]
}
