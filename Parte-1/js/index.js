function fetchCountries(name) {
    let url = `https://restcountries.eu/rest/v2/name/${name}`;

    $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        success: function(responseJSON) {
            console.log(responseJSON);
            displayResults(responseJSON);
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function displayResults(responseJSON) {
    let countries = responseJSON;

    $('.js-search-results').empty();

    countries.forEach(country => {
        $('.js-search-results').append(`
            <h2>${country.name} </h2>
            <img class="flag" src="${country.flag}">
            <p>Capital: ${country.capital}</p>
            <p>Population: ${country.population}</p>
            <p>Region: ${country.region}</p>
            <p>Timezones: ${country.timezones}</p>
            <p>Borders: ${country.borders}</p>
        `)
    })
}

function watchForm() {
    $('.js-search-form').on('submit', function(event)     {
        event.preventDefault();

        let name = $('.js-query').val();

        if (name === "") {
            console.log("empty input");
            return;
        }

        fetchCountries(name);
    });
}

function init() {
    watchForm();
}

init();