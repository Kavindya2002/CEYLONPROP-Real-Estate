import apiClient from './apiClient.js';

// Login function
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/users/login', { email, password });
    
    localStorage.setItem('currentUser', JSON.stringify({
      user: response.data.data.user,
      token: response.data.data.token
    }));
    
    localStorage.setItem('auth_token', response.data.data.token);
    
    return {
      user: response.data.data.user,
      token: response.data.data.token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get current user from API
export const getCurrentUserFromAPI = async () => {
  try {
    const response = await apiClient.get('/users/me');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

// Update user password
export const updatePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await apiClient.put(`/users/${userId}/password`, {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Register seller function
export const registerSeller = async (sellerData) => {
  try {
    const response = await apiClient.post('/sellers', sellerData);
    return {
      success: true,
      message: "Seller registration successful. Please log in.",
      data: response.data.data
    };
  } catch (error) {
    console.error('Seller registration error:', error);
    throw error;
  }
};

// Register customer function
export const registerCustomer = async (customerData) => {
  try {
    const response = await apiClient.post('/customers', customerData);
    return {
      success: true,
      message: "Customer registration successful. Please log in.",
      data: response.data.data
    };
  } catch (error) {
    console.error('Customer registration error:', error);
    throw error;
  }
};

// Register function (generic handler)
export const register = async (userData, role) => {
  if (role === 'seller') {
    return registerSeller(userData);
  } else {
    return registerCustomer(userData);
  }
};

// Logout function
export const logout = async () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('auth_token');
  return { success: true };
};

// Check auth status
export const checkAuthStatus = async () => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    const { user } = JSON.parse(storedUser);
    return { user, isAuthenticated: true };
  }
  return { user: null, isAuthenticated: false };
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    const { user } = JSON.parse(storedUser);
    return user;
  }
  return null;
};