import AbstractComponent from './abstract-component.js';
import {FilterType} from '../utils/const.js';

const MENU_ID_PREFIX = `menu-item__`;

const getMenuItemNameById = (id) => {
  return id.substring(MENU_ID_PREFIX.length);
};

const createFilterMarkup = (filter, active) => {
  const {title, count} = filter;
  return (
    `<a href="#${title}"
      class="main-navigation__item ${(active) ? `main-navigation__item--active` : ``}"
      id="menu-item__${title}">${title}
      ${(title !== FilterType.ALL) ? `<span class="main-navigation__item-count">` + count + `</span></a>` : ``}`
  );
};

const createMenuElementsTemplate = (filters, activeFilter) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it, it.title === activeFilter)).join(`\n`);
  return (
    `<nav class="main-navigation">
      ${filtersMarkup}
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`
  );
};

export default class MenuComponent extends AbstractComponent {
  constructor(filters, activeFilter) {
    super();
    this._filters = filters;
    this._activeFilter = activeFilter;
  }

  getTemplate() {
    return createMenuElementsTemplate(this._filters, this._activeFilter);
  }

  setMenuItemChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      this.getElement().querySelectorAll(`.main-navigation__item`)
      .forEach((it) => {
        it.classList.remove(`main-navigation__item--active`);
      });
      evt.target.closest(`.main-navigation__item`).classList.add(`main-navigation__item--active`);

      const menuItemName = getMenuItemNameById(evt.target.id);
      handler(menuItemName);
    });
  }
}
