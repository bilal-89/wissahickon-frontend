import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import BaseLayout from './components/layout/BaseLayout';
import LoginPage from './features/auth/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardPage from "./features/dashboard/DashBoardPage";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* Protected routes */}
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute>
                                    <BaseLayout>
                                        <Routes>
                                            <Route path="/" element={<DashboardPage />} />
                                            <Route path="/users" element={<div>Users Page Coming Soon</div>} />
                                            <Route path="/settings" element={<div>Settings Page Coming Soon</div>} />
                                        </Routes>
                                    </BaseLayout>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;