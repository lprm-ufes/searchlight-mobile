(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.UserView = (function() {
    UserView.url_login = "http://sav.wancharle.com.br/logar/";

    function UserView() {
      this.submitLogin = __bind(this.submitLogin, this);
      this.storage = window.localStorage;
      this.usuario = this.getUsuario();
      $("#loginForm").on("submit", (function(_this) {
        return function(e) {
          return _this.submitLogin(e);
        };
      })(this));
    }

    UserView.prototype.getUsuario = function() {
      this.usuario = this.storage.getItem('Usuario');
      return this.usuario;
    };

    UserView.prototype.setUsuario = function(usuario) {
      this.usuario = usuario;
      return this.storage.setItem('Usuario', this.usuario);
    };

    UserView.prototype.clear = function() {
      $("#username").val("");
      return $("#password").val("");
    };

    UserView.prototype.trocarUsuario = function() {
      this.storage.removeItem('Usuario');
      this.usuario = null;
      this.clear();
      return $.mobile.changePage('#pglogin', {
        changeHash: false
      });
    };

    UserView.prototype.submitLogin = function(e) {
      var p, u, url;
      $("#submitButton").attr("disabled", "disabled");
      u = $("#username").val();
      p = $("#password").val();
      if (u && p) {
        url = UserView.url_login;
        $.post(url, {
          username: u,
          password: p
        }, (function(_this) {
          return function(res) {
            if (res === true) {
              _this.setUsuario(u);
              _this.load();
            } else {
              alert("Usuário ou Senha inválidos!");
            }
            return $("#submitButton").removeAttr("disabled");
          };
        })(this), "json").fail(function() {
          $("#submitButton").removeAttr("disabled");
          return alert('Não foi possivel conectar, verifique sua conexao de dados ou sua rede wifi!');
        });
      } else {
        $("#submitButton").removeAttr("disabled");
      }
      return false;
    };

    UserView.prototype.load = function() {
      if (this.usuario) {
        this.atividadesview = new Atividades();
        this.atividadesview.clearUI();
        this.atividadesview.sincronizar();
        window.atividadesview = this.atividadesview;
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

}).call(this);

(function() {
  window.Atividades = (function() {
    function Atividades() {}

    Atividades.tolerancia = 5;

    Atividades.prototype.sincronizar = function() {
      var atividadesPendentes;
      atividadesPendentes = this.getAtividades();
      return $.post("http://sav.wancharle.com.br/salvar/", {
        'usuario': userview.getUsuario(),
        'json': JSON.stringify(atividadesPendentes)
      }, function() {
        console.log('envio ok');
        return $("#painel").panel("close");
      }, 'json').done(function(data) {
        atividadesview.setAtividades(data);
        return atividadesview.atualizaUI();
      }).fail(function(error, textstatus) {
        alert('Não foi possível enviar os dados registrados ao servidor. Isso ocorre provavelmente por falta de conexão de dados no momento. Tente novamente quando tver um conexão de internet estável');
        return console.log(textstatus);
      });
    };

    Atividades.prototype.getAtividades = function() {
      var ativs;
      ativs = window.localStorage.getObject('lista_de_atividades');
      if (ativs) {
        return ativs;
      } else {
        return new Array();
      }
    };

    Atividades.prototype.setAtividades = function(atividades) {
      return window.localStorage.setObject('lista_de_atividades', atividades);
    };

    Atividades.prototype.fim = function(id) {
      var ativ, ativs, d, horario_fim, i, limite_fim, n_participantes, n_presentes, _i, _len;
      n_presentes = parseInt($('#txtpresentes' + id).val());
      n_participantes = parseInt($('#txtparticipantes' + id).val());
      if (isInteger(n_presentes) && isInteger(n_participantes)) {
        if (n_presentes < n_participantes) {
          alert("O número de pessoas presentes deve ser igual ou superior ou número de pessoas participantes da atividade!");
          return;
        }
        horario_fim = formatahora(new Date());
        d = new Date();
        d.setMinutes(d.getMinutes() - Atividades.tolerancia);
        limite_fim = formatahora(d);
        ativs = this.getAtividades();
        for (i = _i = 0, _len = ativs.length; _i < _len; i = ++_i) {
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
        this.setAtividades(ativs);
        return atividadesview.atualizaUI();
      } else {
        alert("Para finalizar a atividade é preciso informar o número de participantes e presentes");
        return false;
      }
    };

    Atividades.prototype.start = function(id) {
      var ativ, ativs, d, horario_inicio, i, limite_inicio, _i, _len;
      ativs = this.getAtividades();
      for (i = _i = 0, _len = ativs.length; _i < _len; i = ++_i) {
        ativ = ativs[i];
        if (parseInt(ativ.id) === parseInt(id)) {
          horario_inicio = formatahora(new Date());
          d = new Date();
          d.setMinutes(d.getMinutes() + Atividades.tolerancia);
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
      return this.setAtividades(ativs);
    };

    Atividades.prototype.atualizaOntem = function(ativ) {
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

    Atividades.prototype.atualizaHoje = function(ativ) {
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
        li += '<button class="ui-btn start" onclick="atividadesview.start(' + ativ.id + ')">iniciar</button><p style="display:none" class="h_inicio_registrado"></p>';
      }
      li += '</div> <div class="ui-block-b"> </div> <div class="ui-block-c"> <button class="ui-btn" onclick="atividadesview.fim(' + ativ.id + ')">finalizar</button></div> </div>';
      li += "</li>";
      return li;
    };

    Atividades.prototype.atualizaAmanha = function(ativ) {
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

    Atividades.prototype.atualizaUI = function() {
      var ativ, atividades, hoje, htmlamanha, htmlhoje, htmlontem, _i, _len;
      atividades = this.getAtividades();
      hoje = str2datePT(formatadata(new Date()));
      if (atividades) {
        htmlhoje = "";
        htmlontem = "";
        htmlamanha = "";
        for (_i = 0, _len = atividades.length; _i < _len; _i++) {
          ativ = atividades[_i];
          if ((str2datePT(ativ.data) < hoje) || (ativ.realizada === true)) {
            htmlontem += this.atualizaOntem(ativ);
          } else if (str2datePT(ativ.data) === hoje) {
            htmlhoje += this.atualizaHoje(ativ);
          } else {
            htmlamanha += this.atualizaAmanha(ativ);
          }
        }
        $('#ulhoje').html(htmlhoje);
        $('#ulontem').html(htmlontem);
        $('#ulamanha').html(htmlamanha);
        $('#ulamanha,#ulontem').listview({
          autodividers: true,
          autodividersSelector: function(li) {
            return $(li).find('.data').text();
          }
        }).listview('refresh');
        $('#ulhoje').listview().listview('refresh');
        $('div[data-role=collapsible]').collapsible();
        $('li[data-role=collapsible]').collapsible();
        $('input.numero').textinput();
        return $('input.numero').textinput('refresh');
      }
    };

    Atividades.prototype.clearUI = function() {
      var htmlamanha, htmlhoje, htmlontem;
      htmlhoje = "";
      htmlontem = "";
      htmlamanha = "";
      $('#ulhoje').html(htmlhoje);
      $('#ulontem').html(htmlontem);
      $('#ulamanha').html(htmlamanha);
      $('#ulamanha,#ulontem').listview().listview('refresh');
      return $('#ulhoje').listview().listview('refresh');
    };

    return Atividades;

  })();

}).call(this);

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