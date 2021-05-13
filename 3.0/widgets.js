(function (script) {
  const { affiliateId, sku, type, targetElements } = script.dataset;
  const sourceUrl = new URL(script.src);

  function loadFonts() {
    if (document.querySelector(`link[data-role="bs-font-link"]`)) return;

    const head = document.querySelector('head');
    head.insertAdjacentHTML(
      'beforeend',
      `<link href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,400,500&display=swap" rel="stylesheet" data-role="bs-font-link">`
    );
    head.insertAdjacentHTML(
      'beforeend',
      `<link href="https://fonts.googleapis.com/css?family=PT+Serif&display=swap" rel="stylesheet" data-role="bs-font-link">`
    );
  }

  function makeBookWidget(node) {
    fetch(`${sourceUrl.origin}/widgets/book/${type}/${affiliateId}/${sku}`)
      .then(r => r.text())
      .then(text => (node.shadowRoot.innerHTML = text));
  }

  function makeSearchWidget(node) {
    fetch(`${sourceUrl.origin}/widgets/search/${affiliateId}`)
      .then(r => r.text())
      .then(text => (node.shadowRoot.innerHTML = text));
  }

  function makeWidget(node) {
    loadFonts();

    node.attachShadow({ mode: 'open' });

    switch (type) {
      case 'book':
      case 'book_button':
        makeBookWidget(node);
        break;
      case 'search':
        makeSearchWidget(node);
        break;
    }
  }

  function renderWidgetToTargetElements() {
    // Added support for loading widget to target elements by providing
    // data-target-element attribute in script tag
    // data-target-element can be any selector like id, class etc.
    // ex: data-target-element='.class-name, #elementID'
    const targetNodes = document.querySelectorAll(targetElements);
    if (targetNodes.length > 0) {
      targetNodes.forEach(targetNode => {
        const node = document.createElement('div');
        targetNode.append(node);
        makeWidget(node);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (targetElements) {
      renderWidgetToTargetElements();
    } else {
      const node = document.createElement('div');
      script.after(node);
      makeWidget(node);
    }
  });
})(document.currentScript);
