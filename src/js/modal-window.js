import { LocalStorageEntry } from "../js/local-storage-entry";

const queue = new LocalStorageEntry('Queue');
const watched = new LocalStorageEntry('Watched');

let currentPage = '';
const galleryList = document.querySelector('ul.gallery');
const modalCard = document.querySelector('.modal-card');
const modal = document.querySelector('[data-modal]');

const watchedMovies = JSON.parse(localStorage.getItem('Watched'));
const queueMovies = JSON.parse(localStorage.getItem('Queue'));
// console.log(watchedMovies);

function handleGalleryCards(page) {
    
    const modalOpenList = document.querySelectorAll('[data-modal-open]');
    const modalClose = document.querySelector('[data-modal-close]');
    currentPage = page;

    modalOpenList.forEach(item => {
        item.addEventListener('click', (e) => {
            modal.classList.remove('is-hidden');
            
            const movie = renderModalCard(e.target);
            handleLocalStorageButtons(movie);
            window.addEventListener('keydown', onKeyDown);
            document.addEventListener('click', onBackdropClick);
            modalClose.addEventListener('click', onModalCloseBtnClick);
        });
    });

    function onModalCloseBtnClick() {
        modal.classList.add('is-hidden');
        modalClose.removeEventListener('click', onModalCloseBtnClick);
    } 

    function onKeyDown(e) {
        if (e.keyCode == 27 && !modal.classList.contains('is-hidden')) {
            modal.classList.add('is-hidden');
            window.removeEventListener('keydown', onKeyDown);
        }
    }
        
    function onBackdropClick(e) {
        if (e.target.classList.contains('backdrop')) {
            modal.classList.add('is-hidden');
            document.removeEventListener('click', onBackdropClick);
        }
    }
}

function renderModalCard(el) {
    const movieId = findMovieId(el);
    const movie = currentPage.getMovieById(movieId);
    modalCard.innerHTML = createModalCardMarkup(movie);
    return movie;
} 

function createModalCardMarkup(movie) {
    let watchedBtnText = 'add to watched';
    let queueBtnText = 'add to queue';
    // if (watchedMovies.length !== 0) {
        // if(findMovieInList(movie, watchedMovies)) watchedBtnText = 'Remove from watched';
    // }
    
    // if (watched.findMovie(movie) || watchedMovies.includes(movie)) watchedBtnText = 'Remove from watched';
    // if (queue.findMovie(movie) || queuedMovies.includes(movie)) queueBtnText = 'Remove from queue';

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
                <li class="value__item"><span class="value__vote">${movie.vote_average}</span> / <span class="value__votes">${movie.vote_count}</span></li>
                <li class="value__item">${movie.popularity}</li>
                <li class="value__item value__original-title">${movie.original_title}</li>
                <li class="value__item value__genres">${movie.genres}</li>
            </ul>
            </div>
            <h3 class="modal-card__about">ABOUT</h3>
            <p class="modal-card__about-overview">${movie.overview}</p>
            <div class="modal-card__buttons">
            <button type="submit" class="add-to-watched-btn">${watchedBtnText}</button>
            <button type="submit" class="add-to-queue-btn">${queueBtnText}</button>
            </div>
        </div>
    `;
} // +-

function findMovieInList(movie, list) {
    if(list.find(item => item.id === movie.id) !== undefined) return true;
    else return false;
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

function handleLocalStorageButtons(movie) {

    const watchedBtn = document.querySelector('.add-to-watched-btn');
    const queueBtn = document.querySelector('.add-to-queue-btn');

    watchedBtn.addEventListener('click', () => {
        if (!watched.findMovie(movie)) {
            watched.addMovieToLocalStorage(movie);
            watchedMovies.list.unshift(movie);
            watchedBtn.textContent = 'Remove from watched';
            console.log(watchedMovies);
           } else {
            watched.deleteMovieFromLocalStorage(movie);
            watchedMovies.list.splice(watchedMovies.indexOf(movie), 1);
            watchedBtn.textContent = 'Add to watched';
            console.log(watchedMovies);
        }
    });

    // queueBtn.addEventListener('click', () => {
    //     if (!queueMovies.includes(movie)) {
    //         queue.addMovieToLocalStorage(movie);
    //         queueMovies.unshift(movie);
    //         // queueBtn.textContent = 'Remove from queue';
    //         console.log(queueMovies);
    //     } else {
    //         queue.deleteMovieFromLocalStorage(movie);
    //         queueMovies.splice(watchedMovies.indexOf(movie), 1);
    //         // queueBtn.textContent = 'Add to queue';
    //         console.log(queueMovies);
    //     }
    // });
    
}
export { watchedMovies, queueMovies };
export { handleGalleryCards, createModalCardMarkup, findMovieId };