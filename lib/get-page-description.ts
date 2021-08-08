import * as types from './types'
import { getPageProperty } from 'notion-utils'

export const getPageDescription = (
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null => getPageProperty('Description', block, recordMap)
