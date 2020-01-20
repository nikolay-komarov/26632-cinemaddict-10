import {FilterType} from '../utils/const.js';

export const getWatchlistFilms = (films) => {
  return films.filter((film) => film.userDetails.watchlist);
};

export const getWatchedFilms = (films) => {
  return films.filter((film) => film.userDetails.alreadyWatched);
};

export const getFavoritesFilms = (films) => {
  return films.filter((film) => film.userDetails.favorite);
};

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATCHLIST:
      return getWatchlistFilms(films);
    case FilterType.HISTORY:
      return getWatchedFilms(films);
    case FilterType.FAVORITES:
      return getFavoritesFilms(films);
  }

  return films;
};
