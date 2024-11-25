import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    primary_tenant?: {
        id: string;
        name: string;
        role: string;
        subdomain: string;
    };
    other_tenants: Array<{
        id: string;
        name: string;
        role: string;
        subdomain: string;
    }>;
}

interface Tenant {
    id: string;
    name: string;
    role: string;
    subdomain: string;
}

const hasPermission = (tenant: Tenant | null, requiredRole: string) => {
    return tenant?.role === requiredRole;
};

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    currentTenant: Tenant | null;
    userTenantRoles: Tenant[];
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setCurrentTenant: (tenant: Tenant) => void;
    isOwner: boolean;
    isStaff: boolean;
    isClient: boolean;
    can: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
    const [userTenantRoles, setUserTenantRoles] = useState<Tenant[]>([]);

    const can = (role: string) => {
        return currentTenant ? hasPermission(currentTenant, role) : false;
    };

    const isOwner = can('Owner');
    const isStaff = can('Staff');
    const isClient = can('Client');

    const loadUserData = async () => {
        try {
            const response = await api.get('/auth/me');
            console.log('User data response:', response.data);

            const userData = response.data;
            setUser(userData);

            // Set current tenant from primary tenant
            if (userData.primary_tenant) {
                setCurrentTenant(userData.primary_tenant);
            }

            // Combine primary and other tenants for the full list
            const allTenants = [
                ...(userData.primary_tenant ? [userData.primary_tenant] : []),
                ...(userData.other_tenants || [])
            ];
            setUserTenantRoles(allTenants);

        } catch (error) {
            console.error('Error loading user data:', error);
            await logout();
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            console.log('Login response:', response.data);

            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            setUser(userData);

            // Set current tenant from primary tenant
            if (userData.primary_tenant) {
                setCurrentTenant(userData.primary_tenant);
            }

            // Combine primary and other tenants for the full list
            const allTenants = [
                ...(userData.primary_tenant ? [userData.primary_tenant] : []),
                ...(userData.other_tenants || [])
            ];
            setUserTenantRoles(allTenants);

        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        localStorage.removeItem('token');
        setUser(null);
        setCurrentTenant(null);
        setUserTenantRoles([]);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadUserData();
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                currentTenant,
                userTenantRoles,
                login,
                logout,
                setCurrentTenant,
                isOwner,
                isStaff,
                isClient,
                can,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}