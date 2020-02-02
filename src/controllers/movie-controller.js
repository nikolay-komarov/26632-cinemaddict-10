import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import Film from '../models/movie.js';
import {render, remove, replace, RenderPosition} from '../utils/render.js';
import {USER_FILM_RATING} from '../utils/const.js';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, userName, api) {
    this._container = container;
    this._siteBodyElement = document.querySelector(`body`);
    this._userName = userName;
    this._api = api;

    this._filmCard = null;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._showFilmDetails = this._showFilmDetails.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._addToWatchlistHandler = this._addToWatchlistHandler.bind(this);
    this._markAsWatchedHandler = this._markAsWatchedHandler.bind(this);
    this._markAsFavoriteHandler = this._markAsFavoriteHandler.bind(this);

    this._onCommentDataChange = this._onCommentDataChange.bind(this);
    this._onUserRatingChange = this._onUserRatingChange.bind(this);
    this._onUserRatingUndo = this._onUserRatingUndo.bind(this);
  }

  render(filmCard) {
    this._filmCard = filmCard;

    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = this._createFilmCardComponent(this._filmCard);
    this._filmDetailsComponent = this._createFilmDetailsComponent(this._filmCard, this._userName);

    if (oldFilmCardComponent && oldFilmDetailsComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }
  }

  getFilmCardId() {
    return this._filmCard.id;
  }

  _createFilmCardComponent(filmCard) {
    const filmCardComponent = new FilmCardComponent(filmCard);

    // обработчики для открытия попапа (filmdetails)
    filmCardComponent.setPosterClickHandler(this._showFilmDetails);
    filmCardComponent.setTitleClickHandler(this._showFilmDetails);
    filmCardComponent.setCommentsClickHandler(this._showFilmDetails);

    // обработчики для панели filmCard
    filmCardComponent.setAddToWatchlistButtonClickHandler(this._addToWatchlistHandler);
    filmCardComponent.setMarkAsWatchedButtonClickHandler(this._markAsWatchedHandler);
    filmCardComponent.setMarAsFavoriteButtonClickHandler(this._markAsFavoriteHandler);

    return filmCardComponent;
  }

  _createFilmDetailsComponent(filmCard, userName) {
    const filmDetailsComponent = new FilmDetailsComponent(filmCard, userName);

    filmDetailsComponent.setCloseButtonClickHandler(this._closeFilmDetails);

    // обработчики для панели filmDetailsControl
    filmDetailsComponent.setAddToWatchlistButtonClickHandler(this._addToWatchlistHandler);
    filmDetailsComponent.setMarkAsWatchedButtonClickHandler(this._markAsWatchedHandler);
    filmDetailsComponent.setMarkAsFavoriteButtonClickHandler(this._markAsFavoriteHandler);

    filmDetailsComponent.setDeleteCommentButtonsClickHandler(this._onCommentDataChange);
    filmDetailsComponent.setAddCommentKeyDownHandler(this._onCommentDataChange);

    filmDetailsComponent.setUserRatingClickHandler(this._onUserRatingChange);
    filmDetailsComponent.setUserRatingUndoClickHandler(this._onUserRatingUndo);

    return filmDetailsComponent;
  }

  _addToWatchlistHandler() {
    const newFilmCard = Film.clone((this._filmCard));
    newFilmCard.userDetails.watchlist = !this._filmCard.userDetails.watchlist;
    this._onDataChange(this, this._filmCard, newFilmCard);
  }

  _markAsWatchedHandler() {
    const newFilmCard = Film.clone((this._filmCard));
    newFilmCard.userDetails.alreadyWatched = !this._filmCard.userDetails.alreadyWatched;
    newFilmCard.userDetails.watchingDate = new Date();
    this._onDataChange(this, this._filmCard, Film.clone(newFilmCard));
  }

  _markAsFavoriteHandler() {
    const newFilmCard = Film.clone((this._filmCard));
    newFilmCard.userDetails.favorite = !this._filmCard.userDetails.favorite;
    this._onDataChange(this, this._filmCard, Film.clone(newFilmCard));
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeFilmDetails();
    }
  }

  _showFilmDetails() {
    this._onViewChange();

    this._filmDetailsComponent = this._createFilmDetailsComponent(this._filmCard, this._userName);
    render(this._siteBodyElement, this._filmDetailsComponent, RenderPosition.BEFOREEND); // рендерим карточку с детальной информацией по фильму в body
    document.addEventListener(`keydown`, this._onEscKeyDown);

    this._mode = Mode.POPUP;
  }

  _closeFilmDetails() {
    remove(this._filmDetailsComponent); // удаляем попап со всеми обработчиками
    this._mode = Mode.DEFAUL;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closeFilmDetails();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _onCommentDataChange(oldComment, newComment, evt) {
    this._clearErrorComment();
    const element = this._filmDetailsComponent.getElement().querySelector(`.film-details__comment-input`);
    if (oldComment !== null || !newComment !== null) {
      const newFilmCard = Film.clone(this._filmCard);
      if (oldComment === null) { // добавим новый комментарий
        element.setAttribute(`readonly`, `readonly`);
        this._api.addComment(newFilmCard, newComment)
          .then(() => {
            newFilmCard.comments.push(newComment);
            newFilmCard.commentsCount = newFilmCard.comments.length;
            element.removeAttribute(`readonly`);
          })
          .catch(() => {
            this._onErrorComment();
            element.removeAttribute(`readonly`);
          });
      } else if (newComment === null) { // удалим старый комментарий
        this._api.deleteComment(oldComment.id)
          .then(() => {
            newFilmCard.comments = newFilmCard.comments.filter((it) => it.id !== oldComment.id);
            newFilmCard.commentsCount = newFilmCard.comments.length;
          })
          .catch(() => {
            evt.target.textContent = `Delete`;
            evt.target.disabled = false;
          });
      // } else { // Д12?
      //   return;
      }
      this._onDataChange(this, this._filmCard, Film.clone(newFilmCard));
    }
  }

  _onUserRatingChange(newUserRating) {
    this._clearErrorRating();
    const ratingElements = this._filmDetailsComponent.getElement()
      .querySelector(`.film-details__user-rating-score`)
      .getElementsByTagName(`*`);
    Array.from(ratingElements).forEach((it) => {
      it.setAttribute(`disabled`, `disabled`);
    });
    const newFilmCard = Film.clone((this._filmCard));
    newFilmCard.userDetails.personalRating = newUserRating;
    this._api.updateFilm(this._filmCard.id, newFilmCard)
      .then((updatedFilm) => {
        this._filmCard = updatedFilm;
        this.render(updatedFilm);
      })
      .catch(() => {
        this._onErrorRating(newUserRating);
        Array.from(ratingElements).forEach((it) => {
          it.removeAttribute(`disabled`);
        });
      });
    this._onDataChange(this, this._filmCard, newFilmCard);
  }

  _onUserRatingUndo() {
    this._clearErrorRating();
    const newFilmCard = Film.clone((this._filmCard));
    newFilmCard.userDetails.personalRating = USER_FILM_RATING.UNDO;
    this._api.updateFilm(this._filmCard.id, newFilmCard)
      .then((updatedFilm) => {
        this._filmCard = updatedFilm;
        this.render(updatedFilm);
      });
    this._onDataChange(this, this._filmCard, newFilmCard);
  }

  _onErrorComment() {
    this._filmDetailsComponent.onErrorCommentInput();
    this._filmDetailsComponent.shakeForm();
  }
  _clearErrorComment() {
    this._filmDetailsComponent.resetCommentStyleFromError();
  }
  _onErrorRating(newUserRating) {
    this._filmDetailsComponent.onErrorUserRating(newUserRating);
    this._filmDetailsComponent.shakeForm();
  }
  _clearErrorRating() {
    this._filmDetailsComponent.resetRatingStyleFromError();
  }
}
