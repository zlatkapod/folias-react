import { useState } from 'react';

function AddBlogPostForm({ onAddBlogPost }) {
  const [formData, setFormData] = useState({
    title: '',
    headline: '',
    content: '',
    tags: [],
    images: []
  });
  
  const [tagsInput, setTagsInput] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle tags input
  const handleTagsChange = (e) => {
    setTagsInput(e.target.value);
    
    // Parse tags from comma-separated input
    const tagsArray = e.target.value.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    setFormData({
      ...formData,
      tags: tagsArray
    });
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create a preview URL for the image
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    
    // In a real application, you would upload the image to a server
    // For now, we'll just store the file object and URL
    setFormData({
      ...formData,
      images: [...formData.images, {
        file,
        url: imageUrl,
        alt: file.name
      }]
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.content) {
      alert('Please fill in the title and content fields.');
      return;
    }
    
    // Submit form data
    onAddBlogPost(formData);
  };
  
  // Handle cancellation and return to blog list
  const handleCancel = () => {
    if (window.setActiveView) {
      window.setActiveView('blog');
    }
  };
  
  return (
    <div className="add-blog-post-form">
      <h2>Add New Blog Post</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a title for your blog post"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="headline">Headline/Summary</label>
          <input
            type="text"
            id="headline"
            name="headline"
            value={formData.headline}
            onChange={handleInputChange}
            placeholder="A brief summary or headline for your post"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Add an Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageUpload}
            accept="image/*"
            className="file-input"
          />
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Preview" />
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content * (Supports Markdown)</label>
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
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Write your blog post content here... Use Markdown for formatting!"
            rows={15}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={tagsInput}
            onChange={handleTagsChange}
            placeholder="mushrooms, microdosing, health, etc."
          />
          {formData.tags.length > 0 && (
            <div className="tags-preview">
              {formData.tags.map(tag => (
                <span key={tag} className="blog-tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Publish Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBlogPostForm; 