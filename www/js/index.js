(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GPSControle, ListView, NoteAdd;

NoteAdd = require('./noteadd.coffee').NoteAdd;

ListView = require('./listView.coffee').ListView;

GPSControle = require('./gps_controle.coffee').GPSControle;

window.Anotacoes = (function() {
  function Anotacoes(slsapi) {
    this.slsapi = slsapi;
  }

  Anotacoes.prototype.anotar = function(categoria) {
    return Anotacoes.noteadd = new NoteAdd(categoria, this.slsapi);
  };

  Anotacoes.prototype.anexar = function(note) {
    return Anotacoes.noteadd = new NoteAdd(null, this.slsapi, true, note);
  };

  Anotacoes.prototype.listar = function() {
    return Anotacoes.listview = new ListView(this.slsapi);
  };

  Anotacoes.prototype.deletar = function(note) {
    if (confirm('Deseja apagar esta anotação?')) {
      return this.slsapi.notes.getByQuery("hashid=" + note.hashid, (function(_this) {
        return function(notes) {
          return _this.slsapi.notes["delete"](notes[0].id, function() {
            return _this.listar();
          });
        };
      })(this), function() {
        return alert('erro ao deletar nota');
      });
    }
  };

  return Anotacoes;

})();

exports.Anotacoes = Anotacoes;



},{"./gps_controle.coffee":2,"./listView.coffee":4,"./noteadd.coffee":6}],2:[function(require,module,exports){
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

window.GPSControle = (function() {
  GPSControle.gps = null;

  GPSControle.time = 0;

  GPSControle.accuracy = 1000;

  GPSControle.TIMEOUT = 10;

  GPSControle.HighAccuracy = true;

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
    this.iniciaWatch = bind(this.iniciaWatch, this);
    this.storage = window.localStorage;
    GPSControle.accuracy = 1000;
    this.load();
    this.iniciaWatch();
    this.mostraGPS();
    $(document).on("pageinit", "#pgperfil", function() {
      return $("#pgperfiltimeout").on('slidestop', function(event) {
        GPSControle.TIMEOUT = parseInt($('#pgperfiltimeout').val());
        return console.log("Novo timeout GPS: " + GPSControle.TIMEOUT);
      });
    });
  }

  GPSControle.prototype.mostraGPS = function() {
    $("#pganotar-gps").html(GPSControle.gps);
    return $("#pganotar-gps-accuracy").html(" (" + (parseInt(GPSControle.accuracy)) + " m)");
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
      enableHighAccuracy: GPSControle.HighAccuracy,
      timeout: 1 * 60 * 1000
    });
  };

  GPSControle.prototype.watchSucess = function(position) {
    var timeout;
    $("#barrastatus p.hora").html(formatahora(new Date()).slice(0, 5) + "h");
    timeout = (new Date()).getTime() - GPSControle.time;
    if ((timeout > GPSControle.TIMEOUT * 1000) || (GPSControle.accuracy > parseInt(position.coords.accuracy))) {
      GPSControle.gps = position.coords.latitude + ", " + position.coords.longitude;
      GPSControle.lat = position.coords.latitude;
      GPSControle.lng = position.coords.longitude;
      GPSControle.accuracy = parseInt(position.coords.accuracy);
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

exports.GPSControle = GPSControle;



},{}],3:[function(require,module,exports){
var GPSControle, UserView, utils;

utils = require('./utils.coffee');

UserView = require('./userView.coffee').UserView;

GPSControle = require('./gps_controle.coffee').GPSControle;

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

  App.prototype.main = function() {
    console.log('Received Event: onDeviceReady');
    if (this.getUrlConfServico()) {
      return this.loadServico(this.urlConfServico);
    } else {
      return $.mobile.changePage("#pgservico", {
        changeHash: false
      });
    }
  };

  App.prototype.trocarServico = function() {
    userview.slsapi.user.logout();
    this.setUrlConfServico(null);
    return $.mobile.changePage("#pgservico", {
      changeHash: false
    });
  };

  App.prototype.vincularServico = function() {
    var self;
    self = this;
    return cordova.plugins.barcodeScanner.scan(function(result) {
      return self.loadServico(result.text);
    }, function(error) {
      return alert("Falha na leitura do código QR: " + error);
    });
  };

  App.prototype.getUrlConfServico = function() {
    this.urlConfServico = this.storage.getItem('urlConfServico');
    return this.urlConfServico;
  };

  App.prototype.setUrlConfServico = function(url) {
    this.urlConfServico = url;
    if (url) {
      return this.storage.setItem('urlConfServico', this.urlConfServico);
    } else {
      return this.storage.removeItem('urlConfServico');
    }
  };

  App.prototype.loadServico = function(urlConfServico) {
    this.setUrlConfServico(urlConfServico);
    window.userview = new UserView(urlConfServico);
    userview.load();
    return window.gpscontrole = new GPSControle();
  };

  return App;

})();



},{"./gps_controle.coffee":2,"./userView.coffee":7,"./utils.coffee":8}],4:[function(require,module,exports){
var NoteView;

NoteView = require('./noteView.coffee').NoteView;

window.ListView = (function() {
  ListView.dataPool = null;

  ListView.noteView = null;

  function ListView(slsapi) {
    this.slsapi = slsapi;
    $.mobile.changePage("#pghistorico", {
      changeHash: false
    });
    ListView.dataPool = SLSAPI.dataPool.createDataPool(this.slsapi.mashup);
    $("#notasnav a").off('click');
    $("#notasnav a").on('click', function() {
      var ul_id;
      ul_id = $(this).data('ul-id');
      $("#notasnav a").removeClass('ui-state-persist');
      $(this).addClass('ui-state-persist');
      $('#divulcoletadas,#divulfornecidas').hide();
      return $("#" + ul_id).show();
    });
    this.loadData();
  }

  ListView.prototype.loadData = function() {
    var position, storageNotebookId;
    position = {
      latitude: GPSControle.lat,
      longitude: GPSControle.lng,
      distance: 10000
    };
    ListView.dataPool.loadAllData('', position);
    storageNotebookId = this.slsapi.notes.storageNotebook.id;
    ListView.storageNotebookId = storageNotebookId;
    this.slsapi.off(SLSAPI.dataPool.DataPool.EVENT_LOAD_STOP);
    return this.slsapi.on(SLSAPI.dataPool.DataPool.EVENT_LOAD_STOP, function(datapool) {
      var distance, ds, html, htmlc, i, img, j, k, len, len1, len2, li, n, note, ref, ref1, v;
      html = '';
      htmlc = '';
      $('#ulfornecidas,#ulcoletadas').empty();
      ref = datapool.dataSources;
      for (i = 0, len = ref.length; i < len; i++) {
        ds = ref[i];
        v = [];
        ref1 = ds.notes;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          note = ref1[j];
          distance = getDistanceFromLatLonInKm(parseFloat(position.latitude), parseFloat(position.longitude), note.geo.coordinates[1], note.geo.coordinates[0]);
          v.push([distance, note]);
        }
        v.sort(function(a, b) {
          return a[0] - b[0];
        });
        for (k = 0, len2 = v.length; k < len2; k++) {
          n = v[k];
          distance = n[0], note = n[1];
          img = '';
          if (note.fotoURL) {
            img = "<img width='100px' height='100px' src='" + note.fotoURL + "' />";
          }
          if (ds.url.indexOf(storageNotebookId) > 0) {
            li = "<li><a href='javascript:ListView.selecionar(\"" + note.hashid + "\")'>" + img + "<p>" + (note.texto || note.comentarios) + "</p><p class='ul-li-aside'>" + (formatDistance(distance)) + "</p></a></li>";
            htmlc = htmlc + " " + li;
          } else {
            li = "<li><a href='javascript:ListView.selecionar(\"" + note.hashid + "\")'>" + img + "<p>" + (note.texto || note.comentarios) + "</p><p>" + (formatDistance(distance)) + "</p></a></li>";
            html = html + " " + li;
          }
        }
      }
      $('#ulfornecidas').html(html);
      $('#ulcoletadas').html(htmlc);
      $('#ulfornecidas,#ulcoletadas').listview().listview('refresh');
      $('#divulcoletadas,#divulfornecidas').hide();
      return $("#notasnav a.coletadas").click();
    });
  };

  ListView.selecionar = function(hashid) {
    var note;
    note = ListView.getNoteByHashid(hashid);
    return ListView.noteView = new NoteView(note);
  };

  ListView.getNoteByHashid = function(hashid) {
    var ds, i, j, len, len1, n, ref, ref1;
    ref = ListView.dataPool.dataSources;
    for (i = 0, len = ref.length; i < len; i++) {
      ds = ref[i];
      ref1 = ds.notes;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        n = ref1[j];
        if (n.hashid && n.hashid === hashid) {
          return n;
        }
      }
    }
    return null;
  };

  return ListView;

})();

