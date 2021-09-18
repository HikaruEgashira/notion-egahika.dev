import * as config from './config'
import * as types from './types'

export const getSite = async (): Promise<types.Site | null> => {
  return {
    domain: config.domain,
    name: config.name,
    description: config.description,
    rootNotionPageId: config.rootNotionPageId,
    rootNotionSpaceId: config.rootNotionSpaceId
  } as types.Site
}
