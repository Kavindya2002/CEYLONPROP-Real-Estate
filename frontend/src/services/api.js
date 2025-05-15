// Base API service
const API_DELAY = 500; // Simulate network delay

// Helper function to simulate API calls
const apiCall = async (data, error = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) {
        reject(new Error("API error"));
      } else {
        resolve(data);
      }
    }, API_DELAY);
  });
};

export default apiCall;