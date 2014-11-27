# vim: set ts=3 sw=2 sts=2 expandtab:

window.zeroPad= (num, places) ->
    zero = places - num.toString().length + 1
    return Array(+(zero > 0 && zero)).join("0") + num
window.isInteger = (value)->
    intRegex = /^\d+$/
    return intRegex.test(value)

window.getIntVazio = (value)->
  if value
      return parseInt(value)
  else
      return ""
# fix para console.log em browsers antigos
if (not window.console)
    window.console = {log: () ->  }

  
Storage.prototype.setObject = (key, value) ->
        this.setItem(key, JSON.stringify(value))


Storage.prototype.getObject = (key) ->
        value = this.getItem(key)
        return value and JSON.parse(value)

window.str2datePT = (data)->
    #return Date.parse(data.slice(-4)+"-"+data.slice(3,5)+"-"+data.slice(0,2))
    return new Date(parseInt(data.slice(-4)),parseInt(data.slice(3,5)) - 1,parseInt(data.slice(0,2))).getTime()

window.formatadata = (data) ->
    return zeroPad(data.getDate(),2)+"/"+zeroPad(parseInt(data.getMonth())+1,2)+'/'+data.getFullYear()


window.formatahora = (data) ->
    return zeroPad(data.getHours(),2)+":"+zeroPad(data.getMinutes(),2)+':'+zeroPad(data.getSeconds(),2)
      
      

class window.App
    # Application Constructor
    constructor: () ->
        @storage = window.localStorage
        @userview = null
        this.bindEvents()
          
    bindEvents: () ->
        document.addEventListener('deviceready', this.onDeviceReady, false)

    
    onDeviceReady: () ->
        app.main()

    mostraHistorico: ()->
      anotacoesview.sincronizar()
               
    positionSucess: (gps) ->
        @userview.load()

    positionError: (error) ->
        alert('Não foi possível obter sua localização. Verifique as configurações do seu smartphone.') 

    main: () ->
        console.log('Received Event: onDeviceReady' )       
        window.userview=new UserView()
        userview.load()
        window.gpscontrole = new GPSControle()



#window.localStorage.setObject('lista_de_anotacoes',window.ativtest);
