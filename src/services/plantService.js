import api from './api';

export const plantService = {
  // Get all plants
  getPlants: async () => {
    try {
      const response = await api.get('/plants');
      return response.data;
    } catch (error) {
      console.error('Error fetching plants:', error);
      throw error;
    }
  },
  
  // Get a single plant by ID
  getPlant: async (id) => {
    try {
      const response = await api.get(`/plants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching plant ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new plant
  createPlant: async (plantData) => {
    try {
      const response = await api.post('/plants', plantData);
      return response.data;
    } catch (error) {
      console.error('Error creating plant:', error);
      throw error;
    }
  },
  
  // Update an existing plant
  updatePlant: async (id, plantData) => {
    try {
      const response = await api.put(`/plants/${id}`, plantData);
      return response.data;
    } catch (error) {
      console.error(`Error updating plant ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a plant
  deletePlant: async (id) => {
    try {
      const response = await api.delete(`/plants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting plant ${id}:`, error);
      throw error;
    }
  }
};

export default plantService;