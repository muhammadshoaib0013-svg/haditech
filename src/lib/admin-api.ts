/**
 * Shared Admin API Client Helper
 * Enforces unified JSON response parsing and strict error mapping.
 */

async function parseApiResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      body?.error ||
      body?.message ||
      body?.code ||
      `Request failed with status ${res.status}`

    throw new Error(message)
  }

  // Handle both { success: true, data: T } and raw T response shapes
  if (body && typeof body === 'object' && 'success' in body) {
    if (body.success === false) {
      throw new Error(body.error || 'Request failed')
    }
    return body.data as T
  }

  return body as T
}

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: 'GET' })
  return parseApiResponse<T>(res)
}

export async function apiPost<T>(url: string, payload: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return parseApiResponse<T>(res)
}

export async function apiPut<T>(url: string, payload: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return parseApiResponse<T>(res)
}

export async function apiDelete<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: 'DELETE' })
  return parseApiResponse<T>(res)
}
