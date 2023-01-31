import { fetchMovies } from "./scripts/fetch-movies";
import { LocalStorageEntry } from "./scripts/local-storage-entry";


const fetchMoviesApi = new fetchMovies();
const queue = new LocalStorageEntry('Queue');
const watched = new LocalStorageEntry('Watched');

const input = document.querySelector('.js-movie-search');
const searchBtn = document.querySelector('.js-search-btn');
const galleryList = document.querySelector('ul.gallery');

searchBtn.addEventListener('click', onSearchBtnClick);

addTrendingCards();

async function addTrendingCards() {
    clearGalleryList();

    const trendingMovies = await fetchMoviesApi.getTrendingMovies();
    const markup = renderGalleryCardsMarkup(trendingMovies);
    galleryList.innerHTML = markup;
}


async function onSearchBtnClick(e) {
    e.preventDefault();

    clearGalleryList();
    if (input.value === '') {
        addTrendingCards();
        return;
    }
    fetchMoviesApi.searchQuery = input.value;
    input.value = '';
    const moviesByTitle = await fetchMoviesApi.getMovieByTitle();
    if (moviesByTitle.length === 0) console.log('No movie with that name');

    const markup = renderGalleryCardsMarkup(moviesByTitle);
    galleryList.innerHTML = markup;
}

function renderGalleryCardsMarkup(movies) {
    
    return movies.map((movie) => {
        if (movie.genres.length > 2) {
            movie.genres = `${movie.genres[0]}, ${movie.genres[1]}, Other`;
        };
        return `
            <li class="card">
                <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="Poster \'${movie.title}\'" class="card__movie-img" width="200" height="300">
                <div class="card__info">
                    <h3 class="card__movie-title">${movie.title}</h3>
                    <p class="card__movie-genres">${movie.genres}</p>
                    <span class="card__span"> | </span>
                    <p class="card__movie-date"> ${movie.release_date}</p>
                </div>
            </li>
        `;
    }).join('');
}

function clearGalleryList() {
    galleryList.innerHTML = '';
}

createDataResults();

async function createDataResults() {
    queue.updateLocalStorageEntry();
    watched.updateLocalStorageEntry();
}



