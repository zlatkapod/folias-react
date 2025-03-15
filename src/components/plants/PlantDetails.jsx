import { useState, useEffect } from 'react';
import { careLogApi } from '../../services/api';

function PlantDetails({ plant, onClose, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlant, setEditedPlant] = useState({ ...plant });
  const [activeTab, setActiveTab] = useState('details');
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch care logs when component mounts
  useEffect(() => {
    async function fetchLogs() {
      if (!plant || !plant.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const fetchedLogs = await careLogApi.getByPlant(plant.id);
        setLogs(fetchedLogs);
      } catch (err) {
        console.error('Error fetching care logs:', err);
        setError('Failed to load care logs. Please try again later.');
        // Fall back to empty logs array
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLogs();
  }, [plant]);
  
  // Handle input changes for editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPlant(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle save action
  const handleSave = () => {
    onSave(editedPlant);
    setIsEditing(false);
  };
  
  // Handle cancel action
  const handleCancel = () => {
    setEditedPlant({ ...plant });
    setIsEditing(false);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Get the icon for a specific log type
  const getLogTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'watering': return '💧';
      case 'fertilizing': return '🌱';
      case 'repotting': return '🪴';
      case 'health issue': return '🩺';
      default: return '📝';
    }
  };
  
  // Get date and time from ISO string
  const formatLogDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return {
      date: new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }).format(date),
      time: new Intl.DateTimeFormat('en-US', { 
        hour: 'numeric', 
        minute: 'numeric',
        hour12: true
      }).format(date)
    };
  };
  
  return (
    <div className="plant-details-container">
      <div className="plant-details-header">
        <h2>{plant.name}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Plant Details
        </button>
        <button 
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          Care History
        </button>
      </div>
      
      {activeTab === 'details' ? (
        <div className="plant-details-content">
          <div className="plant-image-container">
            {plant.imageUrl ? (
              <img src={plant.imageUrl} alt={plant.name} className="plant-detail-image" />
            ) : (
              <div className="plant-detail-icon">🪴</div>
            )}
          </div>
          
          <div className="details-section">
            <h3>Basic Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedPlant.name}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  <span className="detail-value">{plant.name}</span>
                )}
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Type:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="type"
                    value={editedPlant.type || ''}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  <span className="detail-value">{plant.type || 'Not specified'}</span>
                )}
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Room:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="room"
                    value={editedPlant.room}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  <span className="detail-value">{plant.room}</span>
                )}
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Health:</span>
                {isEditing ? (
                  <select
                    name="health"
                    value={editedPlant.health}
                    onChange={handleChange}
                    className="edit-select"
                  >
                    <option value="Good">Good</option>
                    <option value="Needs attention">Needs attention</option>
                  </select>
                ) : (
                  <span className={`detail-value health-status ${plant.health === 'Good' ? 'healthy' : 'needs-attention'}`}>
                    {plant.health}
                  </span>
                )}
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Acquired:</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="acquiredDate"
                    value={editedPlant.acquiredDate || ''}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  <span className="detail-value">{formatDate(plant.acquiredDate)}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="details-section">
            <h3>Care Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Light:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="lightCondition"
                    value={editedPlant.lightCondition || ''}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  <span className="detail-value">{plant.lightCondition || 'Not specified'}</span>
                )}
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Pot Size:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="potSize"
                    value={editedPlant.potSize || ''}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  <span className="detail-value">{plant.potSize || 'Not specified'}</span>
                )}
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Soil Type:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="soilType"
                    value={editedPlant.soilType || ''}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  <span className="detail-value">{plant.soilType || 'Not specified'}</span>
                )}
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Watering:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="wateringFrequency"
                    value={editedPlant.wateringFrequency || ''}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  <span className="detail-value">{plant.wateringFrequency || 'Not specified'}</span>
                )}
              </div>
              
              <div className="detail-item full-width">
                <span className="detail-label">Next Watering:</span>
                {isEditing ? (
                  <input
                    type="date"
                    name="nextWatering"
                    value={editedPlant.nextWatering ? new Date(editedPlant.nextWatering).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  <span className="detail-value">{formatDate(plant.nextWatering)}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="details-section">
            <h3>Notes</h3>
            {isEditing ? (
              <textarea
                name="notes"
                value={editedPlant.notes || ''}
                onChange={handleChange}
                className="edit-textarea"
                rows="4"
              />
            ) : (
              <p className="plant-notes">{plant.notes || 'No notes added yet.'}</p>
            )}
          </div>
          
          <div className="action-buttons">
            {isEditing ? (
              <>
                <button className="action-btn save" onClick={handleSave}>Save Changes</button>
                <button className="action-btn cancel" onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <button className="action-btn edit" onClick={() => setIsEditing(true)}>Edit Plant</button>
            )}
          </div>
        </div>
      ) : (
        <div className="care-logs-content">
          <h3>Care History</h3>
          
          {isLoading && <div className="loading">Loading care logs...</div>}
          {error && <div className="error-message">{error}</div>}
          
          {!isLoading && logs && logs.length > 0 ? (
            <div className="care-logs-list">
              {logs.map((log) => {
                const { date, time } = formatLogDate(log.date || log.createdAt);
                
                return (
                  <div key={log.id} className={`care-log-item ${log.type?.toLowerCase()}`}>
                    <div className="log-icon">
                      {getLogTypeIcon(log.type)}
                    </div>
                    <div className="log-content">
                      <div className="log-header">
                        <span className="log-type">{log.type}</span>
                        <span className="log-date">{date} at {time}</span>
                      </div>
                      {log.notes && <p className="log-notes">{log.notes}</p>}
                      
                      {/* Type-specific content */}
                      {log.type === 'Watering' && log.amount && (
                        <div className="log-detail">
                          <span className="detail-label">Amount:</span>
                          <span className="detail-value">{log.amount}</span>
                        </div>
                      )}
                      
                      {log.type === 'Fertilizing' && log.fertilizer && (
                        <div className="log-detail">
                          <span className="detail-label">Fertilizer:</span>
                          <span className="detail-value">{log.fertilizer}</span>
                        </div>
                      )}
                      
                      {log.type === 'Repotting' && (
                        <>
                          {log.potSize && (
                            <div className="log-detail">
                              <span className="detail-label">New Pot Size:</span>
                              <span className="detail-value">{log.potSize}</span>
                            </div>
                          )}
                          {log.soilType && (
                            <div className="log-detail">
                              <span className="detail-label">Soil:</span>
                              <span className="detail-value">{log.soilType}</span>
                            </div>
                          )}
                        </>
                      )}
                      
                      {log.type === 'Health Issue' && log.issue && (
                        <div className="log-detail">
                          <span className="detail-label">Issue:</span>
                          <span className="detail-value">{log.issue}</span>
                        </div>
                      )}
                      
                      {log.photo && (
                        <div className="log-photo">
                          <img src={log.photo} alt={`${log.type} - ${date}`} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !isLoading && (
            <div className="empty-logs">
              <p>No care logs found for this plant.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PlantDetails; 