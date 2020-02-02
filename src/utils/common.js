import moment from 'moment';

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatDateForComment = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:MM`);
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

export const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};
