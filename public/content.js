// content.js
console.log("started content.js");

const isVisible = (element) => {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  const isNotDisplayed = style.display === "none";
  const isVisibilityHidden = style.visibility === "hidden";
  const isOpacityZero = parseFloat(style.opacity) === 0;

  return !isNotDisplayed && !isVisibilityHidden && !isOpacityZero;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Recieved message in content.js");
  if (request.action === "countH1Tags") {
    console.log("Counting H1 tags...");
    const h1Elements = document.querySelectorAll("h1");
    const h1Tags = Array.from(h1Elements).length;

    const h2Elements = document.querySelectorAll("h2");
    const h2Tags = Array.from(h2Elements).length;

    const h3Elements = document.querySelectorAll("h3");
    const h3Tags = Array.from(h3Elements).length;

    const h4Elements = document.querySelectorAll("h4");
    const h4Tags = Array.from(h4Elements).length;

    const h5Elements = document.querySelectorAll("h5");
    const h5Tags = Array.from(h5Elements).length;

    const h6Elements = document.querySelectorAll("h6");
    const h6Tags = Array.from(h6Elements).length;

    const title = document.title;

    const metaDescriptionTag = document.querySelector(
      'meta[name="description"]'
    );
    const description = metaDescriptionTag
      ? metaDescriptionTag.getAttribute("content")
      : "No meta description found";

    checkRobotsTxt().then((hasRobotsTxt) => {
      // Send the data back to the popup
      chrome.runtime.sendMessage({
        h1Tags,
        h2Tags,
        h3Tags,
        h4Tags,
        h5Tags,
        h6Tags,
        title,
        description,
        hasRobotsTxt
      });
    });
  }
});

const checkRobotsTxt = async () => {
  try {
    const domain = window.location.origin; // Get the current domain (like https://example.com)
    const robotsTxtUrl = `${domain}/robots.txt`;

    const response = await fetch(robotsTxtUrl);
    if (response.ok) {
      console.log("robots.txt found");
      return true;
    } else {
      console.log("robots.txt not found or inaccessible");
      return false;
    }
  } catch (error) {
    console.error("Error fetching robots.txt:", error);
    return false;
  }
};
