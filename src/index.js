import { fetchMovies } from "./scripts/fetch-movies";
import { LocalStorageEntry } from "./scripts/local-storage-entry";

const fetchMoviesApi = new fetchMovies();
const queue = new LocalStorageEntry('Queue');
const watched = new LocalStorageEntry('Watched');
const currentPage = new LocalStorageEntry('Current page movies');

const input = document.querySelector('.js-movie-search');
const searchBtn = document.querySelector('.js-search-btn');
const galleryList = document.querySelector('ul.gallery');

searchBtn.addEventListener('click', onSearchBtnClick);

createDataResults();
addTrendingCards();

async function addTrendingCards() {
    clearGalleryList();

    const trendingMovies = await fetchMoviesApi.getTrendingMovies();
    currentPage.addMovieToLocalStorage(trendingMovies);
    const markup = renderGalleryCardsMarkup(trendingMovies);
    galleryList.innerHTML = markup;
    addGalleryCardsEventListeners();
}

function addGalleryCardsEventListeners() {
    const modal = document.querySelector('[data-modal]');
    const modalOpenList = document.querySelectorAll('[data-modal-open]');
    const modalClose = document.querySelector('[data-modal-close]');
    modalOpenList.forEach(item => {
        item.addEventListener('click', toggleModal);
    });

    modalClose.addEventListener('click', toggleModal);

    function toggleModal() {
        modal.classList.toggle('is-hidden');
    }
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
    addGalleryCardsEventListeners();
}

function renderGalleryCardsMarkup(movies) {
    
    return movies.map((movie) => {
        if (movie.genres.length > 2) {
            movie.genres = `${movie.genres[0]}, ${movie.genres[1]}, Other`;
        };
        const release_date = new Date(movie.release_date)
        return `
            <li class="card" data-modal-open>
                <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="Poster \'${movie.title}\'" class="card__movie-img" width="200" height="300">
                <div class="card__info">
                    <p class="card__movie-title">${movie.title}</p>
                    <p class="card__add-info">${movie.genres}
                    <span class="card__span"> | </span> ${release_date.getFullYear()} </p>
                </div>
            </li>
        `;
    }).join('');
}

function clearGalleryList() {
    galleryList.innerHTML = '';
}



async function createDataResults() {
    queue.updateLocalStorageEntry();
    watched.updateLocalStorageEntry();
    currentPage.updateLocalStorageEntry();
}



