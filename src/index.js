import { fetchMovies } from "./js/fetch-movies";
import { LocalStorageEntry } from "./js/local-storage-entry";
import * as modalUtils from "./js/modal-window";
import imageNotFound from './images/not-found.jpg'

const fetchMoviesApi = new fetchMovies();
const currentPage = new LocalStorageEntry('Current page');

const input = document.querySelector('.js-movie-search');
const searchBtn = document.querySelector('.js-search-btn');
const galleryList = document.querySelector('ul.gallery');
const infoText = document.querySelector('.info__text');

searchBtn.addEventListener('click', onSearchBtnClick);
input.addEventListener('keydown', onKeydownInput);

addTrendingMovies();

// add trendeng movies to gallery
async function addTrendingMovies() {
    clearGalleryList();

    const trendingMovies = await fetchMoviesApi.getTrendingMovies();
    trendingMovies.forEach(movie => {
        currentPage.addMovieToLocalStorage(movie);
    });
    
    const markup = createGalleryMoviesMarkup(trendingMovies);
    galleryList.innerHTML = markup;
    modalUtils.handleGalleryCards(currentPage, 'main');
}

function onKeydownInput(e) {
    if (e.keyCode === 13) onSearchBtnClick();
}

// add movies by title to gallery
async function onSearchBtnClick() {
    currentPage.clearList();

    clearGalleryList();
    if (input.value === '') {
        addTrendingMovies();
        return;
    }
    fetchMoviesApi.searchQuery = input.value;
    input.value = '';
    const moviesByTitle = await fetchMoviesApi.getMovieByTitle();
    if (moviesByTitle.length === 0) {
        infoText.classList.remove('is-hidden');
        setTimeout(() => {
            infoText.classList.add('is-hidden');
        }, 2000);
    }
    const markup = createGalleryMoviesMarkup(moviesByTitle);
    galleryList.innerHTML = markup;
    moviesByTitle.forEach(movie => {
        currentPage.addMovieToLocalStorage(movie);
    });
    modalUtils.handleGalleryCards(currentPage, 'main');
}

// create gallery movies markup
function createGalleryMoviesMarkup(movies) {
    return movies.map((movie) => {
        let genres = movie.genres.join(', ');
        if (movie.genres.length > 2) {
            genres = `${movie.genres[0]}, ${movie.genres[1]}, Other`
        };
        const release_date = new Date(movie.release_date);
        const poster = movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : imageNotFound;

        return `
            <li class="card" data-id=${movie.id} data-modal-open>
                <img src=${poster} alt="Poster \'${movie.title}\'" class="card__movie-img" width="200" height="300">
                <div class="card__info">
                    <p class="card__movie-title">${movie.title}</p>
                    <p class="card__add-info">${genres}
                    <span class="card__span"> | </span> ${release_date.getFullYear()} <span class="value__vote">${movie.vote_average.toFixed(1)}</span></p>
                </div>
            </li>
        `;
    }).join('');
}

// clear gallery
function clearGalleryList() {
    galleryList.innerHTML = '';
}



