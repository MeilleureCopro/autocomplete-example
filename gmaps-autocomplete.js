function autocompleteWidget(input) {
    var autocomplete = new google.maps.places.Autocomplete(
        input,
        {componentRestrictions: {country: "fr"}, types: ['address']}),
        baseUrl = 'https://www.meilleurecopro.com/estimation-charges-copropriete-widget';

    function buildFullUrl(place) {
        var queryParams = '?address=' + encodeURIComponent(place.formatted_address);
        queryParams += '';

        for (var i = 0; i < place.address_components.length; i++) {
            var component = place.address_components[i];

            if (component.types.indexOf('street_number') !== -1)
                queryParams += '&addressNumber=' + encodeURIComponent(component['long_name']);

            if (component.types.indexOf('route') !== -1)
                queryParams += '&addressStreet=' + encodeURIComponent(component['long_name']);

            if (component.types.indexOf('locality') !== -1)
                queryParams += '&addressCity=' + encodeURIComponent(component['long_name']);

            if (component.types.indexOf('postal_code') !== -1) {
                queryParams += '&addressZipCode=' + encodeURIComponent(component['long_name']).slice(0, 2);
                queryParams += '&addressDepartment=' + encodeURIComponent(component['long_name']);
            }

            if (component.types.indexOf('country') !== -1)
                queryParams += '&addressCountry=' + encodeURIComponent(component['long_name']);
        }

        queryParams += '&lat=' + place.geometry.location.lat();
        queryParams += '&lng=' + place.geometry.location.lng();

        return baseUrl + queryParams;
    }

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();

        if (place.place_id === undefined)
            return;

        if (place.types.indexOf('street_address') === -1 && place.types.indexOf('route') === -1)
            return;

        input.value = place.formatted_address;

        var url = buildFullUrl(place);

        console.log('iframe url : ', url)
    });
}

console.log(document.getElementById('address-input'));
autocompleteWidget(document.getElementById('address-input'));
