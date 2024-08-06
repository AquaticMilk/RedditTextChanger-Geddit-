function replaceText(find, replace) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
  let node;

  while (node = walker.nextNode()) {
    if (node.nodeType === Node.TEXT_NODE && !isInsideInputOrTextarea(node)) {
      node.nodeValue = node.nodeValue.replace(new RegExp(find, 'gi'), replace);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.shadowRoot) {
      replaceTextInShadowDOM(node.shadowRoot, find, replace);
    }
  }
}

function replaceTextInShadowDOM(shadowRoot, find, replace) {
  const shadowWalker = document.createTreeWalker(shadowRoot, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
  let shadowNode;

  while (shadowNode = shadowWalker.nextNode()) {
    if (shadowNode.nodeType === Node.TEXT_NODE) {
      shadowNode.nodeValue = shadowNode.nodeValue.replace(new RegExp(find, 'gi'), replace);
    } else if (shadowNode.nodeType === Node.ELEMENT_NODE && shadowNode.shadowRoot) {
      replaceTextInShadowDOM(shadowNode.shadowRoot, find, replace);
    }
  }
}

function isInsideInputOrTextarea(node) {
  while (node) {
    if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA' || node.isContentEditable) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function replaceWords() {
  replaceText('\\bshare\\b', 'spreddit');
  replaceText('\\bdelete\\b', 'shreddit');
  replaceText('\\bkarma\\b', 'creddit');
}

const observer = new MutationObserver((mutations) => {
  let shouldReplace = false;
  for (const mutation of mutations) {
    if (mutation.type === 'childList' || mutation.type === 'subtree') {
      shouldReplace = true;
      break;
    }
  }
  if (shouldReplace) {
    replaceWords();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

replaceWords();
