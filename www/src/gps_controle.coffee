
class window.GPSControle
    @gps = null 
    @time = 0
    @accuracy = 1000
    @TIMEOUT = 10 # 10segundos
    @HighAccuracy = true

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
        $(document).on "pageinit","#pgperfil", ()->
            $( "#pgperfiltimeout" ).on 'slidestop', ( event ) ->
                  GPSControle.TIMEOUT = parseInt($('#pgperfiltimeout').val())
                  console.log("Novo timeout GPS: #{GPSControle.TIMEOUT}")
       
    mostraGPS:()->
        $("#pganotar-gps").html(GPSControle.gps)
        $("#pganotar-gps-accuracy").html(" (#{parseInt(GPSControle.accuracy)} m)") 

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
                enableHighAccuracy: GPSControle.HighAccuracy
                timeout: 1*60*1000
            }
         )
    watchSucess: (position) ->
        $("#barrastatus p.hora").html(formatahora(new Date()).slice(0,5)+"h")
        timeout = (new Date()).getTime() - GPSControle.time 
        if (timeout > GPSControle.TIMEOUT*1000) or (GPSControle.accuracy > parseInt(position.coords.accuracy))
            GPSControle.gps = position.coords.latitude+", "+position.coords.longitude
            GPSControle.lat = position.coords.latitude
            GPSControle.lng = position.coords.longitude
            GPSControle.accuracy = parseInt(position.coords.accuracy)
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

