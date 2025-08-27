import React, { useState } from 'react';
import './SearchBox.css';

const SearchBox = ({ 
  placeholder = "🔍 Tìm kiếm...",
  onSearch,
  onClear,
  showClearButton = true,
  className = "",
  disabled = false,
  size = "medium" // small, medium, large
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onClear) {
      onClear();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className={`search-box-container ${className} search-size-${size}`}>
      <div className={`search-input-wrapper ${isFocused ? 'focused' : ''}`}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="search-input"
          disabled={disabled}
        />
        
        {showClearButton && query && (
          <button 
            onClick={handleClear}
            className="clear-search-btn"
            title="Xóa tìm kiếm"
            disabled={disabled}
          >
            ✕
          </button>
        )}
        
        <div className="search-icon">
          🔍
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
