import axios from './axios';

// Tipos para autenticación
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email?: string;
    role?: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'userData';

  /**
   * Realiza el login enviando credenciales al backend
   * @param credentials - Usuario y contraseña
   * @returns Respuesta del backend con token y datos de usuario
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // ========================================
      // MODO DESARROLLO: Login simulado
      // ========================================
      // Descomentar la siguiente línea cuando el backend esté listo
      // const response = await axios.post<LoginResponse>('/auth/login', credentials);
      
      // USUARIOS DE PRUEBA (eliminar cuando el backend esté listo)
      const mockUsers = [
        { 
          username: 'admin', 
          password: 'admin123',
          user: { id: 1, username: 'admin', email: 'admin@municipalidad.com', role: 'ADMIN' }
        },
        { 
          username: 'operador', 
          password: 'operador123',
          user: { id: 2, username: 'operador', email: 'operador@municipalidad.com', role: 'OPERADOR' }
        },
        { 
          username: 'usuario', 
          password: 'usuario123',
          user: { id: 3, username: 'usuario', email: 'usuario@municipalidad.com', role: 'USUARIO' }
        },
      ];

      // Simular delay de red (opcional)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Buscar usuario mock
      const mockUser = mockUsers.find(
        u => u.username === credentials.username && u.password === credentials.password
      );

      if (!mockUser) {
        // Simular error 401
        throw {
          response: {
            status: 401,
            data: { message: 'Credenciales inválidas' }
          }
        };
      }

      // Generar token JWT mock (solo para desarrollo)
      const mockToken = `mock-jwt-token-${mockUser.user.username}-${Date.now()}`;

      const response = {
        data: {
          token: mockToken,
          user: mockUser.user
        }
      };
      
      // ========================================
      // FIN MODO DESARROLLO
      // ========================================
      
      // Guardar token y datos de usuario en localStorage
      if (response.data.token) {
        this.setToken(response.data.token);
        this.setUser(response.data.user);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.removeToken();
    this.removeUser();
    this.removeRefreshToken();
  }

  /**
   * Obtiene el token de autenticación actual
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Guarda el token de autenticación
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Elimina el token de autenticación
   */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Obtiene el refresh token si existe
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Guarda el refresh token
   */
  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /**
   * Elimina el refresh token
   */
  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Obtiene los datos del usuario guardados
   */
  getUser(): LoginResponse['user'] | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Guarda los datos del usuario
   */
  setUser(user: LoginResponse['user']): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Elimina los datos del usuario
   */
  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Refresca el token de acceso usando el refresh token
   */
  async refreshAccessToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post<{ token: string }>('/auth/refresh', {
        refreshToken,
      });

      this.setToken(response.data.token);
      return response.data.token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout(); // Si falla el refresh, cerrar sesión
      throw error;
    }
  }
}

export const authService = new AuthService();
