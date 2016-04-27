(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var SecondScreen;

SecondScreen = (function() {
  function SecondScreen(urlConfServico) {
    this.urlConfServico = urlConfServico;
    this.session = null;
    this.ping = 1;
    this.initializePresentation();
  }

  SecondScreen.prototype.initializePresentation = function() {
    var closeElement, presentationElement;
    presentationElement = document.querySelector('#pglogado .btn-selecttv');
    presentationElement.addEventListener("touchstart", (function(_this) {
      return function() {
        return _this.createNewSession();
      };
    })(this));
    closeElement = document.querySelector('#pglogado .btn-closetv');
    closeElement.addEventListener("touchstart", (function(_this) {
      return function() {
        if (_this.session) {
          return _this.session.close();
        }
      };
    })(this));
    return navigator.presentation.onavailablechange = function(dict) {
      if (dict.available) {
        presentationElement.setAttribute('style', 'display:block;');
        return closeElement.setAttribute('style', 'display:none;');
      } else {
        presentationElement.setAttribute('style', 'display:none;');
        return closeElement.setAttribute('style', 'display:block;');
      }
    };
  };

  SecondScreen.prototype.mapViewReset = function() {
    return this.session.postMessage('reset');
  };

  SecondScreen.prototype.mostraQR = function() {
    return this.session.postMessage('mostraQR');
  };

  SecondScreen.prototype.createNewSession = function() {
    if (this.session) {
      this.session.close();
    }
    this.session = navigator.presentation.requestSession("receiver.html");
    this.session.onmessage = (function(_this) {
      return function(msg) {
        var pc;
        pc = parseInt(msg);
        if (pc) {
          _this.ping = pc + 1;
          return console.log("" + _this.ping);
        }
      };
    })(this);
    return this.session.onstatechange = (function(_this) {
      return function() {
        var closeElement, presentationElement;
        closeElement = document.querySelector('#pglogado .btn-closetv');
        presentationElement = document.querySelector('#pglogado .btn-selecttv');
        if (_this.session.state === "connected") {
          closeElement.setAttribute('style', 'display:block;');
          presentationElement.setAttribute('style', 'display:none;');
          return _this.session.postMessage(_this.urlConfServico);
        } else {
          closeElement.setAttribute('style', 'display:none;');
          return presentationElement.setAttribute('style', 'display:block;');
        }
      };
    })(this);
  };

  return SecondScreen;

})();

exports.SecondScreen = SecondScreen;


},{}],2:[function(require,module,exports){
var Action;

Action = (function() {
  function Action() {}

  Action.normalAction = function(ctx, classe) {
    return "<a class='ui-btn ui-shadow ui-corner-all action-anotar' style='text-align:left'    data-valor=\"" + ctx.valor + "\"><i class='" + classe + "' /><span>&nbsp;" + ctx.legenda + "</span></a>";
  };

  Action.trackingAction = function(ctx, classe) {
    return "<a class='ui-btn ui-shadow ui-corner-all action-rastrear' style='text-align:left'\"><i class='" + classe + "' /><span>&nbsp;" + ctx.legenda + "</span></a>";
  };

  Action.simpleAction = function(ctx, classe) {
    return "<a class='ui-btn ui-shadow ui-corner-all action-anotar-simples' style='text-align:left'  data-valor=\"" + ctx.valor + "\" data-tipo=\"" + ctx.tipo + "\"><i class='" + classe + "' /><span>&nbsp;" + ctx.legenda + "</span></a>";
  };

  Action.identificationAction = function(ctx, classe) {
    return "<a class='ui-btn ui-shadow ui-corner-all action-identificar' style='text-align:left'><i class='" + classe + "' /><span>&nbsp;" + ctx.legenda + "</span></a>";
  };

  Action.bindEvents = function() {
    $(".action-rastrear").off('click');
    $(".action-rastrear").on('click', function() {
      return anotacoesview.rastrear();
    });
    $(".action-identificar").off('click');
    $(".action-identificar").on('click', function() {
      return anotacoesview.identificar();
    });
    $(".action-anotar").off('click');
    $(".action-anotar").on('click', function(e) {
      var valor;
      valor = $(e.target).closest('a.action-anotar').data('valor');
      return anotacoesview.anotar(valor);
    });
    $(".action-anotar-simples").off('click');
    return $(".action-anotar-simples").on('click', function(e) {
      var a, tipo, valor;
      a = $(e.target).closest('a.action-anotar-simples');
      valor = a.data('valor');
      tipo = a.data('tipo');
      return anotacoesview.anotar(valor, tipo);
    });
  };

  Action.render = function(ctx) {
    var classe;
    classe = "fa " + ctx.extra;
    if (ctx.extra && ctx.extra.trim().indexOf("fa-") === -1) {
      classe = "em " + ctx.extra;
    }
    if (ctx.tipo === 'normal') {
      return Action.normalAction(ctx, classe);
    } else if (ctx.tipo === 'simple') {
      return Action.simpleAction(ctx, classe);
    } else if (ctx.tipo === 'identification') {
      return Action.identificationAction(ctx, classe);
    } else if (ctx.tipo === 'tracking') {
      return Action.trackingAction(ctx, classe);
    } else {
      return "Não foi possível entender a estrutura do mashup informado. Verifique se o link está corrompido ou se o app precisa ser atualizado.";
    }
  };

  return Action;

})();

exports.Action = Action;


},{}],3:[function(require,module,exports){
var Action, GPSControle, ListView, NoteAdd, NoteView, RastrearView;

NoteAdd = require('./noteadd.coffee').NoteAdd;

ListView = require('./listView.coffee').ListView;

NoteView = require('./noteView.coffee').NoteView;

GPSControle = require('./gps_controle.coffee').GPSControle;

RastrearView = require('./rastrearView.coffee').RastrearView;

Action = require('./action.coffee').Action;

window.Anotacoes = (function() {
  function Anotacoes(slsapi) {
    this.slsapi = slsapi;
    this.acoes = [];
    this.slsapi.config.register(this);
    this.parseOpcoes(this.slsapi.config.opcoes);
    this.geraTelaAnotacoes();
  }

  Anotacoes.prototype.parseOpcoes = function(opcoes) {
    this.opcoes = opcoes;
    return this.acoes = this.opcoes.get('acoes', this.acoes);
  };

  Anotacoes.prototype.toJSON = function() {
    return {
      'acoes': this.createURL
    };
  };

  Anotacoes.prototype.geraTelaAnotacoes = function() {
    var action, html, i, len, ref;
    html = "";
    ref = this.acoes;
    for (i = 0, len = ref.length; i < len; i++) {
      action = ref[i];
      html += Action.render(action);
    }
    $('#telaPrincipal').html(html);
    return Action.bindEvents();
  };

  Anotacoes.prototype.anotar = function(categoria, tipo) {
    Anotacoes.noteadd = new NoteAdd(categoria, this.slsapi, false, null, tipo);
    return false;
  };

  Anotacoes.prototype.anexar = function(note) {
    Anotacoes.noteadd = new NoteAdd(null, this.slsapi, true, note);
    return false;
  };

  Anotacoes.prototype.showAnotacaoByIdentificador = function(identificador) {
    return this.slsapi.notes.getByQuery("identificador=" + identificador, function(results) {
      return Anotacoes.noteidentificada = new NoteView(results[0]);
    }, function(fail) {
      return console.log("Falha ao buscar nota " + identificador);
    });
  };

  Anotacoes.prototype.identificar = function() {
    var identificador, self;
    if (app.runOnApp === false) {
      identificador = prompt("(leitura de barras simulada) Infome o identificador númerico:");
      this.showAnotacaoByIdentificador(identificador);
    } else {
      self = this;
      cordova.plugins.barcodeScanner.scan(function(result) {
        return self.showAnotacaoByIdentificador(result.text);
      }, function(error) {
        return alert("Falha na leitura do código QR: " + error);
      });
    }
    return false;
  };

  Anotacoes.prototype.rastrear = function() {
    gpscontrole.modoTrilha = true;
    Anotacoes.rastrearView = new RastrearView(this.slsapi);
    RastrearView.updateMapa();
    return true;
  };

  Anotacoes.prototype.listar = function() {
    return Anotacoes.listview = new ListView(this.slsapi);
  };

  Anotacoes.prototype.deletar = function(note) {
    if (confirm('Deseja apagar esta anotação?')) {
      return this.slsapi.notes.getByQuery("hashid=" + note.hashid, (function(_this) {
        return function(notes) {
          return _this.slsapi.notes["delete"](notes[0].id, function() {
            _this.listar();
            return $.mobile.changePage("#pghistorico", {
              changeHash: false
            });
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


},{"./action.coffee":2,"./gps_controle.coffee":4,"./listView.coffee":6,"./noteView.coffee":7,"./noteadd.coffee":8,"./rastrearView.coffee":9}],4:[function(require,module,exports){
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

window.GPSControle = (function() {
  GPSControle.gps = null;

  GPSControle.time = 0;

  GPSControle.accuracy = 1000;

  GPSControle.TIMEOUT = 10;

  GPSControle.HighAccuracy = true;

  GPSControle.trilha = [];

  GPSControle.checkpointDistance = 250;

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
    this.modoTrilha = false;
    GPSControle.trilha = [];
    this.load();
    this.iniciaWatch();
    this.mostraGPS();
    $(document).on("pageinit", "#pgperfil", function() {
      $("#pgperfiltimeout").on('slidestop', function(event) {
        return GPSControle.TIMEOUT = parseInt($('#pgperfiltimeout').val());
      });
      $("#pgperfilzoom").on('slidestop', (function(_this) {
        return function(event) {
          var zoom;
          zoom = parseInt($('#pgperfilzoom').val());
          console.log(zoom);
          return app.ss.session.postMessage("zoom|" + zoom);
        };
      })(this));
      return $(document).on('change', '#flipss', function(e) {
        var val;
        val = $("#flipss").val();
        if (val === "on") {
          if (!window.app.ss) {
            app.iniciaSegundaTela();
          }
          return $(".painel-segunda-tela").show();
        } else {
          return $(".painel-segunda-tela").hide();
        }
      });
    });
  }

  GPSControle.prototype.mostraGPS = function() {
    $("#pganotar-gps").html(GPSControle.gps);
    return $("#pganotar-gps-accuracy").html(" (" + (parseInt(GPSControle.accuracy)) + " m)");
  };

  GPSControle.prototype.load = function() {
    if (GPSControle.estaAberto()) {
      this.modoTrilha = this.storage.getItem('gps_modotrilha');
      GPSControle.gps = this.storage.getItem('gps_data');
      GPSControle.accuracy = this.storage.getItem('gps_accuracy');
      GPSControle.time = this.storage.getItem('gps_time');
      GPSControle.trilha = this.storage.getObject('gps_trilha');
      this.mostraGPS();
      return true;
    } else {
      return null;
    }
  };

  GPSControle.prototype.save = function() {
    var distance, lastPosition, newPosition, vetor;
    this.storage.setItem('gps_data', GPSControle.gps);
    this.storage.setItem('gps_time', GPSControle.time);
    this.storage.setItem('gps_accuracy', GPSControle.accuracy);
    newPosition = [GPSControle.lat, GPSControle.lng];
    if (this.modoTrilha) {
      if (GPSControle.trilha.length > 0) {
        lastPosition = GPSControle.trilha[GPSControle.trilha.length - 1];
        vetor = [lastPosition[0], lastPosition[1], newPosition[0], newPosition[1]];
        distance = getDistanceFromLatLonInKm.apply(null, vetor) * 1000;
        GPSControle.distance = distance;
        $("#pgrastrearview p.comentarios").html(GPSControle.trilha.length + ' pontos, ' + distance.toFixed(2) + ' metros do ultimo ponto');
        if (distance > GPSControle.checkpointDistance) {
          GPSControle.trilha.push(newPosition);
          $(document).trigger('newposition.gpscontrole');
        }
      } else {
        GPSControle.trilha.push(newPosition);
      }
    } else {
      GPSControle.trilha = [];
      GPSControle.trilha.push(newPosition);
    }
    this.storage.setItem('gps_modotrilha', this.modoTrilha);
    return this.storage.setObject('gps_trilha', GPSControle.trilha);
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


},{}],5:[function(require,module,exports){
var GPSControle, SecondScreen, UserView, utils;

utils = require('./utils.coffee');

UserView = require('./userView.coffee').UserView;

SecondScreen = require('./SecondScreen.coffee').SecondScreen;

GPSControle = require('./gps_controle.coffee').GPSControle;

window.App = (function() {
  function App() {
    this.storage = window.localStorage;
    this.userview = null;
    this.runOnApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    this.bindEvents();
    this.trocadeservicos = 0;
  }

  App.prototype.bindEvents = function() {
    $('.btn-vincular').off();
    $('.btn-vincular').on('click', function() {
      return app.vincularServico();
    });
    if (this.runOnApp) {
      return document.addEventListener('deviceready', this.onDeviceReady, false);
    } else {
      return $(document).ready(function() {
        return app.main();
      });
    }
  };

  App.prototype.onDeviceReady = function() {
    return app.main();
  };

  App.prototype.main = function() {
    console.log('Received Event: onDeviceReady');
    if (this.runOnApp) {
      cordova.plugins.backgroundMode.onactivate = function() {
        return console.log('backgroundMode: ativado');
      };
      cordova.plugins.backgroundMode.ondeactivate = function() {
        return console.log('backgroundMode: off');
      };
    }
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
    if (this.runOnApp) {
      return cordova.plugins.barcodeScanner.scan(function(result) {
        return self.loadServico(result.text);
      }, function(error) {
        return alert("Falha na leitura do código QR: " + error);
      });
    } else {
      return self.loadServico(prompt('Informe a url do mashup'));
    }
  };

  App.prototype.getUrlConfServico = function() {
    if (PARAMETROS_GET.mashup) {
      this.setUrlConfServico(PARAMETROS_GET.mashup);
    } else {
      this.urlConfServico = this.storage.getItem('urlConfServico');
    }
    return this.urlConfServico;
  };

  App.prototype.setUrlConfServico = function(url) {
    this.urlConfServico = url;
    if (url) {
      this.storage.setItem('urlConfServico', this.urlConfServico);
    } else {
      this.storage.removeItem('urlConfServico');
    }
    if (this.trocadeservicos > 0) {
      window.location = "index.html";
    }
    return this.trocadeservicos += 1;
  };

  App.prototype.iniciaSegundaTela = function() {
    console.log('iniciado segunda tela');
    if (this.runOnApp) {
      return this.ss = new SecondScreen(this.urlConfServico);
    } else {
      return this.ss = true;
    }
  };

  App.prototype.loadServico = function(urlConfServico) {
    this.setUrlConfServico(urlConfServico);
    window.userview = new UserView(urlConfServico);
    return window.gpscontrole = new GPSControle();
  };

  return App;

})();


},{"./SecondScreen.coffee":1,"./gps_controle.coffee":4,"./userView.coffee":10,"./utils.coffee":11}],6:[function(require,module,exports){
var NoteView;

NoteView = require('./noteView.coffee').NoteView;

window.ListView = (function() {
  ListView.dataPool = null;

  ListView.noteView = null;

  function ListView(slsapi) {
    this.slsapi = slsapi;
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
    $('#ulfornecidas,#ulcoletadas').listview().listview('refresh');
    $('#divulcoletadas,#divulfornecidas').hide();
    $("#notasnav a.coletadas").click();
    this.loadData();
  }

  ListView.prototype.loadData = function() {
    var isAnotacoesProximas, position, storageNotebookId;
    position = {
      latitude: GPSControle.lat,
      longitude: GPSControle.lng,
      distance: 10000
    };
    isAnotacoesProximas = $('.checkAnotacoesProximas').prop('checked');
    console.log('oi', isAnotacoesProximas);
    if (isAnotacoesProximas) {
      ListView.dataPool.loadAllData('', position);
    } else {
      ListView.dataPool.loadAllData();
    }
    storageNotebookId = this.slsapi.notes.storageNotebook.id;
    ListView.storageNotebookId = storageNotebookId;
    this.slsapi.off(SLSAPI.dataPool.DataPool.EVENT_LOAD_STOP);
    return this.slsapi.on(SLSAPI.dataPool.DataPool.EVENT_LOAD_STOP, function(datapool) {
      var distance, ds, html, htmlc, i, img, j, k, len, len1, len2, li, n, note, ref, ref1, v, video;
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
          video = '';
          if (note.fotoURL) {
            img = "<img width='100px' height='100px' src='" + note.fotoURL + "' />";
          } else {
            if (note.youtubeVideoId) {
              img = "<img width='100px' height='100px' src='http://img.youtube.com/vi/" + note.youtubeVideoId + "/sddefault.jpg' />";
            }
          }
          if (note.youtubeVideoId) {
            video = "<span class='fa fa-file-video-o'>&nbsp;</span>";
          }
          if (ds.url.indexOf(storageNotebookId) > 0) {
            li = "<li><a class='action-note-select' data-note-id=\"" + note.hashid + "\">" + img + video + "<p>" + (note.texto || note.comentarios) + "</p><p class='ul-li-aside'>" + (formatDistance(distance)) + "</p></a></li>";
            htmlc = htmlc + " " + li;
          } else {
            li = "<li><a class='action-note-select' data-note-id=\"" + note.hashid + "\">" + img + video + "<p>" + (note.texto || note.comentarios) + "</p><p>" + (formatDistance(distance)) + "</p></a></li>";
            html = html + " " + li;
          }
        }
      }
      $('#ulfornecidas').html(html);
      $('#ulcoletadas').html(htmlc);
      $('#ulfornecidas,#ulcoletadas').listview().listview('refresh');
      $('#divulcoletadas,#divulfornecidas').hide();
      $("#notasnav a.coletadas").click();
      return ListView.bindEvents();
    });
  };

  ListView.bindEvents = function() {
    $("a.action-note-select").off('click');
    return $("a.action-note-select").on('click', function(e) {
      var closest, hashid;
      closest = $(e.target).closest("a.action-note-select");
      hashid = $(closest).data('note-id');
      return ListView.selecionar(hashid);
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


},{"./noteView.coffee":7}],7:[function(require,module,exports){
var NoteView;

NoteView = (function() {
  NoteView.mapa = null;

  NoteView.criaMapa = function(note) {
    var error, error1, marker, pos;
    if (NoteView.mapa) {
      try {
        NoteView.mapa.remove();
      } catch (error1) {
        error = error1;
        console.log("errors: " + error);
      }
    }
    pos = L.latLng(note.latitude, note.longitude);
    NoteView.mapa = L.map('mapa', {
      minZoom: 10,
      maxZoom: 17
    });
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/rezo.ihpe97f0/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(NoteView.mapa);
    marker = L.marker(pos);
    marker.addTo(NoteView.mapa);
    if (note.trilha) {
      NoteView.polyline = L.polyline(note.trilha, {
        color: 'red'
      }).addTo(NoteView.mapa);
    }
    NoteView.mapa.setView(pos, 16);
    NoteView.mapa.invalidateSize(false);
    setTimeout(function() {
      console.log('tentando abrir nota em segunda tela');
      app.ss.session.postMessage("move|" + note.latitude + "|" + note.longitude + "|" + note.hashid);
      console.log('abre nota em segunda tela');
      NoteView.mapa.off('zoomend');
      return NoteView.mapa.on('zoomend', function() {
        return app.ss.session.postMessage("zoom|" + NoteView.mapa.getZoom());
      });
    }, 400);
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
    var user_id;
    this.note = note1;
    console.log("note", this.note);
    if (!this.note) {
      alert('Anotação informada não existe!');
      return;
    }
    $.mobile.changePage("#pgnoteview", {
      changeHash: false
    });
    this.mapa = NoteView.criaMapa(this.note);
    setTimeout(function() {
      return NoteView.mapa.invalidateSize(false);
    }, 1000);
    $('#pgnoteview p.comentarios').html(this.note.comentarios || this.note.texto);
    $('#pgnoteview p.categoria').html(this.note.cat || this.note.user.username);
    $('#pgnoteview p.data').html(this.note.createdAt);
    $('#pgnoteview a.btn-adicionar-nota').off('click');
    $('#pgnoteview a.btn-adicionar-nota').on('click', (function(_this) {
      return function() {
        return anotacoesview.anexar(_this.note);
      };
    })(this));
    user_id = window.localStorage.getItem('user_id');
    if (user_id === this.note.user.id || userview.isRoot) {
      $('#pgnoteview a.btn-deletar-nota').show();
      $('#pgnoteview a.btn-deletar-nota').off('click');
      $('#pgnoteview a.btn-deletar-nota').on('click', (function(_this) {
        return function() {
          return anotacoesview.deletar(_this.note);
        };
      })(this));
    } else {
      $('#pgnoteview a.btn-deletar-nota').hide();
    }
    if (this.note.fotoURL) {
      $('#pgnoteview p.foto').html("<img src='" + this.note.fotoURL + "' width='100%' />");
      $('#pgnoteview p.foto').show();
    } else {
      $('#pgnoteview p.foto').hide();
    }
    $('#pgnoteview p.foto img').off('click');
    $('#pgnoteview p.foto img').on('click', (function(_this) {
      return function() {
        var imageSrc;
        imageSrc = $('#pgnoteview p.foto img').attr('src');
        return app.ss.session.postMessage(imageSrc);
      };
    })(this));
    if (this.note.youtubeVideoId) {
      $('#pgnoteview a.btn-tocar-video').off('click');
      $('#pgnoteview a.btn-tocar-video').on('click', (function(_this) {
        return function() {
          return YoutubeVideoPlayer.openVideo(_this.note.youtubeVideoId);
        };
      })(this));
      $('#notevideo').attr('src', "http://img.youtube.com/vi/" + this.note.youtubeVideoId + "/sddefault.jpg");
      $('#pgnoteview fieldset.video').show();
    } else {
      $('#pgnoteview fieldset.video').hide();
    }
    if (this.note.notebook && this.note.notebook === ListView.storageNotebookId) {
      $('#pgnoteview a.btn-adicionar-nota').hide();
    } else {
      $('#pgnoteview a.btn-deletar-nota').hide();
      $('#pgnoteview a.btn-adicionar-nota').show();
    }
    this.listaFilhos();
  }

  NoteView.prototype.listaFilhos = function() {
    var fi, html, i, img, len, li, note, video;
    $('#ulfilhos').empty();
    html = '';
    fi = NoteView.getFilhos(this.note);
    for (i = 0, len = fi.length; i < len; i++) {
      note = fi[i];
      img = '';
      video = '';
      if (note.fotoURL) {
        img = "<img width='100px' height='100px' src='" + note.fotoURL + "' />";
      } else {
        if (note.youtubeVideoId) {
          img = "<img width='100px' height='100px' src='http://img.youtube.com/vi/" + note.youtubeVideoId + "/sddefault.jpg' />";
        }
      }
      if (note.youtubeVideoId) {
        video = "<span class='fa fa-file-video-o'>&nbsp;</span>";
      }
      li = "<li><a class='action-note-select' data-note-id=\"" + note.hashid + "\">" + img + video + "<p>" + (note.texto || note.comentarios) + "</p></a></li>";
      html = html + " " + li;
    }
    $('#ulfilhos').html(html);
    $('#ulfilhos').listview().listview('refresh');
    return ListView.bindEvents();
  };

  return NoteView;

})();

module.exports = {
  NoteView: NoteView
};


},{}],8:[function(require,module,exports){
var GPSControle, NoteAdd;

GPSControle = require('./gps_controle.coffee').GPSControle;

NoteAdd = (function() {
  function NoteAdd(categoria, slsapi, anexar, note, tipo) {
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
    $('#youtubeThumb').attr('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
    this.fotoURI = null;
    this.identificador = null;
    $.mobile.changePage("#pganotar", {
      changeHash: false
    });
    $('#fotoTirada').off('click');
    $('#fotoTirada').on('click', (function(_this) {
      return function() {
        return _this.escolherFoto();
      };
    })(this));
    $('#pganotar a.btnFotografar').off('click');
    $('#pganotar a.btnFotografar').on('click', (function(_this) {
      return function() {
        return _this.fotografar();
      };
    })(this));
    $('#pganotar a.btnYoutube').off('click');
    $('#pganotar a.btnYoutube').on('click', (function(_this) {
      return function() {
        return _this.linkarYoutube();
      };
    })(this));
    $('#pganotar a.btnQRcode').off('click');
    $('#pganotar a.btnQRcode').on('click', (function(_this) {
      return function() {
        return _this.identificar();
      };
    })(this));
    $('#pganotar a.btnOCR').off('click');
    $('#pganotar a.btnOCR').on('click', (function(_this) {
      return function() {
        return _this.identificarOCR();
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
    if (tipo === 'simple') {
      $(".input-youtube, .input-identificar").hide();
    } else {
      $(".input-youtube, .input-identificar").show();
    }
  }

  NoteAdd.prototype.salvar = function() {
    var note;
    note = {};
    if (this.parentId) {
      note.id_parent = this.parentId;
    }
    if (this.youtubeVideoId) {
      note.youtubeVideoId = this.youtubeVideoId;
    }
    if (this.identificador) {
      note.identificador = this.identificador;
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

  NoteAdd.prototype.identificarOCR = function() {
    var fail, win;
    win = function(r) {
      console.log(r);
      return alert(r.response);
    };
    fail = function(error) {
      return console.log(error);
    };
    return navigator.camera.getPicture((function(_this) {
      return function(imageURI) {
        var ft, options, params;
        console.log(imageURI);
        alert(imageURI);
        ft = new FileTransfer();
        options = new FileUploadOptions();
        options.fileKey = "file";
        options.mimeType = "text/plain";
        params = {};
        params.privado = true;
        options.params = params;
        return ft.upload(imageURI, encodeURI("http://sl.wancharle.com.br/note/ocr"), win, fail, options);
      };
    })(this), (function(_this) {
      return function(message) {
        return _this.fotoOnFail(message);
      };
    })(this), {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
  };

  NoteAdd.prototype.identificar = function() {
    var self;
    self = this;
    return cordova.plugins.barcodeScanner.scan(function(result) {
      self.identificador = result.text;
      $('#noteHashid').text(self.identificador);
      return console.log(result.text);
    }, function(error) {
      return alert("Falha na leitura do código QR: " + error);
    });
  };

  NoteAdd.prototype.linkarYoutube = function() {
    var videoid;
    videoid = prompt('informe o id do video no youtube');
    if (videoid) {
      this.youtubeVideoId = videoid;
      return $('#youtubeThumb').attr('src', "http://img.youtube.com/vi/" + videoid + "/sddefault.jpg");
    }
  };

  NoteAdd.prototype.escolherFoto = function() {
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
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
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


},{"./gps_controle.coffee":4}],9:[function(require,module,exports){
var RastrearView;

RastrearView = (function() {
  RastrearView.mapa = null;

  RastrearView.geoJson = null;

  RastrearView.slsapi = null;

  RastrearView.id = false;

  RastrearView.criaMapa = function() {
    var pos;
    pos = L.latLng([GPSControle.lat, GPSControle.lng]);
    RastrearView.mapa = L.map('mapaRastreio', {
      minZoom: 15,
      maxZoom: 17
    });
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/rezo.ihpe97f0/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(RastrearView.mapa);
    RastrearView.polyline = L.polyline(GPSControle.trilha, {
      color: 'red'
    }).addTo(RastrearView.mapa);
    RastrearView.marker = L.marker(pos);
    RastrearView.marker.addTo(RastrearView.mapa);
    RastrearView.mapa.setView(pos, 16);
    RastrearView.mapa.invalidateSize(false);
    return RastrearView.mapa;
  };

  RastrearView.saveid = function(r) {
    var storage;
    storage = window.localStorage;
    RastrearView.id = r.id;
    storage.setItem('id_rastreamento', RastrearView.id);
    return $("#pgrastrearview p.comentarios").html('ID:' + r.id + ', ' + GPSControle.trilha.length + ' pontos, ' + GPSControle.distance.toFixed(2) + ' metros do ultimo ponto');
  };

  RastrearView.update = function() {
    var query, slsapi;
    slsapi = RastrearView.slsapi;
    query = {
      'trilha': GPSControle.trilha,
      'latitude': GPSControle.lat,
      'longitude': GPSControle.lng
    };
    return slsapi.notes.update(RastrearView.id, query, function(r) {
      $("#pgrastrearview p.comentarios").html('ID:' + r.id + ', ' + GPSControle.trilha.length + ' pontos, ' + GPSControle.distance.toFixed(2) + ' metros do ultimo ponto');
      return console.log("Updata ok: Sent = " + r.bytesSent);
    }, function(error) {
      $.mobile.loading('hide');
      console.log("Erro ao enviar anotação: Code = " + error.code);
      console.log("upload error source " + error.source);
      return console.log("upload error target " + error.target);
    });
  };

  RastrearView.save = function() {
    var note, slsapi;
    note = {};
    slsapi = RastrearView.slsapi;
    note.comentarios = 'nota de rastreamento';
    note.categoria = 'rastreamento';
    note.data_hora = (formatadata(new Date())) + " " + (formatahora(new Date()));
    note.latitude = GPSControle.lat;
    note.longitude = GPSControle.lng;
    note.accuracy = GPSControle.accuracy;
    note.user = slsapi.user.user_id;
    note.trilha = GPSControle.trilha;
    return slsapi.notes.enviar(note, null, function(r) {
      RastrearView.saveid(r);
      console.log("Code = " + r.responseCode);
      console.log("Response = " + r.response);
      return console.log("Sent = " + r.bytesSent);
    }, function(error) {
      $.mobile.loading('hide');
      console.log("Erro ao enviar anotação: Code = " + error.code);
      console.log("upload error source " + error.source);
      return console.log("upload error target " + error.target);
    });
  };

  function RastrearView(slsapi) {
    var lastPosition, storage;
    storage = window.localStorage;
    if (app.runOnApp) {
      cordova.plugins.backgroundMode.enable();
    }
    RastrearView.id = storage.getItem('id_rastreamento');
    RastrearView.slsapi = slsapi;
    $.mobile.changePage("#pgrastrearview", {
      changeHash: false
    });
    lastPosition = GPSControle.trilha.slice(-1, 1);
    if (RastrearView.mapa) {
      RastrearView.mapa.remove();
    }
    this.mapa = RastrearView.criaMapa();
    setTimeout(function() {
      return RastrearView.mapa.invalidateSize(false);
    }, 1000);
    $(document).bind('newposition.gpscontrole', function() {
      return RastrearView.updateMapa();
    });
    $('a.btn-parar-rastreamento').off('click');
    $('a.btn-parar-rastreamento').on('click', function() {
      return RastrearView.stop();
    });
    $('a.btn-atualizar-rastreamento').off('click');
    $('a.btn-atualizar-rastreamento').on('click', function() {
      return RastrearView.updateMapa();
    });
  }

  RastrearView.stop = function() {
    var storage;
    storage = window.localStorage;
    if (app.runOnApp) {
      cordova.plugins.backgroundMode.disable();
    }
    RastrearView.id = "";
    storage.setItem('id_rastreamento', RastrearView.id);
    GPSControle.trilha = [];
    gpscontrole.modoTrilha = false;
    gpscontrole.save();
    return $.mobile.changePage("#pglogado", {
      changeHash: true
    });
  };

  RastrearView.updateMapa = function() {
    var pos;
    GPSControle.checkpointDistance = parseInt($('#pgrastrear-distancia').val());
    pos = L.latLng([GPSControle.lat, GPSControle.lng]);
    RastrearView.marker.setLatLng(pos);
    RastrearView.polyline.setLatLngs(GPSControle.trilha);
    if (RastrearView.id) {
      return RastrearView.update();
    } else {
      return RastrearView.save();
    }
  };

  return RastrearView;

})();

module.exports = {
  RastrearView: RastrearView
};


},{}],10:[function(require,module,exports){
var Anotacoes, UserView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Anotacoes = require('./anotacoes.coffee').Anotacoes;

UserView = (function() {
  UserView.prototype.problemarede = function() {
    if (this.loading) {
      this.loadging = false;
      $.mobile.loading("hide");
      return $.mobile.changePage('#problemarede', {
        changeHash: false
      });
    }
  };

  function UserView(urlConfServico) {
    this.submitLogin = bind(this.submitLogin, this);
    this.loading = true;
    $.mobile.loading("show", {
      text: "Carregando definições do usuário",
      textVisible: true,
      textonly: false
    });
    setTimeout(((function(_this) {
      return function() {
        return _this.problemarede();
      };
    })(this)), 10000);
    this.slsapi = new SLSAPI({
      urlConfServico: urlConfServico
    });
    this.slsapi.on(SLSAPI.Config.EVENT_READY, (function(_this) {
      return function() {
        $("#loginForm").on("submit", function(e) {
          return _this.submitLogin(e);
        });
        _this.load();
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
            return _this.problemarede();
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
        _this.problemarede();
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

  UserView.prototype.bind = function() {
    $(".btn-listar-anotacoes").off();
    return $(".btn-listar-anotacoes").on('click', function() {
      return window.anotacoesview.listar();
    });
  };

  UserView.prototype.loadPermissions = function() {
    this.data = this.slsapi.user.user_data;
    this.isRoot = this.data.isRoot;
    return this.isAdmin = this.data.isAdmin;
  };

  UserView.prototype.load = function() {
    this.loading = false;
    $.mobile.loading("hide");
    if (this.slsapi.user.isLogged()) {
      this.bind();
      this.anotacoesview = new Anotacoes(this.slsapi);
      window.anotacoesview = this.anotacoesview;
      $('#pgperfil p.usuario').html("Usuário: " + (this.slsapi.user.getUsuario()));
      $.mobile.changePage("#pglogado", {
        changeHash: false
      });
      return this.loadPermissions();
    } else {
      return $.mobile.changePage("#pglogin", {
        changeHash: false
      });
    }
  };

  return UserView;

})();

exports.UserView = UserView;


},{"./anotacoes.coffee":3}],11:[function(require,module,exports){
var getParams;

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

getParams = function() {
  var i, key, len, params, query, raw_vars, ref, v, val;
  query = window.location.search.substring(1);
  raw_vars = query.split("&");
  params = {};
  for (i = 0, len = raw_vars.length; i < len; i++) {
    v = raw_vars[i];
    ref = v.split("="), key = ref[0], val = ref[1];
    params[key] = decodeURIComponent(val);
  }
  return params;
};

window.PARAMETROS_GET = getParams();

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


},{}]},{},[5]);
