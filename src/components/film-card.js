import AbstractComponent from './abstract-component.js';
import {SHORT_DESCRIPTION_SYMBOLS, SHORT_DESCRIPTION_END_SYMBOL} from '../utils/const.js';

const createFilmCardControlsMarkup = (card) => {
  const {
    watchlist,
    alreadyWatched,
    favorite
  } = card.userDetails;
  return (
    `<button class="film-card__controls-item ${watchlist ? `film-card__controls-item--active` : ``} button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
    <button class="film-card__controls-item ${alreadyWatched ? `film-card__controls-item--active` : ``} button film-card__controls-item--mark-as-watched">Mark as watched</button>
    <button class="film-card__controls-item ${favorite ? `film-card__controls-item--active` : ``} button film-card__controls-item--favorite">Mark as favorite</button>`
  );
};

const createFilmCardTemplate = (card) => {
  const {title, rating, year, duration, genres, poster, description, commentsCount} = card;
  const shortDescription = (description.length < 140) ? description : (description.slice(0, SHORT_DESCRIPTION_SYMBOLS - 1) + SHORT_DESCRIPTION_END_SYMBOL);
  const filmCardControlsTemplate = createFilmCardControlsMarkup(card);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        ${filmCardControlsTemplate}
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(card) {
    super();
    this._card = card;
  }

  getTemplate() {
    return createFilmCardTemplate(this._card);
  }

  setPosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, handler);
  }

  setTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`)
      .addEventListener(`click`, handler);
  }

  setCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`)
      .addEventListener(`click`, handler);
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setMarkAsWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setMarAsFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
