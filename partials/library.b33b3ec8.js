function e(e,r,t,n){Object.defineProperty(e,r,{get:t,set:n,enumerable:!0,configurable:!0})}function r(e){return e&&e.__esModule?e.default:e}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},o={},a=t.parcelRequired7c6;null==a&&((a=function(e){if(e in n)return n[e].exports;if(e in o){var r=o[e];delete o[e];var t={id:e,exports:{}};return n[e]=t,r.call(t.exports,t,t.exports),t.exports}var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,r){o[e]=r},t.parcelRequired7c6=a),a.register("kyEFX",(function(r,t){var n,o;e(r.exports,"register",(function(){return n}),(function(e){return n=e})),e(r.exports,"resolve",(function(){return o}),(function(e){return o=e}));var a={};n=function(e){for(var r=Object.keys(e),t=0;t<r.length;t++)a[r[t]]=e[r[t]]},o=function(e){var r=a[e];if(null==r)throw new Error("Could not resolve bundle with id "+e);return r}})),a("kyEFX").register(JSON.parse('{"bHX8u":"library.b33b3ec8.js","5UBio":"not-found.8cc15053.jpg","7BX6O":"library.629be147.js"}'));var i,s=a("2GrvB"),l=a("2hTmC");l=a("2hTmC");i=new URL("../"+a("kyEFX").resolve("5UBio"),import.meta.url).toString();const c=new(0,s.LocalStorageEntry)("Current library page"),u=document.querySelector("ul.gallery"),d=document.querySelector(".js-watched-btn"),f=document.querySelector(".js-queue-btn");function p(e){localStorage.setItem("currentMode",e)}function g(e){if(f.classList.remove("on-focus"),d.classList.add("on-focus"),0===l.watchedMovies.length){const e=l.createLibraryPlaceholderMarkup("watched");u.innerHTML=e}else h(l.watchedMovies,"watched")}function v(e){if(d.classList.remove("on-focus"),f.classList.add("on-focus"),0===l.queueMovies.length){const e=l.createLibraryPlaceholderMarkup("queue");u.innerHTML=e}else h(l.queueMovies,"queue")}function h(e,t){u.innerHTML="",c.clearList(),e.forEach((e=>{c.addMovieToLocalStorage(e)}));const n=e.map((e=>{let t=e.genres;e.genres.length>2&&(t=`${e.genres[0]}, ${e.genres[1]}, Other`);const n=new Date(e.release_date),o=e.poster_path?`https://image.tmdb.org/t/p/original${e.poster_path}`:r(i);return`\n            <li class="card" data-id=${e.id} data-modal-open>\n                <img src=${o} alt="Poster '${e.title}'" class="card__movie-img" width="200" height="300">\n                <div class="card__info">\n                    <p class="card__movie-title">${e.title}</p>\n                    <p class="card__add-info">${t}\n                    <span class="card__span"> | </span> ${n.getFullYear()} <span class="value__vote">${e.vote_average.toFixed(1)}</span></p>\n                </div>\n            </li>\n        `})).join("");u.innerHTML=n,l.handleGalleryCards(c,t)}"queue"===localStorage.getItem("currentMode")?v():g(),d.addEventListener("click",(()=>{g(),p("watched")})),f.addEventListener("click",(()=>{v(),p("queue")}));
//# sourceMappingURL=library.b33b3ec8.js.map