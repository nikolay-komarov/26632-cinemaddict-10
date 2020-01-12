import SortComponent from '../components/sort.js';
import NoFilmsComponent from '../components/no-films.js';
import FilmsListComponent from '../components/films-list.js';
import FilmsListExtraComponent from '../components/films-list-extra.js';
import FilmsListContainerComponent from '../components/films-list-container.js';

import ShowMoreButtonComponent from '../components/show-more-button.js';
import MovieController from './movie-controller.js';

import {FILM_IN_EXTRA_COUNT, SHOWING_FILM_CARDS_COUNT_ON_START, SHOWING_FILM_CARDS_COUNT_BY_BUTTON} from '../utils/const.js';

import {render, remove, RenderPosition} from '../utils/render.js';
import {SortType} from '../components/sort.js';

const renderFilms = (filmList, filmCards, onDataChange, onViewChange) => {
  return filmCards.map((film) => {
    const filmController = new MovieController(filmList, onDataChange, onViewChange);
    filmController.render(film);
    return filmController;
  });
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._films = [];
    this._showedFilmControllers = [];
    this._showingFilmCardsCount = SHOWING_FILM_CARDS_COUNT_ON_START;

    this._sortComponent = new SortComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._filmsList = new FilmsListComponent();
    this._filmsListContainer = new FilmsListContainerComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._mostCommentedFilmsComponent = new FilmsListExtraComponent(`Most Commented`);
    this._mostCommentedFilmsContainerComponent = new FilmsListContainerComponent();
    this._topRatedFilmsComponent = new FilmsListExtraComponent(`Top Rated`);
    this._topRatedFilmsContainerComponent = new FilmsListContainerComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this); // ?
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(filmCards) {
    this._films = filmCards;

    const container = this._container.getElement();
    render(container, this._sortComponent, RenderPosition.BEFOREBEGIN);

    const filmsList = this._filmsList.getElement();
    const filmsListContainer = this._filmsListContainer.getElement();

    if (filmCards.length === 0) {
      render(container, this._noFilmsComponent, RenderPosition.BEFOREEND);
      return;
    } else {
      render(container, this._filmsList, RenderPosition.BEFOREEND);
      render(filmsList, this._filmsListContainer, RenderPosition.BEFOREEND);

      const newFilms = renderFilms(filmsListContainer, filmCards.slice(0, this._showingFilmCardsCount), this._onDataChange, this._onViewChange);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      this._renderShowMoreButton(filmCards);

      // TopRated, MostCommented
      const getTopRatedFilms = (allFilmCards) => {
        let ratedArray = allFilmCards;
        return ratedArray.sort((a, b) => a.rating > b.rating ? 1 : -1).slice(-1 * FILM_IN_EXTRA_COUNT);
      };
      const getMostCommentedFilms = (allFilmCards) => {
        let ratedArray = allFilmCards;
        return ratedArray.sort((a, b) => a.commentsCount > b.commentsCount ? 1 : -1).slice(-1 * FILM_IN_EXTRA_COUNT);
      };
      const topRatedCards = getTopRatedFilms(filmCards);
      const mostCommentedCards = getMostCommentedFilms(filmCards);

      // первые две карточки -> Top rated
      if (topRatedCards[FILM_IN_EXTRA_COUNT - 1].rating !== 0) {
        const topRatedList = this._topRatedFilmsComponent.getElement();
        const topRatedContainer = this._topRatedFilmsContainerComponent.getElement();
        render(container, this._topRatedFilmsComponent, RenderPosition.BEFOREEND);
        render(topRatedList, this._topRatedFilmsContainerComponent, RenderPosition.BEFOREEND);
        renderFilms(topRatedContainer, topRatedCards, this._onDataChange, this._onViewChange);
      }
      // следующие две -> Most commented
      if (mostCommentedCards[FILM_IN_EXTRA_COUNT - 1].commentsCount !== 0) {
        const mostCommentedList = this._mostCommentedFilmsComponent.getElement();
        const mostCommentedContainer = this._mostCommentedFilmsContainerComponent.getElement();
        render(container, this._mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
        render(mostCommentedList, this._mostCommentedFilmsContainerComponent, RenderPosition.BEFOREEND);
        renderFilms(mostCommentedContainer, mostCommentedCards, this._onDataChange, this._onViewChange);
      }
    }
  }

  _onSortTypeChange(sortType) {
    let sortedFilms = [];
    this._showingFilmCardsCount = SHOWING_FILM_CARDS_COUNT_ON_START;

    switch (sortType) {
      case SortType.DATE:
        sortedFilms = this._films.slice().sort((a, b) => b.releaseDate - a.releaseDate);
        break;
      case SortType.RATING:
        sortedFilms = this._films.slice().sort((a, b) => b.rating - a.rating);
        break;
      case SortType.DEFAULT:
        sortedFilms = this._films;
        break;
    }

    const filmsListContainer = this._filmsListContainer.getElement();
    filmsListContainer.innerHTML = ``;
    remove(this._showMoreButtonComponent);

    renderFilms(filmsListContainer, sortedFilms.slice(0, this._showingFilmCardsCount), this._onDataChange, this._onViewChange);
    this._renderShowMoreButton(sortedFilms);
  }

  _renderShowMoreButton(showingFilmCards) {
    if (this._showingFilmCardsCount >= showingFilmCards.length) {
      return;
    } else {
      const filmsList = this._filmsList.getElement();
      render(filmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

      const filmsListContainer = this._filmsListContainer.getElement();
      this._showMoreButtonComponent.setClickHandler(() => {
        const prevFilmsCount = this._showingFilmCardsCount;
        this._showingFilmCardsCount = this._showingFilmCardsCount + SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

        renderFilms(filmsListContainer, showingFilmCards.slice(prevFilmsCount, this._showingFilmCardsCount), this._onDataChange, this._onViewChange);

        if (this._showingFilmCardsCount >= showingFilmCards.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    }
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);
    if (index === -1) {
      return;
    }
    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));
    movieController.render(this._films[index]);
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }
}
