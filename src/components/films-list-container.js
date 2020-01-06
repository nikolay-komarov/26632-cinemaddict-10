import AbstractComponent from './abstract-component.js';

const createFilmsListContainerElementTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class FilmsListcontainerElement extends AbstractComponent {
  getTemplate() {
    return createFilmsListContainerElementTemplate();
  }
}
