function createUrlList(text) {
  const urls = text.split("\n").filter(url => {
    return !(url == '' || url.startsWith('//'));
  });
  console.debug(urls);
  return urls;
}

function contains(url, urls) {
  for (const u of urls) {
    if (url.startsWith(u)) {
      return true;
    }
  }
  return false;
}

// Doesn’t affect navigation. It seems there is no way to remove the current session "go back" items?
function init(items) {
  const urls = createUrlList(items.urls);
  chrome.history.onVisited.addListener(result => {
    if (contains(result.url, urls)) {
      chrome.history.deleteUrl({url: result.url});
    }
  });
};

chrome.storage.sync.get("urls", init);
