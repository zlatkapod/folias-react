import { useState, useEffect } from 'react';

function ConfigPage({ 
  plantTypes: initialPlantTypes, 
  soilTypes: initialSoilTypes,
  potSizes: initialPotSizes,
  lightConditions: initialLightConditions,
  onSavePlantTypes,
  onSaveSoilTypes,
  onSavePotSizes,
  onSaveLightConditions
}) {
  // State for each configuration type
  const [activeSection, setActiveSection] = useState('plantTypes');
  const [plantTypes, setPlantTypes] = useState(initialPlantTypes || []);
  const [soilTypes, setSoilTypes] = useState(initialSoilTypes || []);
  const [potSizes, setPotSizes] = useState(initialPotSizes || []);
  const [lightConditions, setLightConditions] = useState(initialLightConditions || []);
  
  // Form states for adding new items
  const [newPlantType, setNewPlantType] = useState({ 
    name: '', 
    label: '',
    wateringFrequency: 7, 
    lightNeeds: 'Medium', 
    humidityNeeds: 'Medium' 
  });
  
  const [newSoilType, setNewSoilType] = useState({ id: '', label: '' });
  const [newPotSize, setNewPotSize] = useState({ id: '', label: '' });
  const [newLightCondition, setNewLightCondition] = useState({ id: '', label: '' });
  
  // Update component state when props change
  useEffect(() => {
    setPlantTypes(initialPlantTypes || []);
    setSoilTypes(initialSoilTypes || []);
    setPotSizes(initialPotSizes || []);
    setLightConditions(initialLightConditions || []);
  }, [initialPlantTypes, initialSoilTypes, initialPotSizes, initialLightConditions]);
  
  // Helper to generate unique IDs
  const generateId = (prefix) => {
    return `${prefix}_${Date.now()}`;
  };
  
  // Helper to get the ID from an item (works with both MongoDB _id and local id)
  const getItemId = (item) => {
    return item._id || item.id;
  };
  
  // Handler for adding a new plant type
  const handleAddPlantType = (e) => {
    e.preventDefault();
    if (!newPlantType.name) return;
    
    // Format data for MongoDB - use the same structure as the Configuration model
    const plantTypeData = {
      id: plantTypes.length > 0 ? Math.max(...plantTypes.map(p => parseInt(p.id) || 0)) + 1 : 1,
      label: newPlantType.name,
      name: newPlantType.name,
      wateringFrequency: newPlantType.wateringFrequency,
      lightNeeds: newPlantType.lightNeeds,
      humidityNeeds: newPlantType.humidityNeeds
    };
    
    const updatedPlantTypes = [...plantTypes, plantTypeData];
    setPlantTypes(updatedPlantTypes);
    onSavePlantTypes(updatedPlantTypes);
    setNewPlantType({ 
      name: '', 
      label: '',
      wateringFrequency: 7, 
      lightNeeds: 'Medium', 
      humidityNeeds: 'Medium' 
    });
  };
  
  // Handler for adding a new soil type
  const handleAddSoilType = (e) => {
    e.preventDefault();
    if (!newSoilType.id || !newSoilType.label) return;
    
    // Format data for MongoDB - use the same structure as the Configuration model
    const soilTypeData = {
      id: newSoilType.id,
      label: newSoilType.label
    };
    
    const updatedSoilTypes = [...soilTypes, soilTypeData];
    setSoilTypes(updatedSoilTypes);
    onSaveSoilTypes(updatedSoilTypes);
    setNewSoilType({ id: '', label: '' });
  };
  
  // Handler for adding a new pot size
  const handleAddPotSize = (e) => {
    e.preventDefault();
    if (!newPotSize.id || !newPotSize.label) return;
    
    // Format data for MongoDB - use the same structure as the Configuration model
    const potSizeData = {
      id: newPotSize.id,
      label: newPotSize.label
    };
    
    const updatedPotSizes = [...potSizes, potSizeData];
    setPotSizes(updatedPotSizes);
    onSavePotSizes(updatedPotSizes);
    setNewPotSize({ id: '', label: '' });
  };
  
  // Handler for adding a new light condition
  const handleAddLightCondition = (e) => {
    e.preventDefault();
    if (!newLightCondition.id || !newLightCondition.label) return;
    
    // Format data for MongoDB - use the same structure as the Configuration model
    const lightConditionData = {
      id: newLightCondition.id,
      label: newLightCondition.label
    };
    
    const updatedLightConditions = [...lightConditions, lightConditionData];
    setLightConditions(updatedLightConditions);
    onSaveLightConditions(updatedLightConditions);
    setNewLightCondition({ id: '', label: '' });
  };
  
  // Handler for removing a plant type
  const handleRemovePlantType = (id) => {
    const updatedPlantTypes = plantTypes.filter(plant => getItemId(plant) !== id);
    setPlantTypes(updatedPlantTypes);
    onSavePlantTypes(updatedPlantTypes);
  };
  
  // Handler for removing a soil type
  const handleRemoveSoilType = (id) => {
    const updatedSoilTypes = soilTypes.filter(soil => getItemId(soil) !== id);
    setSoilTypes(updatedSoilTypes);
    onSaveSoilTypes(updatedSoilTypes);
  };
  
  // Handler for removing a pot size
  const handleRemovePotSize = (id) => {
    const updatedPotSizes = potSizes.filter(size => getItemId(size) !== id);
    setPotSizes(updatedPotSizes);
    onSavePotSizes(updatedPotSizes);
  };
  
  // Handler for removing a light condition
  const handleRemoveLightCondition = (id) => {
    const updatedLightConditions = lightConditions.filter(light => getItemId(light) !== id);
    setLightConditions(updatedLightConditions);
    onSaveLightConditions(updatedLightConditions);
  };
  
  // Handler for updating a plant type (in-place editing)
  const handleUpdatePlantType = (id, field, value) => {
    const updatedPlantTypes = plantTypes.map(plant => {
      if (getItemId(plant) === id) {
        const updatedPlant = { ...plant, [field]: value };
        
        // If name is updated, also update label to keep them in sync
        if (field === 'name') {
          updatedPlant.label = value;
        }
        
        return updatedPlant;
      }
      return plant;
    });
    
    setPlantTypes(updatedPlantTypes);
    onSavePlantTypes(updatedPlantTypes);
  };
  
  return (
    <div className="config-page">
      <div className="config-tabs">
        <button 
          className={`config-tab ${activeSection === 'plantTypes' ? 'active' : ''}`}
          onClick={() => setActiveSection('plantTypes')}
        >
          Plant Types
        </button>
        <button 
          className={`config-tab ${activeSection === 'soilTypes' ? 'active' : ''}`}
          onClick={() => setActiveSection('soilTypes')}
        >
          Soil Types
        </button>
        <button 
          className={`config-tab ${activeSection === 'potSizes' ? 'active' : ''}`}
          onClick={() => setActiveSection('potSizes')}
        >
          Pot Sizes
        </button>
        <button 
          className={`config-tab ${activeSection === 'lightConditions' ? 'active' : ''}`}
          onClick={() => setActiveSection('lightConditions')}
        >
          Light Conditions
        </button>
      </div>
      
      <div className="config-content">
        {/* Plant Types Section */}
        {activeSection === 'plantTypes' && (
          <div className="config-section">
            <h2>Configure Plant Types</h2>
            <p className="section-description">
              Add or edit plant types and their care information. This data will be used when adding new plants.
            </p>
            
            <div className="config-table-container">
              <table className="config-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Watering Frequency (days)</th>
                    <th>Light Needs</th>
                    <th>Humidity Needs</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plantTypes.map(plant => (
                    <tr key={getItemId(plant)}>
                      <td>
                        <input 
                          type="text" 
                          value={plant.name} 
                          onChange={(e) => handleUpdatePlantType(getItemId(plant), 'name', e.target.value)}
                          className="edit-input table-input"
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          value={plant.wateringFrequency} 
                          onChange={(e) => handleUpdatePlantType(getItemId(plant), 'wateringFrequency', parseInt(e.target.value))}
                          min="1"
                          max="30"
                          className="edit-input table-input"
                        />
                      </td>
                      <td>
                        <select 
                          value={plant.lightNeeds} 
                          onChange={(e) => handleUpdatePlantType(getItemId(plant), 'lightNeeds', e.target.value)}
                          className="edit-select table-input"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Low to Medium">Low to Medium</option>
                          <option value="Medium to High">Medium to High</option>
                        </select>
                      </td>
                      <td>
                        <select 
                          value={plant.humidityNeeds} 
                          onChange={(e) => handleUpdatePlantType(getItemId(plant), 'humidityNeeds', e.target.value)}
                          className="edit-select table-input"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleRemovePlantType(getItemId(plant))}
                          className="action-btn delete small"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="add-item-form">
              <h3>Add New Plant Type</h3>
              <form onSubmit={handleAddPlantType}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="plantName">Plant Name*</label>
                    <input 
                      type="text" 
                      id="plantName" 
                      value={newPlantType.name} 
                      onChange={(e) => setNewPlantType({...newPlantType, name: e.target.value})}
                      required
                      placeholder="e.g., Monstera Deliciosa"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="wateringFrequency">Watering Frequency (days)*</label>
                    <input 
                      type="number" 
                      id="wateringFrequency" 
                      value={newPlantType.wateringFrequency} 
                      onChange={(e) => setNewPlantType({...newPlantType, wateringFrequency: parseInt(e.target.value)})}
                      min="1"
                      max="30"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="lightNeeds">Light Needs*</label>
                    <select 
                      id="lightNeeds" 
                      value={newPlantType.lightNeeds} 
                      onChange={(e) => setNewPlantType({...newPlantType, lightNeeds: e.target.value})}
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Low to Medium">Low to Medium</option>
                      <option value="Medium to High">Medium to High</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="humidityNeeds">Humidity Needs*</label>
                    <select 
                      id="humidityNeeds" 
                      value={newPlantType.humidityNeeds} 
                      onChange={(e) => setNewPlantType({...newPlantType, humidityNeeds: e.target.value})}
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-button">Add Plant Type</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Soil Types Section */}
        {activeSection === 'soilTypes' && (
          <div className="config-section">
            <h2>Configure Soil Types</h2>
            <p className="section-description">
              Add or edit soil types available for plant care.
            </p>
            
            <div className="config-table-container">
              <table className="config-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Label</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {soilTypes.map(soil => (
                    <tr key={getItemId(soil)}>
                      <td className="table-cell">{getItemId(soil)}</td>
                      <td className="table-cell">{soil.label}</td>
                      <td>
                        <button 
                          onClick={() => handleRemoveSoilType(getItemId(soil))}
                          className="action-btn delete small"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="add-item-form">
              <h3>Add New Soil Type</h3>
              <form onSubmit={handleAddSoilType}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="soilId">ID*</label>
                    <input 
                      type="text" 
                      id="soilId" 
                      value={newSoilType.id} 
                      onChange={(e) => setNewSoilType({...newSoilType, id: e.target.value})}
                      required
                      placeholder="e.g., peat_moss"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="soilLabel">Label*</label>
                    <input 
                      type="text" 
                      id="soilLabel" 
                      value={newSoilType.label} 
                      onChange={(e) => setNewSoilType({...newSoilType, label: e.target.value})}
                      required
                      placeholder="e.g., Peat Moss Mix"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-button">Add Soil Type</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Pot Sizes Section */}
        {activeSection === 'potSizes' && (
          <div className="config-section">
            <h2>Configure Pot Sizes</h2>
            <p className="section-description">
              Add or edit pot size options for plants.
            </p>
            
            <div className="config-table-container">
              <table className="config-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Label</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {potSizes.map(size => (
                    <tr key={getItemId(size)}>
                      <td className="table-cell">{getItemId(size)}</td>
                      <td className="table-cell">{size.label}</td>
                      <td>
                        <button 
                          onClick={() => handleRemovePotSize(getItemId(size))}
                          className="action-btn delete small"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="add-item-form">
              <h3>Add New Pot Size</h3>
              <form onSubmit={handleAddPotSize}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="potSizeId">ID*</label>
                    <input 
                      type="text" 
                      id="potSizeId" 
                      value={newPotSize.id} 
                      onChange={(e) => setNewPotSize({...newPotSize, id: e.target.value})}
                      required
                      placeholder="e.g., extra_large"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="potSizeLabel">Label*</label>
                    <input 
                      type="text" 
                      id="potSizeLabel" 
                      value={newPotSize.label} 
                      onChange={(e) => setNewPotSize({...newPotSize, label: e.target.value})}
                      required
                      placeholder="e.g., Extra Large (16&quot;)"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-button">Add Pot Size</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Light Conditions Section */}
        {activeSection === 'lightConditions' && (
          <div className="config-section">
            <h2>Configure Light Conditions</h2>
            <p className="section-description">
              Add or edit light condition options for plants.
            </p>
            
            <div className="config-table-container">
              <table className="config-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Label</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lightConditions.map(light => (
                    <tr key={getItemId(light)}>
                      <td className="table-cell">{getItemId(light)}</td>
                      <td className="table-cell">{light.label}</td>
                      <td>
                        <button 
                          onClick={() => handleRemoveLightCondition(getItemId(light))}
                          className="action-btn delete small"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="add-item-form">
              <h3>Add New Light Condition</h3>
              <form onSubmit={handleAddLightCondition}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="lightId">ID*</label>
                    <input 
                      type="text" 
                      id="lightId" 
                      value={newLightCondition.id} 
                      onChange={(e) => setNewLightCondition({...newLightCondition, id: e.target.value})}
                      required
                      placeholder="e.g., bright_filtered"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lightLabel">Label*</label>
                    <input 
                      type="text" 
                      id="lightLabel" 
                      value={newLightCondition.label} 
                      onChange={(e) => setNewLightCondition({...newLightCondition, label: e.target.value})}
                      required
                      placeholder="e.g., Bright Filtered Light"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-button">Add Light Condition</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfigPage; 