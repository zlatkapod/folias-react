import { useState, useEffect } from 'react'
import './App.css'
import AddPlantForm from './components/AddPlantForm'
import Dashboard from './components/dashboard/Dashboard'
import PlantsList from './components/plants/PlantsList'
import { checkServerStatus, plantService, roomService, configService } from './services'
import BlogList from './components/blog/BlogList'
import AddBlogPostForm from './components/blog/AddBlogPostForm'
import ConfigPage from './components/config/ConfigPage'

// Default empty states to use before fetching data
const initialPlants = [];
const initialRooms = [];

// Initial plant configuration data
const initialPlantTypes = [
  { id: 1, name: 'Dracaena Marginata', wateringFrequency: 7, lightNeeds: 'Medium', humidityNeeds: 'Medium' },
  { id: 2, name: 'Snake Plant', wateringFrequency: 14, lightNeeds: 'Low', humidityNeeds: 'Low' },
  { id: 3, name: 'Monstera', wateringFrequency: 10, lightNeeds: 'Medium', humidityNeeds: 'High' },
  { id: 4, name: 'Pothos', wateringFrequency: 7, lightNeeds: 'Low to Medium', humidityNeeds: 'Medium' },
  { id: 5, name: 'Peace Lily', wateringFrequency: 5, lightNeeds: 'Low to Medium', humidityNeeds: 'High' },
  { id: 6, name: 'Fiddle Leaf Fig', wateringFrequency: 7, lightNeeds: 'Medium to High', humidityNeeds: 'Medium' },
  { id: 7, name: 'ZZ Plant', wateringFrequency: 14, lightNeeds: 'Low', humidityNeeds: 'Low' },
  { id: 8, name: 'Boston Fern', wateringFrequency: 3, lightNeeds: 'Medium', humidityNeeds: 'High' },
  { id: 9, name: 'Spider Plant', wateringFrequency: 7, lightNeeds: 'Medium', humidityNeeds: 'Medium' },
  { id: 10, name: 'Aloe Vera', wateringFrequency: 14, lightNeeds: 'High', humidityNeeds: 'Low' },
];

// Initial light conditions
const initialLightConditions = [
  { id: 'direct', label: 'Direct Sunlight' },
  { id: 'indirect', label: 'Indirect Sunlight' },
  { id: 'minimal', label: 'Minimal Sunlight' },
];

// Initial pot sizes
const initialPotSizes = [
  { id: 'small', label: 'Small (4-6")' },
  { id: 'medium', label: 'Medium (8-10")' },
  { id: 'large', label: 'Large (12" or larger)' },
];

