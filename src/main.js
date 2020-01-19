import HeaderProfileComponent from './components/header-profile.js';
import MenuElementsComponent from './components/menu-elements.js';
import FilmsElementComponent from './components/films-element.js';
import PageController from './controllers/page-controller.js';
import FilmsModel from './models/movies.js';

import {generateHeaderProfile} from './mock/header-profile';
import {generateFilmCards} from './mock/film-card.js';
import {FILM_COUNT} from './utils/const.js';
import {generateFilters} from './mock/menu-elements.js';

import {render, RenderPosition} from './utils/render.js';

const siteHeaderElement = document.querySelector(`.header`);

const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new HeaderProfileComponent(generateHeaderProfile), RenderPosition.BEFOREEND);

const filters = generateFilters();
render(siteMainElement, new MenuElementsComponent(filters), RenderPosition.BEFOREEND);

const filmsElement = new FilmsElementComponent();
render(siteMainElement, filmsElement, RenderPosition.BEFOREEND);

const filmCards = generateFilmCards(FILM_COUNT);
const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);

const pageController = new PageController(filmsElement, filmsModel);
pageController.render();

const siteFooterElement = document.querySelector(`.footer`);
const siteFooterFilmCount = siteFooterElement.querySelector(`.footer__statistics`);
siteFooterFilmCount.querySelector(`p`).textContent = filmCards.length + ` movies inside`;
