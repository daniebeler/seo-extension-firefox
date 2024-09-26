// content.js
console.log("started content.js");

const isVisible = (element) => {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  const isNotDisplayed = style.display === "none";
  const isVisibilityHidden = style.visibility === "hidden";
  const isOpacityZero = parseFloat(style.opacity) === 0;
  const rect = element.getBoundingClientRect();
  const isOffScreen =
    rect.width === 0 || rect.height === 0 || rect.bottom < 0 || rect.right < 0;

  return (
    !isNotDisplayed && !isVisibilityHidden && !isOpacityZero && !isOffScreen
  );
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  console.log("Recieved message in content.js");
  if (request.action === "countH1Tags") {

    console.log("Counting H1 tags...");
    const h1Elements = document.querySelectorAll("h1");
    const H1Tags = Array.from(h1Elements).filter(isVisible).length;

    const h2Elements = document.querySelectorAll("h2");
    const H2Tags = Array.from(h2Elements).filter(isVisible).length;

    const h3Elements = document.querySelectorAll("h3");
    const H3Tags = Array.from(h3Elements).filter(isVisible).length;

    const h4Elements = document.querySelectorAll("h4");
    const H4Tags = Array.from(h4Elements).filter(isVisible).length;

    const h5Elements = document.querySelectorAll("h5");
    const H5Tags = Array.from(h5Elements).filter(isVisible).length;

    const h6Elements = document.querySelectorAll("h6");
    const H6Tags = Array.from(h6Elements).filter(isVisible).length;

    const title = document.title;

    const metaDescriptionTag = document.querySelector(
      'meta[name="description"]'
    );
    const description = metaDescriptionTag
      ? metaDescriptionTag.getAttribute("content")
      : "No meta description found";

console.log("sending response")

    // Send the data back to the popup
    chrome.runtime.sendMessage({
      h1Tags: H1Tags,
      h2Tags: H2Tags,
      h3Tags: H3Tags,
      h4Tags: H4Tags,
      h5Tags: H5Tags,
      h6Tags: H6Tags,
      title,
      description,
    });
  }
});
