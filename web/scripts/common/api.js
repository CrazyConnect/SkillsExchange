'use strict';

angular.module('underscore', [])
    .factory('_', function () {
        return window._; // assumes underscore has already been loaded on the page
    });

angular
    .module('app-api', [
        'underscore',
        'restangular'
    ]);

angular.module('app-api')
    .config(['RestangularProvider', configApiAccess]);

function configApiAccess(RestangularProvider) {
    RestangularProvider.setRestangularFields({
        selfLink: '_links.self.href'
    });

    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        if (operation === 'getList' && angular.isDefined(response.data._embedded)) {
            response.totalCount = response.data.total;

            return response.data._embedded.items;
        }

        return response.data;
    });
}

angular.module('app-api')
    .factory('serviceService', ServiceService);

ServiceService.$inject = ['apiClientService'];

function ServiceService(apiClientService) {

    var endPoint = 'api/service-products';

    var model = {
        duration: {type: 'string'},
        description: {type: 'string'},
        price: {type: 'number'},
        user: {type: 'object'}
    };

    var service = {
        get: get,
        getList: getList,
        put: put,
        post: post
    };

    return service;

    /////////

    function get(id) {
        return apiClientService.show(endPoint, id);
    }

    function getList() {
        return apiClientService.index(endPoint);
    }

    function put(service) {
        return apiClientService.update(service, model);
    }

    function post(service) {
        return apiClientService.create(endPoint, service, model);
    }
}

angular.module('app-api')
    .factory('currentUserService', currentCustomerService);

currentCustomerService.$inject = ['apiClientService'];

function currentCustomerService(apiClientService) {

    var endPoint = 'api/user';

    var service = {
        get: get
    };

    return service;

    /////////

    function get() {
        return apiClientService.show(endPoint);
    }
}



angular.module('app-api')
    .factory('apiClientService', ApiClientService);

ApiClientService.$inject = ['Restangular'];

function ApiClientService(Restangular) {
    var model = {};

    var service = {
        show: show,
        index: index,
        indexByCriteria: indexByCriteria,
        create: create,
        update: update
    };

    return service;

    /////////
    function show(endPoint, id) {
        return Restangular.one(endPoint, id).get();
    }

    function create(endPoint, object, modelConfig) {
        model = modelConfig;
        var objectToPost = hydrateModel(object);
        return Restangular.all(endPoint + '/').post(objectToPost);
    }

    function update(object, modelConfig) {
        model = modelConfig;
        var objectToPut = hydrateModel(object);
        return Restangular.one(object._links.self.href).customPUT(objectToPut);
    }

    function index(endPoint, trailingSlash) {
        if (trailingSlash === undefined || trailingSlash === true) {
            endPoint = endPoint + '/';
        }
        return Restangular.all(endPoint).getList()
    }

    function indexByCriteria(endPoint, criteria, params) {
        var query = {};

        for (var attr in criteria) {
            query['criteria[' + attr + ']'] = criteria[attr];
        }
        if (params !== undefined) {
            query = extend(query, params);
        }
        return Restangular.all(endPoint).getList(query);
    }

    function hydrateModel(object) {
        var result = {};
        console.log(model);
        Object.keys(model).forEach(function(propertyName) {
            var label = model[propertyName].label ? model[propertyName].label : propertyName;
            switch (model[propertyName].type) {
                case 'object':
                    result[propertyName] = object[label] ? object[label].id : null;
                    break;
                default:
                    result[propertyName] = object[label];
            }
        });
        return result;
    }

    function extend(obj, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] = src[key];
        }
        return obj;
    }
}
