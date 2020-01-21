export const FILM_COUNT = 13;
export const FILM_IN_EXTRA_COUNT = 2;

export const SHOWING_FILM_CARDS_COUNT_ON_START = 5;
export const SHOWING_FILM_CARDS_COUNT_BY_BUTTON = 5;

export const FILM_WATCH_COUNT_MAX = 250;

export const SHORT_DESCRIPTION_SYMBOLS = 140;
export const SHORT_DESCRIPTION_END_SYMBOL = `\u2026`;

export const MONTH_NAMES = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

export const FILM_COMMENTS_COUNT_MIN = 1;
export const FILM_COMMENTS_COUNT_MAX = 10;

export const FILM_YEAR_MIN = 1900;
export const FILM_YEAR_MAX = 2019;

export const FILM_RATING_MIN = 0;
export const FILM_RATING_MAX = 10;

export const USER_FILM_RATING_MIN = 1; // не менее 1
export const USER_FILM_RATING_MAX = 9; // не более 9

export const YEAR_SECONDS_COUNT = 31536000;

export const VISUALLY_HIDDEN_CSS_CLASS = `visually-hidden`;

export const EMOJI_ICONS = [
  {
    emojiTitle: `emoji-smile`,
    emojiFile: `./images/emoji/smile.png`
  },
  {
    emojiTitle: `emoji-sleeping`,
    emojiFile: `./images/emoji/sleeping.png`
  },
  {
    emojiTitle: `emoji-gpuke`,
    emojiFile: `./images/emoji/puke.png`
  },
  {
    emojiTitle: `emoji-angry`,
    emojiFile: `./images/emoji/angry.png`
  }
];

export const FilterType = {
  ALL: `All`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`
};
