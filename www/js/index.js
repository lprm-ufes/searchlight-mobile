(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GPSControle, ListView, NoteView;

NoteView = require('./noteview.coffee').NoteView;

ListView = require('./listView.coffee').ListView;

GPSControle = require('./gps_controle.coffee').GPSControle;

window.Anotacoes = (function() {
  Anotacoes.tolerancia = 5;

  Anotacoes.noteview = null;

  function Anotacoes(slsapi) {
    this.slsapi = slsapi;
  }

  Anotacoes.prototype.anotar = function(categoria) {
    return Anotacoes.noteview = new NoteView(categoria, this.slsapi);
  };

  Anotacoes.prototype.listar = function() {
    return Anotacoes.listview = new ListView(this.slsapi);
  };

  Anotacoes.prototype.sincronizar = function() {
    var anotacoesPendentes;
    return anotacoesPendentes = this.getAnotacoes();
  };

  Anotacoes.prototype.getAnotacoes = function() {
    var ativs;
    ativs = window.localStorage.getObject('lista_de_anotacoes');
    if (ativs) {
      return ativs;
    } else {
      return new Array();
    }
  };

  Anotacoes.prototype.setAnotacoes = function(anotacoes) {
    return window.localStorage.setObject('lista_de_anotacoes', anotacoes);
  };

  Anotacoes.prototype.fim = function(id) {
    var ativ, ativs, d, horario_fim, i, j, len, limite_fim, n_participantes, n_presentes;
    n_presentes = parseInt($('#txtpresentes' + id).val());
    n_participantes = parseInt($('#txtparticipantes' + id).val());
    if (isInteger(n_presentes) && isInteger(n_participantes)) {
      if (n_presentes < n_participantes) {
        alert("O número de pessoas presentes deve ser igual ou superior ou número de pessoas participantes da atividade!");
        return;
      }
      horario_fim = formatahora(new Date());
      d = new Date();
      d.setMinutes(d.getMinutes() - Anotacoes.tolerancia);
      limite_fim = formatahora(d);
      ativs = this.getAnotacoes();
      for (i = j = 0, len = ativs.length; j < len; i = ++j) {
        ativ = ativs[i];
        if (parseInt(ativ.id) === parseInt(id)) {
          if (ativ.h_inicio_registrado) {
            if (limite_fim > ativ.h_fim) {
              alert("Periodo para finalizar esta atividade terminou. Por isso, esta atividade NÃO será registrada.");
              return false;
            }
            ativ.h_fim_registrado = horario_fim;
            ativ.gps = GPSControle.gps;
            ativ.numero_de_presentes = n_presentes;
            ativ.numero_de_participantes = n_participantes;
            ativ.realizada = true;
          } else {
            alert("É preciso iniciar a atividade antes de finalizar!");
            return false;
          }
        }
      }
      this.setAnotacoes(ativs);
      return anotacoesview.atualizaUI();
    } else {
      alert("Para finalizar a atividade é preciso informar o número de participantes e presentes");
      return false;
    }
  };

  Anotacoes.prototype.start = function(id) {
    var ativ, ativs, d, horario_inicio, i, j, len, limite_inicio;
    ativs = this.getAnotacoes();
    for (i = j = 0, len = ativs.length; j < len; i = ++j) {
      ativ = ativs[i];
      if (parseInt(ativ.id) === parseInt(id)) {
        horario_inicio = formatahora(new Date());
        d = new Date();
        d.setMinutes(d.getMinutes() + Anotacoes.tolerancia);
        limite_inicio = formatahora(d);
        if (limite_inicio > ativ.h_inicio) {
          ativ['h_inicio_registrado'] = horario_inicio;
          $('li.ativ' + id + ' button.ui-btn.start').hide();
          $('li.ativ' + id + ' p.h_inicio_registrado').show();
          $('li.ativ' + id + ' p.h_inicio_registrado').html('Iniciou as ' + horario_inicio.slice(0, 5) + 'h');
        } else {
          alert("Vc não pode iniciar esta atividade ainda!");
        }
      }
    }
    return this.setAnotacoes(ativs);
  };

  Anotacoes.prototype.atualizaOntem = function(ativ) {
    var li;
    li = "<li>";
    li += "<h2 data-inset='false'>" + ativ['h_inicio'].slice(0, 5) + "h - " + ativ['h_fim'].slice(0, 5) + "h</h2><div>";
    li += "<p> Gerência: " + ativ['gerencia'] + "</p>";
    li += "<span style='display:none' class='data'> " + ativ['data'] + '</span>';
    if (ativ.realizada) {
      li += "<p>Realizada de " + ativ['h_inicio_registrado'].slice(0, 5) + "h às " + ativ['h_fim_registrado'].slice(0, 5) + "h</p>";
    } else {
      li += "<p>De " + ativ['h_inicio'].slice(0, 5) + "h às " + ativ['h_fim'].slice(0, 5) + "h</p>";
    }
    if (ativ['tipo'] === Atividade.TIPO_AULA) {
      li += "<p> Participantes/Presentes: " + ativ['numero_de_participantes'] + "/" + ativ['numero_de_presentes'] + "</p>";
    }
    li += "<p>GPS: " + ativ['gps'] + "</p>";
    li += "<p>Professor: " + ativ['usuario'] + "</p>";
    return li + "</div></li>";
  };

  Anotacoes.prototype.atualizaHoje = function(ativ) {
    var li;
    li = "<li class='ativ" + ativ.id + "' data-role='collapsible' data-iconpos='right' data-inset='false'>";
    li += "<h2 data-inset='false'>" + ativ['h_inicio'].slice(0, 5) + 'h - ' + ativ['h_fim'].slice(0, 5) + "h</h2>";
    li += "<span style='display:none' class='data'> " + ativ['data'] + '</span>';
    li += "<p> Gerência: " + ativ['gerencia'] + "</p>";
    li += "<p> Local: " + ativ['local'] + "</p>";
    li += "<p> De " + ativ['h_inicio'].slice(0, 5) + "h às " + ativ['h_fim'].slice(0, 5) + "h</p>";
    li += "<div data-role=\"fieldcontain\"> <label for=\"txtpresentes" + ativ.id + "\">Presentes:</label> <input name=\"txtpresentes" + ativ.id + "\" class=\"numero\" id=\"txtpresentes" + ativ.id + "\" step=\"1\"  value=\"" + (getIntVazio(ativ.numero_de_presentes)) + "\" type=\"number\"/> </div> <div data-role=\"fieldcontain\"> <label for=\"txtparticipantes" + ativ.id + "\">Participantes:</label> <input name=\"txtparticipantes" + ativ.id + "\" class=\"numero\" id=\"txtparticipantes" + ativ.id + "\" step=\"1\"  value=\"" + (getIntVazio(ativ.numero_de_participantes)) + "\" type=\"number\"/> </div>";
    li += '<div class="ui-grid-b"> <div class="ui-block-a">';
    if (ativ.h_inicio_registrado) {
      li += '<p class="h_inicio_registrado">Iniciou as ' + ativ.h_inicio_registrado.slice(0, 5) + 'h</p>';
    } else {
      li += '<button class="ui-btn start" onclick="anotacoesview.start(' + ativ.id + ')">iniciar</button><p style="display:none" class="h_inicio_registrado"></p>';
    }
    li += '</div> <div class="ui-block-b"> </div> <div class="ui-block-c"> <button class="ui-btn" onclick="anotacoesview.fim(' + ativ.id + ')">finalizar</button></div> </div>';
    li += "</li>";
    return li;
  };

  Anotacoes.prototype.atualizaAmanha = function(ativ) {
    var li;
    li = "<li >";
    li += "<h2 data-inset='false'>" + ativ['h_inicio'].slice(0, 5) + "h - " + ativ['h_fim'].slice(0, 5) + "h</h2><div>";
    li += "<p> Gerência: " + ativ['gerencia'] + "</p>";
    li += "<span  style='display:none' class='data'> " + ativ['data'] + '</span>';
    li += "<p>Local: " + ativ['local'] + "</p>";
    li += "<p>De " + ativ['h_inicio'].slice(0, 5) + "h às " + ativ['h_fim'].slice(0, 5) + "h</p>";
    li += "<p>Professor: " + ativ['usuario'] + "</p>";
    return li + "</div></li>";
  };

  Anotacoes.prototype.atualizaUI = function() {
    var acoes, anotacoes, ativ, htmlacoes, htmlhistorico, htmlontem, j, len;
    anotacoes = this.getAnotacoes();
    acoes = str2datePT(formatadata(new Date()));
    if (anotacoes) {
      htmlacoes = "";
      htmlontem = "";
      htmlhistorico = "";
      for (j = 0, len = anotacoes.length; j < len; j++) {
        ativ = anotacoes[j];
        if ((str2datePT(ativ.data) < acoes) || (ativ.realizada === true)) {
          htmlontem += this.atualizaOntem(ativ);
        } else if (str2datePT(ativ.data) === acoes) {
          htmlacoes += this.atualizaHoje(ativ);
        } else {
          htmlhistorico += this.atualizaAmanha(ativ);
        }
      }
      $('#ulontem').html(htmlontem);
      $('#ulhistorico').html(htmlhistorico);
      $('#ulhistorico,#ulontem').listview({
        autodividers: true,
        autodividersSelector: function(li) {
          return $(li).find('.data').text();
        }
      }).listview('refresh');
      $('#ulacoes').listview().listview('refresh');
      $('div[data-role=collapsible]').collapsible();
      $('li[data-role=collapsible]').collapsible();
      $('input.numero').textinput();
      return $('input.numero').textinput('refresh');
    }
  };

  Anotacoes.prototype.clearUI = function() {
    var htmlhistorico, htmlontem;
    htmlontem = "";
    htmlhistorico = "";
    $('#ulontem').html(htmlontem);
    $('#ulhistorico').html(htmlhistorico);
    $('#ulhistorico,#ulontem').listview().listview('refresh');
    return $('#ulacoes').listview().listview('refresh');
  };

  return Anotacoes;

})();

exports.Anotacoes = Anotacoes;



},{"./gps_controle.coffee":2,"./listView.coffee":4,"./noteview.coffee":5}],2:[function(require,module,exports){
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
    console.log('ola');
    return cordova.plugins.barcodeScanner.scan(function(result) {
      console.log('ola');
      return self.loadServico(result.text);
    }, function(error) {
      console.log('ola');
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



},{"./gps_controle.coffee":2,"./userView.coffee":6,"./utils.coffee":7}],4:[function(require,module,exports){
var ListView;

ListView = (function() {
  ListView.dataPool = null;

  function ListView(slsapi) {
    this.slsapi = slsapi;
    $.mobile.changePage("#pghistorico", {
      changeHash: false
    });
    ListView.dataPool = SLSAPI.dataPool.createDataPool(this.slsapi.mashup);
    this.loadData();
  }

  ListView.prototype.loadData = function() {
    var position;
    position = {
      latitude: GPSControle.lat,
      longitude: GPSControle.lng,
      distance: 10000
    };
    ListView.dataPool.loadAllData('', position);
    this.slsapi.off(SLSAPI.dataPool.DataPool.EVENT_LOAD_STOP);
    return this.slsapi.on(SLSAPI.dataPool.DataPool.EVENT_LOAD_STOP, function(datapool) {
      console.log(datapool.dataSources[0].notes);
      return console.log(datapool.dataSources[1].notes);
    });
  };

  ListView.prototype.selecionar = function() {};

  return ListView;

})();

module.exports = {
  ListView: ListView
};



},{}],5:[function(require,module,exports){
var GPSControle, NoteView;

GPSControle = require('./gps_controle.coffee').GPSControle;

NoteView = (function() {
  function NoteView(categoria, slsapi) {
    this.slsapi = slsapi;
    if (categoria) {
      $('#pganotar-titulo').html("Anotação de " + categoria);
      $('#pganotar-categoria').val(categoria);
      $('#pganotar p.categoria').hide();
    } else {
      $('#pganotar-titulo').html("Anotação Personalizada");
      $('#pganotar-categoria').val('');
      $('#pganotar p.categoria').show();
    }
    $('#txtcomments').val('');
    $('#fotoTirada').attr('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
    this.fotoURI = null;
    $.mobile.changePage("#pganotar", {
      changeHash: false
    });
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

  NoteView.prototype.salvar = function() {
    var note;
    note = {};
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

  NoteView.prototype.fotografar = function() {
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

  NoteView.prototype.fotoOnSuccess = function(imageURI) {
    $('#fotoTirada').attr('src', imageURI);
    this.fotoURI = imageURI;
    return console.log(imageURI);
  };

  NoteView.prototype.fotoOnFail = function(message) {
    return alert("Não foi possível fotografar pois: " + message);
  };

  return NoteView;

})();

exports.NoteView = NoteView;



},{"./gps_controle.coffee":2}],6:[function(require,module,exports){
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
      this.anotacoesview.clearUI();
      this.anotacoesview.sincronizar();
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



},{"./anotacoes.coffee":1}],7:[function(require,module,exports){
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



},{}]},{},[3]);
