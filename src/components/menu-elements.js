const createFilterMarkup = (filter) => {
  const {title, count} = filter;
  return (
    `<a href="#${title}" class="main-navigation__item">${title} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

export const createMenuElementsTemplate = (filters) => {
  const filtersMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${filtersMarkup}
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>

    <ul class="sort">
      <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button">Sort by date</a></li>
      <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};
