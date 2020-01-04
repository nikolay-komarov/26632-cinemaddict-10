import {createElement} from '../utils';

const createHeaderProfileTemplate = (headerProfile) => {
  const {rating, avatar} = headerProfile;

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class HeaderProfile {
  constructor(headerProfile) {
    this._headerProfile = headerProfile;
    this._element = null;
  }

  getTemplate() {
    return createHeaderProfileTemplate(this._headerProfile);
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

