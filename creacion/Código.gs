function propiedades(){
//Aquí defines tus "variables de entorno"
//PropertiesService.getScriptProperties().setProperty('llave', 'valor');

}


function crea_reporte() {
  const spreadsheetUrl = PropertiesService.getScriptProperties().getProperty('spreadsheet')
  const dbColaboradores = SpreadsheetApp.openByUrl(spreadsheetUrl).getSheetByName('Colaboradores')
  const config = SpreadsheetApp.openByUrl(spreadsheetUrl).getSheetByName('Config')
  const registros = SpreadsheetApp.openByUrl(spreadsheetUrl)
  const check = config.getRange('B2').getValue()
  const rangoRegistros = config.getRange('B3').getValue()
  const nombreBucket = config.getRange('B5').getValue()
  const datosColaboradores = dbColaboradores.getRange(rangoRegistros).getValues()
  
  if (check == true){
    for(const indiceFila in datosColaboradores){
      Logger.log(`${datosColaboradores[indiceFila][0]}`)
      const perfilEmpleado = defineAtributosReporte(datosColaboradores[indiceFila])
      idFolder = creaCarpeta(perfilEmpleado, nombreBucket)
      idArchivo = creaArchivo(perfilEmpleado,idFolder)
      registrarDocumentos(registros, perfilEmpleado.nombre, perfilEmpleado.areaColaboracion, idArchivo)
    }  
  }
}

function convertirFecha(fechaString){
    //const fechaString = 'Fri Apr 21 1995 00:00:00 GMT-0600 (hora estándar central)'
    const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto',
                   'Septiembre','Octubre','Noviembre','Diciembre']
    const fecha = new Date(fechaString)
    const nuevoFormatoFecha = `${dias[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`
    Logger.log(nuevoFormatoFecha)
    return nuevoFormatoFecha
  }


function defineAtributosReporte(datosEmpleado){
  const perfilEmpleado = {
    nombre: datosEmpleado[0],
    numTelefonico: datosEmpleado[1],
    correoElectronico: datosEmpleado[2],
    fechaNacimiento: convertirFecha(datosEmpleado[3]),
    curp: datosEmpleado[4],
    sexo:datosEmpleado[5],
    edad:datosEmpleado[6],
    rfc:datosEmpleado[7],
    lugarProcedencia:datosEmpleado[8],
    direccion:datosEmpleado[9],
    proyecto:datosEmpleado[10],
    areaColaboracion:datosEmpleado[11],
    coordinadorInmediato:datosEmpleado[12],
    fechaComienzo:convertirFecha(datosEmpleado[13]),
    puestoDesempenia:datosEmpleado[14],
    gradoMaxEstudio:datosEmpleado[15],
    documentoCompruebaGrado:datosEmpleado[16],
    archivoCompruebaGrado:datosEmpleado[17],
    tipoDocumentoGrado:datosEmpleado[18],
    certificaciones:datosEmpleado[19],
    documentoCertificacion:datosEmpleado[20],
    contactoEmergenciaNom:datosEmpleado[21],
    contactoEmergenciaTel:datosEmpleado[22],
    familiograma:datosEmpleado[23],
    dependientesEconomicos:datosEmpleado[24],
    parentesco:datosEmpleado[25],
    padecimientoEnfermedad:datosEmpleado[26],
    tratamientoMedico: datosEmpleado[27],
    chequeoMedico:datosEmpleado[28],
    evaluacionRasgosPersonalidad: datosEmpleado[29],
    evaluacionHabilidadesSociales: datosEmpleado[30],
    evaluacionValores: datosEmpleado[31],
    evaluacionFuncionesEjecutivas: datosEmpleado[32],
    evaluacionEstres: datosEmpleado[33],
    estilosAfrontamiento: datosEmpleado[34],
    evaluacionEstilosAfrontamiento: datosEmpleado[35],
    evaluacionAnsiedad: datosEmpleado[36],
    evaluacionDepresion: datosEmpleado[37],
    DXPsicometricoIntegral: datosEmpleado[38],
    evaluacionAmbienteLaboral: datosEmpleado[39],
    autoevaluacionDesempenioLaboral: datosEmpleado[40],
    evaluacionDesempenioLaboral: datosEmpleado[41],
    reporteLaboralIntegral: datosEmpleado[42],
    evaluacionMultiaxial: datosEmpleado[43],
    observaciones: datosEmpleado[44],
    recomendaciones:datosEmpleado[45]
  }
  return perfilEmpleado
}

