import { REDIRECT_PATH } from './api'

export function getUrlPrefix() {
  const urlObj = new URL(window.location.href)
  return `${urlObj.protocol}//${urlObj.host}${REDIRECT_PATH}/`
}
