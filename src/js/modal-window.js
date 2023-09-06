import { LocalStorageEntry } from "../js/local-storage-entry";
import imageNotFound from '../images/not-found.jpg'

const queueStorage = new LocalStorageEntry('Queue');
const watchedStorage = new LocalStorageEntry('Watched');

const body = document.querySelector('body');
    
const watchedMovies = JSON.parse(localStorage.getItem('Watched')) ? JSON.parse(localStorage.getItem('Watched')) : [];
const queueMovies = JSON.parse(localStorage.getItem('Queue')) ? JSON.parse(localStorage.getItem('Queue')) : [];

let currentPage = '';
let mode = '';
const galleryList = document.querySelector('ul.gallery');
const modalCard = document.querySelector('.modal-card');
const modal = document.querySelector('[data-modal]');

function handleGalleryCards(page, m) {
    const modalOpenList = document.querySelectorAll('[data-modal-open]');
    const modalClose = document.querySelector('[data-modal-close]');
    currentPage = page;
    mode = m;

    modalOpenList.forEach(item => {
        item.addEventListener('click', (e) => {
            modal.classList.remove('is-hidden');
            body.classList.add('modal-open');

            const movie = renderModalCard(e.currentTarget);
            handleLocalStorageButtons(movie);

            window.addEventListener('keydown', onKeyDown);
            document.addEventListener('click', onBackdropClick);
            modalClose.addEventListener('click', onModalCloseBtnClick);
        });
    });

    function onModalCloseBtnClick() {
        modal.classList.add('is-hidden');
        body.classList.remove('modal-open');
        modalClose.removeEventListener('click', onModalCloseBtnClick);
    } 

    function onKeyDown(e) {
        if (e.keyCode == 27 && !modal.classList.contains('is-hidden')) {
            modal.classList.add('is-hidden');
            body.classList.remove('modal-open');
            window.removeEventListener('keydown', onKeyDown);
        }
    }
        
    function onBackdropClick(e) {
        if (e.target.classList.contains('backdrop')) {
            modal.classList.add('is-hidden');
            body.classList.remove('modal-open');
            document.removeEventListener('click', onBackdropClick);
        }
    }
}

// render modal card and return movie
function renderModalCard(el) {
    const movieId = el.dataset.id;
    const movie = currentPage.getMovieById(movieId);
    modalCard.innerHTML = createModalCardMarkup(movie);
    return movie;
} 

// create markup for modal card
function createModalCardMarkup(movie) {
    const isWatched = watchedStorage.findMovie(movie) || (watchedMovies !== null && findMovieInList(movie, watchedMovies));
    const isQueued = queueStorage.findMovie(movie) || (queueMovies !== null && findMovieInList(movie, queueMovies));

    let watchedBtnText = isWatched ? 'Remove from watched' : 'Add to watched';
    let queueBtnText = isQueued ? 'Remove from queue' : 'Add to queue';

    const poster = movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : imageNotFound;

    return `
        <img class="modal-card__img" src=${poster} alt="${movie.title}" width="200" height="300">
        <div class="modal-card__description">
            <h2 class="modal-card__title">${movie.title}</h2>
            <table class="description-table">
                <tr class="description">
                    <td class="parameter__item">Vote / Votes</td>
                    <td class="value__item"><span class="value__vote">${movie.vote_average.toFixed(1)}</span> / <span class="value__votes">${movie.vote_count}</span></td>
                <tr>
                    <td class="parameter__item"> Popularity</td>
                    <td class="value__item">${movie.popularity}</td>
                </tr>
                <tr>
                    <td class="parameter__item">Original Title</td>
                    <td class="value__item value__original-title">${movie.original_title}</td>
                </tr>
                <tr>
                    <td class="parameter__item">Genres</td>
                    <td class="value__item value__genres">${movie.genres.join(', ')}</td>
                </tr>
            </table>
            <h3 class="modal-card__about">ABOUT</h3>
            <p class="modal-card__about-overview">${movie.overview}</p>
            <div class="modal-card__buttons">
                ${mode !== 'queue' ? `<button type="submit" class="add-to-watched-btn">${watchedBtnText}</button>`: `<button type="submit" style="display: none" class="add-to-watched-btn">${watchedBtnText}</button>`}
                ${mode !== 'watched' ? `<button type="submit" class="add-to-queue-btn">${queueBtnText}</button>` : `<button type="submit" style="display: none" class="add-to-queue-btn">${queueBtnText}</button>`}  
            </div>
        </div>
    `;
} 

// find true if movie is found the list
function findMovieInList(movie, list) {
    return list.find(item => item.id === movie.id);
}


// handle modal form buttons and update text
function handleLocalStorageButtons(movie) {
    const watchedBtn = document.querySelector('.add-to-watched-btn');
    const queueBtn = document.querySelector('.add-to-queue-btn');
    
    let isWatched = watchedStorage.findMovie(movie) || (watchedMovies !== null && findMovieInList(movie, watchedMovies));
    let isQueue = queueStorage.findMovie(movie) || (queueMovies !== null && findMovieInList(movie, queueMovies));

    watchedBtn.textContent = isWatched ? 'Remove from watched' : 'Add to watched';
    queueBtn.textContent = isQueue ? 'Remove from queue' : 'Add to queue';

    watchedBtn.addEventListener('click', () => {
        if (isWatched) {
            watchedStorage.deleteMovieFromLocalStorage(movie);
            watchedMovies.splice(watchedMovies.indexOf(movie), 1);
            watchedBtn.textContent = 'Add to watched';
        } else {
            watchedStorage.addMovieToLocalStorage(movie);
            watchedMovies.unshift(movie);
            watchedBtn.textContent = 'Remove from watched';
        }

        isWatched = !isWatched;
        updateLibraryCards(watchedMovies);
    });
    
    queueBtn.addEventListener('click', () => {
        if (isQueue) {
            queueStorage.deleteMovieFromLocalStorage(movie);
            queueMovies.splice(queueMovies.indexOf(movie), 1);
            queueBtn.textContent = 'Add to queue';
        } else {
            queueStorage.addMovieToLocalStorage(movie);
            queueMovies.unshift(movie);
            queueBtn.textContent = 'Remove from queue';
        }

        isQueue = !isQueue;
        updateLibraryCards(queueMovies);
        
    });
};


// update library gallery
function updateLibraryCards(movies) {
    if (mode === 'main') return;
    if (movies.length === 0) {
        const placeholderMarkup = createLibraryPlaceholderMarkup(mode);
        galleryList.innerHTML = placeholderMarkup;
        handleGalleryCards(currentPage, mode);
        return;
    }

    const markup = updateLibraryMarkup(movies);
    galleryList.innerHTML = markup;
    handleGalleryCards(currentPage, mode);
}

// update and return library markup
function updateLibraryMarkup(movies) {
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

const createLibraryPlaceholderMarkup = (listName) => {
    return `
    <div class="placeholder">
        <p class="placeholder__text">Your ${listName} list is empty. Go to the 
            <a class="placeholder__link" href="../index.html">home</a>
            page and add interesting movies to you!
        </p>
    </div>`;
}


export { watchedMovies, queueMovies };
export { handleGalleryCards, createModalCardMarkup, createLibraryPlaceholderMarkup };