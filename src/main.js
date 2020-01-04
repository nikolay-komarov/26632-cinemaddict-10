import HeaderProfileComponent from './components/header-profile.js';
import MenuElementsComponent from './components/menu-elements.js';
import SortComponent from './components/sort.js';
import FilmsElementComponent from './components/films-element.js';
import FilmCardComponent from './components/film-card.js';
import TopRatedFilmsElementComponent from './components/top-rated-films-element.js';
import MostCommentedFilmsComponent from './components/most-commented-film-element.js';
import LoadMoreButtonComponent from './components/load-more-button.js';
import FilmDetailsComponent from './components/film-details.js';
import NoFilmsComponent from './components/no-films.js';

import {generateHeaderProfile} from './mock/header-profile';
import {generateFilmCards} from './mock/film-card.js';
import {FILM_COUNT, FILM_IN_EXTRA_COUNT} from './const';
import {generateFilters} from './mock/menu-elements.js';

import {render, RenderPosition} from './utils.js';

const SHOWING_FILM_CARDS_COUNT_ON_START = 5;
const SHOWING_FILM_CARDS_COUNT_BY_BUTTON = 5;

const siteBodyElement = document.querySelector(`body`);

const renderFilm = (filmList, filmCard) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closeFilmDetails();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const showFilmDetails = () => {
    render(siteBodyElement, filmDetailsComponent.getElement(), RenderPosition.BEFOREEND); // рендерим карточку с детальной информацией по фильму в body
    const filmDetailsCloseButton = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);
    filmDetailsCloseButton.addEventListener(`click`, closeFilmDetails);
  };
  const closeFilmDetails = () => {
    filmDetailsCloseButton.removeEventListener(`click`, closeFilmDetails);
    filmDetailsComponent.getElement().remove();
    filmDetailsComponent.removeElement();
  };

  const filmCardComponent = new FilmCardComponent(filmCard);

  const filmCardPoster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
  filmCardPoster.addEventListener(`click`, () => {
    showFilmDetails();
    document.addEventListener(`keydown`, onEscKeyDown);
  });
  const filmCardTitle = filmCardComponent.getElement().querySelector(`.film-card__title`);
  filmCardTitle.addEventListener(`click`, () => {
    showFilmDetails();
    document.addEventListener(`keydown`, onEscKeyDown);
  });
  const filmCardComments = filmCardComponent.getElement().querySelector(`.film-card__comments`);
  filmCardComments.addEventListener(`click`, () => {
    showFilmDetails();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const filmDetailsComponent = new FilmDetailsComponent(filmCard);
  const filmDetailsCloseButton = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);

  render(filmList, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new HeaderProfileComponent(generateHeaderProfile).getElement(), RenderPosition.BEFOREEND);

const filters = generateFilters();
render(siteMainElement, new MenuElementsComponent(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);

render(siteMainElement, new FilmsElementComponent().getElement(), RenderPosition.BEFOREEND);

const filmsElement = document.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);

const filmCards = generateFilmCards(FILM_COUNT);

if (filmCards.length === 0) {
  render(filmsListElement, new NoFilmsComponent().getElement(), RenderPosition.BEFOREEND);
} else {
  const filmsListContainer = filmsListElement.querySelector(`.films-list__container`);

  let showFilmCardsCount = SHOWING_FILM_CARDS_COUNT_ON_START;
  filmCards.slice(0, showFilmCardsCount).forEach((filmCard) => renderFilm(filmsListContainer, filmCard));

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(filmsListElement, loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);
  const showMoreButton = document.querySelector(`.films-list__show-more`);
  showMoreButton.addEventListener(`click`, () => {
    const prevFilmsCount = showFilmCardsCount;
    showFilmCardsCount = showFilmCardsCount + SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

    filmCards.slice(prevFilmsCount, showFilmCardsCount)
      .forEach((filmCard) => renderFilm(filmsListContainer, filmCard));

    if (showFilmCardsCount >= filmCards.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
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

  let filmsExtraList = filmsElement.querySelectorAll(`.films-list--extra`);

  // первые две карточки -> Top rated
  if (topRatedCards[FILM_IN_EXTRA_COUNT - 1].rating !== 0) {
    render(filmsElement, new TopRatedFilmsElementComponent().getElement(), RenderPosition.BEFOREEND);
    filmsExtraList = filmsElement.querySelectorAll(`.films-list--extra`);
    filmsExtraList[0].querySelector(`.films-list__title`).textContent = `Top rated`;
    const topRatedContainer = filmsExtraList[0].querySelector(`.films-list__container`);
    topRatedCards.forEach((filmCard) => renderFilm(topRatedContainer, filmCard));
  }
  // следующие две -> Most commented
  if (mostCommentedCards[FILM_IN_EXTRA_COUNT - 1].commentsCount !== 0) {
    render(filmsElement, new MostCommentedFilmsComponent().getElement(), RenderPosition.BEFOREEND);
    filmsExtraList = filmsElement.querySelectorAll(`.films-list--extra`);
    filmsExtraList[1].querySelector(`.films-list__title`).textContent = `Most commented`;
    const mostCommentedContainer = filmsExtraList[1].querySelector(`.films-list__container`);
    mostCommentedCards.forEach((filmCard) => renderFilm(mostCommentedContainer, filmCard));
  }
}

const siteFooterElement = document.querySelector(`.footer`);
const siteFooterFilmCount = siteFooterElement.querySelector(`.footer__statistics`);
siteFooterFilmCount.querySelector(`p`).textContent = filmCards.length + ` movies inside`;
