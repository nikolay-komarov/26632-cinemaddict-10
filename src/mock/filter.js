import {FILM_COUNT} from '../utils/const.js';
import {getRandomIntegerNumber} from '../utils/common.js';

const filterNames = [
  `All movies`,
  `Watchlist`,
  `History`,
  `Favorites`
];

export const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      title: it,
      count: (it !== `All movies`) ? getRandomIntegerNumber(0, FILM_COUNT) : FILM_COUNT,
    };
  });
};
