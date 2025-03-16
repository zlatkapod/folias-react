import { useState, useEffect } from 'react';
import PlantDetails from './PlantDetails';
import CareLogModal from './CareLogModal';
import { careLogApi } from '../../services/api';

function PlantsList({ plants: initialPlants, onUpdatePlant }) {
  const [plants, setPlants] = useState(initialPlants);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Update component state when props change
  useEffect(() => {
    setPlants(initialPlants);
  }, [initialPlants]);
  
  // Get unique rooms for the filter dropdown
  const uniqueRooms = [...new Set(plants.map(plant => plant.room))];
  
  // Filter plants based on search term and room filter
  const filteredPlants = plants.filter(plant => {
    const matchesSearch = 
      (plant.name ? plant.name.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (plant.type ? plant.type.toLowerCase().includes(searchTerm.toLowerCase()) : false);
    const matchesRoom = filterRoom === '' || (plant.room ? plant.room === filterRoom : false);
    
    return matchesSearch && matchesRoom;
  });
  
  // Sort plants based on selected sort criteria
  const sortedPlants = [...filteredPlants].sort((a, b) => {
    switch(sortBy) {
      case 'name':
        // Handle cases where name might be undefined
        if (!a.name) return 1;  // Move items without names to the end
        if (!b.name) return -1;
        return a.name.localeCompare(b.name);
      case 'room':
        // Handle cases where room might be undefined
        if (!a.room) return 1;  // Move items without rooms to the end
        if (!b.room) return -1;
        return a.room.localeCompare(b.room);
      case 'watering':
        // Handle cases where nextWatering might be undefined
        if (!a.nextWatering) return 1;  // Move items without watering dates to the end
        if (!b.nextWatering) return -1;
        return new Date(a.nextWatering) - new Date(b.nextWatering);
      default:
        return 0;
    }
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Calculate days until next watering
  const getDaysUntilWatering = (nextWateringDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize today's date
    
    const wateringDate = new Date(nextWateringDate);
    const timeDiff = wateringDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff;
  };
  
  // Get watering status indicator
  const getWateringStatus = (nextWateringDate) => {
    if (!nextWateringDate) return 'ok'; // Default status if no watering date
    
    const daysUntil = getDaysUntilWatering(nextWateringDate);
    
    if (daysUntil < 0) return 'overdue';
    if (daysUntil === 0) return 'today';
    if (daysUntil <= 2) return 'soon';
    return 'ok';
  };

  // Handle plant detail view
  const handleViewDetails = (plant) => {
    setSelectedPlant(plant);
    setShowDetails(true);
  };

  // Handle opening care log modal
  const handleOpenLogModal = (plant) => {
    setSelectedPlant(plant);
    setShowLogModal(true);
  };

  // Handle plant updates
  const handleSavePlant = (updatedPlant) => {
    const updatedPlants = plants.map(p => 
      p.id === updatedPlant.id ? updatedPlant : p
    );
    setPlants(updatedPlants);
    setSelectedPlant(updatedPlant);
    
    // If parent component provided update handler, call it
    if (onUpdatePlant) {
      onUpdatePlant(updatedPlant);
    }
  };

  // Handle plant deletion
  const handleDeletePlant = (plantId) => {
    const updatedPlants = plants.filter(p => p.id !== plantId);
    setPlants(updatedPlants);
    setShowDetails(false);
    
    // If parent component provided update handler, call it with null to indicate deletion
    if (onUpdatePlant) {
      onUpdatePlant({ id: plantId, isDeleted: true });
    }
  };

  // Handle care log save
  const handleSaveLog = async (log, plantUpdates) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add the plant ID to the log
      const logData = {
        ...log,
        plantId: selectedPlant.id
      };
      
      // Save the log to the API
      const savedLog = await careLogApi.create(logData);
      console.log('Log saved:', savedLog);
      
      // If this log includes plant updates (like repotting)
      if (Object.keys(plantUpdates).length > 0 && selectedPlant) {
        const updatedPlant = {
          ...selectedPlant,
          ...plantUpdates,
        };
        
        // Update the plant
        handleSavePlant(updatedPlant);
      }
      
      // Close the modal
      setShowLogModal(false);
    } catch (err) {
      console.error('Error saving care log:', err);
      setError('Failed to save care log. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add state for the App component
  const handleAddPlantClick = () => {
    // This should redirect to the Add Plant form
    // Since we're using the activeView state in the parent App component,
    // we need to communicate this to the parent
    if (window.parent && window.parent.setActiveView) {
      window.parent.setActiveView('addPlant');
    } else {
      // Fallback - this is a workaround since we don't have direct access to setActiveView
      // The App component stores setActiveView in window object 
      if (window.setActiveView) {
        window.setActiveView('addPlant');
      } else {
        console.warn('Cannot navigate to Add Plant view - setActiveView not available');
      }
    }
  };
  
  return (
    <div className="plants-view">
      <div className="plants-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-item">
            <label htmlFor="roomFilter">Room:</label>
            <select
              id="roomFilter"
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
            >
              <option value="">All Rooms</option>
              {uniqueRooms.map(room => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-item">
            <label htmlFor="sortBy">Sort by:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="room">Room</option>
              <option value="watering">Next Watering</option>
            </select>
          </div>
        </div>
      </div>
      
      {isLoading && <div className="loading-indicator">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="plants-list">
        {/* Add New Plant Card - Always visible */}
        <div 
          className="plant-card add-plant-card"
          onClick={handleAddPlantClick}
        >
          <div className="add-plant-icon">
            <span className="plus-icon">+</span>
          </div>
          <div className="add-plant-text">Add New Plant</div>
        </div>
        
        {/* Show message when no plants exist */}
        {sortedPlants.length === 0 && (
          <div className="empty-plants-message">
            <p>You don't have any plants yet. Click the "Add New Plant" card to get started!</p>
          </div>
        )}
        
        {/* Existing Plant Cards */}
        {sortedPlants.map(plant => {
          const wateringStatus = getWateringStatus(plant.nextWatering);
          
          return (
            <div key={plant.id || plant._id} className="plant-card">
              <div className="plant-header">
                {plant.imageUrl ? (
                  <div className="plant-image">
                    <img src={plant.imageUrl} alt={plant.name} />
                  </div>
                ) : (
                  <div className="plant-icon">
                    🪴
                  </div>
                )}
                <div className="plant-main-info">
                  <h3>{plant.name}</h3>
                  {plant.type && plant.name !== plant.type && (
                    <span className="plant-type">{plant.type}</span>
                  )}
                </div>
              </div>
              
              <div className="plant-location">
                <span className="location-icon">📍</span>
                <span className="location-name">{plant.room || 'No room assigned'}</span>
              </div>
              
              <div className="plant-watering">
                <div className={`watering-indicator ${wateringStatus}`}>
                  <span className="watering-icon">💧</span>
                  <span className="watering-text">
                    {wateringStatus === 'overdue' && 'Overdue'}
                    {wateringStatus === 'today' && 'Water today'}
                    {wateringStatus === 'soon' && 'Water soon'}
                    {wateringStatus === 'ok' && 'Water on ' + formatDate(plant.nextWatering)}
                  </span>
                </div>
              </div>
              
              <div className="plant-actions">
                <button 
                  className="action-btn log" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenLogModal(plant);
                  }}
                >
                  Log Care
                </button>
                <button 
                  className="action-btn details"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(plant);
                  }}
                >
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Plant Details Modal */}
      {showDetails && selectedPlant && (
        <PlantDetails 
          plant={selectedPlant}
          onClose={() => setShowDetails(false)}
          onSave={handleSavePlant}
          onDelete={handleDeletePlant}
        />
      )}
      
      {/* Care Log Modal */}
      {showLogModal && selectedPlant && (
        <CareLogModal
          plant={selectedPlant}
          onClose={() => setShowLogModal(false)}
          onSave={handleSaveLog}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}

export default PlantsList; 