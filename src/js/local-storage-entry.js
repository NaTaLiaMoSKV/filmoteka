import Notiflix from "notiflix";

export class LocalStorageEntry {
    list = [];
    key = "";
    length = 0;

    constructor(key) {
        this.key = key;
        const storedData = this.getLocalStorageEntry();
        if (storedData && Array.isArray(storedData)) {
            this.list = storedData;
            this.length = this.list.length;
        }
    }

    // get movie from localStorage by id
    getMovieById(movieId) {
        return this.list.find(movie => movie.id.toString() === movieId);
    }

    // add new movie to localStorage
    addMovieToLocalStorage(movie) {
        if (!this.findMovie(movie)) {
            if (this.key === 'Current page') this.list.push(movie);
            else this.list.unshift(movie)
            this.updateLocalStorageEntry();
        }
    }

    // return true if movie is found
    findMovie(movie) {
        return this.list.some(item => item.id === movie.id);
    }

    // delete movie from localStorage
    deleteMovieFromLocalStorage(movie) {
        const index = this.list.findIndex(item => item.id === movie.id);
        if (index !== -1) {
            this.list.splice(index, 1);
            this.updateLocalStorageEntry();
        }
    }

    // update localStorage entry
    updateLocalStorageEntry() {
        localStorage.setItem(this.key, JSON.stringify(this.list));
        this.length = this.list.length;
    }

    // get localStorage entry
    getLocalStorageEntry() {
        const storedData = localStorage.getItem(this.key);
        return storedData ? JSON.parse(storedData) : [];
    }

    // get length
    getLength() {
        return this.length;
    }

    // clear list
    clearList() {
        this.list = [];
        this.updateLocalStorageEntry();
    }
}