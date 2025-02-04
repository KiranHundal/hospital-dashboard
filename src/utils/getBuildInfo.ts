export const getBuildInfo = async () => {
    try {
      const response = await fetch('/build-meta.json');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching build metadata:', error);
      return null;
    }
  };
