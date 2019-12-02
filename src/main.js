import {createHeaderProfileTemplate} from './components/header-profile.js';
import {createMenuElementsTemplate} from './components/menu-elements.js';
import {createFilmsElementTemplate} from './components/films-element.js';
import {createTopRatedFilmsElementTemplate} from './components/top-rated-films-element.js';
import {createMostCommentedFilmsElementTemplate} from './components/most-commented-film-element.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button.js';
import {createFilmDetailsTemplate} from './components/film-details.js';

const FILM_COUNT = 5;
const FILM_IN_EXTRA_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createHeaderProfileTemplate(), `beforeend`);
render(siteMainElement, createMenuElementsTemplate(), `beforeend`);
render(siteMainElement, createFilmsElementTemplate(), `beforeend`);

const filmsElement = document.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsListConteiner = filmsListElement.querySelector(`.films-list__container`);

new Array(FILM_COUNT)
  .fill(``)
  .forEach(
      () => render(filmsListConteiner, createFilmCardTemplate(), `beforeend`)
  );

render(filmsListElement, createLoadMoreButtonTemplate(), `beforeend`);


render(filmsElement, createTopRatedFilmsElementTemplate(), `beforeend`);
render(filmsElement, createMostCommentedFilmsElementTemplate(), `beforeend`);

const filmsExtraList = filmsElement.querySelectorAll(`.films-list--extra`);
filmsExtraList.forEach(function (it) {
  const element = it.querySelector(`.films-list__container`);
  new Array(FILM_IN_EXTRA_COUNT)
    .fill(``)
    .forEach(
        () => render(element, createFilmCardTemplate(), `beforeend`)
    );
});

const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, createFilmDetailsTemplate(), `beforeend`);

// скроем попап
document.querySelector(`.film-details`).classList.add(`visually-hidden`);

