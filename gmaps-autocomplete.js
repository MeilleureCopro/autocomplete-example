function autocompleteWidget(input) {
    var autocomplete = new google.maps.places.Autocomplete(
        input,
        {componentRestrictions: {country: "fr"}, types: ['address']}),
        baseUrl = 'https://www.meilleurecopro.com/estimation-charges-copropriete-widget';

    function getAddress(place) {
        var address = {
            fullAddress: place.formatted_address
        };

        var queryParams = 'address=' + encodeURIComponent(place.formatted_address);
        queryParams += '';

        for (var i = 0; i < place.address_components.length; i++) {
            var component = place.address_components[i];

            if (component.types.indexOf('street_number') !== -1) {
                queryParams += '&addressNumber=' + encodeURIComponent(component['long_name']);
                address.addressNumber = component['long_name'];
            }

            if (component.types.indexOf('route') !== -1) {
                queryParams += '&addressStreet=' + encodeURIComponent(component['long_name']);
                address.addressStreet = component['long_name'];
            }

            if (component.types.indexOf('locality') !== -1) {
                queryParams += '&addressCity=' + encodeURIComponent(component['long_name']);
                address.addressCity = component['long_name'];
            }

            if (component.types.indexOf('postal_code') !== -1) {
                queryParams += '&addressZipCode=' + encodeURIComponent(component['long_name']);
                queryParams += '&addressDepartment=' + encodeURIComponent(component['long_name'].slice(0, 2));
                address.addressZipCode = component['long_name'];
                address.addressDepartment = component['long_name'].slice(0, 2);
            }

            if (component.types.indexOf('country') !== -1) {
                queryParams += '&addressCountry=' + encodeURIComponent(component['long_name']);
                address.addressCountry = component['long_name'];
            }
        }

        queryParams += '&lat=' + place.geometry.location.lat();
        queryParams += '&lng=' + place.geometry.location.lng();
        address.lat = place.geometry.location.lat();
        address.lng = place.geometry.location.lng();
        address.queryParams = queryParams;

        return address;
    }

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();

        if (place.place_id === undefined)
            return;

        if (place.types.indexOf('street_address') === -1 && place.types.indexOf('route') === -1)
            return;

        input.value = place.formatted_address;

        var address = getAddress(place);

        document.getElementById('iframeUrl').value = baseUrl + '?' + address.queryParams;
        document.getElementById('simulation-widget').src = baseUrl + '?' + address.queryParams;
        document.getElementById('address').value = address.fullAddress;
        document.getElementById('addressNumber').value = address.addressNumber;
        document.getElementById('addressStreet').value = address.addressStreet;
        document.getElementById('addressCity').value = address.addressCity;
        document.getElementById('addressDepartment').value = address.addressDepartment;
        document.getElementById('addressZipCode').value = address.addressZipCode;
        document.getElementById('addressCountry').value = address.addressCountry;
        document.getElementById('lat').value = address.lat;
        document.getElementById('lng').value = address.lng;
    });
}

autocompleteWidget(document.getElementById('address-input'));
