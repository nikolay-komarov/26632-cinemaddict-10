import {getRandomIntegerNumber} from '../utils.js';

const FILM_WATCH_COUNT_MAX = 250;

export const generateHeaderProfile = {
  rating: getRandomIntegerNumber(0, FILM_WATCH_COUNT_MAX),
  avatar: `images/bitmap@2x.png`
};
