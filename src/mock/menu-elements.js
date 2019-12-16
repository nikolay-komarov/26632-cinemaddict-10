import {FILM_COUNT} from '../const.js';
import {getRandomIntegerNumber} from '../utils.js';

const filterNames = [
  `Watchlist`,
  `History`,
  `Favorites`
];

export const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      title: it,
      count: getRandomIntegerNumber(0, FILM_COUNT)
    };
  });
};
