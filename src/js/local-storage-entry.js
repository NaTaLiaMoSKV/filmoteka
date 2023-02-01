import Notiflix, { Notify } from "notiflix";

export class LocalStorageEntry {
    list = [];
    length = 0;

    constructor(key) {
        this.key = key;
    }

    // return movie from localStorage by id
    getMovieById(movieId) {
        // console.log(`id: ${movieId}`);
        for (let i = 0; i < this.list[0].length; i++) {
            // console.log(this.list[0][i].id);
            // console.log(movieId);
            if (this.list[0][i].id == movieId) return this.list[0][i];
        }
    }

    // add new Movie to localStorage
    addMovieToLocalStorage(movie) {
        this.list.unshift(movie);
        this.updateLocalStorageEntry();

    }

    // delete the movie from localStorage
    deleteMovieFromLocalStorage(movie) {
        if(this.list.includes(movie)) {
            this.list.splice(this.list.indexOf(movie), 1);
            this.updateLocalStorageEntry();
        } else
        Notiflix.Notify.failure('can\'t find the movie to delete');
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
}