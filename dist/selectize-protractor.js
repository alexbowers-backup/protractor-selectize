/**
 * Protractor plugin for Selectize (Angular)
 *
 * Licenced under Apache 2.0 License.
 * No attribution needed, commercial use and
 * personal use granted without request.
 *
 * This plugin requires the following change be made to the Selectize JS application.
 *
 * A section of the code looks like this:
 *
 * if (templateName === 'option' || templateName === 'item') {
 *     html = html.replace(regex_tag, '<$1 data-value="' + escape_replace(escape_html(value || '')) + '"');
 * }
 *
 * Change it to be:
 *
 * if (templateName === 'option' || templateName === 'item') {
 *     html = html.replace(regex_tag, '<$1 data-value="' + escape_replace(escape_html(value || '')) + '" data-text="' + escape_replace(escape_html(data.title || '')) + '"');
 * }
 *
 * Then this plugin will work.
 *
 * Usage:
 *
 * var Selectize = require('../misc/selectize'); // Ensure the path is to the JS file, or use node autoloading.
 *
 * // Search by the ID attribute, and then give a string to enter. This should be assigned to a variable, not chained to other methods.
 * // Chaining to other methods will work, but will require repetition.
 * var searchBox = Selectize.findById('customerSearch').search('Mrs Cupcakes');
 *
 * expect(customerSearchBox.contains('Mrs Helen Cupcakes')).toBeTruthy(); // Will pass if Mrs Helen Cupcakes is an option in the dropdown, will fail if not.
 * // Click the option (will fire any click events such as going to page or filling in page data etc.
 * customerSearchBox.choose('Mrs Helen Cupcakes');
 *
 * Future API changes to be made:
 *
 * - Allow findBy* for more ways to find the field
 *
 * - Allow an array for contains, to match many items
 *
 * - Allow orContains (to chain contains together)
 *
 * - Allow choose 'create'
 */
var Selectize = {
    _element: null,
    _searchString: null,
    _results: [],
    _resultsRaw: [],
    _id: null,
    _canCreate: null,
    findById: function (id) {
        if (typeof id == 'undefined' || id.length == 0) {
            throw "No ID Provided";
        } else {
            this._id = id;
            this._element = $('#' + id + ' + .selectize-control .selectize-input input');
            return this;
        }
    },
    search: function (words) {
        if (this._element == null) {
            throw "Element Not Chosen";
        } else {
            this._searchString = words;
            this._element.sendKeys(words);

            browser.sleep(1000);

            this._results = element.all(by.css('#' + this._id + ' + .selectize-control .selectize-dropdown .selectize-dropdown-content')).all(by.css('.option')).map(function (elm) {
                return {
                    id: elm.getRawId().then(function (id) {
                        return id;
                    }),
                    click: elm.click,
                    text: elm.getAttribute('data-text').then(function (text) {
                        return text;
                    })
                };
            });

            this._canCreate = element.all(by.css('#' + this._id + ' + .selectize-control .selectize-dropdown .selectize-dropdown-content')).all(by.css('.create')).map(function(elm) {
               return elm.isPresent();
            });

            return this;
        }
    },
    contains: function (term) {
        return this._results.then(function (result) {
            var found = false;
            for (var i = 0; i < result.length; i++) {
                if (result[i].text == term) {
                    found = true;
                }
            }
            return found;
        });
    },
    choose: function (term) {
        return this._results.then(function (result) {
            var found = false;
            for (var i = 0; i < result.length; i++) {
                if (result[i].text == term) {
                    result[i].click();
                }
            }
            return found;
        });
    },
    canCreate: function() {
        return this._canCreate;
    },
    create: function() {
        element(by.css('#' + this._id + ' + .selectize-control .selectize-dropdown .selectize-dropdown-content .create')).click();
    }
};

module.exports = Selectize;
