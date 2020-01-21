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

const createMenuElementsTemplate = (filters) => {
  const filtersMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);
  return (
    `<nav class="main-navigation">
      ${filtersMarkup}
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`
  );
};

export default class MenuComponent extends AbstractComponent {
  constructor(filter) {
    super();
    this._filter = filter;
  }

  getTemplate() {
    return createMenuElementsTemplate(this._filter);
  }

  setMenuItemChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItemName = getMenuItemNameById(evt.target.id);
      handler(menuItemName);
    });
  }
}
