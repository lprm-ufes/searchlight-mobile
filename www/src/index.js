(function() {
  window.zeroPad = function(num, places) {
    var zero;
    zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  };

  window.isInteger = function(value) {
    var intRegex;
    intRegex = /^\d+$/;
    return intRegex.test(value);
  };

  window.getIntVazio = function(value) {
    if (value) {
      return parseInt(value);
    } else {
      return "";
    }
  };

  if (!window.console) {
    window.console = {
      log: function() {}
    };
  }

  Storage.prototype.setObject = function(key, value) {
    return this.setItem(key, JSON.stringify(value));
  };

  Storage.prototype.getObject = function(key) {
    var value;
    value = this.getItem(key);
    return value && JSON.parse(value);
  };

  window.str2datePT = function(data) {
    return new Date(parseInt(data.slice(-4)), parseInt(data.slice(3, 5)) - 1, parseInt(data.slice(0, 2))).getTime();
  };

  window.formatadata = function(data) {
    return zeroPad(data.getDate(), 2) + "/" + zeroPad(parseInt(data.getMonth()) + 1, 2) + '/' + data.getFullYear();
  };

  window.formatahora = function(data) {
    return zeroPad(data.getHours(), 2) + ":" + zeroPad(data.getMinutes(), 2) + ':' + zeroPad(data.getSeconds(), 2);
  };

  window.App = (function() {
    function App() {
      this.storage = window.localStorage;
      this.userview = null;
      this.bindEvents();
    }

    App.prototype.bindEvents = function() {
      return document.addEventListener('deviceready', this.onDeviceReady, false);
    };

    App.prototype.onDeviceReady = function() {
      return app.main();
    };

    App.prototype.mostraHistorico = function() {
      return atividadesview.sincronizar();
    };

    App.prototype.positionSucess = function(gps) {
      return this.userview.load();
    };

    App.prototype.positionError = function(error) {
      return alert('Não foi possível obter sua localização. Verifique as configurações do seu smartphone.');
    };

    App.prototype.main = function() {
      console.log('Received Event: onDeviceReady');
      window.userview = new UserView();
      userview.load();
      return window.gpscontrole = new GPSControle();
    };

    return App;

  })();

  window.ativtest = [
    {
      gerencia: "RBC/ENE/JS",
      local: "EDMA",
      id: "1",
      usuario: "fabricia",
      data: "16/10/2014",
      h_inicio: "07:00",
      h_fim: "07:30",
      tipo: Atividade.TIPO_AULA
    }, {
      gerencia: "RBC/ENE/JS",
      local: "EDMA",
      id: "2",
      usuario: "fabricia",
      data: "16/11/2014",
      h_inicio: "08:00",
      h_fim: "08:30",
      tipo: Atividade.TIPO_AULA
    }, {
      gerencia: "RBC/ENE/JS",
      local: "EDMA",
      id: "3",
      usuario: "fabricia",
      data: "16/11/2014",
      h_inicio: "09:00",
      h_fim: "09:30",
      tipo: Atividade.TIPO_AULA
    }, {
      gerencia: "RBC/ENE/JS",
      local: "EDMA",
      id: "4",
      usuario: "fabricia",
      data: "22/10/2014",
      h_inicio: "07:00",
      h_fim: "07:30",
      tipo: Atividade.TIPO_AULA
    }, {
      gerencia: "RBC/ENE/JS",
      local: "EDMA",
      id: "5",
      usuario: "fabricia",
      data: "22/10/2014",
      h_inicio: "08:00",
      h_fim: "08:30",
      tipo: Atividade.TIPO_AULA
    }, {
      gerencia: "RBC/ENE/JS",
      local: "EDMA",
      id: "6",
      usuario: "fabricia",
      data: "19/10/2014",
      h_inicio: "09:00",
      h_fim: "09:30",
      tipo: Atividade.TIPO_AULA
    }, {
      gerencia: "RBC/ENE/JS",
      local: "EDMA",
      id: "7",
      usuario: "fabricia",
      data: "21/10/2014",
      h_inicio: "20:00",
      h_fim: "07:30",
      tipo: Atividade.TIPO_AULA
    }, {
      gerencia: "RBC/ENE/JS",
      local: "EDMA",
      id: "8",
      usuario: "fabricia",
      data: "21/10/2014",
      h_inicio: "21:00",
      h_fim: "07:30",
      tipo: Atividade.TIPO_AULA
    }
  ];

}).call(this);
