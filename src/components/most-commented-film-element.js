import {createElement} from '../utils';

const createMostCommentedFilmsElementTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container"></div>
    </section>`
  );
};

export default class MostCommentFilmsElement {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMostCommentedFilmsElementTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
