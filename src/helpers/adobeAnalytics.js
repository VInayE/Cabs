export const adobeAnalyticsPageView = (pagename, LOB, pagetype, primarycategory, subcategory1, subcategory2, subcategory3) => {
  let pageViewObj = {
    page: {
      pageInfo: {
        pageName: pagename,
        lob: LOB,
        sessionID: getSessionID('sessionID') !== '' ? getSessionID : '',
        platform: 'PWA'
      },
      category: {
        pageType: pagetype,
        primaryCategory: primarycategory,
        subCategory1: subcategory1,
        subCategory2: subcategory2,
        subCategory3: subcategory3
      }
    }
  }
  yt_adobe.addDigitalData(pageViewObj)
  yt_adobe.track('virtualPageView', pageViewObj)
}

function getSessionID (key) {
  var regex, matches
  regex = new RegExp('[; ]' + key + '=([^\\s;]*)')
  matches = (' ' + document.cookie).match(regex)
  if (key && matches) {
    return unescape(matches[1])
  }
  return ''
}
