export interface User {
    _id: string;
    email: string;
    password: string;
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    dueDate?: string;
    user: string;
    completed: boolean;
}

export interface Habit {
    _id: string;
    name: string;
    frequency: string;
    user: string;
}

export interface RegisterResponse {
    message: string;
}

export interface LoginResponse {
    token: string;
}

export interface ErrorResponse {
    message: string;
    error?: any;
}