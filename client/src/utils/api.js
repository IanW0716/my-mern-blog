const API_BASE = 'https://api.gzw-blog.me';

export async function apiClient(url, options = {}) {
    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        credentials: 'include',
    });

    return response;
}
