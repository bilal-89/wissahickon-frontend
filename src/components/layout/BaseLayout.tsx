import React, { useState } from 'react';
import { Menu, X, ChevronDown, Home, Users, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const BaseLayout = ({ children }: { children?: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { currentTenant, user, setCurrentTenant, logout, isOwner, isStaff, isClient } = useAuth();

    const allTenants = user?.primary_tenant ?
        [user.primary_tenant, ...(user?.other_tenants || [])] :
        user?.other_tenants || [];

    const handleTenantChange = (tenant: any) => {
        setCurrentTenant(tenant);
    };

    const handleLogout = async () => {
        await logout();
    };

    const CurrentPermissions = () => {
        if (!currentTenant) return null;

        return (
            <div className="p-4 bg-gray-50 mt-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">Current Access:</span>
                </div>
                <div className="text-sm text-gray-600">
                    <div>Business: {currentTenant.name}</div>
                    <div>Role: {currentTenant.role}</div>
                    <div className="mt-2 text-xs">
                        {isOwner && <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded mr-2">Owner Access</span>}
                        {isStaff && <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded mr-2">Staff Access</span>}
                        {isClient && <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded">Client Access</span>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Left side */}
                        <div className="flex">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                            >
                                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <div className="ml-4 flex items-center">
                                <span className="text-lg font-semibold text-gray-900">WISSAHICKON</span>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center">
                            <div className="relative inline-block text-left">
                                <div className="flex items-center">
                                    <button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                        <span>{currentTenant?.name || 'Select Business'}</span>
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-20`}
            >
                <div className="flex flex-col h-full">
                    {/* Tenant Selector */}
                    <div className="p-4 border-b">
                        <div className="space-y-1">
                            {allTenants.map((tenant) => (
                                <button
                                    key={tenant.id}
                                    onClick={() => handleTenantChange(tenant)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                                        currentTenant?.id === tenant.id
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="font-medium">{tenant.name}</div>
                                    <div className="text-xs text-gray-500">{tenant.role}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 p-4 space-y-1">
                        <a href="/" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                            <Home className="mr-3 h-5 w-5" />
                            Dashboard
                        </a>
                        {(isOwner || isStaff) && (
                            <a href="/users" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                                <Users className="mr-3 h-5 w-5" />
                                Users
                            </a>
                        )}
                        {isOwner && (
                            <a href="/settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                                <Settings className="mr-3 h-5 w-5" />
                                Settings
                            </a>
                        )}
                    </nav>

                    <div className="border-t mt-4 pt-4 px-4">
                        <CurrentPermissions />
                    </div>

                    {/* Bottom Section */}
                    <div className="p-4 border-t mt-auto">
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 w-full"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default BaseLayout;