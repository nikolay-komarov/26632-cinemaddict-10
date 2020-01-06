import SortComponent from '../components/sort.js';
import NoFilmsComponent from '../components/no-films.js';
import FilmsListComponent from '../components/films-list.js';
import FilmsListExtraComponent from '../components/films-list-extra.js';
import FilmsListContainerComponent from '../components/films-list-container.js';
import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';

import {FILM_IN_EXTRA_COUNT, SHOWING_FILM_CARDS_COUNT_ON_START, SHOWING_FILM_CARDS_COUNT_BY_BUTTON} from '../utils/const.js';

const siteBodyElement = document.querySelector(`body`);

import {render, remove, RenderPosition} from '../utils/render.js';
import {SortType} from '../components/sort.js';

const renderFilm = (filmList, filmCard) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closeFilmDetails();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const showFilmDetails = () => {
    filmDetailsComponent.setCloseButtonClickHandler(closeFilmDetails);
    render(siteBodyElement, filmDetailsComponent, RenderPosition.BEFOREEND); // рендерим карточку с детальной информацией по фильму в body
  };
  const closeFilmDetails = () => {
    remove(filmDetailsComponent);
  };

  const filmCardComponent = new FilmCardComponent(filmCard);
  filmCardComponent.setPosterClickHandler(() => {
    showFilmDetails();
    document.addEventListener(`keydown`, onEscKeyDown);
  });
  filmCardComponent.setTitleClickHandler(() => {
    showFilmDetails();
    document.addEventListener(`keydown`, onEscKeyDown);
  });
  filmCardComponent.setCommentsClickHandler(() => {
    showFilmDetails();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const filmDetailsComponent = new FilmDetailsComponent(filmCard);

  render(filmList, filmCardComponent, RenderPosition.BEFOREEND);
};

const renderFilms = (filmList, filmCards) => {
  filmCards.forEach((filmCard) => {
    renderFilm(filmList, filmCard);
  });
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._sortComponent = new SortComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._filmsList = new FilmsListComponent();
    // this._filmsElementComponent = new FilmsElementComponent();
    this._filmsListContainer = new FilmsListContainerComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._mostCommentedFilmsComponent = new FilmsListExtraComponent(`Most Commented`);
    this._mostCommentedFilmsContainerComponent = new FilmsListContainerComponent();
    this._topRatedFilmsComponent = new FilmsListExtraComponent(`Top Rated`);
    this._topRatedFilmsContainerComponent = new FilmsListContainerComponent();
  }

  render(filmCards) {
    const renderShowMoreButton = () => {
      if (showingFilmCardsCount >= filmCards.length) {
        return;
      } else {
        render(filmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
        this._showMoreButtonComponent.setClickHandler(() => {
          const prevFilmsCount = showingFilmCardsCount;
          showingFilmCardsCount = showingFilmCardsCount + SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

          renderFilms(filmsListContainer, filmCards.slice(prevFilmsCount, showingFilmCardsCount));

          if (showingFilmCardsCount >= filmCards.length) {
            remove(this._showMoreButtonComponent);
          }
        });
      }
    };

    const container = this._container.getElement();
    render(container, this._sortComponent, RenderPosition.BEFOREBEGIN);

    const filmsList = this._filmsList.getElement();
    const filmsListContainer = this._filmsListContainer.getElement();

    let showingFilmCardsCount = SHOWING_FILM_CARDS_COUNT_ON_START;

    if (filmCards.length === 0) {
      render(container, this._noFilmsComponent, RenderPosition.BEFOREEND);
      return;
    } else {
      render(container, this._filmsList, RenderPosition.BEFOREEND);
      render(filmsList, this._filmsListContainer, RenderPosition.BEFOREEND);
      renderFilms(filmsListContainer, filmCards.slice(0, showingFilmCardsCount));
      renderShowMoreButton();

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        let sortedFilms = [];

        switch (sortType) {
          case SortType.DATE:
            sortedFilms = filmCards.slice().sort((a, b) => b.releaseDate - a.releaseDate);
            break;
          case SortType.RATING:
            sortedFilms = filmCards.slice().sort((a, b) => b.rating - a.rating);
            break;
          case SortType.DEFAULT:
            sortedFilms = filmCards.slice(0, showingFilmCardsCount);
            break;
        }

        filmsListContainer.innerHTML = ``;
        renderFilms(filmsListContainer, sortedFilms);

        if (sortType === SortType.DEFAULT) {
          renderShowMoreButton();
        } else {
          remove(this._showMoreButtonComponent);
        }
      });

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
        renderFilms(topRatedContainer, topRatedCards);
      }
      // следующие две -> Most commented
      if (mostCommentedCards[FILM_IN_EXTRA_COUNT - 1].commentsCount !== 0) {
        const mostCommentedList = this._mostCommentedFilmsComponent.getElement();
        const mostCommentedContainer = this._mostCommentedFilmsContainerComponent.getElement();
        render(container, this._mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
        render(mostCommentedList, this._mostCommentedFilmsContainerComponent, RenderPosition.BEFOREEND);
        renderFilms(mostCommentedContainer, mostCommentedCards);
      }
    }
  }
}
