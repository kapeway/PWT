(function () {
    'use strict';

    angular.module('app')
        .service('performanceService', [
            performanceService
        ]);

    function performanceService() {

        var service = {
            getPerformanceData: getPerformanceData
        };

        return service;

        function getPerformanceData(performancePeriod) {
            if (performancePeriod === 'week') {
                return [
                    {
                        "key": 'Middleware',
                        "values": [[1, 11], [2, 10], [3, 14], [4, 21], [5, 13]]
                    },

                    {
                        "key": 'Ruby',
                        "values": [[1, 29], [2, 36], [3, 42], [4, 25], [5, 22]]
                    },

                    {
                        "key": 'Web External',
                        "values": [[1, 54], [2, 74], [3, 64], [4, 68], [5, 56]]
                    },
                    {
                        "key": 'Database',
                        "values": [[1, 64], [2, 84], [3, 64], [4, 68], [5, 86]]
                    }
                ]
            } else {
                return [
                    {
                        "key": 'Middleware',
                        "values": [[1, 13], [2, 14], [3, 24], [4, 18], [5, 16], [6, 14], [7, 11], [8, 13], [9, 15], [10, 11]]
                    },

                    {
                        "key": 'Ruby',
                        "values": [[1, 29], [2, 36], [3, 42], [4, 25], [5, 22], [6, 34], [7, 41], [8, 19], [9, 45], [10, 31]]
                    },

                    {
                        "key": 'Web External',
                        "values": [[1, 54], [2, 74], [3, 64], [4, 68], [5, 56], [6, 44], [7, 61], [8, 63], [9, 45], [10, 51]]
                    },
                    {
                        "key": 'Database',
                        "values": [[1, 74], [2, 64], [3, 84], [4, 78], [5, 66], [6, 64], [7, 71], [8, 83], [9, 55], [10, 81]]
                    }
                ]
            }
        }
    }
})();
