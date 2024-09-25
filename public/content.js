// content.js
console.log("started content.js")

const isVisible = (element) => {
    if (!element) return false;
    const style = window.getComputedStyle(element);
    const isNotDisplayed = style.display === 'none';
    const isVisibilityHidden = style.visibility === 'hidden';
    const isOpacityZero = parseFloat(style.opacity) === 0;
    const rect = element.getBoundingClientRect();
    const isOffScreen = rect.width === 0 || rect.height === 0 || rect.bottom < 0 || rect.right < 0;

    return !isNotDisplayed && !isVisibilityHidden && !isOpacityZero && !isOffScreen;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'countH1Tags') {
        const h1Elements = document.querySelectorAll('h1');
        const visibleH1Tags = Array.from(h1Elements).filter(isVisible).length;

        const title = document.title;

        const metaDescriptionTag = document.querySelector('meta[name="description"]');
        const description = metaDescriptionTag ? metaDescriptionTag.getAttribute('content') : 'No meta description found';

        // Send the data back to the popup
        chrome.runtime.sendMessage({
            visibleH1Tags,
            title,
            description
        });
    }
});