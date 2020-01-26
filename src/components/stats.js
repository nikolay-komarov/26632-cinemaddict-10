import AbstractSmartComponent from './abstract-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import {renderElement, RenderPosition} from '../utils/render.js';
import {getUniqItems} from '../utils/common.js';

const StatTimeFilter = {
  ALL: `statistic-all-time`,
  TODAY: `statistic-today`,
  WEEK: `statistic-week`,
  MONTH: `statistic-month`,
  YEAR: `statistic-year`
};

const getFilmWatchedToday = (films) => {
  const start = moment().startOf(`day`);
  return films.filter((it) => moment(it.userDetails.watchingDate).isAfter(start._d));
};
const getFilmWatchedWeek = (films) => {
  const start = moment().subtract(7, `days`);
  return films.filter((it) => moment(it.userDetails.watchingDate).isAfter(start._d));
};
const getFilmWatchedMonth = (films) => {
  const start = moment().subtract(1, `month`);
  return films.filter((it) => moment(it.userDetails.watchingDate).isAfter(start._d));
};
const getFilmWatchedYear = (films) => {
  const start = moment().subtract(1, `year`);
  return films.filter((it) => moment(it.userDetails.watchingDate).isAfter(start._d));
};

const createStatsTextChartTemplate = (
    watchedFilmsCount,
    watchedFilmsDuration,
    topGenre
) => {
  return (
    `<ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${Math.floor(watchedFilmsDuration / 60)} <span class="statistic__item-description">h</span>${watchedFilmsDuration % 60} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${(topGenre !== null) ? topGenre : `-`}</p>
      </li>
    </ul>

    ${(watchedFilmsCount > 0) ? `
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>` : ``}`
  );
};

const createStatsTextElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement;
};

const renderGenreChart = (genreCtx, films) => {
  const genresLabels = films.map((film) => film.genres)
      .reduce((acc, genres) => {
        return acc.concat(Array.from(genres));
      }, [])
      .filter(getUniqItems);

  return new Chart(genreCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genresLabels,
      datasets: [{
        data: genresLabels.map((genre) => films.reduce((acc, film) => {
          const targetFilmsCount = Array.from(film.genres)
            .filter((it) => it === genre).length;
          return acc + targetFilmsCount;
        }, 0)),
        backgroundColor: `rgb(255,255,0)`,
        borderWidth: 1,
        barThickness: 30,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 18
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          padding: 30
        }
      },
      tooltips: {
        enabled: false
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            beginAtZero: true,
          }
        }],
        yAxes: [{
          ticks: {
            fontSize: 18,
            fontColor: `#ffffff`,
            padding: 60,
          }
        }]
      }
    }
  });
};

