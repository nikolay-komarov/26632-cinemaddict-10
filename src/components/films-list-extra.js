import AbstractComponent from './abstract-component.js';

const createFilmsListExtraElementTemplate = (title) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>

    </section>`
  );
};

export default class FilmsListExtraElement extends AbstractComponent {
  constructor(title) {
    super();
    this._title = title;
  }
  getTemplate() {
    return createFilmsListExtraElementTemplate(this._title);
  }
}
