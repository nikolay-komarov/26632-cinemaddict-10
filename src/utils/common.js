import moment from 'moment';
import {FILM_YEAR_MIN, FILM_YEAR_MAX} from './const.js';

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomDate = () => {
  return (new Date(getRandomIntegerNumber(FILM_YEAR_MIN, FILM_YEAR_MAX), getRandomIntegerNumber(0, 11), getRandomIntegerNumber(1, 31)));
};

export const getDeepClone = (oldObj) => {
  return JSON.parse(JSON.stringify(oldObj));
};
