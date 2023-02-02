import { fetchMovies } from "./js/fetch-movies";
import { LocalStorageEntry } from "./js/local-storage-entry";
import * as modalUtils from "./js/modal-window";

const fetchMoviesApi = new fetchMovies();
const queue = new LocalStorageEntry('Queue');
const watched = new LocalStorageEntry('Watched');
const currentPage = new LocalStorageEntry('Current page');
export { queue, watched };

const input = document.querySelector('.js-movie-search');
const searchBtn = document.querySelector('.js-search-btn');
const galleryList = document.querySelector('ul.gallery');
const infoText = document.querySelector('.info__text')

searchBtn.addEventListener('click', onSearchBtnClick);

createDataResults();
addTrendingCards();

async function addTrendingCards() {
    clearGalleryList();

    const trendingMovies = await fetchMoviesApi.getTrendingMovies();
    currentPage.addMovieToLocalStorage(trendingMovies);
    const markup = createGalleryCardsMarkup(trendingMovies);
    galleryList.innerHTML = markup;
    modalUtils.addGalleryCardsEventListeners(currentPage);
}


async function onSearchBtnClick(e) {
    e.preventDefault();
    currentPage.clearList();

    clearGalleryList();
    if (input.value === '') {
        addTrendingCards();
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
    const markup = createGalleryCardsMarkup(moviesByTitle);
    galleryList.innerHTML = markup;
    currentPage.addMovieToLocalStorage(moviesByTitle);
    modalUtils.addGalleryCardsEventListeners(currentPage);

}

async function createDataResults() {
    queue.updateLocalStorageEntry();
    watched.updateLocalStorageEntry();
    currentPage.updateLocalStorageEntry();
}

function createGalleryCardsMarkup(movies) {
    
    return movies.map((movie) => {
        if (movie.genres.length > 2) {
            movie.genres = `${movie.genres[0]}, ${movie.genres[1]}, Other`;
        };
        const release_date = new Date(movie.release_date)
        return `
            <li class="card" data-id="${movie.id}" data-modal-open>
                <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="Poster \'${movie.title}\'" class="card__movie-img" width="200" height="300">
                <div class="card__info">
                    <p class="card__movie-title">${movie.title}</p>
                    <p class="card__add-info">${movie.genres}
                    <span class="card__span"> | </span> ${release_date.getFullYear()} <span class="value__vote">${movie.vote_average.toFixed(1)}</span></p>
                </div>
            </li>
        `;
    }).join('');
}

function clearGalleryList() {
    galleryList.innerHTML = '';
}



