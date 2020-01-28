import moment from 'moment';

export default class Film {
  constructor(film) {
    this.id = film[`id`];
    this.title = film[`film_info`][`title`];
    this.titleOriginal = film[`film_info`][`alternative_title`];
    this.rating = film[`film_info`][`total_rating`];
    this.year = moment(film[`film_info`][`release`][`date`]).toDate().getFullYear();
    this.durationStract = {
      filmHours: Math.floor(Number(film[`film_info`][`runtime`]) / 60),
      filmMinutes: Number(film[`film_info`][`runtime`]) % 60
    };
    this.duration = Math.floor(film[`film_info`][`runtime`] / 60) + `h ` + (Number(film[`film_info`][`runtime`]) % 60) + `m`;
    this.genres = film[`film_info`][`genre`];
    this.poster = `./` + film[`film_info`][`poster`];
    this.description = film[`film_info`][`description`];
    this.comments = film[`comments`].map((it) => {
      return ({
        id: it[`id`] || ``,
        emoji: it[`emotion`],
        author: it[`author`] || ``,
        text: it[`comment`],
        day: it[`date`] || null
      });
    });
    this.commentsCount = this.comments.length;
    this.age = film[`film_info`][`age_rating`];
    this.director = film[`film_info`][`director`];
    this.writers = film[`film_info`][`writers`];
    this.actors = film[`film_info`][`actors`];
    this.releaseDate = film[`film_info`][`release`][`date`];
    this.country = film[`film_info`][`release`][`release_country`];
    this.userDetails = {
      personalRating: film[`user_details`][`personal_rating`],
      watchlist: Boolean(film[`user_details`][`watchlist`]),
      alreadyWatched: Boolean(film[`user_details`][`already_watched`]),
      watchingDate: film[`user_details`][`watching_date`],
      favorite: Boolean(film[`user_details`][`favorite`])
    };
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.comments,
      'film_info': {
        'title': this.title,
        'alternative_title': this.titleOriginal,
        'total_rating': this.rating,
        'poster': this.poster.slice(1),
        'age_rating': this.age,
        'director': this.director,
        'writers': this.writers,
        'actors': this.actors,
        'release': {
          'date': new Date(this.year).toISOString(),
          'release_country': this.country
        },
        'runtime': this.durationStract.filmHours * 60 + this.durationStract.filmMinutes,
        'genre': this.genres,
        'description': this.description,
      },
      'user_details': {
        'watchlist': this.userDetails.watchlist,
        'personal_rating': this.userDetails.personalRating,
        'already_watched': this.userDetails.alreadyWatched,
        'watching_date': this.userDetails.watchingDate ? new Date(this.userDetails.watchingDate).toISOString() : ``,
        'favorite': this.userDetails.favorite
      }
    };
  }

  filmToServer() {
    return {
      'id': this.id,
      'comments': this.getCommentsId(),
      'film_info': {
        'title': this.title,
        'alternative_title': this.titleOriginal,
        'total_rating': this.rating,
        'poster': this.poster.slice(1),
        'age_rating': this.age,
        'director': this.director,
        'writers': this.writers,
        'actors': this.actors,
        'release': {
          'date': new Date(this.year).toISOString(),
          'release_country': this.country
        },
        'runtime': this.durationStract.filmHours * 60 + this.durationStract.filmMinutes,
        'genre': this.genres,
        'description': this.description,
      },
      'user_details': {
        'watchlist': this.userDetails.watchlist,
        'personal_rating': this.userDetails.personalRating,
        'already_watched': this.userDetails.alreadyWatched,
        'watching_date': this.userDetails.watchingDate ? new Date(this.userDetails.watchingDate).toISOString() : ``,
        'favorite': this.userDetails.favorite
      }
    };
  }

  static commentToServer(comment) {
    return {
      id: comment.id,
      author: comment.author,
      comment: comment.text,
      date: comment.day,
      emotion: comment.emoji
    };
  }

  getCommentsId() {
    if (typeof this.comments[0] === `object`) {
      return this.comments.map((comment) => comment.id);
    }
    return this.comments;
  }

  static parseFilm(film) {
    return new Film(film);
  }

  static parseFilms(films) {
    return films.map(Film.parseFilm);
  }

  static clone(film) {
    return new Film(film.toRAW());
  }
}
