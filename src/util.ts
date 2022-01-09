function combineURLs(baseURL: string, relativeURL: string) {
  return relativeURL ?
    baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') :
    baseURL;
}

export function getRedirectPath(path) {
  return combineURLs(process.env.S3_REDIRECT_URL ? process.env.S3_REDIRECT_URL : '/img/', path);
}
