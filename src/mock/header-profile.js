import {getRandomIntegerNumber} from '../utils/common.js';
import {FILM_WATCH_COUNT_MAX} from '../utils/const.js';

const UserRank = {
  NONE: ``,
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};

const UserRankBorders = {
  NONE: 0,
  NOVICE: 10,
  FAN: 20
};

const createUserRank = () => {
  const watchedMovies = getRandomIntegerNumber(0, FILM_WATCH_COUNT_MAX);
  let userRank = ``;
  if (watchedMovies === UserRankBorders.NONE) {
    userRank = UserRank.NONE;
  } else if (watchedMovies <= UserRankBorders.NOVICE) {
    userRank = UserRank.NOVICE;
  } else if (watchedMovies <= UserRankBorders.FAN) {
    userRank = UserRank.FAN;
  } else {
    userRank = UserRank.MOVIE_BUFF;
  }

  return userRank;
};

export const generatedHeaderProfile = {
  rating: createUserRank(),
  avatar: `images/bitmap@2x.png`
};
