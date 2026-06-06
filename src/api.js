const API_BASE = '';

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

export async function logout() {
  return await apiFetch('/logout', {
    method: 'POST',
  });
}

export async function fetchMe() {
  return await apiFetch('/me');
}

export async function fetchAnuncios() {
  return await apiFetch('/anuncios');
}

export async function fetchAnuncioDetalle(id) {
  return await apiFetch(`/anuncios/${id}`);
}

export async function createAnuncio(data) {
  return await apiFetch('/anuncios', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchAdminAnuncios() {
  return await apiFetch('/admin/anuncios');
}

export async function comprarEntrada(anuncioId, cantidad = 1) {
  return await apiFetch(`/anuncios/${anuncioId}/comprar`, {
    method: 'POST',
    body: JSON.stringify({ cantidad }),
  });
}

export async function fetchMisEntradas() {
  return await apiFetch('/mis-entradas');
}

export async function fetchDetalleEntrada(id) {
  return await apiFetch(`/mis-entradas/${id}`);
}

export async function actualizarSaldo(operacion, monto) {
  return await apiFetch('/billetera', {
    method: 'POST',
    body: JSON.stringify({ operacion, monto: parseFloat(monto) }),
  });
}
