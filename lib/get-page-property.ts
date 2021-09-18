import * as types from './types'
import { getPageProperty } from 'notion-utils'

export const getPageTweet = (
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null => {
  return getPageProperty('Tweet', block, recordMap)
}

export const getPageDescription = (
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null => getPageProperty('Description', block, recordMap)
