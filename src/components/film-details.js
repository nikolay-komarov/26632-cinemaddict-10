import AbstractSmartComponent from './abstract-smart-component.js';
import {formatDate} from '../utils/common.js';
import {VISUALLY_HIDDEN_CSS_CLASS, USER_FILM_RATING, EMOJI_ICONS} from '../utils/const.js';
import he from 'he';

const COMMMENT_ID_PREFIX = `film-details-comment-id__`;
const EMOJI_PREFIX = `emoji-`;
const SHAKE_ANIMATION_TIMEOUT = `2s`;
const NEW_COMMENT_BORDER_STYLE = {
  DEFAULT: `solid 1px #979797`,
  ON_ERROR: `solid 2px red`
};
const USER_FILM_RATING_STYLE_COLOR = {
  UNCHECKED: `#d8d8d8`,
  ON_ERROR: `red`
};

const getCommentId = (id) => {
  return id.substring(COMMMENT_ID_PREFIX.length);
};

const createCommentMarkup = (comments) => {
  return comments.map((it) => {
    const commentsDate = formatDate(it.day);
    return (
      `<li class="film-details__comment"  id="${COMMMENT_ID_PREFIX}${it.id}">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${it.emoji}.png" width="55" height="55" alt="emoji">
        </span>
        <div>
          <p class="film-details__comment-text">${it.text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${it.author}</span>
            <span class="film-details__comment-day">${commentsDate}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`
    );
  })
  .join(`\n`);
};

const createGanresListMarkup = (genres) => {
  return genres.map((it) => {
    return (
      `<span class="film-details__genre">${it}</span>`
    );
  })
  .join(`\n`);
};

const createUserRaitingMarkup = (userRating) => {
  userRating = Number(userRating); // для проверки в цикле для установки checked
  let userRatingMarkup = ``;
  for (let i = USER_FILM_RATING.MIN; i <= USER_FILM_RATING.MAX; i++) {
    const isChecked = (i === userRating) ? `checked` : ``;
    userRatingMarkup = userRatingMarkup +
      `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" ${isChecked}>
      <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>` +
      `\n`;
  }
  return userRatingMarkup;
};

const createUserEmojiCommentMarkup = (userEmoji) => {
  return `<img src="${EMOJI_ICONS.find((item) => item.emojiTitle === userEmoji).emojiFile}" width="55" height="55" alt="emoji">`;
};

const createEmojiListMarkup = (userEmoji) => {
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping" ${userEmoji === `emoji-smile` ? `checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-smile">
      <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face" ${userEmoji === `emoji-sleeping` ? `checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-sleeping">
      <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="grinning" ${userEmoji === `emoji-gpuke` ? `checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-puke">
      <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning" ${userEmoji === `emoji-angry` ? `checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-angry">
      <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
    </label>`);
};

const createFilmDetailsControlMarkup = (card) => {
  const {
    watchlist,
    alreadyWatched,
    favorite
  } = card.userDetails;

  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlist ? `checked` : ``}>
    <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

    <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${alreadyWatched ? `checked` : ``}>
    <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

    <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favorite ? `checked` : ``}>
    <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>`
  );
};

const createUserRatingContainerMarkup = (card) => {
  const {
    title,
    poster,
  } = card;

  const {
    personalRating,
    alreadyWatched,
  } = card.userDetails;

  const showUserRatingContainer = alreadyWatched ? `` : VISUALLY_HIDDEN_CSS_CLASS;
  const showUserRating = createUserRaitingMarkup(personalRating);

  return (
    `<div class="form-details__middle-container ${showUserRatingContainer}">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              ${showUserRating}
            </div>
          </section>
        </div>
      </section>
  </div>`
  );
};

