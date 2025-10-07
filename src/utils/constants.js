// Application constants
export const APP_NAME = 'SHERLOUK';
export const APP_DESCRIPTION = 'Advanced Data Management Platform';

// API Configuration
export const API_BASE_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) ? (import.meta.env.VITE_API_BASE_URL) : (process.env?.NODE_ENV === 'development' ? 'http://localhost:4000/api' : '/api');

export const API_TIMEOUT = 10000; // 10 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// Table Management
export const SYNC_STATUS = {
  SYNCED: 'synced',
  SYNCING: 'syncing',
  ERROR: 'error',
  OFFLINE: 'offline'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

// Theme
export const THEME_STORAGE_KEY = 'sherlouk-theme';

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'sherlouk-theme',
  USER_PREFERENCES: 'sherlouk-user-preferences',
  DASHBOARD_FILTERS: 'sherlouk-dashboard-filters',
  TABLE_SETTINGS: 'sherlouk-table-settings'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  FULL: 'MMMM dd, yyyy HH:mm:ss',
  SHORT: 'MM/dd/yyyy',
  ISO: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  TABLE_NAME_MIN_LENGTH: 1,
  TABLE_NAME_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a CSV or Excel file.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  TABLE_CREATED: 'Table created successfully.',
  TABLE_UPDATED: 'Table updated successfully.',
  TABLE_DELETED: 'Table deleted successfully.',
  USER_CREATED: 'User created successfully.',
  USER_UPDATED: 'User updated successfully.',
  USER_DELETED: 'User deleted successfully.',
  SETTINGS_SAVED: 'Settings saved successfully.',
  FILE_UPLOADED: 'File uploaded successfully.',
  DATA_EXPORTED: 'Data exported successfully.'
};