import api from './api';

export const configService = {
  // Plant Types
  getPlantTypes: async () => {
    try {
      const response = await api.get('/config/plant-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching plant types:', error);
      throw error;
    }
  },

  createPlantType: async (typeData) => {
    try {
      const response = await api.post('/config/plant-types', typeData);
      return response.data;
    } catch (error) {
      console.error('Error creating plant type:', error);
      throw error;
    }
  },

  updatePlantType: async (id, typeData) => {
    try {
      const response = await api.put(`/config/plant-types/${id}`, typeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating plant type ${id}:`, error);
      throw error;
    }
  },

  deletePlantType: async (id) => {
    try {
      const response = await api.delete(`/config/plant-types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting plant type ${id}:`, error);
      throw error;
    }
  },

  // Soil Types
  getSoilTypes: async () => {
    try {
      const response = await api.get('/config/soil-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching soil types:', error);
      throw error;
    }
  },

  createSoilType: async (typeData) => {
    try {
      const response = await api.post('/config/soil-types', typeData);
      return response.data;
    } catch (error) {
      console.error('Error creating soil type:', error);
      throw error;
    }
  },

  updateSoilType: async (id, typeData) => {
    try {
      const response = await api.put(`/config/soil-types/${id}`, typeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating soil type ${id}:`, error);
      throw error;
    }
  },

  deleteSoilType: async (id) => {
    try {
      const response = await api.delete(`/config/soil-types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting soil type ${id}:`, error);
      throw error;
    }
  },

  // Pot Sizes
  getPotSizes: async () => {
    try {
      const response = await api.get('/config/pot-sizes');
      return response.data;
    } catch (error) {
      console.error('Error fetching pot sizes:', error);
      throw error;
    }
  },

  createPotSize: async (sizeData) => {
    try {
      const response = await api.post('/config/pot-sizes', sizeData);
      return response.data;
    } catch (error) {
      console.error('Error creating pot size:', error);
      throw error;
    }
  },

  updatePotSize: async (id, sizeData) => {
    try {
      const response = await api.put(`/config/pot-sizes/${id}`, sizeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating pot size ${id}:`, error);
      throw error;
    }
  },

  deletePotSize: async (id) => {
    try {
      const response = await api.delete(`/config/pot-sizes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting pot size ${id}:`, error);
      throw error;
    }
  },

  // Light Conditions
  getLightConditions: async () => {
    try {
      const response = await api.get('/config/light-conditions');
      return response.data;
    } catch (error) {
      console.error('Error fetching light conditions:', error);
      throw error;
    }
  },

  createLightCondition: async (conditionData) => {
    try {
      const response = await api.post('/config/light-conditions', conditionData);
      return response.data;
    } catch (error) {
      console.error('Error creating light condition:', error);
      throw error;
    }
  },

  updateLightCondition: async (id, conditionData) => {
    try {
      const response = await api.put(`/config/light-conditions/${id}`, conditionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating light condition ${id}:`, error);
      throw error;
    }
  },

  deleteLightCondition: async (id) => {
    try {
      const response = await api.delete(`/config/light-conditions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting light condition ${id}:`, error);
      throw error;
    }
  }
};

export default configService; 