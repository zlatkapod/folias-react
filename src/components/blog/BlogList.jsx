import { useState, useEffect } from 'react';
import BlogPostDetails from './BlogPostDetails';

function BlogList({ blogPosts: initialBlogPosts, onUpdateBlogPost, onDeleteBlogPost }) {
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Update component state when props change
  useEffect(() => {
    setBlogPosts(initialBlogPosts);
  }, [initialBlogPosts]);
  
  // Get unique tags for the filter dropdown
  const allTags = blogPosts.flatMap(post => post.tags || []);
  const uniqueTags = [...new Set(allTags)];
  
  // Filter blog posts based on search term and tag filter
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      (post.title ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (post.headline ? post.headline.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (post.content ? post.content.toLowerCase().includes(searchTerm.toLowerCase()) : false);
      
    const matchesTag = filterTag === '' || (post.tags ? post.tags.includes(filterTag) : false);
    
    return matchesSearch && matchesTag;
  });
  
  // Handle blog post detail view
  const handleViewDetails = (post) => {
    setSelectedPost(post);
    setShowDetails(true);
  };
  
  // Handle adding a new blog post
  const handleAddBlogPostClick = () => {
    if (window.setActiveView) {
      window.setActiveView('addBlogPost');
    } else {
      console.warn('Cannot navigate to Add Blog Post view - setActiveView not available');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  return (
    <div className="blog-view">
      <div className="blog-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-item">
            <label htmlFor="tagFilter">Tag:</label>
            <select
              id="tagFilter"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
            >
              <option value="">All Tags</option>
              {uniqueTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {filteredPosts.length > 0 || !searchTerm ? (
        <div className="blog-posts-list">
          {/* Add New Blog Post Card - First Item */}
          <div 
            className="blog-post-card add-blog-post-card"
            onClick={handleAddBlogPostClick}
          >
            <div className="add-blog-post-icon">
              <span className="plus-icon">+</span>
            </div>
          </div>
          
          {/* Existing Blog Post Cards */}
          {filteredPosts.map(post => (
            <div 
              key={post.id} 
              className="blog-post-card"
              onClick={() => handleViewDetails(post)}
            >
              <div className="blog-post-header">
                <h3>{post.title}</h3>
                <span className="blog-post-date">{formatDate(post.createdAt)}</span>
              </div>
              
              <p className="blog-post-headline">{post.headline}</p>
              
              <div className="blog-post-tags">
                {post.tags && post.tags.map(tag => (
                  <span key={tag} className="blog-tag">#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No blog posts found matching your criteria.</p>
          <button onClick={() => {
            setSearchTerm('');
            setFilterTag('');
          }}>Clear Filters</button>
        </div>
      )}
      
      {/* Blog Post Details Page */}
      {showDetails && selectedPost && (
        <div className="details-overlay">
          <BlogPostDetails
            post={selectedPost}
            onClose={() => setShowDetails(false)}
            onSave={onUpdateBlogPost}
            onDelete={onDeleteBlogPost}
          />
        </div>
      )}
    </div>
  );
}

export default BlogList; 