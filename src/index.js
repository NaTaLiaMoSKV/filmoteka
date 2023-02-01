import { fetchMovies } from "./js/fetch-movies";
import { LocalStorageEntry } from "./js/local-storage-entry";

const fetchMoviesApi = new fetchMovies();
const queue = new LocalStorageEntry('Queue');
const watched = new LocalStorageEntry('Watched');
const currentPage = new LocalStorageEntry('Current page movies');

const input = document.querySelector('.js-movie-search');
const searchBtn = document.querySelector('.js-search-btn');
const galleryList = document.querySelector('ul.gallery');
const modalCard = document.querySelector('.modal-card');
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
    addGalleryCardsEventListeners();
    
    
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
    if (moviesByTitle.length === 0) {
        infoText.classList.remove('is-hidden');
        setTimeout(() => {
            infoText.classList.add('is-hidden');
        }, 2000);
    }
    const markup = createGalleryCardsMarkup(moviesByTitle);
    galleryList.innerHTML = markup;
    addGalleryCardsEventListeners();
}

async function createDataResults() {
    queue.updateLocalStorageEntry();
    watched.updateLocalStorageEntry();
    currentPage.updateLocalStorageEntry();
}

function addGalleryCardsEventListeners() {
    const modal = document.querySelector('[data-modal]');
    const modalOpenList = document.querySelectorAll('[data-modal-open]');
    const modalClose = document.querySelector('[data-modal-close]');

    modalOpenList.forEach(item => {
        item.addEventListener('click', toggleModal);
    });

    modalClose.addEventListener('click', toggleModal);

    function toggleModal(e) {
        if (modal.classList.contains('is-hidden')) {
            // modal.classList.toggle('is-hidden');
            renderModalCard(e.target);
            
        }
        modal.classList.toggle('is-hidden');
    }
}

function renderModalCard(el) {
    const movieId = findMovieId(el);
    
    const movie = currentPage.getMovieById(movieId);
    modalCard.innerHTML = createModalCardMarkup(movie);
}

function createModalCardMarkup(movie) {
    return `
        <img class="modal-card__img" src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}" width="200" height="300">
        <div class="modal-card__description">
            <h2 class="modal-card__title">${movie.title}</h2>
            <div class="description-fields">
            <ul class="parameter__list">
                <li class="parameter__item">Vote / Votes</li>
                <li class="parameter__item">Popularity</li>
                <li class="parameter__item">Original Title</li>
                <li class="parameter__item">Genre</li>
            </ul>
            <ul class="value__list">
                <li class="value__item"><span class="value__vote">${movie.vote_average.toFixed(1)}</span> / <span class="value__votes">${movie.vote_count}</span></li>
                <li class="value__item">${movie.popularity}</li>
                <li class="value__item value__original-title">${movie.original_title}</li>
                <li class="value__item value__genres">${movie.genres}</li>
            </ul>
            </div>
            <h3 class="modal-card__about">ABOUT</h3>
            <p class="modal-card__about-overview">${movie.overview}</p>
            <div class="modal-card__buttons">
            <button type="submit" class="add-to-watched-btn">add to watched</button>
            <button type="submit" class="add-to-queue-btn">add to queue</button>
            </div>
        </div>
    `;
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

function findMovieId(el) {
    for (let i = 0; i < galleryList.children.length; i++) {
        for (let j = 0; j < galleryList.children[0].childNodes.length; j++) {
            if (galleryList.children[i].childNodes[j] === el) {
                return galleryList.children[i].dataset.id;
            }
        }
    }
}

function clearGalleryList() {
    galleryList.innerHTML = '';
}



