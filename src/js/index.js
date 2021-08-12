import '../styles.css';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/Material.css';
import { notice } from '@pnotify/core';
import { defaults } from '@pnotify/core';
import debounce from 'lodash.debounce';

import fetchCountries from './fetchCountries';
import refs from './getRefs';

import countryCardTpl from '../templates/country-card.hbs';
import countriesListTpl from '../templates/countries-list.hbs';

refs.input.addEventListener('input', debounce(onCountryInput, 500));

function onCountryInput(e) {
  let query = e.target.value;

  if (query.length === 0) {
    clearMarkup();
    return;
  }

  fetchCountries(query)
    .then(data => {
      console.log(data);
      if (data.length > 1 && data.length < 11) {
        renderMarkup(countriesListTpl(data));
      } else if (data.length === 1) {
        renderMarkup(countryCardTpl(data));
      } else if (data.length > 10) {
        onQueryResultsExceeded();
      }
    })
    .catch(error => {
      onError();
    });
}

function renderMarkup(markup) {
  refs.countryContainer.innerHTML = markup;
}

function clearMarkup() {
  refs.countryContainer.innerHTML = '';
}

function onError() {
  console.log('gg');
  alert('Что-то пошло не так(');
  clearMarkup();
}

function onQueryResultsExceeded() {
  notice({
    text: 'Too many matches found. Please enter a more specific query!',
    styling: 'material',
    delay: 3000,
  });
}
