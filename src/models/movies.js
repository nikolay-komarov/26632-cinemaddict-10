import {getFilmsByFilter} from '../utils/filter.js';
import {FilterType} from '../utils/const.js';

export default class Films {
  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }
  getFilmsAll() {
    return this._films;
  }
  setFilms(films) {
    this._films = Array.from(films);
  }
  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }
  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }
    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));
    this._dataChangeHandlers.forEach((handler) => handler());
    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }
  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }
}
