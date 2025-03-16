import { useState } from 'react';
import AddRoomModal from './rooms/AddRoomModal';

function AddPlantForm({ 
  rooms, 
  onAddPlant, 
  onAddRoom, 
  plantTypes,  // Now receiving from props
  lightConditions, // Now receiving from props
  potSizes, // Now receiving from props
  soilTypes // Now receiving from props
}) {
  // Form state
  const [plantType, setPlantType] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [lightCondition, setLightCondition] = useState('');
  const [potSize, setPotSize] = useState('medium');
  const [soilType, setSoilType] = useState('regular');
  const [lastWatered, setLastWatered] = useState(new Date().toISOString().split('T')[0]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [plantImage, setPlantImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // State for the Add Room modal
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  
  // Calculate next watering date based on plant type
  const calculateNextWatering = (plantTypeId, lastWateredDate) => {
    const plant = plantTypes.find(p => p.id === parseInt(plantTypeId));
    if (!plant) return new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0];
    
    const lastWatered = new Date(lastWateredDate);
    const nextWatering = new Date(lastWatered);
    nextWatering.setDate(lastWatered.getDate() + plant.wateringFrequency);
    
    return nextWatering.toISOString().split('T')[0];
  };
  
  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPlantImage(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get plant type details
    const selectedPlantType = plantTypes.find(p => p.id === parseInt(plantType) || p._id === plantType);
    
    // Create new plant object with proper field names for MongoDB
    const newPlant = {
      name: nickname.trim() || (selectedPlantType?.name || 'My Plant'),
      type: selectedPlantType ? selectedPlantType.name : 'Unknown',
      room: selectedRoom,
      lightCondition: lightConditions.find(l => l.id === lightCondition || l._id === lightCondition)?.label || 'Medium Light',
      potSize: potSizes.find(p => p.id === potSize || p._id === potSize)?.label || 'Medium',
      soilType: soilTypes.find(s => s.id === soilType || s._id === soilType)?.label || 'Regular Potting Soil',
      lastWatered: new Date(lastWatered),
      nextWatering: new Date(calculateNextWatering(plantType, lastWatered)),
      wateringFrequency: selectedPlantType?.wateringFrequency ? 
        `Every ${selectedPlantType.wateringFrequency} days` : 'Weekly',
      notes: additionalNotes,
      health: 'Good',
      // In a real app, image would be uploaded to a server/cloud storage
      // For now, we'll just store the data URL if available
      imageUrl: imagePreview || null,
      acquiredDate: new Date(),
    };
    
    console.log('Submitting plant data:', newPlant);
    
    // Pass the new plant to parent component
    onAddPlant(newPlant);
    
    // Reset form
    setPlantType('');
    setNickname('');
    setSelectedRoom('');
    setLightCondition('');
    setPotSize('medium');
    setSoilType('regular');
    setLastWatered(new Date().toISOString().split('T')[0]);
    setAdditionalNotes('');
    setPlantImage(null);
    setImagePreview('');
  };
  
  // Handle room selection
  const handleRoomChange = (e) => {
    const value = e.target.value;
    
    if (value === 'add_new_room') {
      // Open the Add Room modal
      setShowAddRoomModal(true);
    } else {
      setSelectedRoom(value);
    }
  };
  
  // Handle add room modal submission
  const handleAddRoom = async (roomData) => {
    setIsAddingRoom(true);
    
    try {
      // Call the onAddRoom function passed from App component
      const newRoom = await onAddRoom(roomData);
      
      // Select the newly created room - properly handle the API response structure
      if (newRoom) {
        // Check if the response has the nested structure from the API
        if (newRoom.data && newRoom.data.room) {
          setSelectedRoom(newRoom.data.room.name);
        } 
        // Fallback to the direct room object if not using the API nested structure
        else if (newRoom.name) {
          setSelectedRoom(newRoom.name);
        }
      }
      
      // Close the modal
      setShowAddRoomModal(false);
    } catch (error) {
      console.error('Error adding room:', error);
      // You could add error handling UI here
    } finally {
      setIsAddingRoom(false);
    }
  };
  
  return (
    <div className="add-plant-form">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="plantType">Plant Type*</label>
            <select 
              id="plantType" 
              value={plantType} 
              onChange={(e) => setPlantType(e.target.value)}
              required
            >
              <option value="">Select a plant type</option>
              {plantTypes.map(plant => (
                <option key={plant.id} value={plant.id}>{plant.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="nickname">Nickname (optional)</label>
            <input 
              type="text" 
              id="nickname" 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Give your plant a name"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="room">Room*</label>
            <select 
              id="room" 
              value={selectedRoom} 
              onChange={handleRoomChange}
              required
            >
              <option value="">Select a room</option>
              {rooms.map(room => (
                <option key={room.id || room._id} value={room.name}>{room.name}</option>
              ))}
              <option value="add_new_room">+ Add New Room</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="lightCondition">Light Condition*</label>
            <select 
              id="lightCondition" 
              value={lightCondition} 
              onChange={(e) => setLightCondition(e.target.value)}
              required
            >
              <option value="">Select light condition</option>
              {lightConditions.map(light => (
                <option key={light.id} value={light.id}>{light.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="potSize">Pot Size</label>
            <select 
              id="potSize" 
              value={potSize} 
              onChange={(e) => setPotSize(e.target.value)}
            >
              {potSizes.map(size => (
                <option key={size.id} value={size.id}>{size.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="soilType">Soil Type</label>
            <select 
              id="soilType" 
              value={soilType} 
              onChange={(e) => setSoilType(e.target.value)}
            >
              {soilTypes.map(soil => (
                <option key={soil.id} value={soil.id}>{soil.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="lastWatered">Last Watered</label>
            <input 
              type="date" 
              id="lastWatered" 
              value={lastWatered} 
              onChange={(e) => setLastWatered(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="plantImage">Plant Image</label>
            <input 
              type="file" 
              id="plantImage" 
              accept="image/*" 
              onChange={handleImageChange}
              className="file-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Plant preview" />
              </div>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Additional Notes</label>
          <textarea 
            id="notes" 
            value={additionalNotes} 
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any special care instructions or observations"
            rows="3"
          />
        </div>
        
        <div className="plant-info-box">
          {plantType && (
            <div className="care-instructions">
              <h3>Care Information</h3>
              <p><strong>Watering:</strong> Every {plantTypes.find(p => p.id === parseInt(plantType))?.wateringFrequency} days</p>
              <p><strong>Light Needs:</strong> {plantTypes.find(p => p.id === parseInt(plantType))?.lightNeeds}</p>
              <p><strong>Humidity:</strong> {plantTypes.find(p => p.id === parseInt(plantType))?.humidityNeeds}</p>
              <p>Based on your inputs, we'll remind you when to water your plant!</p>
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">Add Plant</button>
        </div>
      </form>

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <AddRoomModal 
          onClose={() => setShowAddRoomModal(false)}
          onAddRoom={handleAddRoom}
          isLoading={isAddingRoom}
        />
      )}
    </div>
  );
}

export default AddPlantForm; 