function creaCarpeta(datosEmpleado, nombreBucket){
  try{
    const valor = `${(datosEmpleado.nombre).trim()}`
    const folder_contenedor = DriveApp.getFoldersByName(nombreBucket).next().getId()
    const folders = DriveApp.getFolderById(folder_contenedor).getFoldersByName(valor)
     if (folders.hasNext()) {
        let folderId = folders.next().getId()
        return folderId
      } 
     else {
        let folderId = DriveApp.getFolderById(folder_contenedor).createFolder(valor).getId()
        return folderId
      }
      
    }
  catch(e){
    Logger.log(`Error: ${e.toString()}`)
    }
}
  
 
function creaArchivo(perfilEmpleado, idFolder){
    const idPlantilla = DriveApp.getFileById(PropertiesService.getScriptProperties().getProperty('idPlantilla'))
    const folder = DriveApp.getFolderById(idFolder)
    const idReporteColaborador = idPlantilla.makeCopy(folder).getId()
    const archivo = DocumentApp.openById(idReporteColaborador)
    const contenido = archivo.getBody()
    contenido.replaceText('{nombre}', perfilEmpleado.nombre)
    contenido.replaceText('{numTelefonico}', perfilEmpleado.numTelefonico)
    contenido.replaceText('{correoElectronico}', perfilEmpleado.correoElectronico)
    contenido.replaceText('{fechaNacimiento}', perfilEmpleado.fechaNacimiento)
    contenido.replaceText('{curp}', perfilEmpleado.curp)
    contenido.replaceText('{sexo}', perfilEmpleado.sexo)
    contenido.replaceText('{edad}', perfilEmpleado.edad)
    contenido.replaceText('{rfc}', perfilEmpleado.rfc)
    contenido.replaceText('{lugarProcedencia}', perfilEmpleado.lugarProcedencia)
    contenido.replaceText('{direccion}', perfilEmpleado.direccion)
    contenido.replaceText('{proyecto}', perfilEmpleado.proyecto)
    contenido.replaceText('{puestoDesempenia}', perfilEmpleado.puestoDesempenia)
    contenido.replaceText('{areaColaboracion}', perfilEmpleado.areaColaboracion)
    contenido.replaceText('{coordinadorInmediato}', perfilEmpleado.coordinadorInmediato)
    contenido.replaceText('{fechaComienzo}', perfilEmpleado.fechaComienzo)
    contenido.replaceText('{gradoMaxEstudio}', perfilEmpleado.gradoMaxEstudio)
    contenido.replaceText('{documentoCompruebaGrado}', perfilEmpleado.documentoCompruebaGrado)
    contenido.replaceText('{certificaciones}', perfilEmpleado.certificaciones)
    contenido.replaceText('{documentoCertificacion}', perfilEmpleado.documentoCertificacion)
    contenido.replaceText('{contactoEmergenciaNom}', perfilEmpleado.contactoEmergenciaNom)
    contenido.replaceText('{contactoEmergenciaTel}', perfilEmpleado.contactoEmergenciaTel)
    contenido.replaceText('{parentesco}', perfilEmpleado.parentesco)
    contenido.replaceText('{familiograma}', perfilEmpleado.familiograma)
    contenido.replaceText('{dependientesEconomicos}', perfilEmpleado.dependientesEconomicos)
    contenido.replaceText('{padecimientoEnfermedad}', perfilEmpleado.padecimientoEnfermedad)
    contenido.replaceText('{chequeoMedico}', perfilEmpleado.chequeoMedico)
    contenido.replaceText('{tratamientoMedico}', perfilEmpleado.tratamientoMedico)
    contenido.replaceText('{evaluacionRasgosPersonalidad}', perfilEmpleado.evaluacionRasgosPersonalidad)
    contenido.replaceText('{evaluacionHabilidadesSociales}', perfilEmpleado.evaluacionHabilidadesSociales)
    contenido.replaceText('{evaluacionValores}', perfilEmpleado.evaluacionValores)
    contenido.replaceText('{evaluacionFuncionesEjecutivas}', perfilEmpleado.evaluacionFuncionesEjecutivas)
    contenido.replaceText('{evaluacionEstres}', perfilEmpleado.evaluacionEstres)
    contenido.replaceText('{evaluacionEstilosAfrontamiento}', perfilEmpleado.evaluacionEstilosAfrontamiento)
    contenido.replaceText('{evaluacionAnsiedad}', perfilEmpleado.evaluacionAnsiedad)
    contenido.replaceText('{evaluacionDepresion}', perfilEmpleado.evaluacionDepresion)
    contenido.replaceText('{DXPsicometricoIntegral}', perfilEmpleado.DXPsicometricoIntegral)
    contenido.replaceText('{evaluacionAmbienteLaboral}', perfilEmpleado.evaluacionAmbienteLaboral)
    contenido.replaceText('{autoevaluacionDesempenioLaboral}', perfilEmpleado.autoevaluacionDesempenioLaboral)
    contenido.replaceText('{evaluacionDesempenioLaboral}', perfilEmpleado.evaluacionDesempenioLaboral)
    contenido.replaceText('{reporteLaboralIntegral}', perfilEmpleado.reporteLaboralIntegral)
    contenido.replaceText('{evaluacionMultiaxial}', perfilEmpleado.evaluacionMultiaxial)
    contenido.replaceText('{observaciones}', perfilEmpleado.observaciones)
    contenido.replaceText('{recomendaciones}', perfilEmpleado.recomendaciones)
    archivo.setName(`Reporte integral | ${perfilEmpleado.nombre}`)
    archivo.saveAndClose()   
    const idDocumento =  DriveApp.getFolderById(idFolder).getFilesByName(`Reporte integral | ${perfilEmpleado.nombre}`).next().getId()
    return idDocumento
}

function registrarDocumentos(sheet, nombre, areaColabora, idDocumento){
  const hojasRegistros = ['Registro de ids', areaColabora]
  for(const hojaRegistro in hojasRegistros){
    const hoja = sheet.getSheetByName((`${hojasRegistros[hojaRegistro]}`).trim())
    hoja.appendRow([ nombre, areaColabora,idDocumento ])
  }
}


