import HeaderProfileComponent from './components/header-profile.js';
import MenuController from './controllers/menu-controller.js';
import FilmsElementComponent from './components/films-element.js';
import PageController from './controllers/page-controller.js';
import FilmsModel from './models/movies.js';

import {generateHeaderProfile} from './mock/header-profile';
import {generateFilmCards} from './mock/film-card.js';
import {FILM_COUNT} from './utils/const.js';

import {render, RenderPosition} from './utils/render.js';

const siteHeaderElement = document.querySelector(`.header`);

const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new HeaderProfileComponent(generateHeaderProfile), RenderPosition.BEFOREEND);

const filmCards = generateFilmCards(FILM_COUNT);

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);

const menuController = new MenuController(siteMainElement, filmsModel);
menuController.render();

const filmsElement = new FilmsElementComponent();
render(siteMainElement, filmsElement, RenderPosition.BEFOREEND);

const pageController = new PageController(filmsElement, filmsModel);
pageController.render();

const siteFooterElement = document.querySelector(`.footer`);
const siteFooterFilmCount = siteFooterElement.querySelector(`.footer__statistics`);
siteFooterFilmCount.querySelector(`p`).textContent = filmCards.length + ` movies inside`;
