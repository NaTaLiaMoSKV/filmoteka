import axios from 'axios';
export class fetchMovies {
  constructor() {
    this.page = 1;
    this.totalPages = 0;
    this.BASE_URL = 'https://api.themoviedb.org/3'
    this.API_KEY = '01da1c68b81345f905c14aa4e6274718';
  }

  fetchPopularMovies() {
    return axios.get(`${this.BASE_URL}/trending/movie/week?api_key=${this.API_KEY}&page=${this.page}`)
      .then(function (response) {
        return response.data.results;
      })
      .catch(function (error) {
        console.log(error);
      })
  }
}