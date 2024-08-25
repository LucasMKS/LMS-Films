import axios from "axios";

class AuthService {
  static BASE_URL = "http://localhost:8080";

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

  static async popular(page) {
    try {
      const response = await axios.get(`${AuthService.BASE_URL}/movies/popular?page=${page}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async searchSeries(searchTerm) {
    try {
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      const response = await axios.get(`${AuthService.BASE_URL}/series/search?query=${encodedSearchTerm}`)
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async detailSeries(serieId) {
    try {
      const response = await axios.get(`${AuthService.BASE_URL}/series/details/${serieId}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async popularSeries(page) {
    try {
      const response = await axios.get(`${AuthService.BASE_URL}/series/popular?page=${page}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async sendRating(title, movieId, rating, poster_path) {
    try {
      const token = localStorage.getItem('token');
      const nickname = localStorage.getItem('nickname');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const response = await axios.post(`${this.BASE_URL}/rate/m/save`, {
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

  static async updateRating(movieId, rating) {
    try {
      const token = localStorage.getItem('token');
      const nickname = localStorage.getItem('nickname');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const response = await axios.put(`${this.BASE_URL}/rate/m/update`, {
        movieId,
        rating,
        nickname,
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
      const nickname = localStorage.getItem('nickname');
      const token = localStorage.getItem('token');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const response = await axios.get(`${AuthService.BASE_URL}/rate/m/ratedcontent`, {
        headers,
        params: { nickname },
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async sendSerieRate(name, serieId, rating, poster_path) {
    try {
      const token = localStorage.getItem('token');
      const nickname = localStorage.getItem('nickname');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const response = await axios.post(`${this.BASE_URL}/rate/s/save`, {
        name,
        serieId,
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

  static async updateSerieRating(serieId, rating) {
    try {
      const token = localStorage.getItem('token');
      const nickname = localStorage.getItem('nickname');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const response = await axios.put(`${this.BASE_URL}/rate/s/update`, {
        serieId,
        rating,
        nickname,
      }, { headers });

      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return err.response.data;
      }
      throw err;
    }
  }

  static async getRatedSerieContent() {
    try {
      const nickname = localStorage.getItem('nickname');
      const token = localStorage.getItem('token');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const response = await axios.get(`${AuthService.BASE_URL}/rate/s/ratedcontent`, {
        headers,
        params: { nickname },
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async toggleFavorite(movieId, title, favorite) {
    try{
      const token = localStorage.getItem('token');
      const nickname = localStorage.getItem('nickname');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      const response = await axios.post(`${this.BASE_URL}/movies/favorite`, {
        movieId,
        title,
        nickname,
        favorite,
        }, {headers });
      
        return response.data;
      } catch (err) {
        if (err.response && err.response.data) {
          return err.response.data;
        }
        throw err;
      }
  };

  static async getFavoriteStatus(movieId) {
    try {
      const token = localStorage.getItem('token');
      const nickname = localStorage.getItem('nickname');
  
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
  
      const response = await axios.get(`${this.BASE_URL}/movies/favoritestatus`, {
        headers,
        params: { movieId, nickname },  // Passa os parâmetros aqui
      });
  
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return err.response.data;
      }
      throw err;
    }
  }

  static async getAllFavorites() {
    try {
      const nickname = localStorage.getItem('nickname');
      const token = localStorage.getItem('token');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const response = await axios.get(`${AuthService.BASE_URL}/movies/getfavorites`, {
        headers,
        params: { nickname },
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async toggleSerieFavorite(serieId, name, favorite) {
    try{
      const token = localStorage.getItem('token');
      const nickname = localStorage.getItem('nickname');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      const response = await axios.post(`${this.BASE_URL}/series/favorite`, {
        serieId,
        name,
        nickname,
        favorite,
        }, {headers });
      
        return response.data;
      } catch (err) {
        if (err.response && err.response.data) {
          return err.response.data;
        }
        throw err;
      }
  };

  static async getFavoriteSeriesStatus(serieId) {
    try {
      const token = localStorage.getItem('token');
      const nickname = localStorage.getItem('nickname');
  
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
  
      const response = await axios.get(`${this.BASE_URL}/series/favoritestatus`, {
        headers,
        params: { serieId, nickname },  // Passa os parâmetros aqui
      });
  
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return err.response.data;
      }
      throw err;
    }
  }

  static async getAllSeriesFavorites() {
    try {
      const nickname = localStorage.getItem('nickname');
      const token = localStorage.getItem('token');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const response = await axios.get(`${AuthService.BASE_URL}/series/getfavorites`, {
        headers,
        params: { nickname },
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
