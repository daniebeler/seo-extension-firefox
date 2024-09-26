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

    checkRobotsTxt().then(({ hasRobotsTxt, sitemapUrl }) => {
      console.log("robots resolved")
      checkSitemapXml(sitemapUrl).then((hasSitemapXml) => {
        console.log("sitemap resolves", sitemapUrl)
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
          hasRobotsTxt,
          hasSitemapXml,
        });
      });
    });
  }
});

const checkRobotsTxt = async () => {
  try {
    const domain = window.location.origin;
    var robotsTxtUrl = `${domain}/robots.txt`;

    robotsTxtUrl = ensureHttps(robotsTxtUrl);

    const response = await fetch(robotsTxtUrl);
    if (response.ok) {
      const robotsTxtContent = await response.text();
      console.log("robots.txt found");

      // Check for any Sitemap directive inside robots.txt
      const sitemapMatch = robotsTxtContent.match(/Sitemap:\s*(.+)/i);
      var sitemapUrl = sitemapMatch ? sitemapMatch[1].trim() : null;
      if (sitemapUrl) {
        sitemapUrl = ensureHttps(sitemapUrl);
      }
      return { hasRobotsTxt: true, sitemapUrl };
    } else {
      console.log("robots.txt not found or inaccessible");
      return { hasRobotsTxt: false, sitemapUrl: null };
    }
  } catch (error) {
    console.error("Error fetching robots.txt:", error);
    return { hasRobotsTxt: false, sitemapUrl: null };
  }
};

// Function to check if sitemap.xml exists at the default location
const checkSitemapXml = async (sitemapUrl) => {
  try {
    // If we already have a sitemap URL from robots.txt, use that, otherwise check the default location
    const domain = window.location.origin;
    const defaultSitemapUrl = sitemapUrl || `${domain}/sitemap.xml`;

    console.log("default stiemap url", defaultSitemapUrl)

    const response = await fetch(defaultSitemapUrl);
    if (response.ok) {
      console.log("Sitemap found at:", defaultSitemapUrl);
      return true;
    } else {
      console.log("Sitemap not found at:", defaultSitemapUrl);
      return false;
    }
  } catch (error) {
    console.error("Error fetching sitemap.xml:", error);
    return false;
  }
};


const ensureHttps = (url) => {
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};