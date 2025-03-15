import { useState } from 'react';

function RoomsList({ rooms, plants }) {
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomLightCondition, setNewRoomLightCondition] = useState('');
  
  // Light conditions
  const lightConditions = [
    { id: 'direct', label: 'Direct Sunlight' },
    { id: 'bright-indirect', label: 'Bright Indirect Light' },
    { id: 'medium', label: 'Medium Light' },
    { id: 'low', label: 'Low Light' },
    { id: 'minimal', label: 'Minimal Light' },
  ];
  
  // Count plants in each room
  const getPlantsCountByRoom = (roomName) => {
    return plants ? plants.filter(plant => plant.room === roomName).length : 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call a function passed from the parent to add a room
    console.log('Add room:', { name: newRoomName, lightCondition: newRoomLightCondition });
    
    // Reset form
    setNewRoomName('');
    setNewRoomLightCondition('');
    setShowAddRoom(false);
  };
  
  return (
    <div className="rooms-view">
      <div className="rooms-header">
        <h2>Your Rooms</h2>
        <button className="add-room-btn" onClick={() => setShowAddRoom(!showAddRoom)}>
          {showAddRoom ? 'Cancel' : 'Add New Room'}
        </button>
      </div>
      
      {showAddRoom && (
        <div className="add-room-form-container">
          <form className="add-room-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="roomName">Room Name*</label>
                <input 
                  type="text" 
                  id="roomName" 
                  value={newRoomName} 
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g., Living Room, Bedroom, Office"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lightCondition">Light Condition*</label>
                <select 
                  id="lightCondition" 
                  value={newRoomLightCondition} 
                  onChange={(e) => setNewRoomLightCondition(e.target.value)}
                  required
                >
                  <option value="">Select light condition</option>
                  {lightConditions.map(light => (
                    <option key={light.id} value={light.id}>{light.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-button">Add Room</button>
            </div>
          </form>
        </div>
      )}
      
      <div className="rooms-grid">
        {rooms.map(room => (
          <div key={room.id} className="room-card">
            <div className="room-header">
              <h3>{room.name}</h3>
              <div className="room-plants-count">
                <span>{getPlantsCountByRoom(room.name)}</span>
                <span className="plants-label">plants</span>
              </div>
            </div>
            
            <div className="room-details">
              <div className="detail-item">
                <span className="detail-label">Light Condition:</span>
                <span className="detail-value">{room.lightCondition}</span>
              </div>
              
              <div className="light-indicator">
                {room.lightCondition.toLowerCase().includes('direct') && (
                  <span className="light-icon high">☀️ High Light</span>
                )}
                {room.lightCondition.toLowerCase().includes('indirect') && (
                  <span className="light-icon medium">🌤️ Medium Light</span>
                )}
                {room.lightCondition.toLowerCase().includes('low') && (
                  <span className="light-icon low">🌥️ Low Light</span>
                )}
                {room.lightCondition.toLowerCase().includes('minimal') && (
                  <span className="light-icon minimal">⛅ Minimal Light</span>
                )}
              </div>
            </div>
            
            <div className="room-card-actions">
              <button className="action-btn view-btn">View Plants</button>
              <button className="action-btn edit-btn">Edit Room</button>
            </div>
          </div>
        ))}
      </div>
      
      {rooms.length === 0 && (
        <div className="empty-state">
          <p>You haven't added any rooms yet.</p>
          <button onClick={() => setShowAddRoom(true)}>Add Your First Room</button>
        </div>
      )}
    </div>
  );
}

export default RoomsList; 