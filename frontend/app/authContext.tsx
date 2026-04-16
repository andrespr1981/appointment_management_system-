"use client";
import { createContext, useContext, useState } from "react";

// 1. Crear el contexto
const AuthContext = createContext<any>(null);

// 2. Crear el proveedor
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Hook para usar el contexto
export function useAuth() {
    return useContext(AuthContext);
}
