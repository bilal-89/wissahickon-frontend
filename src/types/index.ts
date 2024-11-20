export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface ApiResponse<T> {
    data: T;
    error?: string;
    message?: string;
}