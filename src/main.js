import HeaderProfileComponent from './components/header-profile.js';
import MenuController from './controllers/menu-controller.js';
import FilmsElementComponent from './components/films-element.js';
import PageController from './controllers/page-controller.js';
import FilmsModel from './models/movies.js';
import StatsComponent from './components/stats.js';

import {generateHeaderProfile} from './mock/header-profile';
import {generateFilmCards} from './mock/film-card.js';
import {FILM_COUNT} from './utils/const.js';

import {render, RenderPosition} from './utils/render.js';

const siteHeaderElement = document.querySelector(`.header`);

const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new HeaderProfileComponent(generateHeaderProfile), RenderPosition.BEFOREEND);

const statsComponenet = new StatsComponent();

const filmCards = generateFilmCards(FILM_COUNT);

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);

const userName = `mockData`; // пока так?

const filmsElement = new FilmsElementComponent();
const pageController = new PageController(filmsElement, filmsModel, userName);
const menuController = new MenuController(siteMainElement, filmsModel, statsComponenet, pageController);

menuController.render();
render(siteMainElement, filmsElement, RenderPosition.BEFOREEND);
render(siteMainElement, statsComponenet, RenderPosition.BEFOREEND);
statsComponenet.hide();
pageController.render();

const siteFooterElement = document.querySelector(`.footer`);
const siteFooterFilmCount = siteFooterElement.querySelector(`.footer__statistics`);
siteFooterFilmCount.querySelector(`p`).textContent = filmCards.length + ` movies inside`;
