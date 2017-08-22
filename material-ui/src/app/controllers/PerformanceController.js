(function () {
    angular
        .module('app')
        .controller('PerformanceController', [
            'premiumService', '$q',
            PerformanceController
        ]);

    function PerformanceController(premiumService, $q) {
        var vm = this;
        var monthNumber = ["Jan", "Feb", "Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
        vm.showOptions=false;
        var getChartOptions =function(chartPremiumData) {
            var getChartToolTip=function(d){
                if(d.week)
                  return "Premium for " + monthNumber[d.month-1] +" " + d.year + " " + d.week + " week";
                return "Premium for " + monthNumber[d.month-1] +" " + d.year;
            };
            return {chart: {
                type: 'pieChart',
                height: 300,
                donut: true,
                x: function (d) { return getChartToolTip(d) ; },
                y: function (d) { return d.premium; },
                valueFormat: (d3.format(".0f")),
                color: ['#F44336', '#E91E63','#9c27B0','#3F51B5','#00BCD4','#4CAF50','#FFEB3B','#795548','#9E9E9E'],
                showLabels: false,
                showLegend: false,
                title: chartPremiumData.policyType,
                margin: { top: -10 }
                }
            }
        };
        
        var setIndividualPremiumCharts=function(premiumDataResult){
            vm.motorPremiumChartData = premiumDataResult[0];
            vm.motorPremiumChartOption = getChartOptions(premiumDataResult[0]);
            vm.lifePremiumChartData = premiumDataResult[1];
            vm.lifePremiumChartOption = getChartOptions(premiumDataResult[1]);
            vm.healthPremiumChartData = premiumDataResult[2];
            vm.healthPremiumChartOption = getChartOptions(premiumDataResult[2]);
        };

        vm.performancePeriod = 'week';
        vm.changePeriod = changePeriod;

        activate();

        function activate() {
            var queries = [loadData()];
            $q.all(queries);
        }

        function loadData() {
            if(vm.performancePeriod==='week'){
                vm.dataLoading=true;
                var promise = premiumService.getWeeklyPremium();
                promise.then(
                function(response) { 
                    vm.dataLoading=false;
                    setIndividualPremiumCharts(response.data.result);
                });
            }
            else{
                vm.dataLoading=true;
                var promise = premiumService.getMonthlyPremium();
                promise.then(
                function(response) { 
                    vm.dataLoading=false;
                    setIndividualPremiumCharts(response.data.result);
                });
            }
        }

        function changePeriod() {
            loadData();
        }
    }
})();
