const normalizeApiBaseUrl = () => {
  const configured = (import.meta.env.VITE_API_URL || '').trim();

  if (!configured) {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/api`;
    }
    return 'http://localhost:5000/api';
  }

  const withoutTrailingSlash = configured.replace(/\/+$/, '');
  const withApiPath = withoutTrailingSlash.endsWith('/api')
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;

  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && withApiPath.startsWith('http://') && !withApiPath.includes('localhost')) {
    return withApiPath.replace('http://', 'https://');
  }

  return withApiPath;
};

const API_URL = normalizeApiBaseUrl();

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return {
    success: false,
    message: text || 'Unexpected server response',
  };
};

const requestJson = async (path, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${path}`, options);
    const data = await parseResponse(response);
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(`Unable to connect to API (${API_URL}). Check VITE_API_URL, backend status, CORS, and HTTPS settings.`);
    }
    throw error;
  }
};

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth header
const getAuthHeaders = (isJson = true) => {
  const token = getAuthToken();
  return {
    ...(isJson && { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return requestJson('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: async () => {
    return requestJson('/auth/me', {
      headers: getAuthHeaders(),
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },
};

// Property API
export const propertyAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${API_URL}/properties?${queryString}`
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  getOne: async (id) => {
    const response = await fetch(`${API_URL}/properties/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  getTrending: async (limit = 6) => {
    const response = await fetch(`${API_URL}/properties/trending?limit=${limit}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  getFeatured: async (limit = 6) => {
    const response = await fetch(`${API_URL}/properties/featured?limit=${limit}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  getAdvertisements: async () => {
    const response = await fetch(`${API_URL}/properties/advertisements`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  incrementViews: async (id) => {
    const response = await fetch(`${API_URL}/properties/${id}/view`, {
      method: 'PUT',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  // Admin endpoints
  create: async (formData) => {
    const response = await fetch(`${API_URL}/properties`, {
      method: 'POST',
      headers: getAuthHeaders(false),
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  update: async (id, formData) => {
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(false),
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  toggleFeatured: async (id) => {
    const response = await fetch(`${API_URL}/properties/${id}/featured`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  toggleActive: async (id) => {
    const response = await fetch(`${API_URL}/properties/${id}/active`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  deleteImage: async (propertyId, publicId) => {
    const response = await fetch(
      `${API_URL}/properties/${propertyId}/images/${publicId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  getAdminProperties: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return requestJson(`/properties/admin/all?${queryString}`, {
      headers: getAuthHeaders(),
    });
  },
};

// Lead API
export const leadAPI = {
  create: async (leadData) => {
    const response = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  // Admin endpoints
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return requestJson(`/leads?${queryString}`, {
      headers: getAuthHeaders(),
    });
  },

  getByProperty: async (propertyId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${API_URL}/leads/property/${propertyId}?${queryString}`,
      {
        headers: getAuthHeaders(),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  updateStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  getStats: async () => {
    const response = await fetch(`${API_URL}/leads/stats`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
};
