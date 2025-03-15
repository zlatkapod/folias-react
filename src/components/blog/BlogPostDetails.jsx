import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function BlogPostDetails({ post, onClose, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(post);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'tags') {
      // Convert comma-separated tags to array
      const tagsArray = value.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      setEditedPost({
        ...editedPost,
        tags: tagsArray
      });
    } else {
      setEditedPost({
        ...editedPost,
        [name]: value
      });
    }
  };
  
  // Handle image upload for editing
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create a preview URL for the image
    const imageUrl = URL.createObjectURL(file);
    
    // In a real application, you would upload the image to a server
    // For now, we'll just store the file object and URL
    setEditedPost({
      ...editedPost,
      images: [...(editedPost.images || []), {
        file,
        url: imageUrl,
        alt: file.name
      }]
    });
  };
  
  // Handle save
  const handleSave = () => {
    onSave(editedPost);
    setIsEditing(false);
  };
  
  // Handle delete
  const handleDelete = () => {
    onDelete(post.id);
    onClose();
  };
  
  return (
    <div className="blog-post-details-page">
      <div className="details-header">
        <h2>{isEditing ? 'Edit Blog Post' : post.title}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="blog-post-details-content">
        {isEditing ? (
          <div className="blog-post-edit-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editedPost.title}
                onChange={handleInputChange}
                className="edit-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="headline">Headline</label>
              <input
                type="text"
                id="headline"
                name="headline"
                value={editedPost.headline}
                onChange={handleInputChange}
                className="edit-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="blogImage">Add an Image</label>
              <input
                type="file"
                id="blogImage"
                name="blogImage"
                onChange={handleImageUpload}
                accept="image/*"
                className="file-input"
              />
              {editedPost.images && editedPost.images.length > 0 && (
                <div className="images-preview">
                  {editedPost.images.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={image.url} alt={image.alt || 'Blog image'} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Content (Supports Markdown)</label>
              <div className="markdown-tips">
                <p>You can use Markdown to format your text:</p>
                <ul>
                  <li><code># Heading 1</code> - For a large header</li>
                  <li><code>## Heading 2</code> - For a subheader</li>
                  <li><code>**bold text**</code> - For <strong>bold text</strong></li>
                  <li><code>*italic text*</code> - For <em>italic text</em></li>
                  <li><code>[link text](https://example.com)</code> - For links</li>
                  <li><code>- item</code> - For bullet lists</li>
                  <li><code>1. item</code> - For numbered lists</li>
                </ul>
              </div>
              <textarea
                id="content"
                name="content"
                value={editedPost.content}
                onChange={handleInputChange}
                className="edit-textarea"
                rows={15}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={(editedPost.tags || []).join(', ')}
                onChange={handleInputChange}
                className="edit-input"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            
            <div className="edit-actions">
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="blog-post-view">
            <div className="blog-post-meta">
              <p className="blog-post-created-at">
                Posted on {formatDate(post.createdAt)}
              </p>
              <div className="blog-post-tags">
                {post.tags && post.tags.map(tag => (
                  <span key={tag} className="blog-tag">#{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="blog-post-headline-section">
              <h3>{post.headline}</h3>
            </div>
            
            {/* Display images if available */}
            {post.images && post.images.length > 0 && (
              <div className="blog-post-images">
                {post.images.map((image, index) => (
                  <div key={index} className="blog-post-image">
                    <img src={image.url} alt={image.alt || 'Blog image'} />
                  </div>
                ))}
              </div>
            )}
            
            <div className="blog-post-content">
              {/* Render content as Markdown */}
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
            
            <div className="blog-post-actions">
              <button 
                className="action-btn edit" 
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button 
                className="action-btn delete" 
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h3>Delete Blog Post?</h3>
            <p>Are you sure you want to delete "{post.title}"? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="action-btn delete" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogPostDetails; 