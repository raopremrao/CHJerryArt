// IndexNow API Submission Script
// This script submits your URLs to Bing (and other search engines) instantly

const urls = [
    'https://chjerryart.vercel.app/',
    'https://chjerryart.vercel.app/gallery'
];

const host = 'chjerryart.vercel.app';

// IndexNow endpoint (works for Bing, Yandex, and other participating search engines)
const indexNowUrl = 'https://api.indexnow.org/indexnow';

async function submitToIndexNow() {
    const payload = {
        host: host,
        key: 'your-api-key-here', // You need to generate this
        keyLocation: `https://${host}/your-api-key-here.txt`,
        urlList: urls
    };

    try {
        const response = await fetch(indexNowUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('✅ Successfully submitted URLs to IndexNow!');
            console.log('Status:', response.status);
        } else {
            console.log('❌ Submission failed');
            console.log('Status:', response.status);
            console.log('Response:', await response.text());
        }
    } catch (error) {
        console.error('Error submitting to IndexNow:', error);
    }
}

// Alternative: Simple GET request (easier method)
async function submitURLsSimple() {
    console.log('📤 Submitting URLs to IndexNow...\n');

    for (const url of urls) {
        // Using Bing's IndexNow endpoint with simple GET request
        const submitUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=your-api-key`;

        console.log(`Submitting: ${url}`);
        console.log(`You can also manually visit: ${submitUrl}\n`);
    }

    console.log('💡 Note: You need to set up an API key first.');
    console.log('Visit: https://www.bing.com/indexnow for setup instructions');
}

// Run the simple submission info
submitURLsSimple();
