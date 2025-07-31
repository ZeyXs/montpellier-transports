import axios from 'axios';

const API_BASE_URL = 'https://cartographie.tam-voyages.com/gtfs';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'MontpellierTransports/1.0.0',
    'Referer': 'https://cartographie.tam-voyages.com/',
  },
});

// Function to fetch new API key
const fetchNewApiKey = async (): Promise<string | null> => {
  try {
    console.log('🔄 Fetching new API key...');

    // Fetch the homepage to get the new API key
    const response = await fetch('https://cartographie.tam-voyages.com/', {
      headers: {
        'User-Agent': 'MontpellierTransports/1.0.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const htmlText = await response.text();

    // Extract API key using regex (equivalent to the curl command)
    const apiKeyMatch = htmlText.match(/header-api-key[^>]*value="([^"]+)"/);

    if (apiKeyMatch && apiKeyMatch[1]) {
      const newKey = apiKeyMatch[1];
      console.log('✅ New API key obtained:', newKey.substring(0, 8) + '...');
      return newKey;
    } else {
      console.warn('⚠️ Could not find API key in response');
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to fetch new API key:', error);
    return null;
  }
};

// Function to update the API key in the client
const updateApiKey = (newKey: string) => {
  apiClient.defaults.headers['X-Api-Key'] = newKey;
  console.log('🔑 API key updated');
};

// Add response interceptor to handle 404 errors and refresh API key
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 404 and we haven't already retried this request
    if (error.response?.status === 404 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('🔄 404 error detected, refreshing API key...');

      // Fetch new API key
      const newKey = await fetchNewApiKey();

      if (newKey) {
        // Update the API key in the original request
        originalRequest.headers['X-Api-Key'] = newKey;

        // Update the default headers for future requests
        updateApiKey(newKey);

        // Retry the original request with the new API key
        console.log('🔄 Retrying request with new API key...');
        return apiClient.request(originalRequest);
      }
    }

    // If we can't get a new API key or it's not a 404, reject the error
    return Promise.reject(error);
  }
);

// Initialize API key rotation
let rotationInterval: NodeJS.Timeout | null = null;

const startApiKeyRotation = () => {
  if (rotationInterval) {
    clearInterval(rotationInterval);
  }

  // Fetch new key immediately, then every 5 minutes
  fetchNewApiKey().then(newKey => {
    if (newKey) {
      updateApiKey(newKey);
    }
  });

  rotationInterval = setInterval(async () => {
    const newKey = await fetchNewApiKey();
    if (newKey) {
      updateApiKey(newKey);
    }
  }, 5 * 60 * 1000); // 5 minutes

  console.log('🔄 API key rotation started (every 5 minutes)');
};

// Auto-start rotation when module is imported
startApiKeyRotation();

export default apiClient;
