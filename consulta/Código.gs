// Inicio de  la  función para la obtención del html
function doGet() {
  const template =  HtmlService.createTemplateFromFile('index'); // Método para la creación del  template
  return template.evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1.0'); // se evalua la metadata de la cabecera
}

//busqueda de los datos dentro de la  base de datos
function getUrlsDocumentos(nombre, hoja){
  Logger.log(Session.getActiveUser().getEmail())
  const urlDB = PropertiesService.getScriptProperties().getProperty('urlDB')
  const ss = SpreadsheetApp.openByUrl(urlDB)
  const dataR = ss.getSheetByName(hoja)
  const data = dataR.getRange(1, 1, dataR.getLastRow(), 3).getValues()
  const listaColaboradores = data.map(function(r) { return r[0] })
  const colaborador = listaColaboradores.indexOf(nombre)
  
  if (colaborador > -1){
    //Logger.log(buscaResultados(nombre, data))
    return buscaResultados(nombre, data)
  }
  
  else{
     //Logger.log('valor de colobarador no encontrado')
    return 'valor de colobarador no encontrado'
    }
  }

 
function buscaResultados(nombre, data){
  const resultados = data.map(function(x){
    if(x[0] == nombre){
      return x[2]
      }
    else{ return null }
    }
  )
  
  const ids = (resultados) => { 
    const res = []
    for(const valor in resultados){
      if(resultados[valor] != null){
        res.push(resultados[valor])
      }
    }
    return res
  }
  return ids(resultados)
}

//Autocomletado
function autoCompletar(hoja){
  const urlDB = PropertiesService.getScriptProperties().getProperty('urlDB')
  const ss = SpreadsheetApp.openByUrl(urlDB);
  const dataR = ss.getSheetByName(hoja);
  const data = dataR.getRange(1, 1).getDataRegion().getValues()
  const nombreCompleto = {};
  data.forEach(function(n){
     nombreCompleto[n[0]] = null;
 });
  //Logger.log(nombreCompleto); // obtener el dato del Nombre unicamente con el el valor del nombre y lo demas en nulo para la integración con materialize
  return nombreCompleto;
  
}


//Funcion para traer los archivos .js o .css
function include(filename){
  return HtmlService.createTemplateFromFile(filename).getRawContent();
}