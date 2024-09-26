import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [h1Count, setH1Count] = useState(0);
  const [h2Count, setH2Count] = useState(0);
  const [h3Count, setH3Count] = useState(0);
  const [h4Count, setH4Count] = useState(0);
  const [h5Count, setH5Count] = useState(0);
  const [h6Count, setH6Count] = useState(0);
  const [imgCount, setImgCount] = useState(0);
  const [aCount, setACount] = useState(0);
  const [pageTitle, setPageTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [domain, setDomain] = useState<string>("");
  const [robotsTxtExists, setRobotsTxtExists] = useState<boolean | null>(null);
  const [sitemapExists, setSitemapExists] = useState<boolean | null>(null);

  const [accordionOpen, setAccordionOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (message: {
      h1Tags: number;
      h2Tags: number;
      h3Tags: number;
      h4Tags: number;
      h5Tags: number;
      h6Tags: number;
      imgTags: number;
      aTags: number;
      title: string;
      description: string;
      hasRobotsTxt: boolean;
      hasSitemapXml: boolean;
    }) => {
      console.log("Message received in App.tsx:", message);
      if (message.h1Tags !== undefined) {
        setH1Count(message.h1Tags);
        setH2Count(message.h2Tags);
        setH3Count(message.h3Tags);
        setH4Count(message.h4Tags);
        setH5Count(message.h5Tags);
        setH6Count(message.h6Tags);
        setImgCount(message.imgTags);
        setACount(message.aTags);
        setPageTitle(message.title);
        setMetaDescription(message.description);
        setRobotsTxtExists(message.hasRobotsTxt);
        setSitemapExists(message.hasSitemapXml);
        console.log("Received message:", message);
      }
      console.log("Received message:", message);
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Request the count of H1 tags when the popup opens
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id !== undefined) {
        console.log("sending message to content script");
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "countH1Tags" },
          (response) => {
            console.log("Response received from content script:", response);
            handleMessage(response); // Handle the response in the callback
          }
        );
        const url = new URL(activeTab.url!);
        setDomain(url.hostname);
      }
    });

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen);
  };

  return (
    <div className="p-5 w-[600px] bg-zinc-200">
      <div className="py-4">
        <img src="/images/logo.svg" className="h-12" alt="" />
      </div>

      <section className="mb-10 p-4 w-full bg-white rounded-xl">
        <div>
          <div className="flex w-full items-center">
            <h2 className="m-0 mr-2 flex-1">Title</h2>

            {pageTitle.length >= 50 && pageTitle.length <= 60 && (
              <div className="bg-green-500 p-1 rounded-full text-sm text-white">
                {pageTitle.length} characters
              </div>
            )}

            {(pageTitle.length < 50 || pageTitle.length > 60) && (
              <div className="bg-red-500 p-1 rounded-full text-sm text-white">
                {pageTitle.length} characters
              </div>
            )}
          </div>

          <p>{pageTitle}</p>
        </div>

        <div className="mt-6">
          <div onClick={toggleAccordion} className="rounded-lg p-2 cursor-pointer hover:bg-zinc-200">
            <div className="flex w-full items-center">
              <h2 className="m-0 flex-1 mr-2">Description</h2>

              {metaDescription.length >= 150 &&
                metaDescription.length <= 170 && (
                  <div className="bg-green-500 p-1 rounded-full text-sm text-white">
                    {metaDescription.length} characters
                  </div>
                )}

              {(metaDescription.length < 150 ||
                metaDescription.length > 170) && (
                <div className="bg-red-500 p-1 rounded-full text-sm text-white">
                  {metaDescription.length} characters
                </div>
              )}
            </div>

            <p>{metaDescription}</p>
          </div>

          {accordionOpen && (
            <div className="mt-2 p-4 border rounded bg-gray-100">

              <ol>
                <li>Length: Aim for 150-160 characters to ensure the description displays fully in search results without being cut off.</li>
             
             <li>Keywords: Include relevant keywords naturally. This helps improve search visibility and aligns with user intent.</li>
             
             <li>Tone and Voice: Use a tone that resonates with your target audience, whether it's professional, casual, or technical.</li>
              </ol>
            </div>
          )}
        </div>
      </section>

      <section className="mb-10 p-4 w-full bg-white rounded-xl">
        <div className="flex justify-evenly">
          <div className="flex flex-col items-center mr-2">
            <h3>H1</h3>
            {h1Count}
          </div>

          <div className="flex flex-col items-center mr-2">
            <h3>H2</h3>
            {h2Count}
          </div>

          <div className="flex flex-col items-center mr-2">
            <h3>H3</h3>
            {h3Count}
          </div>

          <div className="flex flex-col items-center mr-2">
            <h3>H4</h3>
            {h4Count}
          </div>

          <div className="flex flex-col items-center mr-2">
            <h3>H5</h3>
            {h5Count}
          </div>

          <div className="flex flex-col items-center mr-2">
            <h3>H6</h3>
            {h6Count}
          </div>

          <div className="flex flex-col items-center mr-2">
            <h3>Images</h3>
            {imgCount}
          </div>

          <div className="flex flex-col items-center mr-2">
            <h3>Links</h3>
            {aCount}
          </div>
        </div>
      </section>

      <section className="mb-10 p-4 w-full bg-white rounded-xl">
        <h1>Robots.txt Status</h1>
        {robotsTxtExists === null ? (
          <p>Checking...</p>
        ) : robotsTxtExists ? (
          <p className="text-green-500">robots.txt exists on this site.</p>
        ) : (
          <p className="text-red-500">
            robots.txt does not exist on this site.
          </p>
        )}
      </section>

      <section className="mb-10 p-4 w-full bg-white rounded-xl">
        <h1>Sitemap Status</h1>
        {sitemapExists === null ? (
          <p>Checking...</p>
        ) : sitemapExists ? (
          <p className="text-green-500">Sitemap exists on this site.</p>
        ) : (
          <p className="text-red-500">Sitemap does not exist on this site.</p>
        )}
      </section>

      <section className="mb-10 p-4 w-full bg-white rounded-xl">
        <h1>View {domain} on:</h1>

        <div className="flex mb-3">
          <img
            src="/icons/logo-96.png"
            className="h-5 w-5 mr-2 items-center"
            alt=""
          />
          <a
            href={
              "https://pagespeed.web.dev/analysis?utm_source=psi&utm_medium=redirect&url=" +
              domain
            }
          >
            PageSpeed Insights
          </a>
        </div>

        <div className="flex mb-3">
          <img
            src="/icons/logo-96.png"
            className="h-5 w-5 mr-2 items-center"
            alt=""
          />
          <a href={"https://www.whois.com/whois/" + domain}>Whois</a>
        </div>
      </section>

      <div className="flex justify-center items-center">
        Developed with
        <img src="/icons/heart.svg" className="h-4 w-4 ml-1 mr-1" alt="" />
        by
        <a
          href="https://blacklemon.design"
          className="ml-1 hover:text-[#F7CE33]"
        >
          Black Lemon
        </a>
      </div>
    </div>
  );
}

export default App;
