import AbstractComponent from './abstract-component.js';

const createFilmsElementTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class FilmsElement extends AbstractComponent {
  getTemplate() {
    return createFilmsElementTemplate();
  }
}
