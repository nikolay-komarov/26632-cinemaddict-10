import AbstractComponent from './abstract-component.js';

const createFilmsListElementTemplate = () => {
  return (
    `<section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      </section>
    </section>`
  );
};

export default class FilmsListElement extends AbstractComponent {
  getTemplate() {
    return createFilmsListElementTemplate();
  }
}
