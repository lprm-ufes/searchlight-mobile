

class ListView
  @dataPool: null

  constructor: (@slsapi) ->
    $.mobile.changePage("#pghistorico",{changeHash:false})

    ListView.dataPool = SLSAPI.dataPool.createDataPool(@slsapi.mashup)

    @loadData()
  
  loadData: ->
    position = { latitude:GPSControle.lat, longitude:GPSControle.lng, distance:10000}
    ListView.dataPool.loadAllData('',position)

    @slsapi.off SLSAPI.dataPool.DataPool.EVENT_LOAD_STOP
    @slsapi.on SLSAPI.dataPool.DataPool.EVENT_LOAD_STOP, (datapool)->
      console.log(datapool.dataSources[0].notes)
      console.log(datapool.dataSources[1].notes)

  selecionar: () ->

module.exports= {ListView: ListView}
# vim: set ts=2 sw=2 sts=2 expandtab:
