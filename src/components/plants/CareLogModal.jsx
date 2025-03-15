import { useState } from 'react';

function CareLogModal({ plant, onClose, onSave, isLoading }) {
  const [logType, setLogType] = useState('Watering');
  const [logData, setLogData] = useState({
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  // Define available log types
  const logTypes = [
    'Watering',
    'Fertilizing',
    'Repotting',
    'Health Issue'
  ];

  // Define pot size options
  const potSizes = [
    'Small (4-6")',
    'Medium (8-10")',
    'Large (12"+)'
  ];

  // Define soil type options
  const soilTypes = [
    'All Purpose',
    'Cactus Mix',
    'Orchid Mix',
    'African Violet Mix',
    'Peat Moss',
    'Coconut Coir'
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLogData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // In a real app, you'd upload this to a server
    // For now, we'll just use a local preview
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setLogData(prev => ({
        ...prev,
        photo: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Collect all the log data
    const log = {
      type: logType,
      date: new Date(logData.date).toISOString(),
      notes: logData.notes,
      ...logData,
    };
    
    // Check if this log type might update plant properties
    let plantUpdates = {};
    
    // For repotting, update the plant's pot size and soil type
    if (logType === 'Repotting') {
      plantUpdates = {
        potSize: logData.potSize,
        soilType: logData.soilType
      };
    }
    
    // For health issue, update the plant's health status
    if (logType === 'Health Issue') {
      plantUpdates = {
        health: 'Needs attention'
      };
    }
    
    // Submit data to parent component
    onSave(log, plantUpdates);
  };

  return (
    <div className="care-log-modal">
      <div className="modal-header">
        <h3>Log Care for {plant.name}</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="logType">Care Type:</label>
          <select 
            id="logType"
            value={logType}
            onChange={(e) => setLogType(e.target.value)}
            required
          >
            {logTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={logData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        
        {/* Type-specific fields */}
        {logType === 'Watering' && (
          <div className="form-group">
            <label htmlFor="amount">Amount (ml):</label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="e.g., 250"
              value={logData.amount || ''}
              onChange={handleInputChange}
            />
          </div>
        )}
        
        {logType === 'Fertilizing' && (
          <>
            <div className="form-group">
              <label htmlFor="fertilizer">Fertilizer:</label>
              <input
                type="text"
                id="fertilizer"
                name="fertilizer"
                placeholder="e.g., Plant Food Plus"
                value={logData.fertilizer || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount (ml):</label>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="e.g., 50"
                value={logData.amount || ''}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
        
        {logType === 'Repotting' && (
          <>
            <div className="form-group">
              <label htmlFor="potSize">New Pot Size:</label>
              <select
                id="potSize"
                name="potSize"
                value={logData.potSize || ''}
                onChange={handleInputChange}
              >
                <option value="">Select Pot Size</option>
                {potSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="soilType">Soil Type:</label>
              <select
                id="soilType"
                name="soilType"
                value={logData.soilType || ''}
                onChange={handleInputChange}
              >
                <option value="">Select Soil Type</option>
                {soilTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </>
        )}
        
        {logType === 'Health Issue' && (
          <>
            <div className="form-group">
              <label htmlFor="issue">Issue Type:</label>
              <input
                type="text"
                id="issue"
                name="issue"
                placeholder="e.g., Yellow leaves, Pest infestation"
                value={logData.issue || ''}
                onChange={handleInputChange}
                required={logType === 'Health Issue'}
              />
            </div>
            <div className="form-group">
              <label htmlFor="treatment">Treatment Applied:</label>
              <input
                type="text"
                id="treatment"
                name="treatment"
                placeholder="e.g., Neem oil spray, Removed affected leaves"
                value={logData.treatment || ''}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
        
        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Additional notes about this care activity..."
            value={logData.notes}
            onChange={handleInputChange}
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="photo">Photo (Optional):</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handlePhotoUpload}
          />
          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="Preview" />
            </div>
          )}
        </div>
        
        <div className="modal-actions">
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="save-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Log'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CareLogModal; 