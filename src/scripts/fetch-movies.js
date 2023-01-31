import axios from 'axios';
const genres = JSON.parse(`[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}]`);

export class fetchMovies {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalPages = 0;
    this.BASE_URL = 'https://api.themoviedb.org/3'
    this.API_KEY = '01da1c68b81345f905c14aa4e6274718';
    this.trasformMovie = ({poster_path, overview, release_date, id, original_title, title, backdrop_path, popularity, vote_count, video, genre_ids}) => {
      return {title, id, poster_path, overview, release_date, original_title, backdrop_path, popularity, vote_count, video, genres: genre_ids.map(n => genres.find(genre => genre.id === n).name) };
    }
  }

  async getMovieByTitle() {
    const response = await axios.get(`${this.BASE_URL}/search/movie?api_key=${this.API_KEY}&language=en-US&query=${this.searchQuery}&page=${this.page}&include_adult=false`);
    const data = response.data;
    // this.page += 1;
    return data.results.map(this.trasformMovie);
  }

  async getTrendingMovies() {
    const response = await axios.get(`${this.BASE_URL}/trending/movie/week?api_key=${this.API_KEY}&page=${this.page}`);
    const data = response.data;
    // this.page += 1;
    return data.results.map(this.trasformMovie);
  }

  resetPage() {
    this.page = 1;
  }

  
}