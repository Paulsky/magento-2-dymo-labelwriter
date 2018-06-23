//'mage/storage',
define([
    'jquery',
    'mageUtils',
    'wdevsDymo',
    'wdevsAddressFormater'
], function ($, utils, wdevsDymo, wdevsAddressFormater) {
    'use strict';

    //init printer and label
    wdevsDymo.loadSettings();

    function printOrder(orderId, authToken){
        var defer = $.Deferred();
        wdevsAddressFormater.getShippingAddressByOrder(orderId, authToken).done(function(address){
            //"NAME \nSTREET \nPOSTCODE  CITY\n COUNTRY"
            //"P. Wijnberg \nGrote Markt 22 \n1234 AB  's Gravenzande\n Nederland"
            wdevsDymo.printLabel(address);

            //uncheck the checkboxes
            var checkboxId = 'idscheck'+orderId;
            if($('input:checkbox[id^='+checkboxId+']:checked').length){
                $('input:checkbox[id^='+checkboxId+']:checked').click();
            }
            defer.resolve();
        }).fail(function(){
            defer.fail();
        });

        return defer.promise();
    }

    //Should be a temporarily function
    //But Magento's url.build is not working
    //except if your create another 3+ files only for the url...
    function getAdminPath() {
        var pathName = window.location.pathname;
        var pathArray = pathName.split('/');
        var adminPath = "admin";
        for (var i = 0; i < pathArray.length; i++) {
            if(pathArray[i] != ""){
                adminPath = pathArray[i];
                break;
            }
        }

        return adminPath;
    }

    return function (target) {

        return target.extend({

            /**
             * Default action callback. Sends selections data
             * via POST request or POST form
             *
             * @param {Object} action - Action data.
             * @param {Object} data - Selections data.
             */
            defaultCallback: function (action, data) {

                if (action.type == 'mass_print_dymo_labels') {
                    //close the dropdown
                    this.opened(false);

                    if (data.hasOwnProperty('selected')) {
                        if (data.selected.length > 0) {
                            /**
                             * So there is a bug in the Magento 2 REST API.
                             * Session based authentication for REST API in admin is currently not working.
                             * And it should work; See GitHub: https://github.com/magento/magento2/issues/14297
                             */

                            /**
                             * For now we have to generate an access token
                             * with that token, we can consume the REST API
                             */

                            /**
                             * if this bug is fixed. We can remove:
                             * - Controller/Adminhtml/Auth/Token.php
                             * - etc/adminhtml/routes.xml
                             * - the authToken parameters in the functions
                             * - the below AJAX request (/admin/dymo/auth/token)
                             */


                            if(wdevsDymo.isLoaded()) {
                                //show loader
                                $('body').trigger('processStart');
                                var adminPath = getAdminPath();
                                var authUrl = '/' + adminPath +'/dymo/auth/token';
                                $.ajax({
                                    method: 'POST',
                                    data: {form_key: window.FORM_KEY},
                                    url: authUrl,
                                    dataType: 'json',
                                }).done(function (tokenData) {
                                    //tokenData = {'authToken': 'xyx'}
                                    var tokenData = $.parseJSON(JSON.stringify(tokenData));

                                    var printedOrders = [];
                                    if (tokenData.hasOwnProperty('authToken')) {
                                        var authToken = tokenData.authToken;
                                        $.each(data.selected, function (index, orderId) {
                                            var printedOrder = printOrder(orderId, authToken);
                                            printedOrders.push(printedOrder);
                                        });

                                        $.when.apply($, printedOrders).done(function () {
                                            //all orders data is fetched and printed
                                            //stop loader
                                            $('body').trigger('processStop');
                                        });

                                    }
                                });
                            }
                        }
                    }
                    return false;
                } else {
                    //call other mass action methods
                    var defaultCallback = this._super();
                    return defaultCallback;
                }
            }
        });
    };
});