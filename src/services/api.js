// API service for Folias app
// Handles all communication with the backend API

const API_BASE_URL = 'http://localhost:8000/api';

// For development: Check if backend server is accessible
const checkServerStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.split('/api')[0]}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (response.ok) {
      console.log('Backend server is running');
      return true;
    } else {
      console.error('Backend server is running but returned an error status');
      return false;
    }
  } catch (e) {
    console.error('Backend server is not accessible:', e.message);
    return false;
  }
};

// Get a temporary token for development
// In production, you would handle proper auth with login
const getDevToken = async () => {
  // Check if we already have a token in localStorage
  let token = localStorage.getItem('folias_token');
  
  // If token exists and is not expired, return it
  if (token) {
    try {
      // Check token validity
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        return token;
      }
      // If not valid, continue to get a new one
      console.log('Existing token is invalid, getting a new one');
    } catch (e) {
      console.log('Error checking token:', e);
    }
  }
  
  // First check if the backend server is accessible
  const serverRunning = await checkServerStatus();
  if (!serverRunning) {
    console.error('Cannot get token because backend server is not accessible');
    return null;
  }
  
  // For development, let's get a temporary token
  try {
    console.log('Attempting to get development token from server...');
    
    const response = await fetch(`${API_BASE_URL}/users/dev-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email: 'dev@example.com',
        password: 'password123'
      }),
      credentials: 'include' // This allows cookies to be sent/received
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Dev token received successfully');
      token = data.token;
      localStorage.setItem('folias_token', token);
      return token;
    } else {
      const errorData = await response.json();
      console.error('Failed to get dev token:', errorData);
      return null;
    }
  } catch (e) {
    console.error('Error getting dev token:', e);
    return null;
  }
};

// Helper function for making API requests
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Get token
  try {
    const token = await getDevToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No auth token available for API request');
    }
  } catch (authError) {
    console.error('Authentication error:', authError);
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Allow cookies to be sent/received
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-2xx responses
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        // If response is not JSON, just use the status text
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
    
    // For 204 No Content responses
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
}

// Plant-related API calls
export const plantApi = {
  // Get all plants
  getAll: async () => {
    return fetchApi('/plants');
  },
  
  // Get a single plant
  getById: async (id) => {
    return fetchApi(`/plants/${id}`);
  },
  
  // Create a new plant
  create: async (plantData) => {
    return fetchApi('/plants', {
      method: 'POST',
      body: JSON.stringify(plantData),
    });
  },
  
  // Update a plant
  update: async (id, plantData) => {
    return fetchApi(`/plants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(plantData),
    });
  },
  
  // Delete a plant
  delete: async (id) => {
    return fetchApi(`/plants/${id}`, {
      method: 'DELETE',
    });
  },
  
  // Get plants that need watering
  getPlantsToWater: async () => {
    return fetchApi('/plants/to-water');
  },
  
  // Get plants by room
  getByRoom: async (roomId) => {
    return fetchApi(`/plants/by-room/${roomId}`);
  },
  
  // Get plants by health status
  getByHealth: async (status) => {
    return fetchApi(`/plants/by-health/${status}`);
  },
};

// Room-related API calls
export const roomApi = {
  // Get all rooms
  getAll: async () => {
    return fetchApi('/rooms');
  },
  
  // Get a single room
  getById: async (id) => {
    return fetchApi(`/rooms/${id}`);
  },
  
  // Create a new room
  create: async (roomData) => {
    return fetchApi('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },
  
  // Update a room
  update: async (id, roomData) => {
    return fetchApi(`/rooms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(roomData),
    });
  },
  
  // Delete a room
  delete: async (id) => {
    return fetchApi(`/rooms/${id}`, {
      method: 'DELETE',
    });
  },
};

// Care log-related API calls
export const careLogApi = {
  // Create a new care log
  create: async (logData) => {
    return fetchApi('/care-logs', {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  },
  
  // Get a single care log
  getById: async (id) => {
    return fetchApi(`/care-logs/${id}`);
  },
  
  // Get logs for a specific plant
  getByPlant: async (plantId) => {
    return fetchApi(`/care-logs/plant/${plantId}`);
  },
  
  // Get logs by type
  getByType: async (type) => {
    return fetchApi(`/care-logs/type/${type}`);
  },
  
  // Get recent care logs
  getRecent: async () => {
    return fetchApi('/care-logs/recent');
  },
  
  // Update a care log
  update: async (id, logData) => {
    return fetchApi(`/care-logs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(logData),
    });
  },
  
  // Delete a care log
  delete: async (id) => {
    return fetchApi(`/care-logs/${id}`, {
      method: 'DELETE',
    });
  },
};

// Auth-related API calls
export const authApi = {
  // Login
  login: async (email, password) => {
    return fetchApi('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  // Register
  register: async (userData) => {
    return fetchApi('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  // Get current user
  getCurrentUser: async () => {
    return fetchApi('/users/me');
  },
  
  // Dev token for testing
  getDevToken: async () => {
    return getDevToken();
  },
  
  // Check server status
  checkServerStatus: async () => {
    return checkServerStatus();
  },
  
  // Clear token
  clearToken: () => {
    localStorage.removeItem('folias_token');
  }
};

export default {
  plant: plantApi,
  room: roomApi,
  careLog: careLogApi,
  auth: authApi,
}; 