const createStatsElementTemplate = (
    userProfile
) => {
  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="${userProfile.avatar}" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${userProfile.rating}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

    </section>`
  );
};

const getWatchedFilms = (films) => {
  return films.filter((it) => it.userDetails.alreadyWatched);
};

const getFilmsDuration = (films) => {
  return films
    .map((it) => it.durationStract.filmHours * 60 + it.durationStract.filmMinutes)
    .reduce((duration, currentDuration) => (duration + currentDuration), 0);
};

const getTopGenre = (films) => {
  return films.map((it) => it.genres)
    .reduce((newArray, current) => {
      return newArray.concat(current);
    }, [])
    .reduce((prev, it, i, array) =>
      ((array.filter((v) => v === prev).length >= array.filter((v) => v === it).length) ? prev : it), null);
};

export default class StatsElement extends AbstractSmartComponent {
  constructor(filmModel, profile) {
    super();
    this._userProfile = profile;
    this._films = filmModel.getFilmsAll();
    this._watchedFilteredFilms = getWatchedFilms(this._films);
    this._watchedFilteredFilmsCount = this._watchedFilteredFilms.length;
    this._watchedFilteredFilmsDuration = getFilmsDuration(this._watchedFilteredFilms);
    this._topGenre = getTopGenre(this._watchedFilteredFilms);

    this._activeTimeFilter = StatTimeFilter.ALL; // ?

    this._genreChart = null;

    this._setStatFilterItemChangeHandler((filterName) => {
      this._setTextChartOptionsByFilterName(filterName);
      this._renderChart();
    });
  }

  getTemplate() {
    return createStatsElementTemplate(
        this._userProfile,
        this._watchedFilteredFilmsCount,
        this._watchedFilteredFilmsDuration,
        this._topGenre
    );
  }

  updateFilmsModel(filmModel) {
    this._films = filmModel.getFilmsAll();
    this._watchedFilteredFilms = getWatchedFilms(this._films);
    this._watchedFilteredFilmsCount = this._watchedFilteredFilms.length;
    this._watchedFilteredFilmsDuration = getFilmsDuration(this._watchedFilteredFilms);
    this._topGenre = getTopGenre(this._watchedFilteredFilms);
  }

  _setTextChartOptionsByFilterName(filterName) {
    switch (filterName) {
      case StatTimeFilter.ALL:
        this._watchedFilteredFilms = getWatchedFilms(this._films);
        this._watchedFilteredFilmsCount = this._watchedFilteredFilms.length;
        this._watchedFilteredFilmsDuration = getFilmsDuration(this._watchedFilteredFilms);
        this._topGenre = getTopGenre(this._watchedFilteredFilms);
        break;
      case StatTimeFilter.TODAY:
        this._watchedFilteredFilms = getFilmWatchedToday(getWatchedFilms(this._films));
        this._watchedFilteredFilmsCount = this._watchedFilteredFilms.length;
        this._watchedFilteredFilmsDuration = getFilmsDuration(this._watchedFilteredFilms);
        this._topGenre = getTopGenre(this._watchedFilteredFilms);
        break;
      case StatTimeFilter.WEEK:
        this._watchedFilteredFilms = getFilmWatchedWeek(getWatchedFilms(this._films));
        this._watchedFilteredFilmsCount = this._watchedFilteredFilms.length;
        this._watchedFilteredFilmsDuration = getFilmsDuration(this._watchedFilteredFilms);
        this._topGenre = getTopGenre(this._watchedFilteredFilms);
        break;
      case StatTimeFilter.MONTH:
        this._watchedFilteredFilms = getFilmWatchedMonth(getWatchedFilms(this._films));
        this._watchedFilteredFilmsCount = this._watchedFilteredFilms.length;
        this._watchedFilteredFilmsDuration = getFilmsDuration(this._watchedFilteredFilms);
        this._topGenre = getTopGenre(this._watchedFilteredFilms);
        break;
      case StatTimeFilter.YEAR:
        this._watchedFilteredFilms = getFilmWatchedYear(getWatchedFilms(this._films));
        this._watchedFilteredFilmsCount = this._watchedFilteredFilms.length;
        this._watchedFilteredFilmsDuration = getFilmsDuration(this._watchedFilteredFilms);
        this._topGenre = getTopGenre(this._watchedFilteredFilms);
        break;
      default:
        break;
    }
  }

  _renderStatsText() {
    const container = this.getElement();
    const statsTextChartElement = createStatsTextElement(createStatsTextChartTemplate(
        this._watchedFilteredFilmsCount,
        this._watchedFilteredFilmsDuration,
        this._topGenre
    ));
    renderElement(container, statsTextChartElement, RenderPosition.BEFOREEND);
  }

  show() {
    super.show();
    this._renderChart();
  }

  _renderChart() {
    this._resetChart();

    const element = this.getElement();
    this._renderStatsText();
    if (this._watchedFilteredFilms.length > 0) {
      const genreCtx = element.querySelector(`.statistic__chart`);
      this._genreChart = renderGenreChart(genreCtx, this._watchedFilteredFilms);
    }
  }

  _setStatFilterItemChangeHandler(handler) {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `LABEL`) {
        return;
      }
      const statFilterName = evt.target.getAttribute(`for`);
      handler(statFilterName);
    });
  }


  _resetChart() {
    const element = this.getElement();

    if (element.querySelector(`.statistic__text-list`)) {
      element.querySelector(`.statistic__text-list`).remove();
    }
    if (element.querySelector(`.statistic__chart-wrap`)) {
      element.querySelector(`.statistic__chart-wrap`).remove();
    }
    if (this._genreChart !== null) {
      this._genreChart.destroy();
    }

    this._genreChart = null;
  }
}
