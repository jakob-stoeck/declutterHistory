let blockUrls = [];

// retrieve from options
chrome.storage.sync.get({
  urls: [],
}, function(items) {
  console.debug(items);
  blockUrls = items.urls.split("\n").filter(url => {
    return !(url == '' || url.startsWith('// '));  
  });
  console.debug(blockUrls);
});

function shouldBlock(url, blockUrls) {
  for (const burl of blockUrls) {
    if (url.startsWith(burl)) {
      return true;
    }
  }
  return false;
}

function onVisited(result) {
  if (shouldBlock(result.url, blockUrls)) {
    // Doesn’t affect navigation. It seems there is no way to remove the current session "go back" items?
    chrome.history.deleteUrl({url: result.url});
  }
}
chrome.history.onVisited.addListener(onVisited);

