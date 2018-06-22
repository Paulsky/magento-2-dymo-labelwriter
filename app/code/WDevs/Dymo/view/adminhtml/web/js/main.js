/**
 * Created by Paul Wijnberg on 20-6-2018.
 * http://labelwriter.com/software/dls/sdk/js/DYMO.Label.Framework.3.0.js
 * http://developers.dymo.com/2016/08/08/dymo-label-web-service-faq/
 * http://developers.dymo.com/2018/05/29/updated-js-sdk-and-dls/
 * http://developers.dymo.com/2015/09/24/dymo-label-framework-javascript-library-2-0-open-beta-2/
 * http://www.labelwriter.com/software/dls/sdk/samples/js/PrintLabel/PrintLabel.html
 */
//load the Dymo Label XML file as a dependency
define(['jquery', 'dymoFramework', "text!../assets/label.label"], function ($, dymo, dymoLabel) {
    "use strict";

    //first printer that is available
    var mainPrinter = null;
    //the target .label file
    var label = null;

    /**
     * Gets all available Dymo printers by the Dymo SDK.
     * Sets the first printer as the main printer.
     */
    function loadPrinter() {
        var printers = dymo.label.framework.getPrinters();
        if (printers.length == 0) {
            console.log("No Dymo printers found.");

        } else {
            if (printers[0].printerType == "LabelWriterPrinter") {
                mainPrinter = printers[0];
                console.log('Main printer: ' + mainPrinter.name);
            } else {
                console.log("No Dymo LabelWriter printers found.");
            }
        }

    }

    /**
     * Loads the .label file with an AJAX request.
     */
    function loadLabel() {
        if (dymoLabel) {
            label = dymo.label.framework.openLabelXml(dymoLabel);
            // check if the .label file has an address object
            if (label.getAddressObjectCount() == 0) {
                console.log('Label file (\'../assets/label.label\') does not contain an address object.');
                return;
            }
            console.log('Label loaded.');
        }

    }

    /**
     * Sets the address of the .label file.
     * @param string address The address
     * @returns {*}
     */
    function setAddress(address) {
        if (!label || label.getAddressObjectCount() == 0) {
            return;
        }
        //Dymo label SDK function
        return label.setAddressText(0, address);
    }

    return ({
        loadSettings: loadSettings,
        printLabel: printLabel,
        isLoaded: isLoaded
    });

    function loadSettings() {
        //load setttings
        loadPrinter();
        loadLabel();
    }

    /**
     * Starts the print action if a printer is present and if a .label file is loaded.
     */
    function printLabel(address) {
        if (!mainPrinter) {
            console.log('No printer available.');
            return;
        }

        if (!label) {
            console.log('Label not loaded.');
            return;
        }

        setAddress(address);
        //Dymo label SDK function
        label.print(mainPrinter.name);

    }

    function isLoaded() {
        if (!mainPrinter || !label) {
            return false;
        }

        return true;
    }


});