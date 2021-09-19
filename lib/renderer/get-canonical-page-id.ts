import { ExtendedRecordMap } from 'notion-types'
import {
  parsePageId,
  getCanonicalPageId as getCanonicalPageIdImpl
} from 'notion-utils'

export const getCanonicalPageId = (
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | null => {
  const cleanPageId = parsePageId(pageId, { uuid: false })
  if (!cleanPageId) {
    return null
  }

  return getCanonicalPageIdImpl(pageId, recordMap, {
    uuid
  })
}
