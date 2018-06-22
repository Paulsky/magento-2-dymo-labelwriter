var config = {
    paths: {
        "dymoFramework": 'Wdevs_Dymo/js/dymo.label.framework.min'
    },
    map: {
        '*': {
            wdevsDymo: 'Wdevs_Dymo/js/main',
            wdevsAddressFormater: 'Wdevs_Dymo/js/address.formatter'
        }
    },
    shim: {
        'dymoFramework': {
            exports: 'dymo'
        },
    },
    config: {
        mixins: {
            'Magento_Ui/js/grid/massactions': {
                'Wdevs_Dymo/js/grid/massactions-mixin': true
            }
        }
    }
};