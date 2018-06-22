/**
 * Created by Paul Wijnberg on 22-6-2018.
 */
define(['jquery'], function ($) {
    "use strict";

    // function checkNLPostCode(nlPostCode){  // nlPostCode is the value of the postcode field
    //     nlPostCode = nlPostCode.replace(/^\s+|\s+$/g,""); // strip leading and trailing spaces
    //     nlPostCode  = nlPostCode.replace(/(\d)\s(\d)/g, "$1$2");
    //     nlPostCode  = nlPostCode.replace(/(\d)\s(\d)/g, "$1$2");  // must be done twice to trap space between 12 and 34!
    //     nlPostCode  = nlPostCode.replace(/(\D)\s(\D)/g, "$1$2");
    //     nlPostCode =  nlPostCode.replace(/(\d{4})(\D{2})/g, "$1 $2");  // add space as 5th character
    //     nlPostCode  = nlPostCode.replace(/\s{2,}/g," ");  // replace multiple spaces by one space
    //     nlPostCode  = nlPostCode.toUpperCase();  // convert to upper case
    //     return nlPostCode;
    // }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function capitalizeEachWord(string) {
        return string.split(' ').map(function (val) {
            return val.charAt(0).toUpperCase() + val.substr(1).toLowerCase();
        }).join(' ');
    }

    function formatFirstName(firstName) {
        firstName = firstName.trim();
        firstName = firstName.substring(0, 1);
        firstName = capitalizeFirstLetter(firstName);
        return firstName + ".";
    }

    function formatCityLine(postcode, city) {
        //TODO: fix this:
        //'s gravenhage becomes 'S Gravenhage....
        city = capitalizeEachWord(city);
        //two spaces
        return postcode + "  " + city;


    }

    function formatStreetLine(streetArray) {
        var street = streetArray;
        if (streetArray.length > 0) {
            street = streetArray[0];
        }

        street = capitalizeEachWord(street.trim());

        return street;
    }

    function formatNameLine(firstName, lastName) {
        firstName = formatFirstName(firstName);
        lastName = capitalizeFirstLetter(lastName.trim());

        return firstName + " " + lastName;
    }

    function getCountryById(countryId, authToken) {
        var defer = $.Deferred();
        if (countryId === "") {
            defer.resolve(countryId);
        } else {
            $.ajax({
                url: '/rest/V1/directory/countries/' + countryId,
                type: 'GET',
                dataType: 'json',
                contentType: "application/json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
                },
            }).done(function (countryData) {
                countryData = $.parseJSON(JSON.stringify(countryData));
                var country = "";
                if (countryData.hasOwnProperty('full_name_locale')) {
                    country = countryData.full_name_locale;
                }
                defer.resolve(country);
            });
        }

        return defer.promise();
    }

    function getAddressFormat(addressData, authToken) {
        //sample json: "address": { "address_type": "shipping", "city": "Groningen", "country_id": "NL", "email": "contact@wijnbergdevelopments.nl", "entity_id": 1, "firstname": "Paul", "lastname": "Wijnberg", "parent_id": 1, "postcode": "1234AB", "region": "Groningen", "region_code": "GR", "region_id": 12, "street": [ "main street 200" ], "telephone": "123456789" },

        //needs to be something like this:
        //"P. Wijnberg \nMain Street 200 \n1234 AB  Groningen \nThe Netherlands"
        var defer = $.Deferred();
        var countryId = "";
        if (addressData.hasOwnProperty('country_id')) {
            countryId = addressData.country_id;
        }
        getCountryById(countryId, authToken).done(function (country) {
            var name = formatNameLine(addressData.firstname, addressData.lastname);
            var street = formatStreetLine(addressData.street);
            var city = formatCityLine(addressData.postcode, addressData.city);
            var format = name + " \n" + street + " \n" + city;
            if (country != "") {
                format = format + " \n" + country;
            }
            defer.resolve(format);
        });
        return defer.promise();

    }

    function getShippingAddressFromOrder(orderData, authToken) {
        var defer = $.Deferred();
        var propertyExists = false;
        if (orderData.hasOwnProperty('extension_attributes')) {
            if (orderData.extension_attributes.hasOwnProperty('shipping_assignments')) {
                if (orderData.extension_attributes.shipping_assignments.length > 0) {
                    if (orderData.extension_attributes.shipping_assignments[0].hasOwnProperty('shipping')) {
                        if (orderData.extension_attributes.shipping_assignments[0].shipping.hasOwnProperty('address')) {
                            var address = orderData.extension_attributes.shipping_assignments[0].shipping.address;
                            propertyExists = true;
                            getAddressFormat(address, authToken).done(function (format) {
                                defer.resolve(format);
                            }).fail(function () {
                                defer.fail();
                            });
                        }
                    }
                }
            }
        }

        if (!propertyExists) {
            defer.fail();
        }

        return defer.promise();
    }

    return ({
        getShippingAddressByOrder: getShippingAddressByOrder
    });

    function getShippingAddressByOrder(orderId, authToken) {
        var defer = $.Deferred();
        $.ajax({
            url: '/rest/V1/orders/' + orderId,
            type: 'GET',
            dataType: 'json',
            contentType: "application/json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
            },
        }).done(function (orderData) {
            orderData = $.parseJSON(JSON.stringify(orderData));
            getShippingAddressFromOrder(orderData, authToken).done(function (address) {
                defer.resolve(address);
            }).fail(function () {
                defer.fail();
            })

        }).fail(function () {
            defer.fail();
        })

        return defer.promise();

    }


});