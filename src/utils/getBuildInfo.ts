export const getBuildInfo = async () => {
    try {
      console.log('Fetching build info...'); // Debug log
      const response = await fetch('/build-meta.json');
      console.log('Response:', response.status); // Debug log

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Build info loaded:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error fetching build metadata:', error);
      return null;
    }
  };
