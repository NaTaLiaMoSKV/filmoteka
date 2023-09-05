import { LocalStorageEntry } from "./local-storage-entry";
import { watchedMovies, queueMovies } from "./modal-window";
import * as modalUtils from "./modal-window";
import imageNotFound from '../images/not-found.jpg'

const currentLibraryPage = new LocalStorageEntry('Current library page');

const galleryList = document.querySelector('ul.gallery');

const watchedBtn = document.querySelector('.js-watched-btn');
const queueBtn = document.querySelector('.js-queue-btn');

onWatchedBtnClick();

watchedBtn.addEventListener('click', onWatchedBtnClick);
queueBtn.addEventListener('click', onQueueBtnClick);

function onWatchedBtnClick(e) {
    queueBtn.classList.remove('on-focus');
    watchedBtn.classList.add('on-focus');
    addMovies(watchedMovies, 'watched');
}

function onQueueBtnClick(e) {
    watchedBtn.classList.remove('on-focus');
    queueBtn.classList.add('on-focus');
    addMovies(queueMovies, 'queue');
}

function addMovies(list, mode) {
    clearGalleryList();
    currentLibraryPage.clearList();

    list.forEach(item => {
        currentLibraryPage.addMovieToLocalStorage(item);
    });

    const markup = createGalleryMoviesMarkup(list);
    galleryList.innerHTML = markup;
    modalUtils.handleGalleryCards(currentLibraryPage, mode);
}

function createGalleryMoviesMarkup(movies) {
    return movies.map((movie) => {
        let genres = movie.genres;
        if (movie.genres.length > 2) {
            genres = `${movie.genres[0]}, ${movie.genres[1]}, Other`;
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

function clearGalleryList() {
    galleryList.innerHTML = '';
}
export { createGalleryMoviesMarkup };