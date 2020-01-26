import {getRandomArrayItem, getRandomIntegerNumber, getRandomDate} from '../utils/common.js';
import {YEAR_SECONDS_COUNT, FILM_RATING_MIN, FILM_RATING_MAX, USER_FILM_RATING_MIN, USER_FILM_RATING_MAX, FILM_COMMENTS_COUNT_MIN, FILM_COMMENTS_COUNT_MAX} from '../utils/const.js';

const FILM_TITLES = [
  `made-for-each-other`,
  `popeye-meets-sinbad`,
  `sagebrush-trail`,
  `santa-claus-conquers-the-martians`,
  `the-dance-of-life`,
  `the-great-flamarion`,
  `the-man-with-the-golden-arm`
];

const FILM_DURATION_HOUR_MIN = 0;
const FILM_DURATION_HOUR_MAX = 5;
const FILM_DURATION_MIN_MIN = 0;
const FILM_DURATION_MIN_MAX = 60;

const getFilmDuration = () => {
  const filmHours = getRandomIntegerNumber(FILM_DURATION_HOUR_MIN, FILM_DURATION_HOUR_MAX);
  const filmMinutes = getRandomIntegerNumber(FILM_DURATION_MIN_MIN, FILM_DURATION_MIN_MAX);
  return {
    filmHours,
    filmMinutes
  };
};

const getFilmDurationString = (duration) => {
  return `${duration.filmHours}h ${duration.filmMinutes}m`;
};

const FILM_GANRES = [
  `Action`,
  `Western`,
  `Gangster`,
  `Detective`,
  `Drama`,
  `Historical`,
  `Comedy`,
  `Melodrama`,
  `Music`,
  `Noir`,
  `Political`,
  `Adventure`,
  `Fairy`,
  `Tragedy`,
  `Tragicomedy`
];

const FILM_GANRES_MAX_COUNT = 3;

const getFilmGenres = (genres) => {
  return genres
    .filter(() => Math.random() > 0.5)
    .slice(0, FILM_GANRES_MAX_COUNT);
};

const FILM_POSTERS_PATH = `./images/posters/`;
const FILM_POSTERS = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const COUNT_SENTENCE_MIN = 1;
const COUNT_SENTENCE_MAX = 3;
const FILM_DECRIPTION_TEMPLE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
const filmDescriptionArray = FILM_DECRIPTION_TEMPLE.split(`.`);

const getFilmDescription = () => {
  let filmDescription = ``;
  const randomLength = getRandomIntegerNumber(COUNT_SENTENCE_MIN, COUNT_SENTENCE_MAX);
  for (let i = 0; i < randomLength; i++) {
    filmDescription = filmDescription + getRandomArrayItem(filmDescriptionArray) + `. `;
  }

  return filmDescription;
};

const COMMENTS_EMOJIES = [
  `./images/emoji/smile.png`,
  `./images/emoji/sleeping.png`,
  `./images/emoji/puke.png`,
  `./images/emoji/angry.png`
];

const COMMENTS_TEXTS = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`
];

const COMMENTS_AUTHORS = [
  `Tim Macoveev`,
  `John Doe`
];

const AGE_RATING = [
  `18+`,
  `12+`,
  `6+`
];

const DIRECTORS = [
  `Anthony Mann`
];

const WRITERS = [
  `Anne Wigton`,
  `Heinz Herald`,
  `Richard Weil`
];

const ACTORS = [
  `Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`
];

const COUNTRIES = [
  `USA`
];

const generateFilmComments = () => {
  return new Array(getRandomIntegerNumber(FILM_COMMENTS_COUNT_MIN, FILM_COMMENTS_COUNT_MAX))
    .fill(``)
    .map(() => {
      return {
        id: Math.random(),
        emoji: getRandomArrayItem(COMMENTS_EMOJIES),
        text: getRandomArrayItem(COMMENTS_TEXTS),
        author: getRandomArrayItem(COMMENTS_AUTHORS),
        day: getRandomDate()
      };
    });
};

const generateWatchedDate = () => {
  const diffValue = getRandomIntegerNumber(0, YEAR_SECONDS_COUNT);

  return (new Date()) - diffValue;
};

const generateUserDetails = () => {
  const alreadyWatched = Math.random() > 0.5;
  let personalRating = USER_FILM_RATING_MAX;
  if (alreadyWatched) {
    personalRating = getRandomIntegerNumber(USER_FILM_RATING_MIN, USER_FILM_RATING_MAX);
  }
  return {
    personalRating,
    watchlist: Math.random() > 0.5,
    alreadyWatched,
    watchingDate: alreadyWatched ? generateWatchedDate() : null,
    favorite: Math.random() > 0.5
  };
};

const generateFilmCard = () => {
  const commentsArray = generateFilmComments();

  const filmTitle = getRandomArrayItem(FILM_TITLES);

  const durationStract = getFilmDuration();

  const writersList = `` + getRandomArrayItem(WRITERS);
  const actorsList = `` + getRandomArrayItem(ACTORS);

  const releaseDate = getRandomDate();

  const userDetails = generateUserDetails();

  return {
    id: String(new Date() + Math.random()),
    title: filmTitle,
    titleOriginal: `Original: ` + filmTitle,
    rating: getRandomIntegerNumber(FILM_RATING_MIN, FILM_RATING_MAX * 10) / 10,
    year: releaseDate.getFullYear(),
    durationStract,
    duration: getFilmDurationString(durationStract),
    genres: getFilmGenres(FILM_GANRES),
    poster: FILM_POSTERS_PATH + getRandomArrayItem(FILM_POSTERS),
    description: getFilmDescription(),
    comments: commentsArray,
    commentsCount: commentsArray.length,
    age: getRandomArrayItem(AGE_RATING),
    director: getRandomArrayItem(DIRECTORS),
    writers: writersList,
    actors: actorsList,
    releaseDate,
    country: getRandomArrayItem(COUNTRIES),
    userDetails
  };
};

const generateFilmCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilmCard);
};

export {generateFilmCard, generateFilmCards};
