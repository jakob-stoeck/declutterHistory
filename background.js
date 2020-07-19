function createUrlTrie(text) {
  const root = {};
  let curNode = root;
  for (c of text) {
    if (typeof curNode[c] === 'undefined') {
      curNode[c] = {};
    }
    curNode = c === "\n" ? root : curNode[c];
  }
  curNode["\n"] = {}; // needed in case of missing line feed at the end of text
  return root;
}

function trieContains(url, trie) {
  let curNode = trie;
  for (c of url) {
    if (typeof curNode[c] !== 'undefined') {
      curNode = curNode[c];
      if (curNode["\n"]) {
        return true;
      }
    }
  }
  return false;
}

var urls = {};

chrome.storage.sync.get("urls", items => {
  if (items.urls) {
    urls = createUrlTrie(items.urls);
  }
});

chrome.history.onVisited.addListener(result => {
  if (trieContains(result.url, urls)) {
    chrome.history.deleteUrl({url: result.url});
  }
});

/*
// TESTS

let t = `// One URL per line
// Matches all URLs beginning with this
// https://example.com/ matches all sub pages
https://example.com/
http://www.example.com`;

function assert(condition, message) {
  if (!condition) {
    message = message || "Assertion failed";
    if (typeof Error !== "undefined") {
      throw new Error(message);
    }
    throw message; // Fallback
  }
}

trie = createUrlTrie(t);
assert(trieContains('https://example.com/asdf"', trie) === true);
assert(trieContains('https://example.com/"', trie) === true);
assert(trieContains('https://example.com"', trie) === false);
assert(trieContains('http://www.example.com/asdf"', trie) === true);
assert(trieContains('com/login.action?"', trie) === false);
*/
