'use strict';

angular.module('bnePaymentsOldFashionedApp')
	.controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {

		$scope.hoursCombo = [
			{name: '1'},
			{name: '2'},
			{name: '3'},
			{name: '4'},
			{name: '5'},
			{name: '6'},
			{name: '7'},
			{name: '8'},
			{name: '9'},
			{name: '10'},
			{name: '11'},
			{name: '12'},
			{name: '14'},
			{name: '15'},
			{name: '16'},
			{name: '17'},
			{name: '18'},
			{name: '19'},
			{name: '20'},
			{name: '21'},
			{name: '22'},
			{name: '23'},
			{name: '24'}
		];

    $scope.minutesCombo = [
      {name: '00'},
      {name: '01'},
      {name: '02'},
      {name: '03'},
      {name: '04'},
      {name: '05'},
      {name: '06'},
      {name: '07'},
      {name: '08'},
      {name: '09'},
      {name: '10'},
      {name: '11'},
      {name: '12'},
      {name: '13'},
      {name: '14'},
      {name: '15'},
      {name: '16'},
      {name: '17'},
      {name: '18'},
      {name: '19'},
      {name: '20'},
      {name: '21'},
      {name: '22'},
      {name: '23'},
      {name: '24'},
      {name: '25'},
      {name: '26'},
      {name: '27'},
      {name: '28'},
      {name: '29'},
      {name: '30'},
      {name: '31'},
      {name: '32'},
      {name: '33'},
      {name: '34'},
      {name: '35'},
      {name: '36'},
      {name: '37'},
      {name: '38'},
      {name: '39'},
      {name: '40'},
      {name: '41'},
      {name: '42'},
      {name: '43'},
      {name: '44'},
      {name: '45'},
      {name: '46'},
      {name: '47'},
      {name: '48'},
      {name: '49'},
      {name: '50'},
      {name: '51'},
      {name: '52'},
      {name: '53'},
      {name: '54'},
      {name: '55'},
      {name: '56'},
      {name: '57'},
      {name: '58'},
      {name: '59'}
    ];
    $scope.interbankPayments = [];
		$scope.thirdpayingAccounts = [];

		$scope.maxAmount = 10000.0;

    $scope.ownDefaultData = [];
    $scope.thirdDefaultData = [];

    $http.get("http://projects.anzen.com.mx:4567/api/accounts?group=true&query=", {}).
      success(function(responseData, status, headers, config) {
      $scope.ownDefaultData = responseData;
    }).
      error(function(data, status, headers, config) {
      console.log("error");
    });

    $http.get("http://projects.anzen.com.mx:4567/api/thirdaccounts?query=", {}).
      success(function(responseData, status, headers, config) {
      $scope.thirdDefaultData = responseData;
    }).
      error(function(data, status, headers, config) {
      console.log("error");
    });

    $scope.showAccounts = true;

		$scope.getCurrentDate = function () {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			if(dd<10) {
				dd='0'+dd
			}

			if(mm<10) {
				mm='0'+mm
			}

			today = dd+'/'+mm+'/'+yyyy;

			return today;
		};

    $scope.getCurrentTime = function () {
			var today = new Date();

      var hours = today.getHours();
      var minutes = today.getMinutes();

      return hours + ":" + minutes;
    };

		$scope.addPayment = function (payments) {
			if(payments.payingAccounts.length >= 15) return;

			var firstPayment = {
				target: undefined,
        application: 'Mismo día',
				date: $scope.getCurrentDate()
			}

			payments.payingAccounts.push(firstPayment);
		};

    $scope.addTemplate = function () {
			if($scope.interbankPayments.length >= 5) return;

      var template = {
        payingAccounts: []
      }

      $scope.interbankPayments.push(template);

      for(var i = 0; i < 5; i++) {
        $scope.addPayment(template);
      }
    };

    $scope.addPayments = function (payments) {
      for(var i = 0; i < payments.depositAccountNumber; i++) {
        $scope.addPayment(payments);
      }
      payments.depositAccountNumber = "";
    };

		$scope.addThirdPayment = function () {
			if($scope.thirdpayingAccounts.length >= 15) return;

			var firstPayment = {
        enabled: false,
        fiscal: false
			}

			$scope.thirdpayingAccounts.push(firstPayment);
		};

    $scope.addMoreThirdPayments = function () {
      //for(var i = 0; i < 5; i++) {
      $scope.addThirdPayment();
      //}
    };
    // setup

    $scope.setup = function () {
      $scope.interbankPayments = [];
      $scope.thirdpayingAccounts = [];
      //$scope.addTemplate();
      $scope.addMoreThirdPayments();
      $scope.collapseOne = false;
      $scope.collapseTwo = false;
      $scope.collapseThree = false;
      $scope.collapseFour = false;
      $scope.allowNext = false;
    };

    $scope.setup();

		$scope.getPayingAccountIndex = function(payingAccounts, accountId) {
			for(var i = 0; i < payingAccounts.length; i++) {
				if(payingAccounts[i].id === accountId) {
					return i;
				}
			}

			return -1;
		};

		$scope.removePayingAccount = function(intIndex, index) {
      var payingAccounts = $scope.interbankPayments[intIndex].payingAccounts;

			if(index != -1) {
				payingAccounts.splice(index, 1);
			}

		};

		$scope.btn_openclose = function( btn ) {
			console.log( $(btn) );
			if( $(btn).find('span').html() == '+' ){
				$(btn).find('span').html('-');
			}else{
				$(btn).find('span').html('+');
			}
		};

		$scope.show_tltp = function( elemento , boton ) {
			var izq = ($(boton).offset().left)-($(elemento).width()/2)+9;
			var arriba = $(boton).offset().top;
			console.log(izq);
			$( elemento ).css({
				'left': izq,
				'top': arriba
			}).show();
		};
		$scope.hide_tltp = function( elemento ) {
			$( elemento ).hide();
		};

    $scope.getTotalPayment = function (payments) {
      var sum = 0;
      for(var i = 0; i < payments.payingAccounts.length; i++) {
        var elem = payments.payingAccounts[i].amount;
        if(elem && parseFloat(elem)) {
          sum += parseFloat(elem);
        }
      }

      return sum;
    };


    $("#sortable").sortable();
		$( "input.calendar" ).datepicker({
			buttonImage: "/images/ico-calendar.png",
      		buttonImageOnly: true
		});


    var emptyThird = angular.toJson($scope.thirdpayingAccounts);
    var emptyInterbank = angular.toJson($scope.interbankPayments);

    $scope.$watch('interbankPayments', function (value) {
      if(emptyInterbank !== angular.toJson($scope.interbankPayments)) {
        $scope.allowNext = true;
      }
    }, true);

    $scope.$watch('thirdpayingAccounts', function (value) {
      if(emptyThird !== angular.toJson($scope.thirdpayingAccounts)) {
        $scope.allowNext = true;
      }
    }, true);

    $scope.verifyThirdMode = function (payment, selection) {
      if(selection === 'programming' && payment.remote) {
        payment.remote = false;
        payment.remoteDate = '';
        payment.hoursRemote = 'hh';
        payment.minutesRemote = 'mm';
      }
      if(selection === 'remote' && payment.programming) {
        payment.programming = false;
        payment.date = '';
        payment.hours = 'hh';
        payment.minutes = 'mm';
      }
    };

    $scope.selectAll = false;

    $scope.selectAllThird = function () {
      $scope.selectAll = !$scope.selectAll;
      for(var i = 0; i < $scope.thirdpayingAccounts.length; i++) {
        $scope.thirdpayingAccounts[i].enabled = $scope.selectAll;
      }
    };

    $scope.validateInterbankPayment = function (payment) {
      if(payment.target && payment.amount)
        return true;
      return false;
    };

    $scope.validateThirdPayment = function (payment) {
      return payment.enabled;
    };

    $scope.acceptApplied = function () {
      $scope.applied = false;
      $scope.showAccounts = true;
      $scope.setup();
    };

    $scope.fiscalVerify = function (payment) {
      if(payment.fiscal) {
        payment.iva = (payment.amount * 0.16).toFixed(2);
      }
    };

    $scope.getAppliedDate = function (payment) {
      var date = $scope.getCurrentDate() + " " + $scope.getCurrentTime() + " hrs";
      if(payment.date && payment.hours && payment.minutes) {
        date = payment.date + " " + payment.hours.name + ":" + payment.minutes.name + " hrs";
      }
      if(payment.remoteDate && payment.hours && payment.minutes) {
        date = payment.remoteDate + " " + payment.hours.name + ":" + payment.minutes.name + " hrs";
      }

      payment.appliedDate = date;

      return date;
    };

    $scope.thirdResume = function (payment) {
      var column1 = [];
      var column2 = [];

      var date = $scope.getCurrentDate() + " " + $scope.getCurrentTime() + " hrs";
      if(payment.date) {
        date = payment.date + " " + payment.hours.name + ":" + payment.minutes.name + " hrs";
      }
      if(payment.remoteDate) {
        date = payment.remoteDate + " " + payment.hours.name + ":" + payment.minutes.name + " hrs";
      }

      var c2r1 = {
        name: 'Fecha / Hora de aplicación:',
        data: date
      }

      column2.push(c2r1);

      if(payment.rfc) {
        var c2r2 = {
          name: 'RFC:',
          data: payment.rfc
        }

        column2.push(c2r2);
      }

      if(payment.iva) {
        var c2r3 = {
          name: 'IVA:',
          data: payment.iva
        }

        column2.push(c2r2);
      }

      if(payment.options) {
        if(payment.concentradora) {
          var c1r = {
            name: 'Cuenta concentradora:',
            data: 'Si'
          }

          column1.push(c1r);
        }

        if(payment.references && payment.numeric) {
          var c1r = {
            name: 'Referencia numérica:',
            data: payment.numeric
          }

          column1.push(c1r);
        }

        if(payment.references && payment.alpha) {
          var c1r = {
            name: 'Referencia alfanumérica:',
            data: payment.alpha
          }

          column1.push(c1r);
        }

        if(payment.references && payment.concept) {
          var c1r = {
            name: 'Concepto del pago:',
            data: payment.concept
          }

          column1.push(c1r);
        }
      }

      if(column1.length > column2.length) {
        var size = column1.length - column2.length;
        for(var i = 0; i < size; i++) {
          column2.push({name: '', data: ''});
        }
      }

      if(column2.length > column1.length) {
        var size = column2.length - column1.length;
        for(var i = 0; i < size; i++) {
          column1.push({name: '', data: ''});
        }
      }

      var rows = [];

      for(var i = 0; i < column1.length; i++) {
        rows.push([{name:column1[i].name}, {name:column1[i].data}, {name:column2[i].name}, {name:column2[i].data}]);
      }

      console.log(rows);
      return rows;
    };

    $scope.test = function () {
      console.log("test");
    };
	}]);
