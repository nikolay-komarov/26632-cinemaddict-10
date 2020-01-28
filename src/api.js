import Movie from './models/movie.js';
import Comment from './models/comment.js';

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
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(Movie.parseFilms);
  }
  getComments(movieId) {
    return this._load({url: `comments/${movieId}`})
    .then((response) => response.json())
    .then(Comment.parseComments);
  }

  updateFilm(id, film) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(film.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(Movie.parseFilm);
  }

  // addComment(moveId, comment) {
  //   return this._load({
  //     url: `comments/${moveId}`,
  //     method: Method.POST,
  //     body: JSON.stringify(comment),
  //     headers: new Headers({'Content-Type': `application/json`})
  //   })
  //     .then((response) => response.json());
  // }

  // createTask(task) {
  // }

  // updateTask(id, data) {
  // }

  // deleteTask(id) {
  // }


  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}

//  API;
