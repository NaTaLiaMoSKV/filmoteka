import Notiflix, { Notify } from "notiflix";

export class LocalStorageEntry {
    list = [];
    length = 0;

    constructor(key) {
        this.key = key;
    }

    // return movie from localStorage by id
    getMovieById(movieId) {
        for (let i = 0; i < this.list[0].length; i++) {
            if (this.list[0][i].id == movieId) return this.list[0][i];
        }
    }

    // add new Movie to localStorage
    addMovieToLocalStorage(movie) {
        if (!this.list.includes(movie)) {
            this.list.unshift(movie);
            this.updateLocalStorageEntry();
        } else Notiflix.Notify.info('already in storage');
        
    }

    // return true if the movie is found
    findMovie(movie) {
        if (this.list.length > 0) {
            if (this.list.map(movie => movie.id).includes(movie.id)) return true;
            else return false;
        } return false;
    }

    // delete the movie from localStorage
    deleteMovieFromLocalStorage(movie) {
        if(this.list.map(movie => movie.id).includes(movie.id)) {
            this.list.splice(this.list.indexOf(movie), 1);
            this.updateLocalStorageEntry();
        } 
    }


    // update entry in localStorage 
    updateLocalStorageEntry() {
        localStorage.setItem(this.key, JSON.stringify(this.list));
        this.length = this.list.length;
    }

    
    // get entries from localStorage
    getLocalStorageEntry(){
        if(localStorage.getItem(this.key)) {
            return JSON.parse(localStorage.getItem(this.key));
        }
    }

    // get number of movies
    get length() {
        return this.length;
    }

    // clear list
    clearList() {
        this.list = [];
    }
}