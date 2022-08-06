import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const ref = {
    searchBox: document.querySelector("#search-box"),
    countryList: document.querySelector(".country-list"),
    countryInfo: document.querySelector(".country-info"),
}
const DEBOUNCE_DELAY = 300;

ref.searchBox.addEventListener("input", debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    const { value } = e.target;
    ref.countryInfo.innerHTML = "";
    ref.countryList.innerHTML = "";
    if (value === "") return;
    
    fetchCountries(value)
        .then(counties => {
            if (counties.length > 10) return Notify.info("Too many matches found. Please enter a more specific name.");
            if (counties.length >= 2 && counties.length <= 10) {
                insertCountryList(counties);
                return;
            }
            if (counties.length === 1) {
                insertCountryList(counties);
                insertCountryInfo(counties);
                const countryName = document.querySelector(".country-list p");
                countryName.classList.add("country-list__name");
            }
        })
        .catch(() => Notify.failure("Oops, there is no country with that name"));

}

function createListItem(item) {
    return `<li><img src="${item.flags.svg}" alt="${item.name.common}"/><p>${item.name.official}</p></li>`;
}

function createContentOfCountryList(counties) {
    return counties.reduce((acc, item) => acc + createListItem(item), "");
}

function createContentOfCountryInfo(counties) {
    const { capital, population, languages } = counties[0];
    const langValues = Object.values(languages);
    return `<p><span>Capital: </span>${capital}</p>
            <p><span>Popolation: </span>${population}</p>
            <p><span>Languages: </span>${langValues.join(", ")}</p>`
}

function insertCountryList(counties) {
    const result = createContentOfCountryList(counties);
    ref.countryList.insertAdjacentHTML("beforeend", result);
}

function insertCountryInfo(counties) {
    const result = createContentOfCountryInfo(counties);
    ref.countryInfo.insertAdjacentHTML("beforeend", result);
}

