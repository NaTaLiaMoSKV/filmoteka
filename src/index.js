import { fetchMovies } from "./fetchMovies";
import { LocalStorageEntry } from "./localStorageEntry";

const fetchMoviesApi = new fetchMovies();
const queue = new LocalStorageEntry('Queue');
const watched = new LocalStorageEntry('Watched');

createDataResults();

async function createDataResults() {
    queue.updateLocalStorageEntry();
    watched.updateLocalStorageEntry();

    const dataResults = await fetchMoviesApi.fetchPopularMovies();
    console.log('\nAdd to queue:')
    queue.addMovieToLocalStorage(dataResults[0]);
    console.log(queue.length);

    console.log('\nAdd to watched:')
    watched.addMovieToLocalStorage(dataResults[1]);
    console.log(watched.length);


    console.log('\nDelete from queue:')
    queue.deleteMovieFromLocalStorage(dataResults[0]);
    console.log(queue.length);

    console.log('\nDelete from watched:');
    watched.deleteMovieFromLocalStorage(dataResults[1]);
    console.log(watched.length);
}


