jQuery.support.cors = true;
typeof $.typeahead === 'function' && $.typeahead({
    input: '.js-typeahead-search_v2',
    minLength: 2,
    dynamic: true,
    debug: true,
    delay: 500,
    backdrop: {
        "background-color": "#fff"
    },
    href: "#",
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
            href: "#",
            ajax: function (query) {
                let data = JSON.stringify({
                    "query": {
                        // "prefix" : { "Publication" : query }
                        "prefix": {
                            "Publication": {
                                "value": query,
                                "case_insensitive": true
                            }
                        }
                    },
                    "collapse": {
                        "field": "ISBN"
                    }
                });
                return {
                    type: "POST",
                    url: "http://34.91.175.68:9200/book_collection/_search",
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
        onClickAfter: function (node, a, item, event){
            event.preventDefault();
            console.log(item);
            sell.populateForm(item);
            return;
        },
        onCancel: function(node, event){
            sell.clearForm();
        }
    }
});

$.typeahead({
    input: '.js-typeahead-subject_v2',
    minLength: 1,
    dynamic: true,
    debug: true,
    delay: 500,
    maxItem: 7,
    maxItemPerGroup: 6,
    order: "asc",
    hint: true,
    searchOnFocus: true,
    blurOnTab: false,
    // matcher: function (item, displayKey) {
    //     // if (item.id === "BOS") {
    //     //     // Disable Boston for X reason
    //     //     item.disabled = true;
    //     // }
    //
    //     // Add all items matched items
    //     // return true;
    // },
    multiselect: {
        limit: 10,
        limitTemplate: 'You can\'t select more than 10 teams',
        matchOn: ["_source.Name"],
        cancelOnBackspace: true,
        // data: function () {
        //
        //     var deferred = $.Deferred();
        //
        //     setTimeout(function () {
        //         deferred.resolve([{
        //             "matchedKey": "name",
        //             "name": "Canadiens",
        //             "img": "canadiens",
        //             "city": "Montreal",
        //             "id": "MTL",
        //             "conference": "Eastern",
        //             "division": "Northeast",
        //             "group": "teams"
        //         }]);
        //     }, 2000);
        //
        //     deferred.always(function () {
        //         console.log('data loaded from promise');
        //     });
        //
        //     return deferred;
        //
        // },
        // callback: {
        //     onClick: function (node, item, event) {
        //         console.log(item);
        //         alert(item.name + ' Clicked!');
        //     },
        //     onCancel: function (node, item, event) {
        //         console.log(item);
        //         alert(item.name + ' Removed!');
        //     }
        // }
    },
    template: function (query, item) {
        return '<li class="repkittpl">{{_source.Name}}</li>';
    },
    emptyTemplate: 'no result for {{query}}',
    source: {
        subjects: {
            display: "_source.Name",
            ajax: function (query) {
                let data = JSON.stringify({
                    "query": {
                        "prefix" : { "Name" : query }
                    }
                });
                return {
                    type: "POST",
                    url: "http://34.91.175.68:9200/book_subjects/_search",
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
        onClick: function (node, a, item, event) {
            console.log(item.name + ' Added!')
        },
        onSubmit: function (node, form, items, event) {
            event.preventDefault();

            alert(JSON.stringify(items))
        }
    },
    debug: true
});

typeof $.typeahead === 'function' && $.typeahead({
    input: '.js-typeahead-hockey_v2',
    minLength: 1,
    maxItem: 8,
    maxItemPerGroup: 6,
    order: "asc",
    hint: true,
    searchOnFocus: true,
    blurOnTab: false,
    matcher: function (item, displayKey) {
        console.log(item);
        console.log(displayKey);
        // if (item.id === "BOS") {
        //     // Disable Boston for X reason
        //     item.disabled = true;
        // }
        // Add all items matched items
        return true;
    },
    multiselect: {
        limit: 10,
        limitTemplate: 'You can\'t select more than 10 teams',
        matchOn: ["id"],
        // matchOn: ["_source.Name"],
        cancelOnBackspace: true,
        data: function () {

            var deferred = $.Deferred();

            setTimeout(function () {
                deferred.resolve([
                    // {
                    //     "name": "Thrashers",
                    //     "img": "thrashers",
                    //     "city": "Atlanta",
                    //     "id": "ATL",
                    //     "conference": "Eastern",
                    //     "division": "Southeast"
                    // }
                    // {
                    //     "_index": "book_subjects",
                    //     "_type": "_doc",
                    //     "_id": "8",
                    //     "_score": 1.0,
                    //     "_source": {
                    //         "Id": "8",
                    //         "Name": "logic",
                    //         "TypeId": "1",
                    //         "CreationDate": "2020-12-03 14:21:54",
                    //         "Status": "1"
                    //     }
                    // }
                    {
                        "id": "8",
                        "name": "logic",
                        "TypeId": "1",
                        "CreationDate": "2020-12-03 14:21:54",
                        "Status": "1"
                    }
                ]);
            }, 2000);

            deferred.always(function () {
                console.log('data loaded from promise');
            });

            return deferred;

        },
        callback: {
            onClick: function (node, item, event) {
                console.log(item);
                alert(item.name + ' Clicked!');
                // alert(item._source.Name + ' Clicked!');
            },
            onCancel: function (node, item, event) {
                console.log(item);
                alert(item.name + ' Removed!');
                // alert(item._source.Name + ' Removed!');
            }
        }
    },
    // templateValue: "{{_source.Name}}",
    templateValue: "{{name}}",
    // display: ["_source.Name"],
    display: ["name"],
    emptyTemplate: 'no result for {{query}}',
    source: {
        teams: {
            // url: "http://35.204.244.237/clients/bookxpress/public/html/demo/hockey_v2.json"
            url: "http://35.204.244.237/clients/bookxpress/public/html/demo/subjects_v3.json",
        }
    },
    callback: {
        onClick: function (node, a, item, event) {
            console.log(item.name + ' Added!')
            // console.log(item._source.Name + ' Added!')
        },
        onSubmit: function (node, form, items, event) {
            event.preventDefault();

            alert(JSON.stringify(items))
        }
    },
    debug: true
});