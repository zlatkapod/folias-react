import { useState } from 'react';

function Dashboard({ plants }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  
  // Calculate date range for the selected timeframe
  const getDateRange = () => {
    const today = new Date();
    const endDate = new Date();
    
    switch(selectedTimeframe) {
      case 'week':
        endDate.setDate(today.getDate() + 7);
        break;
      case 'month':
        endDate.setMonth(today.getMonth() + 1);
        break;
      default:
        endDate.setDate(today.getDate() + 7);
    }
    
    return {
      start: today,
      end: endDate
    };
  };
  
  // Get upcoming care tasks within the selected timeframe
  const getUpcomingTasks = () => {
    const dateRange = getDateRange();
    
    // Get watering tasks
    const wateringTasks = plants
      .filter(plant => {
        const wateringDate = new Date(plant.nextWatering);
        return wateringDate >= dateRange.start && wateringDate <= dateRange.end;
      })
      .map(plant => ({
        plantId: plant.id,
        plantName: plant.name,
        task: 'Watering',
        dueDate: plant.nextWatering,
        room: plant.room
      }));
    
    // In a real app, we would have other tasks like:
    // - Fertilizing tasks
    // - Repotting reminders
    // - Seasonal care tasks
    
    // Combine all tasks and sort by due date
    return [...wateringTasks].sort((a, b) => 
      new Date(a.dueDate) - new Date(b.dueDate)
    );
  };
  
  const upcomingTasks = getUpcomingTasks();
  
  // Get plant health statistics
  const healthStats = {
    healthy: plants.filter(p => p.health === 'Good').length,
    needsAttention: plants.filter(p => p.health === 'Needs attention').length,
    total: plants.length
  };
  
  // Count plants by room
  const plantsByRoom = plants.reduce((acc, plant) => {
    acc[plant.room] = (acc[plant.room] || 0) + 1;
    return acc;
  }, {});
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  return (
    <div className="dashboard">
      <section className="dashboard-section tasks-section">
        <div className="section-header">
          <h2>Upcoming Plant Care</h2>
          <div className="timeframe-selector">
            <button 
              className={selectedTimeframe === 'week' ? 'active' : ''} 
              onClick={() => setSelectedTimeframe('week')}
            >
              This Week
            </button>
            <button 
              className={selectedTimeframe === 'month' ? 'active' : ''} 
              onClick={() => setSelectedTimeframe('month')}
            >
              This Month
            </button>
          </div>
        </div>
        
        <div className="task-list">
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map(task => (
              <div key={`${task.plantId}-${task.task}`} className="task-card">
                <div className="task-info">
                  <span className="task-name">{task.task}</span>
                  <span className="plant-name">{task.plantName}</span>
                  <span className="task-location">in {task.room}</span>
                </div>
                <div className="task-date">
                  <span className="due-date">{formatDate(task.dueDate)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No plant care tasks scheduled for this period.</p>
            </div>
          )}
        </div>
      </section>
      
      <div className="dashboard-sidebar">
        <section className="dashboard-section">
          <h2>Plant Health Overview</h2>
          <div className="health-stats">
            <div className="stat-card">
              <span className="stat-number">{healthStats.healthy}</span>
              <span className="stat-label">Healthy</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{healthStats.needsAttention}</span>
              <span className="stat-label">Needs Attention</span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-label">
              <span>Overall Health</span>
              <span>{Math.round((healthStats.healthy / healthStats.total) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(healthStats.healthy / healthStats.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </section>
        
        <section className="dashboard-section">
          <h2>Plants by Room</h2>
          <div className="room-stats">
            {Object.entries(plantsByRoom).map(([room, count]) => (
              <div key={room} className="room-stat-item">
                <span className="room-name">{room}</span>
                <span className="room-count">{count} plants</span>
              </div>
            ))}
          </div>
        </section>
        
        <section className="dashboard-section quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-button">
              Log Watering
            </button>
            <button className="action-button">
              Record Health Issue
            </button>
            <button className="action-button">
              Add Plant Notes
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard; 