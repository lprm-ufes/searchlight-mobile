
class window.GPSControle
    @gps = null 
    @time = 0
    @accuracy = 1000

    @estaAberto: ->
         gpsdata = window.localStorage.getItem('gps_data')
         if gpsdata
            return true
         else
            return false

    constructor: () ->
        @storage = window.localStorage
        GPSControle.accuracy = 1000
        @load()
        @iniciaWatch()
        @mostraGPS()
       
    mostraGPS:()->
        $("#barrastatus p.gps").html(GPSControle.gps+"<br>("+parseInt(GPSControle.accuracy)+" metros)")

    load: ()-> 
        if GPSControle.estaAberto()
            GPSControle.gps = @storage.getItem('gps_data')
            GPSControle.accuracy = @storage.getItem('gps_accuracy')
            GPSControle.time = @storage.getItem('gps_time')
            @mostraGPS()
            return true
        else
            return null

    save: ()->
      @storage.setItem('gps_data',GPSControle.gps)
      @storage.setItem('gps_time',GPSControle.time)
      @storage.setItem('gps_accuracy',GPSControle.accuracy)

    iniciaWatch: () =>
         @watchid = navigator.geolocation.watchPosition(
            (position) =>
                @watchSucess(position)
            ,(error) =>
                @watchError(error)
            ,{
                enableHighAccuracy: true
                timeout: 1*60*1000
            }
         )
    watchSucess: (position) ->
        $("#barrastatus p.hora").html(formatahora(new Date()).slice(0,5)+"h")
        timeout = (new Date()).getTime() - GPSControle.time 
        if (timeout > 600000) or ((GPSControle.accuracy - position.coords.accuracy) > 2)
            GPSControle.gps = position.coords.latitude+", "+position.coords.longitude
            GPSControle.accuracy = position.coords.accuracy 
            GPSControle.time = (new Date()).getTime()
            console.log("latlong: "+GPSControle.gps + " accuracy:"+position.coords.accuracy)
            @mostraGPS()
            @save()


    watchError: (error) ->
        if error.code == error.PERMISSION_DENIED
           alert("Para que o sistema funcione por favor ative o GPS do seu telefone")

        if error.code == error.POSITION_UNAVAILABLE
           alert("Não estou conseguindo obter uma posição do GPS, verifique se sua conexão GPS está ativa")

        if error.code == error.TIMEOUT
           console.log('timeout gps: ' + error.message)

# vim: set ts=2 sw=2 sts=2 expandtab:

