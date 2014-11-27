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
