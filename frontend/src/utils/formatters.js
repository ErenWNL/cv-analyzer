// Date formatting
export const formatDate = (date, options = {}) => {
  const {
    format = 'medium',
    locale = 'en-US',
    timezone = undefined
  } = options;

  if (!date) return 'N/A';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  const formatOptions = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' },
    date: { year: 'numeric', month: '2-digit', day: '2-digit' }
  };

  try {
    return dateObj.toLocaleDateString(locale, {
      ...formatOptions[format],
      timeZone: timezone
    });
  } catch (error) {
    return dateObj.toLocaleDateString();
  }
};

// Relative time formatting
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

// File size formatting
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Number formatting
export const formatNumber = (number, options = {}) => {
  const {
    decimals = 2,
    locale = 'en-US',
    currency = undefined,
    notation = 'standard'
  } = options;

  if (number === null || number === undefined || isNaN(number)) return 'N/A';

  const num = Number(number);

  if (currency) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  }

  if (notation === 'compact') {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      maximumFractionDigits: decimals
    }).format(num);
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

// Percentage formatting
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  
  const num = Number(value);
  return `${num.toFixed(decimals)}%`;
};

// Phone number formatting
export const formatPhoneNumber = (phoneNumber, format = 'US') => {
  if (!phoneNumber) return 'N/A';

  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (format === 'US') {
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
  }
  
  return phoneNumber;
};

// Credit card formatting
export const formatCreditCard = (cardNumber, mask = true) => {
  if (!cardNumber) return 'N/A';

  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (mask) {
    if (cleaned.length >= 4) {
      return `**** **** **** ${cleaned.slice(-4)}`;
    }
    return '**** **** **** ****';
  }
  
  // Format without masking
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
};

// URL formatting
export const formatURL = (url, maxLength = 50) => {
  if (!url) return 'N/A';

  try {
    const urlObj = new URL(url);
    let formatted = urlObj.hostname + urlObj.pathname;
    
    if (formatted.length > maxLength) {
      formatted = formatted.substring(0, maxLength - 3) + '...';
    }
    
    return formatted;
  } catch {
    return url.length > maxLength ? url.substring(0, maxLength - 3) + '...' : url;
  }
};

// Text truncation
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Capitalize first letter
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Title case formatting
export const toTitleCase = (text) => {
  if (!text) return '';
  
  return text.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Slug generation
export const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Currency formatting with symbol
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined || isNaN(amount)) return 'N/A';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch (error) {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

// Duration formatting
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

// Address formatting
export const formatAddress = (address) => {
  if (!address) return 'N/A';
  
  const parts = [
    address.street,
    address.city,
    address.state,
    address.postalCode,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
};
