class window.Atividades
  @tolerancia = 5
  
  sincronizar: ()->
        atividadesPendentes = @getAtividades() 

        $.post( "http://sav.wancharle.com.br/salvar/", {'usuario':userview.getUsuario(),'json':JSON.stringify(atividadesPendentes)}, 
            ()-> 
                console.log('envio ok')
                $( "#painel" ).panel( "close" )
            ,'json')
        .done((data)->
              atividadesview.setAtividades(data)
              atividadesview.atualizaUI()

        ).fail((error,textstatus)->
            alert('Não foi possível enviar os dados registrados ao servidor. Isso ocorre provavelmente por falta de conexão de dados no momento. Tente novamente quando tver um conexão de internet estável')
            console.log(textstatus)
        )
         
  getAtividades: ()->
    ativs= window.localStorage.getObject('lista_de_atividades')
    if ativs
      return ativs
    else
      return new Array()

  setAtividades:(atividades)->
    window.localStorage.setObject('lista_de_atividades',atividades)

  fim: (id)->
    n_presentes = parseInt($('#txtpresentes'+id).val())
    n_participantes = parseInt($('#txtparticipantes'+id).val())
    if isInteger(n_presentes) and isInteger(n_participantes)
      if n_presentes < n_participantes
          alert("O número de pessoas presentes deve ser igual ou superior ou número de pessoas participantes da atividade!")
          return

      horario_fim = formatahora(new Date())
      d = new Date()
      d.setMinutes(d.getMinutes()-Atividades.tolerancia)
      limite_fim = formatahora(d)


      ativs = @getAtividades()
      for ativ, i in ativs
        if parseInt(ativ.id) == parseInt(id)
          if ativ.h_inicio_registrado
            if limite_fim > ativ.h_fim
              alert("Periodo para finalizar esta atividade terminou.
              Por isso, esta atividade NÃO será registrada.")
              return false

            ativ.h_fim_registrado = horario_fim
            ativ.gps = GPSControle.gps
            ativ.numero_de_presentes = n_presentes
            ativ.numero_de_participantes = n_participantes
            ativ.realizada=true
          else
            alert("É preciso iniciar a atividade antes de finalizar!")
            return false
      @setAtividades(ativs)
      atividadesview.atualizaUI()
    else
      alert("Para finalizar a atividade é preciso informar o número de participantes e presentes")
      return false


  start:(id)->
    ativs = @getAtividades()
    for ativ, i in ativs
      if parseInt(ativ.id) == parseInt(id)
        horario_inicio = formatahora(new Date())
        d = new Date()
        d.setMinutes(d.getMinutes()+Atividades.tolerancia)
        limite_inicio = formatahora(d)
        if limite_inicio > ativ.h_inicio
          ativ['h_inicio_registrado'] = horario_inicio
          $('li.ativ'+id+ ' button.ui-btn.start').hide()
          $('li.ativ'+id+ ' p.h_inicio_registrado').show()
          $('li.ativ'+id+ ' p.h_inicio_registrado').html('Iniciou as '+horario_inicio.slice(0,5)+'h')
        else
          alert("Vc não pode iniciar esta atividade ainda!")
        
    @setAtividades(ativs) 
  atualizaOntem: (ativ) ->
    li = "<li>"
    li+="<h2 data-inset='false'>"+ativ['h_inicio'].slice(0,5)+"h - "+ativ['h_fim'].slice(0,5)+"h</h2><div>"
    li+="<p> Gerência: "+ativ['gerencia']+ "</p>"
    li+="<span style='display:none' class='data'> "+ativ['data']+ '</span>'
    if ativ.realizada
      li+="<p>Realizada de "+ativ['h_inicio_registrado'].slice(0,5)+"h às "+ativ['h_fim_registrado'].slice(0,5)+"h</p>"
    else
      li+="<p>De "+ativ['h_inicio'].slice(0,5)+"h às "+ativ['h_fim'].slice(0,5)+"h</p>"
    if ativ['tipo'] == Atividade.TIPO_AULA
        li+="<p> Participantes/Presentes: "+ ativ['numero_de_participantes'] + "/" + ativ['numero_de_presentes'] + "</p>"
        
    li+="<p>GPS: " + ativ['gps']+ "</p>"
    li+="<p>Professor: "+ativ['usuario']+"</p>"
    return li+"</div></li>"

  atualizaHoje: (ativ) ->
    li = "<li class='ativ"+ativ.id+"' data-role='collapsible' data-iconpos='right' data-inset='false'>"
    li+="<h2 data-inset='false'>"+ativ['h_inicio'].slice(0,5)+'h - '+ativ['h_fim'].slice(0,5)+"h</h2>"
    li+="<span style='display:none' class='data'> "+ativ['data']+ '</span>'
    li+="<p> Gerência: "+ativ['gerencia']+ "</p>"
    li+="<p> Local: "+ativ['local']+"</p>"
    li+="<p> De "+ativ['h_inicio'].slice(0,5)+"h às "+ativ['h_fim'].slice(0,5)+"h</p>"
    li+="<div data-role=\"fieldcontain\">
      <label for=\"txtpresentes#{ativ.id}\">Presentes:</label>
      <input name=\"txtpresentes#{ativ.id}\" class=\"numero\" id=\"txtpresentes#{ativ.id}\" step=\"1\"  value=\"#{getIntVazio(ativ.numero_de_presentes)}\" type=\"number\"/>
      </div>
      <div data-role=\"fieldcontain\">
      <label for=\"txtparticipantes#{ativ.id}\">Participantes:</label>
      <input name=\"txtparticipantes#{ativ.id}\" class=\"numero\" id=\"txtparticipantes#{ativ.id}\" step=\"1\"  value=\"#{getIntVazio(ativ.numero_de_participantes)}\" type=\"number\"/>
      </div>"
      
    li+='<div class="ui-grid-b">
    <div class="ui-block-a">'
    if ativ.h_inicio_registrado
      li+='<p class="h_inicio_registrado">Iniciou as '+ativ.h_inicio_registrado.slice(0,5)+ 'h</p>'
    else
      li+='<button class="ui-btn start" onclick="atividadesview.start('+ativ.id+')">iniciar</button><p style="display:none" class="h_inicio_registrado"></p>'
    li+='</div>
    <div class="ui-block-b"> </div>
    <div class="ui-block-c"> <button class="ui-btn" onclick="atividadesview.fim('+ativ.id+')">finalizar</button></div>
</div>'
    li+="</li>"
    return li


  atualizaAmanha: (ativ) ->
    li = "<li >"
    li+="<h2 data-inset='false'>"+ativ['h_inicio'].slice(0,5)+"h - "+ativ['h_fim'].slice(0,5)+"h</h2><div>"
    li+="<p> Gerência: "+ativ['gerencia']+ "</p>"
    li+="<span  style='display:none' class='data'> "+ativ['data']+ '</span>'
    li+="<p>Local: "+ativ['local']+"</p>"
    li+="<p>De "+ativ['h_inicio'].slice(0,5)+"h às "+ativ['h_fim'].slice(0,5)+"h</p>"
    li+="<p>Professor: "+ativ['usuario']+ "</p>"
    return li+"</div></li>"

  atualizaUI: ()->
      atividades = @getAtividades()
      #d=new Date()
      #alert(d)
      #alert(formatadata(d))

      hoje = str2datePT(formatadata(new Date())) 
      #alert(hoje)
      if atividades
          htmlhoje = ""
          htmlontem = ""
          htmlamanha = ""
          for ativ in atividades
            if (str2datePT(ativ.data)< hoje) or (ativ.realizada==true)
              htmlontem += @atualizaOntem(ativ)
            else if str2datePT(ativ.data) == hoje
              htmlhoje += @atualizaHoje(ativ)
            else
              htmlamanha += @atualizaAmanha(ativ)

          $('#ulhoje').html(htmlhoje)
          $('#ulontem').html(htmlontem)
          $('#ulamanha').html(htmlamanha)
          $('#ulamanha,#ulontem').listview({ 
            autodividers:true,
            autodividersSelector:  ( li ) ->
                  return $(li).find('.data').text()
          }).listview('refresh')

          $('#ulhoje').listview().listview('refresh')
          
          #fix: ao atualizar um collapsible eh necessario chamar sua classe
          $('div[data-role=collapsible]').collapsible()
          $('li[data-role=collapsible]').collapsible()
          $('input.numero').textinput()
          $('input.numero').textinput('refresh')
          #fimfix.

  clearUI: ()->
          htmlhoje = ""
          htmlontem = ""
          htmlamanha = ""
          $('#ulhoje').html(htmlhoje)
          $('#ulontem').html(htmlontem)
          $('#ulamanha').html(htmlamanha)
          $('#ulamanha,#ulontem').listview().listview('refresh')

          $('#ulhoje').listview().listview('refresh')
          





# vim: set ts=2 sw=2 sts=2 expandtab:
