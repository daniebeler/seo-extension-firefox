import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [h1Count, setH1Count] = useState(0);
  const [h2Count, setH2Count] = useState(0);
  const [h3Count, setH3Count] = useState(0);
  const [h4Count, setH4Count] = useState(0);
  const [h5Count, setH5Count] = useState(0);
  const [h6Count, setH6Count] = useState(0);
  const [pageTitle, setPageTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [domain, setDomain] = useState<string>("");

  useEffect(() => {
    const handleMessage = (message: {
      h1Tags: number;
      h2Tags: number;
      h3Tags: number;
      h4Tags: number;
      h5Tags: number;
      h6Tags: number;
      title: string;
      description: string;
    }) => {
      if (message.h1Tags !== undefined) {
        setH1Count(message.h1Tags);
        setH2Count(message.h2Tags);
        setH3Count(message.h3Tags);
        setH4Count(message.h4Tags);
        setH5Count(message.h5Tags);
        setH6Count(message.h6Tags);
        setPageTitle(message.title);
        setMetaDescription(message.description);
        console.log("Received message:", message);
      }
      console.log("Received message:", message);
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Request the count of H1 tags when the popup opens
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id !== undefined) {
        chrome.tabs.sendMessage(activeTab.id, { action: "countH1Tags" });
        const url = new URL(activeTab.url!);
        setDomain(url.hostname);
      }
    });

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <div className="p-5 w-[600px] bg-zinc-200">
      <section className="mb-10 p-4 w-full bg-white rounded-xl">
        <div>
          <div className="flex items-center">
            <h2 className="m-0 mr-2">Title</h2>

            {pageTitle.length >= 50 && pageTitle.length <= 60 && (
              <div className="bg-green-500 p-1 rounded-full text-sm">
                {pageTitle.length} characters
              </div>
            )}

            {(pageTitle.length < 50 || pageTitle.length > 60) && (
              <div className="bg-red-500 p-1 rounded-full text-sm">
                {pageTitle.length} characters
              </div>
            )}
          </div>

          <p>{pageTitle}</p>
        </div>

        <div>
          <div className="flex items-center">
            <h2 className="m-0 mr-2">Description</h2>

            {metaDescription.length >= 150 && metaDescription.length <= 170 && (
              <div className="bg-green-500 p-1 rounded-full text-sm">
                {metaDescription.length} characters
              </div>
            )}

            {(metaDescription.length < 150 || metaDescription.length > 170) && (
              <div className="bg-red-500 p-1 rounded-full text-sm">
                {metaDescription.length} characters
              </div>
            )}
          </div>

          <p>{metaDescription}</p>
        </div>
      </section>

      <section className="mb-10 p-4 w-full bg-white rounded-xl">
        <div className="flex">
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
        </div>
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
