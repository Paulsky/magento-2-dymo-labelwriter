# Magento 2.* Dymo LabelWriter

This extension/module/plugin lets you print a label from the order overview in the backend of Magento 2.*. For the extension of OpenCart please see this project: [OpenCart Dymo LabelWriter].

![magento-2-order-overview-label](https://user-images.githubusercontent.com/9481318/41775142-09f23708-7623-11e8-831f-ae438841ef1b.png)

Note the following:
* This extension is **not** tested thoroughly
* This extension is only tested in Magento **2.2.4**
* This extension is only tested with a **Dymo LabelWriter 450**
* This extension is only tested on **Windows 10 with Internet Explorer 11 (- succeeded) and Google Chrome 67 (- succeeded)**
* Please check on [this demo page](http://www.labelwriter.com/software/dls/sdk/samples/js/PrintLabel/PrintLabel.html) if you can print a label through your browser

### Dependencies

This extension depends on the following frameworks/SDK's/modules

* An installed and connected Dymo LabelWriter or a configured (fake) Dymo LabelWriter driver
* [DLS] DYMO Label Software v8.7.2
* [jQuery] 1.12.4 (already used in the backend of Magento 2.2.4)
* [Dymo Label Framework SDK]

### Installation

Choose between 1.A or 1.B.

#### 1.A. Composer (recommended)
* Navigate in the console to the root directory of your Magento 2 installation
* Run: composer require wdevs/magento-2-dymo

#### 1.B. Manual

* Create folders: /app/code/Wdevs/Dymo/
* Download all files from this repository
* Copy all files to /app/code/Wdevs/Dymo/

#### 2. Enable the module
* Navigate in the console to the root directory of your Magento 2 installation
* Run: php ./bin/magento module:enable Wdevs_Dymo
* Run: php ./bin/magento setup:upgrade
* Clear caches


### Known Issues

At this moment there are no known issues. Please let us know if you have any problems with the module!

### Troubleshoot

* Please check if you have the right version installed of the [DLS]
* If you updated the DLS, please restart your browser or restart your computer completely.
* Clear the Magento cache
* Clear your own browser cache
* Please check on [this demo page](http://www.labelwriter.com/software/dls/sdk/samples/js/PrintLabel/PrintLabel.html) if you can print a label through your browser. If not, try a different browser. The demo page should work. If not, this module probably won't work. 

### Todo's

 - Write Tests
 - Test with other versions, printers and browsers
 - Make the loading of printers more dynamic
 - Maybe make the extension compatible with other eCommerce platforms?
 - Dynamic label design / label upload

### Version
0.1.0 Beta

### Contribute

Thank you for your interest in contributing! There are many ways to contribute to this project. Get started [here](https://github.com/Paulsky/magento-2-dymo-labelwriter/blob/master/CONTRIBUTING.md).

### License

MIT

[Dymo Label Framework SDK]: http://labelwriter.com/software/dls/sdk/js/DYMO.Label.Framework.latest.js
[jQuery]:http://jquery.com
[OpenCart Dymo LabelWriter]: https://github.com/Paulsky/opencart-dymo-labelwriter
[DLS]: http://www.dymo.com/en-GB/online-support/dymo-user-guides