import api from './api';
import plantService from './plantService';
import roomService from './roomService';
import configService from './configService';

// Server status check
export const checkServerStatus = async () => {
  try {
    const response = await api.get('/health');
    return { 
      status: 'online', 
      message: response.message || 'Server is running' 
    };
  } catch (error) {
    return { 
      status: 'offline', 
      message: 'Unable to connect to server' 
    };
  }
};

export {
  api,
  plantService,
  roomService,
  configService
};

export default {
  api,
  plantService,
  roomService,
  configService,
  checkServerStatus
}; 