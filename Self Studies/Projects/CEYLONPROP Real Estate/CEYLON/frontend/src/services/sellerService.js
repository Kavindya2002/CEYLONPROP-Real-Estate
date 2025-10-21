import apiClient from './apiClient.js';

// Get all sellers with pagination and filtering
export const getSellers = async (
  pagination = { page: 1, limit: 10 },
  filter
) => {
  try {
    const params = new URLSearchParams();
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    
    if (filter?.search) {
      params.append('search', filter.search);
    }
    
    const response = await apiClient.get(`/sellers?${params.toString()}`);
    return {
      sellers: response.data.data,
      totalPages: response.data.totalPages || 1
    };
  } catch (error) {
    console.error('Error fetching sellers:', error);
    throw error;
  }
};

// Get a seller by ID
export const getSellerById = async (id) => {
  try {
    const response = await apiClient.get(`/sellers/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching seller with ID ${id}:`, error);
    throw error;
  }
};

// Create a new seller
export const createSeller = async (sellerData) => {
  try {
    const response = await apiClient.post('/sellers', sellerData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating seller:', error);
    throw error;
  }
};

// Update seller details
export const updateSeller = async (id, sellerData) => {
  try {
    const response = await apiClient.put(`/sellers/${id}`, sellerData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating seller with ID ${id}:`, error);
    throw error;
  }
};

// Delete a seller
export const deleteSeller = async (id) => {
  try {
    const response = await apiClient.delete(`/sellers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting seller:", error);
    throw error;
  }
};

// Update seller status
export const updateSellerStatus = async (id, status) => {
  try {
    const response = await apiClient.patch(`/sellers/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    console.error(`Error updating status for seller with ID ${id}:`, error);
    throw error;
  }
};