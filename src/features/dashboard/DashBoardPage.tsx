import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Calendar, Clock, Bell, User, Settings } from 'lucide-react';

const DashboardPage = () => {
    const { currentTenant, isOwner, isStaff, isClient } = useAuth();

    const QuickActions = () => {
        if (isOwner) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickActionButton
                        icon={<User className="h-5 w-5" />}
                        label="Manage Users"
                        href="/users"
                    />
                    <QuickActionButton
                        icon={<Settings className="h-5 w-5" />}
                        label="Business Settings"
                        href="/settings"
                    />
                    <QuickActionButton
                        icon={<Bell className="h-5 w-5" />}
                        label="Notifications"
                        href="/notifications"
                    />
                </div>
            );
        }

        if (isStaff) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickActionButton
                        icon={<Calendar className="h-5 w-5" />}
                        label="View Schedule"
                        href="/schedule"
                    />
                    <QuickActionButton
                        icon={<Clock className="h-5 w-5" />}
                        label="Time Clock"
                        href="/time-clock"
                    />
                    <QuickActionButton
                        icon={<Bell className="h-5 w-5" />}
                        label="Tasks"
                        href="/tasks"
                    />
                </div>
            );
        }

        // Client Quick Actions
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickActionButton
                    icon={<Calendar className="h-5 w-5" />}
                    label="Book Service"
                    href="/book"
                />
                <QuickActionButton
                    icon={<Clock className="h-5 w-5" />}
                    label="View History"
                    href="/history"
                />
                <QuickActionButton
                    icon={<Bell className="h-5 w-5" />}
                    label="Messages"
                    href="/messages"
                />
            </div>
        );
    };

    const QuickActionButton = ({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) => (
        <a
            href={href}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
                {icon}
            </div>
            <span className="font-medium text-gray-900">{label}</span>
        </a>
    );

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <Shield className="h-6 w-6 text-blue-500" />
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Welcome to {currentTenant?.name}
                    </h1>
                </div>
                <p className="text-gray-600">
                    You are viewing this business as: <span className="font-medium">{currentTenant?.role}</span>
                </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                <QuickActions />
            </div>

            {/* Recent Activity - Shared across all roles */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                <div className="text-gray-600">
                    {/* Placeholder for activity feed */}
                    <p>No recent activity to show.</p>
                </div>
            </div>

            {/* Profile Section - Shared across all roles */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Profile & Preferences</h2>
                <div className="text-gray-600">
                    <p>Update your profile settings and preferences.</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;