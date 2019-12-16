import {createHeaderProfileTemplate} from './components/header-profile.js';
import {createMenuElementsTemplate} from './components/menu-elements.js';
import {createFilmsElementTemplate} from './components/films-element.js';
import {createTopRatedFilmsElementTemplate} from './components/top-rated-films-element.js';
import {createMostCommentedFilmsElementTemplate} from './components/most-commented-film-element.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button.js';
import {createFilmDetailsTemplate} from './components/film-details.js';

import {generateHeaderProfile} from './mock/header-profile';

import {generateFilmCards} from './mock/film-card.js';

import {FILM_COUNT} from './const';
import {FILM_IN_EXTRA_COUNT} from './const';
import {generateFilters} from './mock/menu-elements.js';

const SHOWING_FILM_CARDS_COUNT_ON_START = 5;
const SHOWING_FILM_CARDS_COUNT_BY_BUTTON = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createHeaderProfileTemplate(generateHeaderProfile), `beforeend`);

const filters = generateFilters();
render(siteMainElement, createMenuElementsTemplate(filters), `beforeend`);

render(siteMainElement, createFilmsElementTemplate(), `beforeend`);

const filmsElement = document.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsListConteiner = filmsListElement.querySelector(`.films-list__container`);

const filmCards = generateFilmCards(FILM_COUNT);
let showFilmCardsCount = SHOWING_FILM_CARDS_COUNT_ON_START;
filmCards.slice(0, showFilmCardsCount).forEach((it) => render(filmsListConteiner, createFilmCardTemplate(it), `beforeend`));

render(filmsListElement, createLoadMoreButtonTemplate(), `beforeend`);
const showMoreButton = document.querySelector(`.films-list__show-more`);
showMoreButton.addEventListener(`click`, () => {
  const prevFilmsCount = showFilmCardsCount;
  showFilmCardsCount = showFilmCardsCount + SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

  filmCards.slice(prevFilmsCount, showFilmCardsCount)
    .forEach((filmCard) => render(filmsListConteiner, createFilmCardTemplate(filmCard), `beforeend`));

  if (showFilmCardsCount >= filmCards.length) {
    showMoreButton.remove();
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
  render(filmsElement, createTopRatedFilmsElementTemplate(), `beforeend`);
  filmsExtraList = filmsElement.querySelectorAll(`.films-list--extra`);
  filmsExtraList[0].querySelector(`.films-list__title`).textContent = `Top rated`;
  const topRatedContainer = filmsExtraList[0].querySelector(`.films-list__container`);
  topRatedCards.forEach((iCard) => render(topRatedContainer, createFilmCardTemplate(iCard), `beforeend`));
}
// следующие две -> Most commented
if (mostCommentedCards[FILM_IN_EXTRA_COUNT - 1].commentsCount !== 0) {
  render(filmsElement, createMostCommentedFilmsElementTemplate(), `beforeend`);
  filmsExtraList = filmsElement.querySelectorAll(`.films-list--extra`);
  filmsExtraList[1].querySelector(`.films-list__title`).textContent = `Most commented`;
  const mostCommentedContainer = filmsExtraList[1].querySelector(`.films-list__container`);
  mostCommentedCards.forEach((iCard) => render(mostCommentedContainer, createFilmCardTemplate(iCard), `beforeend`));
}

const siteFooterElement = document.querySelector(`.footer`);
const siteFooterFilmCount = siteFooterElement.querySelector(`.footer__statistics`);
siteFooterFilmCount.querySelector(`p`).textContent = filmCards.length + ` movies inside`;

render(siteFooterElement, createFilmDetailsTemplate(filmCards[0]), `beforeend`);

// скроем попап
document.querySelector(`.film-details`).classList.add(`visually-hidden`);

