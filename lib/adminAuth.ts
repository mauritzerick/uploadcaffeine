import { cookies } from 'next/headers'

const ADMIN_COOKIE_NAME = 'admin_token'
const ADMIN_TOKEN = process.env.WEB_ADMIN_TOKEN || 'supersecret'

export interface AdminAuthResult {
  isAuthenticated: boolean
  error?: string
}

/**
 * Validate admin token from cookie or query param
 * @param token Optional token from query param
 * @returns Authentication result
 */
export async function validateAdminAuth(token?: string): Promise<AdminAuthResult> {
  // Check for token in query param (first-time auth)
  if (token) {
    if (token === ADMIN_TOKEN) {
      return { isAuthenticated: true }
    }
    return { isAuthenticated: false, error: 'Invalid token' }
  }

  // Check for existing cookie
  const cookieStore = cookies()
  const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME)

  if (!adminCookie) {
    return { isAuthenticated: false, error: 'No token provided' }
  }

  if (adminCookie.value === ADMIN_TOKEN) {
    return { isAuthenticated: true }
  }

  return { isAuthenticated: false, error: 'Invalid token' }
}

/**
 * Set admin auth cookie
 * @param token The admin token to validate and set
 * @returns Success status
 */
export function setAdminCookie(token: string): boolean {
  if (token !== ADMIN_TOKEN) {
    return false
  }

  const cookieStore = cookies()
  
  // Set cookie for 24 hours
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })

  return true
}

/**
 * Clear admin auth cookie
 */
export function clearAdminCookie() {
  const cookieStore = cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

/**
 * Check if admin is authenticated (for API routes)
 */
export async function requireAdminAuth(): Promise<{ isAuthenticated: boolean; error?: string }> {
  const result = await validateAdminAuth()
  
  if (!result.isAuthenticated) {
    return { isAuthenticated: false, error: result.error || 'Unauthorized' }
  }

  return { isAuthenticated: true }
}