// Initial soil types
const initialSoilTypes = [
  { id: 'regular', label: 'Regular Potting Soil' },
  { id: 'cactus', label: 'Cactus & Succulent Mix' },
  { id: 'orchid', label: 'Orchid Mix' },
  { id: 'african_violet', label: 'African Violet Mix' },
  { id: 'peat', label: 'Peat-based Mix' },
];

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [plants, setPlants] = useState(initialPlants);
  const [rooms, setRooms] = useState(initialRooms);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');
  
  // Configuration data states
  const [plantTypes, setPlantTypes] = useState(initialPlantTypes);
  const [lightConditions, setLightConditions] = useState(initialLightConditions);
  const [potSizes, setPotSizes] = useState(initialPotSizes);
  const [soilTypes, setSoilTypes] = useState(initialSoilTypes);

  // Make setActiveView accessible to child components
  useEffect(() => {
    window.setActiveView = setActiveView;
    return () => {
      delete window.setActiveView; // Clean up when component unmounts
    };
  }, [setActiveView]);

  // Check server status on mount
  useEffect(() => {
    const checkServer = async () => {
      setIsLoading(true);
      try {
        const status = await checkServerStatus();
        setServerStatus(status);
        
        if (status.status === 'online') {
          // Fetch initial data from API
          const fetchData = async () => {
            try {
              // Fetch plants
              const plantsResponse = await plantService.getPlants();
              setPlants(plantsResponse);
              
              // Fetch rooms
              const roomsResponse = await roomService.getRooms();
              setRooms(roomsResponse);
              
              // Fetch configuration data
              const [plantTypesResponse, soilTypesResponse, potSizesResponse, lightConditionsResponse] = 
                await Promise.all([
                  configService.getPlantTypes(),
                  configService.getSoilTypes(),
                  configService.getPotSizes(),
                  configService.getLightConditions()
                ]);
              
              setPlantTypes(plantTypesResponse);
              setSoilTypes(soilTypesResponse);
              setPotSizes(potSizesResponse);
              setLightConditions(lightConditionsResponse);
              
              setError(null);
            } catch (error) {
              console.error('Error fetching data:', error);
              setError('Failed to load data. Please try again.');
            } finally {
              setIsLoading(false);
            }
          };
          
          fetchData();
        } else {
          setError('Server is offline. Please try again later.');
          setIsLoading(false);
        }
      } catch (error) {
        setServerStatus({ status: 'offline', message: 'Unable to connect to server' });
        setError('Server connection failed. Please try again later.');
        setIsLoading(false);
      }
    };
    
    checkServer();
  }, []);

  // Load configuration data from local storage
  useEffect(() => {
    const loadConfigData = () => {
      try {
        const storedPlantTypes = localStorage.getItem('plantTypes');
        const storedLightConditions = localStorage.getItem('lightConditions');
        const storedPotSizes = localStorage.getItem('potSizes');
        const storedSoilTypes = localStorage.getItem('soilTypes');
        const storedBlogPosts = localStorage.getItem('blogPosts');
        
        if (storedPlantTypes) setPlantTypes(JSON.parse(storedPlantTypes));
        if (storedLightConditions) setLightConditions(JSON.parse(storedLightConditions));
        if (storedPotSizes) setPotSizes(JSON.parse(storedPotSizes));
        if (storedSoilTypes) setSoilTypes(JSON.parse(storedSoilTypes));
        if (storedBlogPosts) setBlogPosts(JSON.parse(storedBlogPosts));
        else setBlogPosts(mockBlogPosts); // Use mock data if no saved blog posts
      } catch (err) {
        console.error('Error loading data from localStorage:', err);
        // Fallback to initial values if there's an error
        setBlogPosts(mockBlogPosts);
      }
    };
    
    loadConfigData();
  }, []);

  // Configuration data save handlers
  const handleSavePlantTypes = (updatedPlantTypes) => {
    setPlantTypes(updatedPlantTypes);
    localStorage.setItem('plantTypes', JSON.stringify(updatedPlantTypes));
  };
  
  const handleSaveLightConditions = (updatedLightConditions) => {
    setLightConditions(updatedLightConditions);
    localStorage.setItem('lightConditions', JSON.stringify(updatedLightConditions));
  };
  
  const handleSavePotSizes = (updatedPotSizes) => {
    setPotSizes(updatedPotSizes);
    localStorage.setItem('potSizes', JSON.stringify(updatedPotSizes));
  };
  
  const handleSaveSoilTypes = (updatedSoilTypes) => {
    setSoilTypes(updatedSoilTypes);
    localStorage.setItem('soilTypes', JSON.stringify(updatedSoilTypes));
  };

  // Handler for adding a plant
  const handleAddPlant = async (plantData) => {
    try {
      setIsLoading(true);
      const newPlant = await plantService.createPlant(plantData);
      setPlants(prevPlants => [...prevPlants, newPlant]);
      setError(null);
      return newPlant;
    } catch (error) {
      setError('Failed to add plant. Please try again.');
      console.error('Error adding plant:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for updating a plant
  const handleUpdatePlant = async (id, plantData) => {
    try {
      setIsLoading(true);
      const updatedPlant = await plantService.updatePlant(id, plantData);
      setPlants(prevPlants => 
        prevPlants.map(plant => plant._id === id ? updatedPlant : plant)
      );
      setError(null);
      return updatedPlant;
    } catch (error) {
      setError('Failed to update plant. Please try again.');
      console.error('Error updating plant:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for deleting a plant
  const handleDeletePlant = async (id) => {
    try {
      setIsLoading(true);
      await plantService.deletePlant(id);
      setPlants(prevPlants => prevPlants.filter(plant => plant._id !== id));
      setError(null);
      return true;
    } catch (error) {
      setError('Failed to delete plant. Please try again.');
      console.error('Error deleting plant:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for adding a room
  const handleAddRoom = async (roomData) => {
    try {
      setIsLoading(true);
      const newRoom = await roomService.createRoom(roomData);
      setRooms(prevRooms => [...prevRooms, newRoom]);
      setError(null);
      return newRoom;
    } catch (error) {
      setError('Failed to add room. Please try again.');
      console.error('Error adding room:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for updating a room
  const handleUpdateRoom = async (id, roomData) => {
    try {
      setIsLoading(true);
      const updatedRoom = await roomService.updateRoom(id, roomData);
      setRooms(prevRooms => 
        prevRooms.map(room => room._id === id ? updatedRoom : room)
      );
      setError(null);
      return updatedRoom;
    } catch (error) {
      setError('Failed to update room. Please try again.');
      console.error('Error updating room:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for deleting a room
  const handleDeleteRoom = async (id) => {
    try {
      setIsLoading(true);
      await roomService.deleteRoom(id);
      setRooms(prevRooms => prevRooms.filter(room => room._id !== id));
      setError(null);
      return true;
    } catch (error) {
      setError('Failed to delete room. Please try again.');
      console.error('Error deleting room:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers for configuration items
  const handleAddConfigItem = async (itemType, itemData) => {
    try {
      setIsLoading(true);
      let newItem;
      
      switch (itemType) {
        case 'plantType':
          newItem = await configService.createPlantType(itemData);
          setPlantTypes(prev => [...prev, newItem]);
          break;
        case 'soilType':
          newItem = await configService.createSoilType(itemData);
          setSoilTypes(prev => [...prev, newItem]);
          break;
        case 'potSize':
          newItem = await configService.createPotSize(itemData);
          setPotSizes(prev => [...prev, newItem]);
          break;
        case 'lightCondition':
          newItem = await configService.createLightCondition(itemData);
          setLightConditions(prev => [...prev, newItem]);
          break;
        default:
          throw new Error(`Unknown item type: ${itemType}`);
      }
      
      setError(null);
      return newItem;
    } catch (error) {
      setError(`Failed to add ${itemType}. Please try again.`);
      console.error(`Error adding ${itemType}:`, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateConfigItem = async (itemType, id, itemData) => {
    try {
      setIsLoading(true);
      let updatedItem;
      
      switch (itemType) {
        case 'plantType':
          updatedItem = await configService.updatePlantType(id, itemData);
          setPlantTypes(prev => prev.map(item => item._id === id ? updatedItem : item));
          break;
        case 'soilType':
          updatedItem = await configService.updateSoilType(id, itemData);
          setSoilTypes(prev => prev.map(item => item._id === id ? updatedItem : item));
          break;
        case 'potSize':
          updatedItem = await configService.updatePotSize(id, itemData);
          setPotSizes(prev => prev.map(item => item._id === id ? updatedItem : item));
          break;
        case 'lightCondition':
          updatedItem = await configService.updateLightCondition(id, itemData);
          setLightConditions(prev => prev.map(item => item._id === id ? updatedItem : item));
          break;
        default:
          throw new Error(`Unknown item type: ${itemType}`);
      }
      
      setError(null);
      return updatedItem;
    } catch (error) {
      setError(`Failed to update ${itemType}. Please try again.`);
      console.error(`Error updating ${itemType}:`, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfigItem = async (itemType, id) => {
    try {
      setIsLoading(true);
      
      switch (itemType) {
        case 'plantType':
          await configService.deletePlantType(id);
          setPlantTypes(prev => prev.filter(item => item._id !== id));
          break;
        case 'soilType':
          await configService.deleteSoilType(id);
          setSoilTypes(prev => prev.filter(item => item._id !== id));
          break;
        case 'potSize':
          await configService.deletePotSize(id);
          setPotSizes(prev => prev.filter(item => item._id !== id));
          break;
        case 'lightCondition':
          await configService.deleteLightCondition(id);
          setLightConditions(prev => prev.filter(item => item._id !== id));
          break;
        default:
          throw new Error(`Unknown item type: ${itemType}`);
      }
      
      setError(null);
      return true;
    } catch (error) {
      setError(`Failed to delete ${itemType}. Please try again.`);
      console.error(`Error deleting ${itemType}:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle adding a blog post
  const handleAddBlogPost = (blogPost) => {
    // Generate a unique ID for the blog post
    const newBlogPost = {
      ...blogPost,
      id: Date.now(), // Simple way to generate a unique ID
      createdAt: new Date().toISOString(),
    };
    
    const updatedBlogPosts = [...blogPosts, newBlogPost];
    setBlogPosts(updatedBlogPosts);
    
    // Save to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(updatedBlogPosts));
    
    setActiveView('blog');
  };
  
  // Handle updating blog posts
  const handleUpdateBlogPost = (updatedPost) => {
    const updatedBlogPosts = blogPosts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    );
    
    setBlogPosts(updatedBlogPosts);
    
    // Save to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(updatedBlogPosts));
  };
  
  // Handle deleting blog posts
  const handleDeleteBlogPost = (postId) => {
    const updatedBlogPosts = blogPosts.filter(post => post.id !== postId);
    
    setBlogPosts(updatedBlogPosts);
    
    // Save to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(updatedBlogPosts));
  };

  // Function to retry connecting to the server
  const handleRetryConnection = async () => {
    setIsLoading(true);
    setError(null);
    setServerStatus(null);
    
    try {
      // Try to check server status again
      const status = await checkServerStatus();
      setServerStatus(status);
      
      if (status.status === 'online') {
        // Fetch data if server is online
        const fetchData = async () => {
          try {
            // Fetch plants
            const plantsResponse = await plantService.getPlants();
            setPlants(plantsResponse);
            
            // Fetch rooms
            const roomsResponse = await roomService.getRooms();
            setRooms(roomsResponse);
            
            // Fetch configuration data
            const [plantTypesResponse, soilTypesResponse, potSizesResponse, lightConditionsResponse] = 
              await Promise.all([
                configService.getPlantTypes(),
                configService.getSoilTypes(),
                configService.getPotSizes(),
                configService.getLightConditions()
              ]);
            
            setPlantTypes(plantTypesResponse);
            setSoilTypes(soilTypesResponse);
            setPotSizes(potSizesResponse);
            setLightConditions(lightConditionsResponse);
            
            setError(null);
          } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data. Please try again.');
          } finally {
            setIsLoading(false);
          }
        };
        
        fetchData();
      } else {
        setError('Server is offline. Please try again later.');
        setIsLoading(false);
      }
    } catch (error) {
      setServerStatus({ status: 'offline', message: 'Unable to connect to server' });
      setError('Server connection failed. Please try again later.');
      setIsLoading(false);
      
      // Fall back to mock data
      setPlants(mockPlants);
      setRooms(mockRooms);
    }
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
          plantTypes={plantTypes}
          lightConditions={lightConditions}
          potSizes={potSizes}
          soilTypes={soilTypes}
        />;
      case 'blog':
        return <BlogList 
          blogPosts={blogPosts} 
          onUpdateBlogPost={handleUpdateBlogPost}
          onDeleteBlogPost={handleDeleteBlogPost}
        />;
      case 'addBlogPost':
        return <AddBlogPostForm onAddBlogPost={handleAddBlogPost} />;
      case 'config':
        return <ConfigPage 
          plantTypes={plantTypes}
          lightConditions={lightConditions}
          potSizes={potSizes}
          soilTypes={soilTypes}
          onSavePlantTypes={handleSavePlantTypes}
          onSaveLightConditions={handleSaveLightConditions}
          onSavePotSizes={handleSavePotSizes}
          onSaveSoilTypes={handleSaveSoilTypes}
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
    case 'blog': return 'Blog';
    case 'addBlogPost': return 'Add New Blog Post';
    case 'config': return 'Configuration';
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
            className={activeView === 'blog' ? 'active' : ''} 
            onClick={() => setActiveView('blog')}
          >
            Blog
          </li>
          <li className="sidebar-divider"></li>
          <li 
            className={`config-tab ${activeView === 'config' ? 'active' : ''}`} 
            onClick={() => setActiveView('config')}
          >
            Configuration
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

// Fallback mock blog posts for development
const mockBlogPosts = [
  {
    id: 1,
    title: "Mushrooms For Stress Management",
    headline: "Proven techniques to cope with daily stress by microdosing psilocybin",
    content: "Microdosing mushrooms has gained popularity as a way to manage stress and improve mental well-being. This practice involves taking very small amounts of psilocybin mushrooms, typically about one-tenth of a recreational dose.\n\nThese sub-perceptual doses don't cause hallucinations but may offer subtle mood improvements, increased creativity, and reduced anxiety for many users. Research is still in early stages, but preliminary studies suggest potential benefits for stress reduction.\n\nImportant considerations before trying microdosing include:\n\n1. Legal status: Psilocybin remains illegal in many regions\n2. Proper dosing: Working with experienced guides is recommended\n3. Individual reactions vary significantly\n4. Should be part of a holistic wellness approach\n\nAlways consult healthcare professionals, especially if you have existing mental health conditions or take medications.",
    tags: ["microdosing", "mushrooms", "stress", "wellness"],
    createdAt: "2023-07-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Indoor Plants That Purify Your Air",
    headline: "Top 5 houseplants that improve your home's air quality while being easy to maintain",
    content: "Indoor air quality is often worse than outdoor air, containing pollutants like formaldehyde, benzene, and trichloroethylene. Fortunately, certain houseplants can help purify your indoor environment while adding beauty to your home.\n\nHere are the top 5 air-purifying indoor plants:\n\n1. Spider Plant (Chlorophytum comosum): Removes formaldehyde and xylene. Easy to grow and propagate.\n\n2. Peace Lily (Spathiphyllum): Filters benzene, formaldehyde, trichloroethylene. Thrives in low light but needs consistent watering.\n\n3. Snake Plant (Sansevieria trifasciata): Filters formaldehyde and benzene. Extremely low-maintenance and tolerates neglect.\n\n4. Boston Fern (Nephrolepis exaltata): Removes formaldehyde and xylene. Prefers humid environments.\n\n5. Pothos (Epipremnum aureum): Filters benzene, formaldehyde, xylene. Nearly indestructible and grows in various conditions.\n\nFor maximum benefit, aim for one medium-sized plant per 100 square feet of living space. Remember that while these plants help with air quality, they work best as part of a comprehensive approach that includes proper ventilation and reducing pollutant sources.",
    tags: ["plants", "air quality", "health", "indoor gardening"],
    createdAt: "2023-08-22T14:15:00Z"
  }
];

export default App
