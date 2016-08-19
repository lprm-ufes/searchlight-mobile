// Generated by CoffeeScript 1.10.0
(function() {
  var $$, MyApp, PARAMETROS_GET, getParams, goPageInAnotherView;

  MyApp = {};

  MyApp.config = {};

  MyApp.angular = angular.module('SearchlightApp', ['ngStorage']);

  $$ = Dom7;

  MyApp.fw7 = {
    app: new Framework7({
      animateNavBackIcon: true
    }),
    options: '',
    views: []
  };

  goPageInAnotherView = function(viewSelector, pageSelector) {
    $$(viewSelector)[0].f7View.router.loadPage(pageSelector);
    $$('.view').hide();
    return $$(viewSelector).show();
  };

  getParams = function() {
    var j, key, len, params, query, raw_vars, ref, v, val;
    query = window.location.search.substring(1);
    raw_vars = query.split("&");
    params = {};
    for (j = 0, len = raw_vars.length; j < len; j++) {
      v = raw_vars[j];
      ref = v.split("="), key = ref[0], val = ref[1];
      params[key] = decodeURIComponent(val);
    }
    return params;
  };

  PARAMETROS_GET = getParams();

  MyApp.angular.factory('InitService', [
    '$document', function($document) {
      var eventListeners, onReady, pub;
      onReady = function() {
        var fw7, i, pagina;
        fw7 = MyApp.fw7;
        i = void 0;
        pagina = $('body').data('pagina');
        if (pagina === 'logged') {
          MyApp.tab1 = fw7.app.addView('#tab1', fw7.options);
          MyApp.tab2 = fw7.app.addView('#tab2', fw7.options);
          MyApp.tab3 = fw7.app.addView('#tab3', fw7.options);
          fw7.views.push(MyApp.tab1);
          fw7.views.push(MyApp.tab2);
          fw7.views.push(MyApp.tab3);
          fw7.app.showTab("#tab1");
          console.log('logged page');
        } else {
          console.log('index page');
          MyApp.viewBase = fw7.app.addView('.view-base', fw7.options);
          fw7.views.push(MyApp.viewBase);
        }
        i = 0;
        while (i < eventListeners.ready.length) {
          eventListeners.ready[i]();
          i = i + 1;
        }
      };
      'use strict';
      pub = {};
      eventListeners = {
        'ready': []
      };
      pub.addEventListener = function(eventName, listener) {
        eventListeners[eventName].push(listener);
      };
      (function() {
        $document.ready(function() {
          if (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
            console.log('Using Cordova/PhoneGap setting');
            document.addEventListener('deviceready', onReady, false);
            pub.runOnApp = true;
          } else {
            console.log('Using web browser setting');
            pub.runOnApp = false;
            onReady();
          }
        });
      })();
      return pub;
    }
  ]);

  MyApp.angular.factory('SearchlightService', [
    'InitService', '$localStorage', function(InitService, storage) {
      'use strict';
      var eventListeners, onApiFail, onApiReady, pub;
      pub = {};
      eventListeners = {
        'ready': []
      };
      pub.addEventListener = function(eventName, listener) {
        eventListeners[eventName].push(listener);
      };
      pub.trocarServico = function() {
        pub.api.user.logout();
        pub.setUrlConfServico(null);
        return $.mobile.changePage("#pgservico", {
          changeHash: false
        });
      };
      pub.vincularServico = function() {
        var url;
        if (InitService.runOnApp) {
          return cordova.plugins.barcodeScanner.scan(function(result) {
            return pub.loadServico(result.text);
          }, function(error) {
            return alert("Falha na leitura do código QR: " + error);
          });
        } else {
          url = prompt('Informe a url do mashup');
          if (url !== null) {
            if (url) {
              return pub.loadServico(url);
            } else {
              return alert('Informe uma url de serviço válida!');
            }
          }
        }
      };
      pub.getUrlConfServico = function() {
        if (PARAMETROS_GET.mashup) {
          pub.setUrlConfServico(PARAMETROS_GET.mashup);
        } else {
          pub.urlConfServico = storage.urlConfServico;
        }
        return pub.urlConfServico;
      };
      pub.setUrlConfServico = function(url) {
        pub.urlConfServico = url;
        if (url) {
          return storage.urlConfServico = pub.urlConfServico;
        } else {
          return delete storage.urlConfServico;
        }
      };
      onApiReady = function() {
        var i, results;
        i = 0;
        results = [];
        while (i < eventListeners.ready.length) {
          eventListeners.ready[i]();
          results.push(i = i + 1);
        }
        return results;
      };
      onApiFail = function(err) {
        return console.log(err);
      };
      pub.loadServico = function(urlConfServico) {
        console.log(urlConfServico);
        pub.setUrlConfServico(urlConfServico);
        pub.api = new SLSAPI({
          urlConfServico: pub.urlConfServico
        });
        MyApp.fw7.app.showPreloader('Carregando Serviço');
        pub.api.on(SLSAPI.Config.EVENT_READY, onApiReady);
        pub.api.on(SLSAPI.Config.EVENT_FAIL, onApiFail);
      };
      return pub;
    }
  ]);

  MyApp.angular.controller('AcoesPageController', [
    '$scope', '$http', 'InitService', function($scope, $http, InitService) {
      'use strict';
      InitService.addEventListener('ready', function() {
        console.log('AcoesPageController: ok, DOM ready');
      });
    }
  ]);

  MyApp.angular.controller('DetailPageController', [
    '$scope', '$http', 'InitService', function($scope, $http, InitService) {
      'use strict';
      InitService.addEventListener('ready', function() {
        console.log('DetailPageController: ok, DOM ready');
      });
    }
  ]);

  MyApp.angular.controller('UserController', [
    '$window', '$scope', '$http', 'SearchlightService', function($window, $scope, $http, SLS) {
      'use strict';
      var bindLoginEvents, load, loadPermissions, loading, mostraLoading, onLoginFail, onLoginSuccess, onSearchlightReady, submitLogin;
      submitLogin = function(e) {
        var p, u;
        u = $$("#username").val();
        p = $$("#password").val();
        if (u && p) {
          $$("#submitButton").attr("disabled", "disabled");
        } else {
          alert('Forneça um usuario e uma senha para autenticação');
        }
        SLS.api.user.login(u, p);
        return false;
      };
      bindLoginEvents = function() {
        SLS.api.on(SLSAPI.User.EVENT_LOGIN_START, mostraLoading);
        SLS.api.on(SLSAPI.User.EVENT_LOGIN_FAIL, onLoginFail);
        SLS.api.on(SLSAPI.User.EVENT_LOGIN_SUCCESS, onLoginSuccess);
        return $$("#loginForm").on("submit", function(e) {
          return submitLogin(e);
        });
      };
      mostraLoading = function() {
        var loading;
        loading = true;
        return MyApp.fw7.app.showPreloader('Enviando');
      };
      loadPermissions = function() {
        $scope.data = SLS.api.user.user_data;
        $scope.isRoot = $scope.data.isRoot;
        return $scope.isAdmin = $scope.data.isAdmin;
      };
      load = function() {
        var loading;
        loading = false;
        if (SLS.api.user.isLogged()) {
          loadPermissions();
          $window.location.href = './logged.html';
          return console.log('tentei');
        } else {
          bindLoginEvents();
          return MyApp.viewBase.router.loadPage("#loginPage");
        }
      };
      onLoginFail = function(err) {
        $.mobile.loading('hide');
        $("#submitButton").removeAttr("disabled");
        if (err.response.body.error) {
          return alert(err.response.body.error);
        } else {
          return this.problemarede();
        }
      };
      onLoginSuccess = function() {
        MyApp.fw7.app.hidePreloader();
        $("#submitButton").removeAttr("disabled");
        return load();
      };
      onSearchlightReady = function() {
        console.log('LoginPageController: ok, SearchlightService carregou api corretamente');
        load();
      };
      loading = true;
      SLS.addEventListener('ready', onSearchlightReady);
      console.log('User controller');
    }
  ]);

  MyApp.angular.controller('StartupController', [
    '$scope', 'InitService', 'SearchlightService', function($scope, InitService, SLS) {
      'use strict';
      $scope.vincularServico = SLS.vincularServico;
      InitService.addEventListener('ready', function() {
        console.log('StartupController: ok, DOM ready');
        if (SLS.getUrlConfServico()) {
          SLS.loadServico(SLS.urlConfServico);
        } else {
          MyApp.viewBase.router.loadPage("#escolheServico");
        }
      });
    }
  ]);

}).call(this);
