import { LocalStorageEntry } from "./local-storage-entry";
import { watchedMovies, queueMovies } from "./modal-window";
import * as modalUtils from "./modal-window";

// console.log(watchedMovies);
// console.log(queueMovies);

const currentLibraryPage = new LocalStorageEntry('Current library page');

const galleryList = document.querySelector('ul.gallery');
const watchedBtn = document.querySelector('.js-watched-btn');
const queueBtn = document.querySelector('.js-queue-btn');

onLibraryLoad();

function onLibraryLoad() {
    watchedBtn.addEventListener('click', onWatchedBtnClick);
    queueBtn.addEventListener('click', onQueueBtnClick);
}

function onWatchedBtnClick(e) {
    console.log(watchedMovies);
    queueBtn.classList.remove('on-focus');
    watchedBtn.classList.add('on-focus');
    addMovies(watchedMovies);
}

function onQueueBtnClick(e) {
    watchedBtn.classList.remove('on-focus');
    queueBtn.classList.add('on-focus');
    addMovies(queueMovies);
}

function addMovies(moviesList) {
    clearGalleryList();
    

    currentLibraryPage.clearList();
    currentLibraryPage.addMovieToLocalStorage(moviesList);
    const markup = createGalleryCardsMarkup(moviesList);
    galleryList.innerHTML = markup;
    modalUtils.handleGalleryCards(currentLibraryPage);
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


