// Shared formatting utilities for the CV Analyzer application

/**
 * Formats a date to a readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string ('short', 'long', 'relative', 'iso')
 * @returns {string} - Formatted date string
 */
const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffInMs = now - dateObj;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString();
      
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
    case 'relative':
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays === -1) return 'Tomorrow';
      if (diffInDays > 0 && diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 0 && diffInDays > -7) return `In ${Math.abs(diffInDays)} days`;
      return dateObj.toLocaleDateString();
      
    case 'iso':
      return dateObj.toISOString();
      
    default:
      return dateObj.toLocaleDateString();
  }
};

/**
 * Formats a number with appropriate units
 * @param {number} bytes - Number of bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted size string
 */
const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Formats a percentage value
 * @param {number} value - Value to format (0-100)
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted percentage string
 */
const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formats a score with color coding
 * @param {number} score - Score value (0-100)
 * @returns {object} - Object with formatted score and color class
 */
const formatScore = (score) => {
  if (typeof score !== 'number' || isNaN(score)) {
    return { text: 'N/A', color: 'text-gray-500' };
  }
  
  let color = 'text-red-500';
  if (score >= 80) color = 'text-green-500';
  else if (score >= 60) color = 'text-yellow-500';
  else if (score >= 40) color = 'text-orange-500';
  
  return {
    text: score.toFixed(1),
    color
  };
};

/**
 * Formats a phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
const formatPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return 'N/A';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
};

/**
 * Formats a name with proper capitalization
 * @param {string} name - Name to format
 * @returns {string} - Formatted name
 */
const formatName = (name) => {
  if (!name || typeof name !== 'string') return 'N/A';
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats currency values
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} - Formatted currency string
 */
const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch (error) {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

/**
 * Formats a duration in milliseconds to human-readable format
 * @param {number} ms - Duration in milliseconds
 * @returns {string} - Formatted duration string
 */
const formatDuration = (ms) => {
  if (typeof ms !== 'number' || isNaN(ms) || ms < 0) return '0ms';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  if (seconds > 0) return `${seconds}s`;
  return `${ms}ms`;
};

/**
 * Truncates text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} - Truncated text
 */
const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Formats a list of items for display
 * @param {Array} items - Array of items to format
 * @param {string} separator - Separator between items (default: ', ')
 * @param {number} maxItems - Maximum number of items to show
 * @returns {string} - Formatted list string
 */
const formatList = (items, separator = ', ', maxItems = 5) => {
  if (!Array.isArray(items) || items.length === 0) return 'None';
  
  if (items.length <= maxItems) {
    return items.join(separator);
  }
  
  const shown = items.slice(0, maxItems);
  const remaining = items.length - maxItems;
  
  return `${shown.join(separator)} and ${remaining} more`;
};

/**
 * Formats a timestamp for display
 * @param {Date|string|number} timestamp - Timestamp to format
 * @returns {string} - Formatted timestamp
 */
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Invalid Timestamp';
  
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};

module.exports = {
  formatDate,
  formatFileSize,
  formatPercentage,
  formatScore,
  formatPhone,
  formatName,
  formatCurrency,
  formatDuration,
  truncateText,
  formatList,
  formatTimestamp
};
