import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [h1Count, setH1Count] = useState(0);
    const [pageTitle, setPageTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');

    useEffect(() => {
        const handleMessage = (message: { visibleH1Tags: number; title: string; description: string }) => {
            if (message.visibleH1Tags !== undefined) {
                setH1Count(message.visibleH1Tags);
                setPageTitle(message.title);
                setMetaDescription(message.description);
                console.log('Received message:', message);
            }
            console.log('Received message:', message);
        };

        chrome.runtime.onMessage.addListener(handleMessage);

        // Request the count of H1 tags when the popup opens
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab && activeTab.id !== undefined) {
                chrome.tabs.sendMessage(activeTab.id, { action: 'countH1Tags' });
            }
        });

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>H1 Tags: {h1Count}</h1>
            <h2>Page Title: {pageTitle}</h2>
            <h2>Meta Description: {metaDescription}</h2>
        </div>
    );
}

export default App;
