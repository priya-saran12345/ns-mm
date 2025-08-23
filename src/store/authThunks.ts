import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginCredentials, SignupCredentials, User } from '../types/auth.types';
import {  setError } from './authSlice';

// Mock API calls - replace with actual API endpoints
const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loginUser = createAsyncThunk<
  { user: User; token: string },
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setError(null));
      // Simulate API call
      await mockApiDelay(1000);

      // Mock authentication logic
      if (credentials.email === 'admin@erp.com' && credentials.password === 'admin123') {
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          name: 'Admin User',
          role: 'admin',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop&crop=face',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        const mockToken = 'mock-jwt-token-admin-' + Date.now();
        
        return { user: mockUser, token: mockToken };
      } else if (credentials.email === 'user@erp.com' && credentials.password === 'user123') {
        const mockUser: User = {
          id: '2',
          email: credentials.email,
          name: 'Regular User',
          role: 'user',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        const mockToken = 'mock-jwt-token-user-' + Date.now();
        
        return { user: mockUser, token: mockToken };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk<
  { user: User; token: string },
  SignupCredentials,
  { rejectValue: string }
>(
  'auth/signupUser',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setError(null));

      // Simulate API call
      await mockApiDelay(1000);

      // Mock signup logic
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const mockUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token-new-' + Date.now();
      
      return { user: mockUser, token: mockToken };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Signup failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    // Simulate API call for logout
    await mockApiDelay(500);
  }
);