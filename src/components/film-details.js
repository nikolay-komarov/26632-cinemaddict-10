import AbstractSmartComponent from './abstract-smart-component.js';
import {formatDate} from '../utils/common.js';
import {VISUALLY_HIDDEN_CSS_CLASS, USER_FILM_RATING_MIN, USER_FILM_RATING_MAX, EMOJI_ICONS} from '../utils/const.js';
import he from 'he';

const COMMMENT_ID_PREFIX = `film-details-comment-id__`;

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
  userRating = Number(userRating); // для проверки в цикле для усановки checked
  let userRatingMarkup = ``;
  for (let i = USER_FILM_RATING_MIN; i <= USER_FILM_RATING_MAX; i++) {
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

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning" ${userEmoji === `emoji-gpuke` ? `checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-gpuke">
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
                  <td class="film-details__term">Genres</td>
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

    // this.isComponetShowing = false;

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
  }

  // rerender() {
  //   const oldElement = this.getElement();
  //   const parent = oldElement.parentElement;

  //   this.removeElement();

  //   const newElement = this.getElement();

  //   // попытка удалить анимацию при ререндинге попапа - не работает! - ?
  //   if (this.isComponetShowing) {
  //     newElement.style.animation = ``;
  //   }

  //   parent.replaceChild(newElement, oldElement);

  //   this.recoveryListeners();
  // }
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
      .addEventListener(`change`, handler);
  }

  setDeleteCommentButtonsClickHandler(handler) {
    this._deleteButtonClickHandler = handler;
    this.getElement().querySelectorAll(`.film-details__comment-delete`)
      .forEach((it) => it.addEventListener(`click`, (evt) => {
        const commentToDelete = this._card.comments.find((comment) => toString(comment.id) === toString(getCommentId(evt.target.closest(`.film-details__comment`).id)));
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
              id: Math.random(),
              emoji: EMOJI_ICONS.find((item) => item.emojiTitle === this._options.userCommentEmoji).emojiFile,
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
        // this.rerender();
      });
    element.querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, () => {
        this._isWatched = !this._isWatched;
        // this.rerender();
      });
    element.querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, () => {
        this._isFavorite = !this._isFavorite;
        // this.rerender();
      });

    const userRating = element.querySelector(`.film-details__user-rating-score`);
    userRating.addEventListener(`change`, (evt) => {
      this.userRating = Number(evt.target.value);
      // this.rerender();
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
}
