angular.module('PortalApp')

.controller('watismusicCtrl', ['$scope', '$http', '$q', '$sce', 'watismusicFactory', function ($scope, $http, $q, $sce,
watismusicFactory) {

    // Widget Configuration
    $scope.portalHelpers.config = {
        // make 'widgetMenu.html' the template for the top right menu
        "widgetMenu": "widgetMenu.html"
    };

    // Import variables and functions from service
    $scope.insertValue = watismusicFactory.insertValue;
    $scope.suggestionForm = watismusicFactory.suggestionForm;
    $scope.loading = watismusicFactory.loading;
    $scope.links = watismusicFactory.links;
    $scope.openDataExampleData = watismusicFactory.openDataExampleData;
    $scope.dbData = watismusicFactory.dbData;
    $scope.youtubeData = watismusicFactory.youtubeData;
    $scope.item = watismusicFactory.item;

    // Model for the search and list example
    $scope.model = [{
        title: "item 1",
        details: "item 1 details",
        category: '1'
    }, {
        title: "item 2",
        details: "item 2 details",
        category: '2'
    }, {
        title: "item 3",
        details: "item 3 details",
        category: '1'
    }, {
        title: "item 4",
        details: "item 4 details",
        category: '2'
    }, {
        title: "item 5",
        details: "item 5 details",
        category: '1'
    }, {
        title: "item 6",
        details: "item 6 details",
        category: '2'
    }];

    // $scope.YouTubeData = [
    //   {
    //     title: "testTitle1",
    //     id: "R7vmHGAshi8",
    //     rating: 0,
    //     genre: "pop"
    //   },
    //   {
    //     title: "testTitle2",
    //     id: "S0TemlxiMdw",
    //     rating: 0,
    //     genre: "classical"
    //   }
    // ];


    // initialize the service
    watismusicFactory.init($scope);

    // watch for changes in the loading variable
    $scope.$watch('loading.value', function () {
        // if loading
        if ($scope.loading.value) {
            // show loading screen in the first column, and don't append it to browser history
            $scope.portalHelpers.showView('loading.html', 1, false);
            // show loading animation in place of menu button
            $scope.portalHelpers.toggleLoading(true);
        } else {
            $scope.portalHelpers.showView('main.html', 1);
            $scope.portalHelpers.toggleLoading(false);
        }
    });

    $scope.idToYoutubeLink = function(youtubeID){
        return $sce.trustAsResourceUrl("https://www.youtube.com/embed/"+youtubeID);
    };

    $scope.star = function(id) {
        $scope.portalHelpers.invokeServerFunction('star',{id:id}).then(function (
            result) {
            $scope.dbData.value = [];
        });
    }
    
    // Create table, invoked by a button press from database test example
    $scope.createTable = function () {
        $scope.portalHelpers.invokeServerFunction('createTable').then(function (
            result) {
            $scope.dbData.value = [];
        });
    };

    // Handle form submit in the database test example
    $scope.insertSuggestion = function () {
        //if ($scope.insertValue.value.length > 50)
        //    alert('value should be less than 50 characters');
        //else {
            $scope.portalHelpers.invokeServerFunction('insertSuggestion', {
                data: JSON.stringify($scope.suggestionForm)
            }).then(function (result) {
                console.log(result);
                $scope.youtubeData.value = JSON.parse(result.data);
            });
            //$scope.insertValue.value = "";
        //}
    };

    $scope.insertData = function(){};

    // Handle click on an item in the list and search example
    $scope.showDetails = function (item) {
        // Set which item to show in the details view
        $scope.item.value = item;
        // Show details view in the second column
        $scope.portalHelpers.showView('details.html', 2);
    };

    // Handle "previous item" click from the details page
    $scope.prevItem = function () {
        // get previous items in the list
        var prevItem = $scope.portalHelpers.getPrevListItem();
        // refresh details view with the new item
        $scope.showDetails(prevItem);
    };

    $scope.nextItem = function () {
        var nextItem = $scope.portalHelpers.getNextListItem();
        $scope.showDetails(nextItem);
    };

}])
    // Factory maintains the state of the widget
    .factory('watismusicFactory', ['$http', '$rootScope', '$filter', '$q', function ($http, $rootScope,
        $filter, $q) {
        var initialized = {
            value: false
        };

        // Your variable declarations
        var loading = {
            value: true
        };
        var insertValue = {
            value: null
        };
        var suggestionForm = {
          title: null,
          artist: null,
          linkID: null,
          rating: null,
          genre: null
        };
        var links = {
            value: null
        };
        var openDataExampleData = {
            value: null
        };
        var dbData = {
            value: null
        };
        var item = {
            value: null
        };
        var youtubeData = {
          value: null
        };
        var sourcesLoaded = 0;

        var init = function ($scope) {
            if (initialized.value)
                return;
            initialized.value = true;

            // Place your init code here:

            // Get data for the widget
            $http.get('/ImportantLinks/JSONSource').success(function (data) {
                links.value = data;
                sourceLoaded();
            });

            // OPEN DATA API EXAMPLE
            $scope.portalHelpers.invokeServerFunction('getOpenData').then(function (
                result) {
                console.log('getopendata data: ', result);
                openDataExampleData.value = result.data;
                sourceLoaded();
            });

            $scope.portalHelpers.invokeServerFunction('getData').then(function (result) {
                dbData.value = result;
                console.log(result);
                sourceLoaded();
            });
            $scope.portalHelpers.invokeServerFunction('getRecommended').then(function (result) {
                youtubeData.value = JSON.parse(result.data);
                console.log(youtubeData.value);
                sourceLoaded();
            });
        };

        function sourceLoaded() {
            sourcesLoaded++;
            if (sourcesLoaded == 4)
                loading.value = false;
        }

        return {
            init: init,
            loading: loading,
            insertValue: insertValue,
            suggestionForm: suggestionForm,
            links: links,
            openDataExampleData: openDataExampleData,
            dbData: dbData,
            youtubeData: youtubeData,
            item: item
        };

    }])
    // Custom directive example
    .directive('watismusicDirectiveName', ['$http', function ($http) {
        return {
            link: function (scope, el, attrs) {

            }
        };
    }])
    // Custom filter example
    .filter('watismusicFilterName', function () {
        return function (input, arg1, arg2) {
            // Filter your output here by iterating over input elements
            var output = input;
            return output;
        };
    });