import MenuComponent from '../components/menu-elements.js';
import {FilterType} from '../utils/const.js';
import {getFilmsByFilter} from '../utils/filter.js';
import {render, replace, RenderPosition} from '../utils/render.js';

export default class MenuController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._activeFilterType = FilterType.ALL;
    this._menuComponent = null;
  }

  render() {
    const container = this._container;
    const allFilms = this._filmsModel.getFilms();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        title: filterType,
        count: getFilmsByFilter(allFilms, filterType).length
      };
    });
    const oldComponent = this._filterComponent;

    this._menuComponent = new MenuComponent(filters);

    if (oldComponent) {
      replace(this._menuComponent, oldComponent);
    } else {
      render(container, this._menuComponent, RenderPosition.BEFOREEND);
    }

    render(container, this._menuComponent, RenderPosition.BEFOREEND);
  }
}
