import HeaderProfileComponent from './components/header-profile.js';
import Loading from './components/loading.js';
import MenuController from './controllers/menu-controller.js';
import FilmsElementComponent from './components/films-element.js';
import PageController from './controllers/page-controller.js';
import FilmsModel from './models/movies.js';
import StatsComponent from './components/stats.js';

import {generatedHeaderProfile} from './mock/header-profile';

import API from './api.js';
const AUTHORIZATION = `Basic eo0w590ik29889b`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict/`;

import {render, RenderPosition, remove} from './utils/render.js';

const siteHeaderElement = document.querySelector(`.header`);

const siteMainElement = document.querySelector(`.main`);

const headerProfile = generatedHeaderProfile;
render(siteHeaderElement, new HeaderProfileComponent(headerProfile), RenderPosition.BEFOREEND);

const loading = new Loading();
render(siteMainElement, loading, RenderPosition.BEFOREEND);

const filmsModel = new FilmsModel();

const api = new API(END_POINT, AUTHORIZATION);
api.getFilms()
  .then((filmCards) => {
    filmsModel.setFilms(filmCards);

    const userName = `userName`;

    remove(loading);

    const statsComponenet = new StatsComponent(filmsModel, headerProfile);

    const filmsElement = new FilmsElementComponent();
    render(siteMainElement, filmsElement, RenderPosition.BEFOREEND);

    const pageController = new PageController(filmsElement, filmsModel, userName, api);
    const menuController = new MenuController(siteMainElement, filmsModel, statsComponenet, pageController);
    menuController.render();
    render(siteMainElement, filmsElement, RenderPosition.BEFOREEND);
    render(siteMainElement, statsComponenet, RenderPosition.BEFOREEND);
    statsComponenet.hide();
    pageController.render();

    const siteFooterElement = document.querySelector(`.footer`);
    const siteFooterFilmCount = siteFooterElement.querySelector(`.footer__statistics`);
    siteFooterFilmCount.querySelector(`p`).textContent = filmsModel.getFilmsAll().length + ` movies inside`;
  });
