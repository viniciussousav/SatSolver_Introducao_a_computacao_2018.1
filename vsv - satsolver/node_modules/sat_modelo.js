exports.solve = function (fileName) {
  
  let formula = readFormula(fileName)
  let result = doSolve(formula.clauses, formula.variables)
  return result // two fields: isSat and satisfyingAssignment
}

// Receives the current assignment and produces the next one


function nextAssignment(assignmentArray) { //FUNCAO QUE GERA TODAS AS COMBINAÇÕES

  var check = true;
  for (var i = 0; i < assignmentArray.length && check; i++) {
    if (assignmentArray[i] == false) {
      assignmentArray[i] = true;
      check = false
    } else {
      assignmentArray[i] = false;
    }
  }
  return assignmentArray
}

function doSolve(clauses, assignmentArray) { //FUNCAO QUE TESTA AS POSSIBILIDADES
  
  let isSat = false
  let g = 0;
  
  while ((!isSat) && g < Math.pow(2, assignmentArray.length)) { 
    
    let clausesCopy = new Array()

    for (let i = 0; i < clauses.length; i++) {
      clausesCopy[i] = new Array()
      for (let j = 0; j < clauses[i].length; j++) {
        for (let m = 0; m < variaveis.length; m++) {
          if (Math.abs(clauses[i][j]) == variaveis[m]) {
            if (clauses[i][j] > 0) {
              clausesCopy[i].push(assignmentArray[m])
            } else {
              clausesCopy[i].push(!assignmentArray[m])
            }
          }
        }
      }
    }


    var checkSat = true;
    //1.ALGORITMO DE CONFERIR COMBINAÇÕES
    for(let i = 0; i < clausesCopy.length; i++){
      var temTrue = false;
      for(let j = 0;j < clausesCopy[i].length && !temTrue; j++){
        if(clausesCopy[i][j] == true){
          clausesCopy[i] = true
          temTrue = true
        }
      }
      if(!temTrue){
        clausesCopy[i] = false
        checkSat = false;
      }
    }

    if(checkSat){
      isSat = true
    } else{
      assignmentArray = nextAssignment(assignmentArray)
    }
    g++
  }

  let result = { 'isSat': isSat, satisfyingAssignment: null }
  if (isSat) {
    result.satisfyingAssignment = assignmentArray
  }
  return result
}

function readClauses(text) { //SEPARAÇÃO DAS CLAUSÚLAS
  
  var clauses = [] //array que armazena as clausulas

  //1.gerando as clausulas
  for (var i = 0; i < text.length; i++) {
    if (text[i].charAt(0) != 'c' && text[i].charAt(0) != 'p') {
      var x = text[i].split(" ")
      x.pop()
      clauses.push(x)
    }
  }
  return clauses
}

var variaveis = []

function readVariables(clauses) { //MOSTRANDO ATRIBUIÇÃO INICIAL
  
  //1.identificando todas as variaveis
  for (var i = 0; i < clauses.length; i++) { 
    for (var j = 0; j < clauses[i].length; j++) {
      let check = variaveis.indexOf(Math.abs(clauses[i][j]))
      if (check == -1) {
        variaveis.push(Math.abs(clauses[i][j]))
      }
    }
  }
  variaveis.sort()

  var assignmentArray = []
  for(var i = 0; i < variaveis.length; i++){
    assignmentArray.push(false)
  } 

  return assignmentArray
}

function checkProblemSpecification(text, clauses, variaveis) {
  
  var stop = false
  var linha = []
  
  for(var i = 0; i < text.length && !stop; i++){
    if(text[i].charAt(0) == 'p'){
      linha = text[i].split(" ");
      stop = true;
    }
  }
  var quantVariaveis = linha[2]
  var quantClauses = linha[3]
  
  if (quantVariaveis != variaveis.length || quantClauses != clauses.length ){
    if(quantVariaveis != variaveis.length){
      console.log("O numero de variaveis inseridas não condiz")
    }
    if(quantClauses != clauses.length){
      console.log("O numero de clausulas inseridas nao condiz")
    }
    return false
  } else {
    return true
  }

}

function readFormula(fileName) {
  // To read the file, it is possible to use the 'fs' module.
  var fs = require("fs")
  let text = fs.readFileSync(fileName, 'utf8').split('\n')
  let clauses = readClauses(text)
  let variables = readVariables(clauses)

  // In the following line, text is passed as an argument so that the function
  // is able to extract the problem specification.
  let specOk = checkProblemSpecification(text, clauses, variables)

  let result = { 'clauses': [], 'variables': [] }
  if (specOk) {
    result.clauses = clauses
    result.variables = variables
  }
  return result
}


