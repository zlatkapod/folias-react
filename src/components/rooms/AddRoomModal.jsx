import { useState } from 'react';

/**
 * Modal component for adding a new room
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {Function} props.onAddRoom - Function to call when adding a room
 * @param {boolean} props.isLoading - Loading state
 */
function AddRoomModal({ onClose, onAddRoom, isLoading }) {
  const [roomData, setRoomData] = useState({
    name: '',
    description: '',
    lightLevel: 'medium',
    humidity: 'medium',
  });

  // Light level options
  const lightLevels = [
    { id: 'high', label: 'Direct Sunlight' },
    { id: 'bright-indirect', label: 'Bright Indirect Light' },
    { id: 'medium', label: 'Medium Light' },
    { id: 'low', label: 'Low Light' }
  ];

  // Humidity options
  const humidityLevels = [
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' }
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create the room object
    const newRoom = {
      name: roomData.name.trim(),
      description: roomData.description.trim(),
      lightLevel: roomData.lightLevel,
      humidity: roomData.humidity
    };
    
    // Call the onAddRoom function passed from parent
    onAddRoom(newRoom);
    
    // Reset form
    setRoomData({
      name: '',
      description: '',
      lightLevel: 'medium',
      humidity: 'medium',
    });
  };

  return (
    <div className="care-log-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Room</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form className="log-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Room Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={roomData.name}
              onChange={handleInputChange}
              placeholder="e.g., Living Room"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={roomData.description}
              onChange={handleInputChange}
              placeholder="Describe the room and its conditions..."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lightLevel">Light Level</label>
            <select
              id="lightLevel"
              name="lightLevel"
              value={roomData.lightLevel}
              onChange={handleInputChange}
            >
              {lightLevels.map(level => (
                <option key={level.id} value={level.id}>{level.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="humidity">Humidity Level</label>
            <select
              id="humidity"
              name="humidity"
              value={roomData.humidity}
              onChange={handleInputChange}
            >
              {humidityLevels.map(level => (
                <option key={level.id} value={level.id}>{level.label}</option>
              ))}
            </select>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn" 
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRoomModal; 