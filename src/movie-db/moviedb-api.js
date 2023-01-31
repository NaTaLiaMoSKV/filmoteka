// import axios from "axios";

// const BASE_URL = 'https://api.themoviedb.org/3';
// const API_KEY = '01da1c68b81345f905c14aa4e6274718';

// const genres = JSON.parse(`[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}]`);

// const  trasformMovie = ({id, title, genre_ids}) => {
//     return {id, title, genres: genre_ids.map(n => genres.find(genre => genre.id === n).name) };
// }

// const getTrending = async (page) => {
//     const response = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`);
//     const data = response.data;
//     return {page: data.page, results: data.results.map(trasformMovie) }
// };


// export  {getTrending};
