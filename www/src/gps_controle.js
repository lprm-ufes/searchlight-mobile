(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.GPSControle = (function() {
    GPSControle.gps = null;

    GPSControle.time = 0;

    GPSControle.accuracy = 1000;

    GPSControle.estaAberto = function() {
      var gpsdata;
      gpsdata = window.localStorage.getItem('gps_data');
      if (gpsdata) {
        return true;
      } else {
        return false;
      }
    };

    function GPSControle() {
      this.iniciaWatch = __bind(this.iniciaWatch, this);
      this.storage = window.localStorage;
      GPSControle.accuracy = 1000;
      this.load();
      this.iniciaWatch();
      this.mostraGPS();
    }

    GPSControle.prototype.mostraGPS = function() {
      return $("#barrastatus p.gps").html(GPSControle.gps + "<br>(" + parseInt(GPSControle.accuracy) + " metros)");
    };

    GPSControle.prototype.load = function() {
      if (GPSControle.estaAberto()) {
        GPSControle.gps = this.storage.getItem('gps_data');
        GPSControle.accuracy = this.storage.getItem('gps_accuracy');
        GPSControle.time = this.storage.getItem('gps_time');
        this.mostraGPS();
        return true;
      } else {
        return null;
      }
    };

    GPSControle.prototype.save = function() {
      this.storage.setItem('gps_data', GPSControle.gps);
      this.storage.setItem('gps_time', GPSControle.time);
      return this.storage.setItem('gps_accuracy', GPSControle.accuracy);
    };

    GPSControle.prototype.iniciaWatch = function() {
      return this.watchid = navigator.geolocation.watchPosition((function(_this) {
        return function(position) {
          return _this.watchSucess(position);
        };
      })(this), (function(_this) {
        return function(error) {
          return _this.watchError(error);
        };
      })(this), {
        enableHighAccuracy: true,
        timeout: 1 * 60 * 1000
      });
    };

    GPSControle.prototype.watchSucess = function(position) {
      var timeout;
      $("#barrastatus p.hora").html(formatahora(new Date()).slice(0, 5) + "h");
      timeout = (new Date()).getTime() - GPSControle.time;
      if ((timeout > 600000) || ((GPSControle.accuracy - position.coords.accuracy) > 2)) {
        GPSControle.gps = position.coords.latitude + ", " + position.coords.longitude;
        GPSControle.accuracy = position.coords.accuracy;
        GPSControle.time = (new Date()).getTime();
        console.log("latlong: " + GPSControle.gps + " accuracy:" + position.coords.accuracy);
        this.mostraGPS();
        return this.save();
      }
    };

    GPSControle.prototype.watchError = function(error) {
      if (error.code === error.PERMISSION_DENIED) {
        alert("Para que o sistema funcione por favor ative o GPS do seu telefone");
      }
      if (error.code === error.POSITION_UNAVAILABLE) {
        alert("Não estou conseguindo obter uma posição do GPS, verifique se sua conexão GPS está ativa");
      }
      if (error.code === error.TIMEOUT) {
        return console.log('timeout gps: ' + error.message);
      }
    };

    return GPSControle;

  })();

}).call(this);
