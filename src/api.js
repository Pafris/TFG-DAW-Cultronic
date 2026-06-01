const API_BASE = 'http://127.0.0.1:8000';

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(options.headers || {}),
    },
    mode: 'cors',
    ...options,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message = data?.message || data?.error || 'Error de conexión con el servidor';
    throw new Error(message);
  }

  return data;
}

export async function login(credentials) {
  return await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(values) {
  return await apiFetch('/register', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export async function fetchAnuncios() {
  return await apiFetch('/anuncios');
}
