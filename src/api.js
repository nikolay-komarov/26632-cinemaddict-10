import Movie from './models/movie.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`); // Д12?
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;

    this._films = null;
    this._film = null;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then((films) => {
        this._films = films;
        return Promise.all(films.map((film) => this._load({url: `comments/${film.id}`})));
      })
      .then((response) => {
        return Promise.all(response.map((it) => it.json()));
      })
      .then((comments) => {
        this._films.forEach((film, i) => {
          film[`comments`] = comments[i];
        });
        const newFilms = this._films;
        return newFilms;
      })
      .then(Movie.parseFilms);
  }

  updateFilm(id, newData) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(newData.convertFilmToServer()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then((film) => {
        this._film = film;
        return this._load({url: `comments/${film.id}`});
      })
      .then((response) => response.json())
      .then((comments) => {
        this._film[`comments`] = comments;
        const newFilm = this._film;
        return newFilm;
      })
      .then(Movie.parseFilm);
  }

  addComment(film, comment) {
    return this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(Movie.convertCommentToServer(comment)),
      headers: new Headers({'Content-Type': `application/json`})
    });
  }

  deleteComment(id) {
    return this._load({url: `comments/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);
    return fetch(`${this._endPoint}${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