module.exports = {
  ListView: window.ListView
};



},{"./noteView.coffee":5}],5:[function(require,module,exports){
var NoteView;

NoteView = (function() {
  NoteView.mapa = null;

  NoteView.criaMapa = function(note) {
    var marker, pos;
    pos = L.latLng(note.latitude, note.longitude);
    NoteView.mapa = L.map('mapa', {
      minZoom: 15,
      maxZoom: 17
    });
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/rezo.ihpe97f0/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(NoteView.mapa);
    marker = L.marker(pos);
    marker.addTo(NoteView.mapa);
    NoteView.mapa.setView(pos, 16);
    NoteView.mapa.invalidateSize(false);
    return NoteView.mapa;
  };

  NoteView.getFilhos = function(note) {
    var ds, f, filhos, i, len, ref;
    filhos = [];
    ref = ListView.dataPool.dataSources;
    for (i = 0, len = ref.length; i < len; i++) {
      ds = ref[i];
      f = ds.notesChildren[note.hashid];
      if (f) {
        filhos = filhos.concat(f);
      }
    }
    return filhos;
  };

  function NoteView(note1) {
    this.note = note1;
    $.mobile.changePage("#pgnoteview", {
      changeHash: false
    });
    if (NoteView.mapa) {
      NoteView.mapa.remove();
    }
    this.mapa = NoteView.criaMapa(this.note);
    setTimeout(function() {
      return NoteView.mapa.invalidateSize(false);
    }, 1000);
    $('#pgnoteview p.comentarios').html(this.note.comentarios || this.note.texto);
    $('#pgnoteview p.categoria').html(this.note.cat || this.note.user.username);
    $('#pgnoteview a.btn-adicionar-nota').off('click');
    $('#pgnoteview a.btn-adicionar-nota').on('click', (function(_this) {
      return function() {
        return anotacoesview.anexar(_this.note);
      };
    })(this));
    $('#pgnoteview a.btn-deletar-nota').off('click');
    $('#pgnoteview a.btn-deletar-nota').on('click', (function(_this) {
      return function() {
        return anotacoesview.deletar(_this.note);
      };
    })(this));
    if (this.note.notebook && this.note.notebook === ListView.storageNotebookId) {
      $('#pgnoteview a.btn-deletar-nota').show();
      $('#pgnoteview a.btn-adicionar-nota').hide();
    } else {
      $('#pgnoteview a.btn-deletar-nota').hide();
      $('#pgnoteview a.btn-adicionar-nota').show();
    }
    this.listaFilhos();
  }

  NoteView.prototype.listaFilhos = function() {
    var fi, html, i, img, len, li, note;
    $('#ulfilhos').empty();
    html = '';
    fi = NoteView.getFilhos(this.note);
    console.log(fi);
    for (i = 0, len = fi.length; i < len; i++) {
      note = fi[i];
      img = '';
      if (note.fotoURL) {
        img = "<img width='100px' height='100px' src='" + note.fotoURL + "' />";
      }
      li = "<li><a href='javascript:ListView.selecionar(\"" + note.hashid + "\")'>" + img + "<p>" + (note.texto || note.comentarios) + "</p></a></li>";
      html = html + " " + li;
    }
    $('#ulfilhos').html(html);
    return $('#ulfilhos').listview().listview('refresh');
  };

  return NoteView;

})();

module.exports = {
  NoteView: NoteView
};



},{}],6:[function(require,module,exports){
var GPSControle, NoteAdd;

GPSControle = require('./gps_controle.coffee').GPSControle;

NoteAdd = (function() {
  function NoteAdd(categoria, slsapi, anexar, note) {
    if (anexar == null) {
      anexar = false;
    }
    if (note == null) {
      note = null;
    }
    this.slsapi = slsapi;
    if (anexar) {
      this.parentId = note.hashid;
    }
    $('#pganotar p.nota-relacionada').hide();
    if (categoria) {
      $('#pganotar-titulo').html("Anotação de " + categoria);
      $('#pganotar-categoria').val(categoria);
      $('#pganotar p.categoria').hide();
    } else {
      if (anexar) {
        $('#pganotar-titulo').html("Anotação Relacionada");
        $('#pganotar p.nota-relacionada').html("<strong>Nota relacionada:</strong>" + (note.comentarios || note.texto));
        $('#pganotar p.nota-relacionada').show();
      } else {
        $('#pganotar-titulo').html("Anotação Personalizada");
      }
      $('#pganotar-categoria').val('');
      $('#pganotar p.categoria').show();
    }
    $('#txtcomments').val('');
    $('#fotoTirada').attr('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
    this.fotoURI = null;
    $.mobile.changePage("#pganotar", {
      changeHash: false
    });
    $('#pganotar a.btnFotografar').off('click');
    $('#pganotar a.btnFotografar').on('click', (function(_this) {
      return function() {
        return _this.fotografar();
      };
    })(this));
    $('#pganotar a.btnSalvar').off('click');
    $('#pganotar a.btnSalvar').on('click', (function(_this) {
      return function() {
        return _this.salvar();
      };
    })(this));
    this.slsapi.off(SLSAPI.Notes.EVENT_ADD_NOTE_START);
    this.slsapi.on(SLSAPI.Notes.EVENT_ADD_NOTE_START, function() {
      return $.mobile.loading('show', {
        text: 'enviando',
        textVisible: 'true'
      });
    });
    this.slsapi.off(SLSAPI.Notes.EVENT_ADD_NOTE_FINISH);
    this.slsapi.on(SLSAPI.Notes.EVENT_ADD_NOTE_FINISH, function() {
      $.mobile.loading('hide');
      return $.mobile.changePage("#pglogado", {
        changeHash: false
      });
    });
    this.slsapi.off(SLSAPI.Notes.EVENT_ADD_NOTE_FAIL);
    this.slsapi.on(SLSAPI.Notes.EVENT_ADD_NOTE_FAIL, function() {
      $.mobile.loading('hide');
      return alert('Erro no envio da anotação. Verifique sua conexão wifi.');
    });
  }

  NoteAdd.prototype.salvar = function() {
    var note;
    note = {};
    if (this.parentId) {
      note.id_parent = this.parentId;
    }
    note.comentarios = $('#txtcomments').val();
    note.categoria = $('#pganotar-categoria').val();
    note.fotoURI = this.fotoURI;
    note.data_hora = (formatadata(new Date())) + " " + (formatahora(new Date()));
    note.latitude = GPSControle.lat;
    note.longitude = GPSControle.lng;
    note.accuracy = GPSControle.accuracy;
    note.user = this.slsapi.user.user_id;
    return this.slsapi.notes.enviar(note, null, function(r) {
      console.log("Code = " + r.responseCode);
      console.log("Response = " + r.response);
      return console.log("Sent = " + r.bytesSent);
    }, function(error) {
      $.mobile.loading('hide');
      alert("Erro ao enviar anotação: Code = " + error.code);
      console.log("upload error source " + error.source);
      return console.log("upload error target " + error.target);
    });
  };

  NoteAdd.prototype.fotografar = function() {
    return navigator.camera.getPicture((function(_this) {
      return function(imageURI) {
        return _this.fotoOnSuccess(imageURI);
      };
    })(this), (function(_this) {
      return function(message) {
        return _this.fotoOnFail(message);
      };
    })(this), {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI
    });
  };

  NoteAdd.prototype.fotoOnSuccess = function(imageURI) {
    $('#fotoTirada').attr('src', imageURI);
    this.fotoURI = imageURI;
    return console.log(imageURI);
  };

  NoteAdd.prototype.fotoOnFail = function(message) {
    return alert("Não foi possível fotografar pois: " + message);
  };

  return NoteAdd;

})();

exports.NoteAdd = NoteAdd;



},{"./gps_controle.coffee":2}],7:[function(require,module,exports){
var Anotacoes, UserView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Anotacoes = require('./anotacoes.coffee').Anotacoes;

UserView = (function() {
  function UserView(urlConfServico) {
    this.submitLogin = bind(this.submitLogin, this);
    this.slsapi = new SLSAPI({
      urlConfServico: urlConfServico
    });
    this.slsapi.on(SLSAPI.Config.EVENT_READY, (function(_this) {
      return function() {
        $("#loginForm").on("submit", function(e) {
          return _this.submitLogin(e);
        });
        _this.slsapi.on(SLSAPI.User.EVENT_LOGIN_START, function() {
          return $.mobile.loading('show', {
            text: 'enviando',
            textVisible: 'true'
          });
        });
        _this.slsapi.on(SLSAPI.User.EVENT_LOGIN_FAIL, function(err) {
          $.mobile.loading('hide');
          $("#submitButton").removeAttr("disabled");
          if (err.response.body.error) {
            return alert(err.response.body.error);
          } else {
            return alert('Não foi possivel conectar, verifique sua conexao de dados ou sua rede wifi!');
          }
        });
        return _this.slsapi.on(SLSAPI.User.EVENT_LOGIN_SUCCESS, function() {
          $.mobile.loading('hide');
          $("#submitButton").removeAttr("disabled");
          return _this.load();
        });
      };
    })(this));
    this.slsapi.on(SLSAPI.Config.EVENT_FAIL, (function(_this) {
      return function(err) {
        alert('Não foi possivel conectar ao serviço, verifique sua conexao de dados ou sua rede wifi!');
        return console.log(err);
      };
    })(this));
  }

  UserView.prototype.clear = function() {
    $("#username").val("");
    return $("#password").val("");
  };

  UserView.prototype.trocarUsuario = function() {
    this.slsapi.user.logout();
    return $.mobile.changePage('#pglogin', {
      changeHash: false
    });
  };

  UserView.prototype.submitLogin = function(e) {
    var p, u;
    u = $("#username").val();
    p = $("#password").val();
    if (u && p) {
      $("#submitButton").attr("disabled", "disabled");
    } else {
      alert('Forneça um usuario e uma senha para autenticação');
    }
    this.slsapi.user.login(u, p);
    return false;
  };

  UserView.prototype.load = function() {
    if (this.slsapi.user.isLogged()) {
      this.anotacoesview = new Anotacoes(this.slsapi);
      window.anotacoesview = this.anotacoesview;
      return $.mobile.changePage("#pglogado", {
        changeHash: false
      });
    } else {
      return $.mobile.changePage("#pglogin", {
        changeHash: false
      });
    }
  };

  return UserView;

})();

exports.UserView = UserView;



},{"./anotacoes.coffee":1}],8:[function(require,module,exports){
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

window.formatDistance = function(distance) {
  if (distance < 0.1) {
    return ((distance * 1000).toFixed(0)) + " m";
  } else {
    return (distance.toFixed(1)) + " km";
  }
};

window.getDistanceFromLatLonInKm = function(lat1, lon1, lat2, lon2) {
  var R, a, c, d, dLat, dLon;
  R = 6371;
  dLat = deg2rad(lat2 - lat1);
  dLon = deg2rad(lon2 - lon1);
  a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  d = R * c;
  return d;
};

window.deg2rad = function(deg) {
  return deg * (Math.PI / 180);
};



},{}]},{},[3]);
