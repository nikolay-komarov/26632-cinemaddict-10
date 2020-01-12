import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import {render, remove, replace, RenderPosition} from '../utils/render.js';
import {getDeepClone} from '../utils/common.js';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._siteBodyElement = document.querySelector(`body`);

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
  }

  render(filmCard) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(filmCard);
    this._filmDetailsComponent = new FilmDetailsComponent(filmCard);

    this._filmCardComponent.setPosterClickHandler(() => {
      this._showFilmDetails();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });
    this._filmCardComponent.setTitleClickHandler(() => {
      this._showFilmDetails();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });
    this._filmCardComponent.setCommentsClickHandler(() => {
      this._showFilmDetails();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmCardComponent.setAddToWatchButtonClickHandler(() => {
      let newFilmCard = getDeepClone(filmCard);
      newFilmCard.userDetails.watchlist = !filmCard.userDetails.watchlist;
      this._onDataChange(this, filmCard, newFilmCard);
    });
    this._filmCardComponent.setMarkAsWatchedButtonClickHandler(() => {
      let newFilmCard = getDeepClone(filmCard);
      newFilmCard.userDetails.alreadyWatched = !filmCard.userDetails.alreadyWatched;
      newFilmCard.userDetails.watchingDate = new Date();
      this._onDataChange(this, filmCard, newFilmCard);
    });
    this._filmCardComponent.setMarAsFavoriteButtonClickHandler(() => {
      let newFilmCard = getDeepClone(filmCard);
      newFilmCard.userDetails.favorite = !filmCard.userDetails.favorite;
      this._onDataChange(this, filmCard, newFilmCard);
    });

    this._filmDetailsComponent.setAddToWatchButtonClickHandler(() => {
      let newFilmCard = getDeepClone(filmCard);
      newFilmCard.userDetails.watchlist = !filmCard.userDetails.watchlist;
      this._onDataChange(this, filmCard, newFilmCard);
    });
    this._filmDetailsComponent.setMarkAsWatchedButtonClickHandler(() => {
      let newFilmCard = getDeepClone(filmCard);
      newFilmCard.userDetails.alreadyWatched = !filmCard.userDetails.alreadyWatched;
      newFilmCard.userDetails.watchingDate = new Date();
      this._onDataChange(this, filmCard, newFilmCard);
    });
    this._filmDetailsComponent.setMarkAsFavoriteButtonClickHandler(() => {
      let newFilmCard = getDeepClone(filmCard);
      newFilmCard.userDetails.favorite = !filmCard.userDetails.favorite;
      this._onDataChange(this, filmCard, newFilmCard);
    });
    this._filmDetailsComponent.setUserRatingClickHandler(() => {
      let newFilmCard = getDeepClone(filmCard);
      newFilmCard.userDetails.personalRating = this._filmDetailsComponent.userRating;
      this._onDataChange(this, filmCard, newFilmCard);
    });

    if (oldFilmCardComponent && oldFilmDetailsComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
      this._filmDetailsComponent.setCloseButtonClickHandler(() => this._closeFilmDetails());
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeFilmDetails();
    }
  }

  _showFilmDetails() {
    this._onViewChange(); // убивает обработчики на детальной карточке

    this._filmDetailsComponent.setCloseButtonClickHandler(() => this._closeFilmDetails());
    render(this._siteBodyElement, this._filmDetailsComponent, RenderPosition.BEFOREEND); // рендерим карточку с детальной информацией по фильму в body
    this._filmDetailsComponent.isComponetShowing = true;

    this._mode = Mode.POPUP;
  }

  _closeFilmDetails() {
    this._filmDetailsComponent.removeCloseButtonClickHandler(() => this._closeFilmDetails());
    remove(this._filmDetailsComponent);
    this._mode = Mode.DEFAUL;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closeFilmDetails();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
