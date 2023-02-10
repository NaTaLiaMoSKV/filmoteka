import { LocalStorageEntry } from "../js/local-storage-entry";

const queue = new LocalStorageEntry('Queue');
const watched = new LocalStorageEntry('Watched');

const watchedMovies = JSON.parse(localStorage.getItem('Watched'));
const queueMovies = JSON.parse(localStorage.getItem('Queue'));;

let currentPage = '';
let mode = '';
const galleryList = document.querySelector('ul.gallery');
const modalCard = document.querySelector('.modal-card');
const modal = document.querySelector('[data-modal]');

function handleGalleryCards(page, m) {
    const modalOpenList = document.querySelectorAll('[data-modal-open]');
    const modalClose = document.querySelector('[data-modal-close]');
    currentPage = page;
    mpde = m;

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

// render modal card and return movie
function renderModalCard(el) {
    const movieId = findMovieId(el);
    const movie = currentPage.getMovieById(movieId);
    modalCard.innerHTML = createModalCardMarkup(movie);
    return movie;
} 

// create markup for modal card
function createModalCardMarkup(movie) {
    let watchedBtnText = 'add to watched';
    let queueBtnText = 'add to queue';
    
    if(watched.findMovie(movie) || (watchedMovies !== null && findMovieInList(movie, watchedMovies))) watchedBtnText = 'remove from watched';
    if (queue.findMovie(movie) || (queueMovies !== null && findMovieInList(movie, queueMovies))) queueBtnText = 'remove from queue';
    
    return `
        <img class="modal-card__img" src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}" width="200" height="300">
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
            <button type="submit" class="add-to-watched-btn">${watchedBtnText}</button>
            <button type="submit" class="add-to-queue-btn">${queueBtnText}</button>
            </div>
        </div>
    `;
} 

// find true if movie is found the list
function findMovieInList(movie, list) {
    if(list.find(item => item.id === movie.id) !== undefined) return true;
    else return false;
}

// find and return movie id
function findMovieId(el) {
    for (let i = 0; i < galleryList.children.length; i++) {
        for (let j = 0; j < galleryList.children[0].childNodes.length; j++) {
            if (galleryList.children[i].childNodes[j] === el) {
                return galleryList.children[i].dataset.id;
            }
        }
    }
} 

// handle modal form buttons and update text
function handleLocalStorageButtons(movie) {

    const watchedBtn = document.querySelector('.add-to-watched-btn');
    const queueBtn = document.querySelector('.add-to-queue-btn');

    if (mode === 'watched') {
        queueBtn.style.display = 'none';
    }
    if (mode === 'queue') {
        watchedBtn.style.display = 'none';
    }

    watchedBtn.addEventListener('click', () => {

        if (watched.findMovie(movie) || (watchedMovies !== null && findMovieInList(movie, watchedMovies))) { // delete movie from LocalStorage 
            watched.deleteMovieFromLocalStorage(movie);
            watchedBtn.textContent = 'Add to watched';
            watchedMovies.splice(watchedMovies.indexOf(movie), 1);
            watched.clearList();
            watched.updateLocalStorageEntry();
            watched.addMovieToLocalStorage(watchedMovies);
            console.log(watchedMovies);
            updateLibraryCards(watchedMovies);
        } else { // add movie to LocalStorage 
            watched.addMovieToLocalStorage(movie);
            watchedBtn.textContent = 'Remove from watched';
            watchedMovies.unshift(movie);
            console.log(watchedMovies);
            updateLibraryCards(watchedMovies);
        }
        
    });

    queueBtn.addEventListener('click', () => {
        if (queue.findMovie(movie) || (queueMovies !== null && findMovieInList(movie, queueMovies))) { // delete movie from LocalStorage 
            queue.deleteMovieFromLocalStorage(movie);
            queueBtn.textContent = 'Add to queue';
            queueMovies.splice(queueMovies.indexOf(movie), 1);
            queue.clearList();
            queue.updateLocalStorageEntry();
            queue.addMovieToLocalStorage(queueMovies);
            console.log(queueMovies);
            updateLibraryCards(queueMovies);
            
        } else { // add movie to LocalStorage 
            queue.addMovieToLocalStorage(movie);
            queueBtn.textContent = 'Remove from queue';
            queueMovies.unshift(movie);
            console.log(queueMovies);
            updateLibraryCards(queueMovies);
        }
    });
    
}

// update library gallery
function updateLibraryCards(movies) {
    const markup = updateLibraryMarkup(movies);
    galleryList.innerHTML = markup;
}

// update and return library markup
function updateLibraryMarkup(movies) {
    return movies.map((movie) => {
        let genres = movie.genres;
        if (movie.genres.length > 2) {
            genres = `${movie.genres[0]}, ${movie.genres[1]}, Other`;
        };
        const release_date = new Date(movie.release_date)
        return `
            <li class="card" data-id="${movie.id}" data-modal-open>
                <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="Poster \'${movie.title}\'" class="card__movie-img" width="200" height="300">
                <div class="card__info">
                    <p class="card__movie-title">${movie.title}</p>
                    <p class="card__add-info">${genres}
                    <span class="card__span"> | </span> ${release_date.getFullYear()} <span class="value__vote">${movie.vote_average.toFixed(1)}</span></p>
                </div>
            </li>
        `;
    }).join('');
}


export { watchedMovies, queueMovies };
export { handleGalleryCards, createModalCardMarkup, findMovieId };