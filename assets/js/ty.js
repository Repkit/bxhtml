jQuery.support.cors = true;
$.typeahead({
    input: '.js-typeahead-country_v2',
    minLength: 2,
    dynamic: true,
    debug: true,
    delay: 500,
    backdrop: {
        "background-color": "#fff"
    },
    href: "https://europe-west1-bookxpress-295807.cloudfunctions.net/bx/book?ISBN={{_source.ISBN}}",
    template: function (query, item) {
        return '<div class="result">' +
            '<div class="row">' +
            '<div class="col-3">' +
            '<img src="https://www.studystore.nl/images/{{_source.ISBN}}/1/1" width="100px" loading="lazy" alt="{{_source.Publication}}"/>' +
            '</div>' +
            '<div class="col-9">' +
            '<div class="title">' +
            '{{_source.Publication}}' +
            '</div>' +
            '<div class="author">' +
            '{{_source.Author}}' +
            '</div>' +
            '<div class="info">' +
            'ISBN: {{_source.ISBN}} | Edition: {{_source.Edition}}' +
            '</div>' +
            '<button type="button" class="sell"><i>from</i>&nbsp;&nbsp;<strike>{{_source.Price}}</strike>&nbsp;&nbsp;<strong>{{_source.DiscountedPrice}}</strong></button>' +
            '</div>' +
            '</div>' +
            '</div>'
    },
    emptyTemplate: "no result for {{query}}",
    source: {
        book: {
            display: "_source.Publication",
            href: "https://europe-west1-bookxpress-295807.cloudfunctions.net/bx/book?ISBN={{_source.ISBN}}",
            ajax: function (query) {
                let data = JSON.stringify({
                    // "query": {
                    //     // "prefix" : { "Publication" : query }
                    //     "prefix": {
                    //         "Publication": {
                    //             "value": query,
                    //             "case_insensitive": true
                    //         }
                    //     }
                    // },
                    // "collapse": {
                    //     "field": "ISBN"
                    // }
                    "query": {
                        "match": {
                            "Publication": {
                                "query": query
                            }
                        }
                    }
                    ,"collapse":{"field":"ISBN"}
                });
                return {
                    type: "POST",
                    url: "https://es.asahiconsultancy.net/book_collection/_search",
                    path: "hits.hits",
                    contentType: "application/json;charset=UTF-8",
                    processData: false,
                    dataType: 'json',
                    beforeSend: function (jqXHR, options) {
                        jqXHR.setRequestHeader("Authorization", "Basic " + btoa('elastic' + ":" + 'W38800kxpr3$S'));
                    },
                    data: data
                }
            }
        }
    },
    callback: {
    }
});