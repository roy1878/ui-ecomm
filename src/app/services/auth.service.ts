import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserKey = 'ecommerce-current-user';
  private usersKey = 'ecommerce-users';
  currentUser:any = this.loadUser();

  constructor(private http: HttpClient) {}

  register(name: string, username: string, password: string): { success: boolean; message: string; user?: AuthUser } {
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();

    if (!trimmedName || !trimmedUsername || !password.trim()) {
      return { success: false, message: 'Please fill in all fields.' };
    }

    const users = this.getUsers();
    const existingUser = users.find((user) => user.username.toLowerCase() === trimmedUsername.toLowerCase());

    if (existingUser) {
      return { success: false, message: 'This username is already registered.' };
    }

    const newUser: AuthUser = {
      id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
      name: trimmedName,
      username: trimmedUsername,
      password: password
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    this.currentUser = newUser;
    localStorage.setItem(this.currentUserKey, JSON.stringify(newUser));

    return { success: true, message: 'Registration successful.', user: newUser };
  }

  login(username: string, password: string): { success: boolean; message: string; user?: AuthUser } {
    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password.trim()) {
      return { success: false, message: 'Username and password are required.' };
    }

    const users = this.getUsers();
    const user = users.find((entry) => entry.username.toLowerCase() === trimmedUsername.toLowerCase());

    if (!user) {
      return { success: false, message: 'User not found. Please register first.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    this.currentUser = user;
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));

    return { success: true, message: 'Login successful.', user };
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.currentUserKey);
    sessionStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  private getUsers(): AuthUser[] {
    const stored = localStorage.getItem(this.usersKey);
    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as AuthUser[];
    } catch {
      return [];
    }
  }

  private loadUser(): AuthUser | null {
    const stored = localStorage.getItem(this.currentUserKey);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  }

    registerUser(registerRequest:any){
      const baseUrl = 'http://localhost:8080/auth/register';
      return this.http.post(baseUrl, registerRequest);

    }

     loginUser(loginRequest:any){
      const baseUrl = 'http://localhost:8080/auth/login';
      return this.http.post(baseUrl, loginRequest);

    }
}
