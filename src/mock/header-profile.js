import {getRandomIntegerNumber} from '../utils/common.js';
import {FILM_WATCH_COUNT_MAX} from '../utils/const.js';

export const generateHeaderProfile = {
  rating: getRandomIntegerNumber(0, FILM_WATCH_COUNT_MAX),
  avatar: `images/bitmap@2x.png`
};
