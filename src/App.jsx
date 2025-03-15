import { useState, useEffect } from 'react'
import './App.css'
import AddPlantForm from './components/AddPlantForm'
import Dashboard from './components/dashboard/Dashboard'
import PlantsList from './components/plants/PlantsList'
import { plantApi, roomApi, authApi } from './services/api'

// Default empty states to use before fetching data
const initialPlants = [];
const initialRooms = [];

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [plants, setPlants] = useState(initialPlants);
  const [rooms, setRooms] = useState(initialRooms);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);

  // Check server status on mount
  useEffect(() => {
    const checkServer = async () => {
      const status = await authApi.checkServerStatus();
      setServerStatus(status);
      
      // If server is not running, set appropriate error
      if (!status) {
        setError('Cannot connect to the server. Please make sure the backend is running.');
        setIsLoading(false);
      }
    };
    
    checkServer();
  }, []);

  // Fetch plants and rooms from API after server status is checked
  useEffect(() => {
    // Skip if server is not running
    if (serverStatus === false) {
      return;
    }
    
    // Skip if server status check is still in progress
    if (serverStatus === null) {
      return;
    }
    
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get a development token first
        const token = await authApi.getDevToken();
        
        if (!token) {
          setError('Failed to authenticate. Please check the backend server.');
          setIsLoading(false);
          // Fall back to mock data
          setPlants(mockPlants);
          setRooms(mockRooms);
          return;
        }
        
        // Fetch plants and rooms in parallel
        const [plantsData, roomsData] = await Promise.all([
          plantApi.getAll(),
          roomApi.getAll()
        ]);
        
        setPlants(plantsData.data?.plants || plantsData);
        setRooms(roomsData.data?.rooms || roomsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data: ' + (err.message || 'Unknown error'));
        
        // Fall back to mock data for development if API fails
        setPlants(mockPlants);
        setRooms(mockRooms);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [serverStatus]);

  // Function to handle adding a room
  const handleAddRoom = async (room) => {
    try {
      // Map light level to the expected enum values
      let lightCondition;
      switch (room.lightLevel) {
        case 'high':
          lightCondition = 'Direct sunlight';
          break;
        case 'bright-indirect':
          lightCondition = 'Bright indirect';
          break;
        case 'medium':
          lightCondition = 'Medium light';
          break;
        case 'low':
          lightCondition = 'Low light';
          break;
        default:
          lightCondition = 'Medium light';
      }
      
      // Create room data object with mapped values
      const roomData = {
        name: room.name,
        description: room.description,
        lightCondition: lightCondition
      };
      
      const newRoom = await roomApi.create(roomData);
      setRooms([...rooms, newRoom]);
      return newRoom;
    } catch (err) {
      console.error('Error adding room:', err);
      // Handle error (e.g., show notification)
      throw err; // Re-throw to allow handling in the calling component
    }
  };

  // Function to handle updating a plant
  const handleUpdatePlant = async (updatedPlant) => {
    try {
      // Send update to the API
      const result = await plantApi.update(updatedPlant.id, updatedPlant);
      
      // Update local state with the returned data
      setPlants(currentPlants => 
        currentPlants.map(plant => 
          plant.id === result.id ? result : plant
        )
      );
    } catch (err) {
      console.error('Error updating plant:', err);
      // Handle error (e.g., show notification)
    }
  };

  // Function to handle adding a plant
  const handleAddPlant = async (plant) => {
    try {
      // Transform plant data if needed
      
      // Map numeric watering frequency to proper enum string value
      let wateringFrequency;
      const frequencyDays = plant.wateringFrequency;
      
      if (frequencyDays <= 1) {
        wateringFrequency = 'Daily';
      } else if (frequencyDays <= 3) {
        wateringFrequency = 'Every 2-3 days';
      } else if (frequencyDays <= 7) {
        wateringFrequency = 'Weekly';
      } else if (frequencyDays <= 14) {
        wateringFrequency = 'Bi-weekly';
      } else {
        wateringFrequency = 'Monthly';
      }
      
      // Map light condition to proper enum value
      let lightCondition;
      switch (plant.lightCondition) {
        case 'Direct Sunlight':
          lightCondition = 'Direct Sunlight';
          break;
        case 'Indirect Sunlight':
          lightCondition = 'Indirect Sunlight';
          break;
        case 'Minimal Sunlight':
          lightCondition = 'Low Light';
          break;
        default:
          lightCondition = 'Medium Light';
      }
      
      const plantData = {
        name: plant.nickname || plant.type,
        type: plant.type,
        room: plant.room,
        nextWatering: new Date(plant.nextWatering),
        lastWatered: plant.lastWatered ? new Date(plant.lastWatered) : new Date(),
        health: plant.health || 'Good',
        lightCondition: lightCondition,
        potSize: plant.potSize,
        soilType: plant.soilType,
        wateringFrequency: wateringFrequency, // Use the string enum value
        acquiredDate: plant.acquiredDate ? new Date(plant.acquiredDate) : new Date(),
        notes: plant.additionalNotes,
        // Include any other fields needed by your API
      };
      
      // Send to API
      const newPlant = await plantApi.create(plantData);
      
      // Add to local state
      setPlants([...plants, newPlant]);
      
      // After adding, go to plants view
      setActiveView('plants');
    } catch (err) {
      console.error('Error adding plant:', err);
      // Handle error (e.g., show notification)
    }
  };

  // Function to retry connecting to the server
  const handleRetryConnection = async () => {
    setIsLoading(true);
    setError(null);
    setServerStatus(null);
    
    // Clear any previous token to ensure a fresh start
    authApi.clearToken();
    
    // First check server status
    const status = await authApi.checkServerStatus();
    setServerStatus(status);
    
    if (!status) {
      setError('Cannot connect to the server. Please make sure the backend is running.');
      setIsLoading(false);
    }
    // The second useEffect will handle data fetching if server is up
  };

  // Function to render the appropriate view based on activeView state
  const renderView = () => {
    // Show loading indicator while data is being fetched
    if (isLoading) {
      return <div className="loading-state">Loading...</div>;
    }
    
    // Show error message if data fetching failed
    if (error) {
      return (
        <div className="error-state">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={handleRetryConnection}>
            Retry Connection
          </button>
          <p className="note">
            <strong>Note:</strong> The app is currently using mock data. Some features may be limited.
          </p>
        </div>
      );
    }
    
    switch(activeView) {
      case 'dashboard':
        return <Dashboard plants={plants} />;
      case 'plants':
        return <PlantsList plants={plants} onUpdatePlant={handleUpdatePlant} />;
      case 'addPlant':
        return <AddPlantForm 
          rooms={rooms} 
          onAddPlant={handleAddPlant}
          onAddRoom={handleAddRoom}
        />;
      default:
        return <Dashboard plants={plants} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
      />
      <div className="content-container">
        <Header title={getHeaderTitle(activeView)} />
        <main className="main-content">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

// Helper function to get the header title based on active view
function getHeaderTitle(view) {
  switch(view) {
    case 'dashboard': return 'Dashboard';
    case 'plants': return 'My Plants';
    case 'addPlant': return 'Add New Plant';
    default: return 'Dashboard';
  }
}

// Sidebar Component
function Sidebar({ activeView, setActiveView }) {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>Folias</h2>
      </div>
      <nav className="sidebar-menu">
        <ul>
          <li 
            className={activeView === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveView('dashboard')}
          >
            Dashboard
          </li>
          <li 
            className={activeView === 'plants' ? 'active' : ''} 
            onClick={() => setActiveView('plants')}
          >
            My Plants
          </li>
          <li 
            className={activeView === 'addPlant' ? 'active' : ''} 
            onClick={() => setActiveView('addPlant')}
          >
            Add New Plant
          </li>
        </ul>
      </nav>
      <div className="user-info">
        <span>Welcome, Plant Lover</span>
      </div>
    </div>
  );
}

// Header Component
function Header({ title }) {
  return (
    <header className="content-header">
      <h1>{title}</h1>
    </header>
  );
}

// Fallback mock data for development (in case API fails)
const mockPlants = [
  { 
    id: 1, 
    name: 'Dracaena Marginata', 
    room: 'Living Room', 
    nextWatering: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    health: 'Good', 
    type: 'Dragon Tree', 
    lightCondition: 'Indirect Sunlight',
    potSize: 'Medium (8-10")',
    soilType: 'All Purpose',
    wateringFrequency: 'Every 2-3 days',
    acquiredDate: '2023-01-15',
    notes: 'Thriving in the corner by the window.'
  },
  { 
    id: 2, 
    name: 'Snake Plant', 
    room: 'Bedroom', 
    nextWatering: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (overdue)
    health: 'Good', 
    type: 'Sansevieria', 
    lightCondition: 'Low Light',
    potSize: 'Small (4-6")',
    soilType: 'Cactus Mix',
    wateringFrequency: 'Monthly',
    acquiredDate: '2022-11-10',
    notes: 'Very low maintenance, perfect for the bedroom.'
  },
  { 
    id: 3, 
    name: 'Monstera', 
    room: 'Office', 
    nextWatering: new Date(Date.now()).toISOString(), // Today
    health: 'Needs attention', 
    type: 'Monstera Deliciosa', 
    lightCondition: 'Bright Indirect Light',
    potSize: 'Large (12"+)',
    soilType: 'All Purpose',
    wateringFrequency: 'Weekly',
    acquiredDate: '2022-09-05',
    notes: 'Some leaves have brown spots, might need more humidity.'
  },
];

// Fallback mock rooms for development
const mockRooms = [
  { id: 1, name: 'Living Room', lightCondition: 'Bright indirect' },
  { id: 2, name: 'Bedroom', lightCondition: 'Low light' },
  { id: 3, name: 'Office', lightCondition: 'Direct sunlight' },
];

export default App
