// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initAutocomplete() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 52.3558182, lng: 4.9557263 },
        zoom: 17,
        mapTypeId: "roadmap",
    });
    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    const travelDistance = document.getElementById("travelDistance");
    const addBookDeliveryAddress = document.getElementById("addBookDeliveryAddress");
    const searchBox = new google.maps.places.SearchBox(input);

    /* add input to map */
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });
    let markers = [];
    let circles = [];
    let selectedPlaces = []
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        // Clear out the old markers.
        markers.forEach((marker) => {
            marker.setMap(null);
        });
        markers = [];

        // Clear out the old markers.
        circles.forEach((circle) => {
            circle.setMap(null);
        });
        circles = [];

        selectedPlaces = [];

        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();
        const radius = travelDistance.value * 1000;
        places.forEach((place) => {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            const icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
            };
            // Create a marker for each place.
            markers.push(
                new google.maps.Marker({
                    map,
                    icon,
                    title: place.name,
                    position: place.geometry.location,
                })
            );

            circles.push(
                new google.maps.Circle({
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35,
                    map,
                    center: place.geometry.location,
                    radius: radius,
                })
            );

            selectedPlaces.push(place);

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });

        map.fitBounds(bounds);
        switch(radius) {
            case 1000:
                map.setZoom(14);
                break;
            case 2000:
                map.setZoom(13);
                break;
            case 4000:
                map.setZoom(12);
                break;
            default:
                map.setZoom(11);
        }
    });

    travelDistance.addEventListener("change", (event) => {
        if(circles.length < 1){
            return;
        }
        // Clear out the old markers.
        circles.forEach((circle) => {
            circle.setMap(null);
        });
        let circle = circles.pop();
        circles = [];

        // console.log(event);
        let radius = parseInt(event.target.value) * 1000;
        circles.push(
            new google.maps.Circle({
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
                map,
                center: circle.getCenter(),
                radius: radius,
            })
        );

        switch(radius) {
            case 1000:
                map.setZoom(14);
                break;
            case 2000:
                map.setZoom(13);
                break;
            case 4000:
                map.setZoom(12);
                break;
            default:
                map.setZoom(11);
        }
    }, false);

    addBookDeliveryAddress.addEventListener("click", (event) => {
        event.preventDefault();
        if(selectedPlaces.length < 1){
            return;
        }

        let place = selectedPlaces.pop();
        console.log(place);
        let el = '<label class="badge badge-success" style="color:white;">'+ place.name + '<small>(' + place.formatted_address +')</small>\n' +
            '    <input type="hidden" name="Addresses[]" value="'+ place.formatted_address +'">\n' +
            '    <input type="hidden" name="Radius[]" value="'+ travelDistance.value +'">\n' +
            '    <span aria-hidden="true" onclick="this.parentElement.remove();" style="\n' +
            '        border-left: 1px solid white;\n' +
            '        cursor: pointer;\n' +
            '        padding-left: 7px;\n' +
            '        padding-right: 2px;\n' +
            '    ">&times;</span>\n' +
            '</label>';

        $('#selectedAddresses').append(el);
        $('#allowInPersonDelivery').prop( "checked", true );

    }, false);
}