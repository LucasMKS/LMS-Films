import axios from "axios";

class AuthService {
  static BASE_URL = "http://localhost:8080"

  static async login(email, password) {
    try {
      const response = await axios.post(`${AuthService.BASE_URL}/auth/login`, { email, password })
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async register(userData) {
    try {
      const response = await axios.post(`${AuthService.BASE_URL}/auth/register`, userData)
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async search(searchTerm) {
    try {
      const encodedSearchTerm = encodeURIComponent(searchTerm); 
      const response = await axios.get(`${AuthService.BASE_URL}/movies/search?query=${encodedSearchTerm}`)
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async details(movieId) {
    try {
      const response = await axios.get(`${AuthService.BASE_URL}/movies/details/${movieId}`);
    return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async popular() {
    try {
      const response = await axios.get(`${AuthService.BASE_URL}/movies/popular`)
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async sendRating(title, movieId, rating, poster_path) {
    try {
      const token = localStorage.getItem('token');
      const nickname = localStorage.getItem('nickname');  // Recuperar o nickname
  
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
  
      const response = await axios.post(`${this.BASE_URL}/rate/save`, {
        title,
        movieId,
        rating,
        nickname,
        poster_path,
      }, { headers });
  
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return err.response.data;
      }
      throw err;
    }
  }
  

  static async getRatedContent() {
    try {
        const nickname = localStorage.getItem('nickname'); // Recupera o nickname do localStorage
        const token = localStorage.getItem('token'); // Recupera o token de autenticação do localStorage

        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        const response = await axios.get(`${AuthService.BASE_URL}/rate/ratedcontent`, {
            headers,
            params: { nickname }, // Passa o nickname como parâmetro
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}



    /**AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
      }
    
      static isAuthenticated() {
        const token = localStorage.getItem('token')
        return !!token
      }
    
      static isAdmin() {
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
      }
    
      static isUser() {
        const role = localStorage.getItem('role')
        return role === 'USER'
      }
    
      static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
      }
    }
    
    export default AuthService;