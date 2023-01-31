import { fetchMovies } from "./partials/fetchMovies";
import { LocalStorageEntry } from "./partials/localStorageEntry";


const fetchMoviesApi = new fetchMovies();
const queue = new LocalStorageEntry('Queue');
const watched = new LocalStorageEntry('Watched');

const input = document.querySelector('.js-movie-search');
const searchBtn = document.querySelector('.js-search-btn');
searchBtn.addEventListener('click', onSearchBtnClick);

// fetchMoviesApi.getTrendingMovies().then(console.log).catch(console.log);

function onSearchBtnClick(e) {
    e.preventDefault();
    fetchMoviesApi.searchQuery = input.value;
    fetchMoviesApi.getMovieByTitle().then(console.log).catch(console.log);
}

createDataResults();

async function createDataResults() {
    queue.updateLocalStorageEntry();
    watched.updateLocalStorageEntry();
}



