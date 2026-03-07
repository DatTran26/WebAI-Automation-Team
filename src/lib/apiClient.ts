const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options;

    let url = `${BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams(params);
        url = `${url}?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...init.headers,
        },
        ...init,
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

export const apiClient = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { method: 'GET', ...options }),
    post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
    put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
    delete: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { method: 'DELETE', ...options }),
};