const createFilmDetailsTemplate = (card, options = {}) => {
  const {
    title,
    titleOriginal,
    rating,
    duration,
    genres,
    poster,
    description: notSanitizedDescription,
    comments,
    commentsCount,
    age,
    director,
    writers,
    actors,
    releaseDate,
    country
  } = card;

  const {userCommentEmoji} = options;

  const releaseDateTemplate = formatDate(releaseDate);
  const commentsTemplate = createCommentMarkup(comments);
  const genresListTemplate = createGanresListMarkup(genres);
  const filmdDtailsControlTamplate = createFilmDetailsControlMarkup(card);
  const userRatingContainerTemplate = createUserRatingContainerMarkup(card);
  const userCommentEmojiTemplate = (userCommentEmoji) ? createUserEmojiCommentMarkup(userCommentEmoji) : ``;
  const emojiListTemplate = createEmojiListMarkup(userCommentEmoji);
  const description = he.encode(notSanitizedDescription);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${age}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">${titleOriginal}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDateTemplate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genres.length === 1 ? `Genre` : `Genres`}</td>
                  <td class="film-details__cell">
                    ${genresListTemplate}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${filmdDtailsControlTamplate}
          </section>
        </div>

        ${userRatingContainerTemplate}

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsTemplate}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
              ${userCommentEmojiTemplate}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${emojiListTemplate}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(card, userName) {
    super();
    this._card = card;
    this._userName = userName;

    this._inWatchList = card.userDetails.watchlist;
    this._isWatched = card.userDetails.alreadyWatched;
    this._isFavorite = card.userDetails.favorite;
    this.userRating = card.userDetails.userRating;

    this._options = {
      userCommentEmoji: null
    };

    this._closeButtonClickHandler = null;
    this._addToWatchlistButtonClickHandler = null;
    this._markAsWatchedButtonClickHandler = null;
    this._markAsFavoriteButtonClickHandler = null;
    this._userRatingClickHandler = null;
    this._deleteButtonClickHandler = null;
    this._addCommentKeyDownHandler = null;

    this._subscribeOnEvents();

    this.userRatingLabel = null;
  }

  rerender() {
    super.rerender();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._card, this._options);
  }

  setCloseButtonClickHandler(handler) {
    this._closeButtonClickHandler = handler;
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this._addToWatchlistButtonClickHandler = handler;
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, handler);
  }

  setMarkAsWatchedButtonClickHandler(handler) {
    this._markAsWatchedButtonClickHandler = handler;
    this.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, handler);
  }

  setMarkAsFavoriteButtonClickHandler(handler) {
    this._markAsFavoriteButtonClickHandler = handler;
    this.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, handler);
  }

  setUserRatingClickHandler(handler) {
    this._userRatingClickHandler = handler;
    this.getElement().querySelector(`.film-details__user-rating-score`)
      .addEventListener(`change`, (evt) => {
        const newUserRating = Number(evt.target.value);
        handler(newUserRating);
      });
  }

  setDeleteCommentButtonsClickHandler(handler) {
    this._deleteButtonClickHandler = handler;
    this.getElement().querySelectorAll(`.film-details__comment-delete`)
      .forEach((it) => it.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const commentToDelete = this._card.comments.find((comment) => (comment.id).toString() === (getCommentId(evt.target.closest(`.film-details__comment`).id)).toString());
        handler(commentToDelete, null);
      }));
  }

  setAddCommentKeyDownHandler(handler) {
    this._addCommentKeyDownHandler = handler;
    this.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, (evt) => {
        if (this._options.userCommentEmoji !== null) {
          const isEnterCtrlKey = (evt.key === `Enter` && evt.ctrlKey);
          if (isEnterCtrlKey) {
            // соберем новый комментарий
            const newComment = {
              id: Math.random().toString(),
              emoji: this._options.userCommentEmoji.substring(EMOJI_PREFIX.length),
              text: evt.target.value,
              author: this._userName,
              day: new Date(),
            };
            handler(null, newComment);
          }
        }
      });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, () => {
        this._inWatchList = !this._inWatchList;
      });
    element.querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, () => {
        this._isWatched = !this._isWatched;
      });
    element.querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, () => {
        this._isFavorite = !this._isFavorite;
      });

    const userRating = element.querySelector(`.film-details__user-rating-score`);
    userRating.addEventListener(`change`, (evt) => {
      this.userRating = Number(evt.target.value);
    });

    const emojiList = element.querySelector(`.film-details__emoji-list`);
    emojiList.addEventListener(`click`, (evt) => {
      this._options.userCommentEmoji = evt.target.parentNode.getAttribute(`for`);
      this.rerender();
    });
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this.setAddToWatchlistButtonClickHandler(this._addToWatchlistButtonClickHandler);
    this.setMarkAsWatchedButtonClickHandler(this._markAsWatchedButtonClickHandler);
    this.setMarkAsFavoriteButtonClickHandler(this._markAsFavoriteButtonClickHandler);
    this.setUserRatingClickHandler(this._userRatingClickHandler);
    this.setDeleteCommentButtonsClickHandler(this._deleteButtonClickHandler);
    this.setAddCommentKeyDownHandler(this._addCommentKeyDownHandler);
    this._subscribeOnEvents();
  }

  shakeForm() {
    const element = this.getElement();
    element.style.animationName = `shake`;
    element.style.animationDuration = SHAKE_ANIMATION_TIMEOUT;
  }
  onErrorCommentInput() {
    const element = this.getElement();
    const newCommentField = element.querySelector(`.film-details__comment-label`);
    newCommentField.style.border = NEW_COMMENT_BORDER_STYLE.ON_ERROR;
  }
  onErrorUserRating(rating) {
    const element = this.getElement();
    const userRatingLabelElements = element.querySelectorAll(`.film-details__user-rating-label`);
    userRatingLabelElements.forEach((it) => {
      if (it.getAttribute(`for`) === `rating-${rating}`) {
        this.userRatingLabel = it;
      }
    });
    this.userRatingLabel.style.backgroundColor = USER_FILM_RATING_STYLE_COLOR.ON_ERROR;
  }
  resetCommentStyleFromError() {
    const element = this.getElement();
    const newCommentField = element.querySelector(`.film-details__comment-label`);
    newCommentField.style.border = NEW_COMMENT_BORDER_STYLE.DEFAULT;
  }
  resetRatingStyleFromError() {
    const element = this.getElement();
    element.querySelectorAll(`.film-details__user-rating-label`)
      .forEach((it) => {
        if (it.style.backgroundColor === USER_FILM_RATING_STYLE_COLOR.ON_ERROR) {
          it.style.backgroundColor = USER_FILM_RATING_STYLE_COLOR.UNCHECKED;
        }
      });
  }
}
