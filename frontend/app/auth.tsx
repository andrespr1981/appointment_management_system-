import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function verifyRefreshToken(): Promise<{ valid: boolean; status: number }> {
    try {
        const response = await fetch(`${API_URL}/auth/verify_refresh`, {
            method: 'POST',
            credentials: 'include'
        })
        if (response.ok) {
            return { valid: true, status: response.status }
        } else {
            return { valid: false, status: 401 }
        }
    } catch (e) {
        return { valid: false, status: 500 }
    }
}