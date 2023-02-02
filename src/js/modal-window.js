import { LocalStorageEntry } from "./local-storage-entry";
import { queue, watched } from "..";
let currentPage = '';
const galleryList = document.querySelector('ul.gallery');
const modalCard = document.querySelector('.modal-card');
const modal = document.querySelector('[data-modal]');


function addGalleryCardsEventListeners(curPage) {
    
    const modalOpenList = document.querySelectorAll('[data-modal-open]');
    const modalClose = document.querySelector('[data-modal-close]');
    currentPage = curPage;

    modalOpenList.forEach(item => {
        item.addEventListener('click', toggleModal);
    });

    modalClose.addEventListener('click', toggleModal);


    function toggleModal(e) {
        if (modal.classList.contains('is-hidden')) {
            AddToLocalStorage(renderModalCard(e.target));
            window.addEventListener('keydown', onKeyDown);
            modal.addEventListener('click', onBackdropClick);
        }
        modal.classList.toggle('is-hidden');
    }

    function onKeyDown(e) {
        if (e.keyCode == 27 && !modal.classList.contains('is-hidden')) {
            modal.classList.add('is-hidden');
            window.removeEventListener('keydown', onKeyDown);
        }
    }
        
    function onBackdropClick() {
        // if (!modal.classList.contains('is-hidden') ) {
        //     modal.classList.add('is-hidden');
        //     backdrop.removeEventListener('click', onBackdropClick)
        // }
        console.log('backdrop');
    }
}

function renderModalCard(el) {
    const movieId = findMovieId(el);
    const movie = currentPage.getMovieById(movieId);
    modalCard.innerHTML = createModalCardMarkup(movie);
    return movie;
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
                <li class="value__item"><span class="value__vote">${movie.vote_average}</span> / <span class="value__votes">${movie.vote_count}</span></li>
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
} // ok

function findMovieId(el) {
    for (let i = 0; i < galleryList.children.length; i++) {
        for (let j = 0; j < galleryList.children[0].childNodes.length; j++) {
            if (galleryList.children[i].childNodes[j] === el) {
                return galleryList.children[i].dataset.id;
            }
        }
    }
} // ok

function AddToLocalStorage(movie) {
    
    createDataResults();
    const watchedBtn = document.querySelector('.add-to-watched-btn');
    const queueBtn = document.querySelector('.add-to-queue-btn');

    watchedBtn.addEventListener('click', () => {
        watched.addMovieToLocalStorage(movie);

    });
    queueBtn.addEventListener('click', () => {
        queue.addMovieToLocalStorage(movie);
    });
    
}

function createDataResults() {
    queue.updateLocalStorageEntry();
    watched.updateLocalStorageEntry();
}


export {addGalleryCardsEventListeners, createModalCardMarkup, findMovieId};