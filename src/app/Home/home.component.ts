import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';

declare var go :any;
@Component({
  selector: 'home',
  templateUrl: './home.html'
})
@Injectable()
export class Home implements OnInit{

  public $;
  public myDiagram;
  public jsonIncorrecto = true;
  public input; // input parseado a JSON
  public distancia =0;
  public mismaAltura = 0;
  public nodeDataArray = [];
  public linkDataArray = [];
  public textJoin;
  public inputExample : any = {};
  public texto;
  public myDiagramDiv;
  public show;
  public showText='Ver más';



  ngOnInit() {
   this.show= false;
   this.$ = go.GraphObject.make;
   this.inputExample.Sujeto = {};
   this.inputExample.Sujeto.N = "Pedro";
   this.inputExample.Predicado = {};
   this.inputExample.Predicado.V = "trabaja";
   this.inputExample.Predicado.CCL="en google"
   this.myDiagram = new go.Diagram("myDiagramDiv");
   //this.cajaNegra(this.inputExample);
  }

  initDiagramaNOdesTemplate(){
        this.myDiagram.nodeTemplate =
        this.$(go.Node, "Auto",
           new go.Binding("location", "loc", go.Point.parse),
          this.$(go.Shape,
            { figure: "RoundedRectangle",
              fill: "white" },  // default Shape.fill value
            new go.Binding("fill", "color")),  // binding to get fill from nodedata.color
          this.$(go.TextBlock,
            { margin: 5 },
            new go.Binding("text", "key"))  // binding to get TextBlock.text from nodedata.key
        );
        this.myDiagram.nodeTemplateMap.add('rectangulo',  this.$(go.Node, "Auto",
           new go.Binding("location", "loc", go.Point.parse),
          this.$(go.Shape,
            { figure: "RoundedRectangle",
              fill: "white" },  // default Shape.fill value
            new go.Binding("fill", "color")),  // binding to get fill from nodedata.color
          this.$(go.TextBlock,
            { margin: 5 },
            new go.Binding("text", "key"))  // binding to get TextBlock.text from nodedata.key
        ));

        this.myDiagram.nodeTemplateMap.add('elipse',  this.$(go.Node, "Auto",
           new go.Binding("location", "loc", go.Point.parse),
          this.$(go.Shape,
            { figure: "Ellipse",
              fill: "white" },  // default Shape.fill value
            new go.Binding("fill", "color")),  // binding to get fill from nodedata.color
          this.$(go.TextBlock,
            { margin: 5 },
            new go.Binding("text", "key"))  // binding to get TextBlock.text from nodedata.key
        ));


        this.myDiagram.linkTemplate = // por defecto
        this.$(go.Link,
          this.$(go.Shape),
          this.$(go.Shape, { toArrow: "Standard" }),
          this.$(go.TextBlock, this.textJoin, { segmentOffset: new go.Point(0, -10) })  // aqui se le pone la flecha el noombe que deseemmos :)
        );

        this.myDiagram.linkTemplateMap.add("Normal", this.$(go.Link,
          this.$(go.Shape),
          this.$(go.Shape, { toArrow: "Standard" }),
          this.$(go.TextBlock, this.textJoin, { segmentOffset: new go.Point(0, -10) })  // aqui se le pone la flecha el noombe que deseemmos :)
        ));

        this.myDiagram.linkTemplateMap.add("NormalSinText", this.$(go.Link,
          this.$(go.Shape),
          this.$(go.Shape, { toArrow: "Standard" }) // aqui se le pone la flecha el noombe que deseemmos :)
        ));

        this.myDiagram.linkTemplateMap.add("LineaUnionSimple", this.$(go.Link,
          this.$(go.Shape),
          this.$(go.TextBlock, "", { segmentOffset: new go.Point(0, -10) })  // aqui se le pone la flecha el noombe que deseemmos :)
        ));

        this.myDiagram.linkTemplateMap.add("influence",  // Linea curva 
        this.$(go.Link,
          { curve: go.Link.Bezier, toShortLength: 8 },
          this.$(go.Shape,
            { stroke: "green", strokeWidth: 1.5 }),
          this.$(go.Shape,
            {
              fill: "green",
              stroke: null,
              toArrow: "Standard",
              scale: 1.5
            })
        ));
    }

  createAndAddNode(text , color, tipoNodo, position){
        let node: any = {};      
        node.key = text;
        node.color =  color || "lightblue";
        node.category = tipoNodo || "Auto";
        node.loc =position || (this.distancia +" " + ++this.mismaAltura)
        this.distancia+=200
        if(this.distancia === 0 || this.distancia===200)
          this.mismaAltura+=200
        this.nodeDataArray.push(node);
    }
  addLinks(key1, key2, tipoUnion){
      let link : any = {};
      link.from = key1;
      link.to = key2;
      link.category = tipoUnion || "Normal";
      this.linkDataArray.push(link);
  }
  cajaNegra(inputExample){
    this.restauraInicio(); //Volvemos al estado cero
    inputExample = this.devuelveParseo(inputExample)
    let tipoDeFigura = this.conceptoOinstancia(inputExample);
    let nodo1 = this.tratantoSujeto(inputExample, tipoDeFigura);
    let nodo2 =this.tratandoPredicado(inputExample, tipoDeFigura);
    this.addLinks(nodo1, nodo2, 'Normal');
    this.initDiagramaNOdesTemplate();
    this.myDiagram.model = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray)
    
  }


  restauraInicio(){ //Funcion que devuelve los valores iniciales
    this.myDiagram.clear()
    this.nodeDataArray = [];
    this.linkDataArray = [];
    this.textJoin="";
    this.distancia =0;
    this.mismaAltura = 0;
    this.createAndAddNode('DIBUJANDO EL DIAGRAMA',undefined,undefined,'0 0');
  }
  conceptoOinstancia(inputExample){
    const regxs = {
      "lower": /^[a-z0-9 ]+$/,
      "upper": /^[A-Z0-9 ]+$/,
      "upperLower": /^[A-Za-z0-9 ]+$/
    }
    let determinantes = ['']
    console.log('inputExample.Sujeto', inputExample.Sujeto)
    if(!inputExample.Sujeto.Det && regxs.upper.test(inputExample.Sujeto.N[0])){ // lo del inputExample sobra
      return 'instancia';
    }
    if(inputExample.Sujeto.Det && (inputExample.Sujeto.Det[inputExample.Sujeto.Det.length-1] === 's')){ // si el determinate es pural se refiere a un concepto
      return 'concepto';
    }
    if(inputExample.Sujeto.Det && (inputExample.Sujeto.Det[0].toLowerCase() === 'el' || inputExample.Sujeto.Det[0].toLowerCase() === 'la' && regxs.upper.test(inputExample.Sujeto.N[0]))){
      return 'instancia';
    }
    else{
      return 'concepto';
    }
    
  }

  conceptoItem(determinate, nombre){ // si es un concepto general devuelve el item que figurara en el dibujo
    if(nombre[nombre.length-1].toLowerCase() ==='s' && nombre[nombre.length-2].toLowerCase() ==='e' && nombre[nombre.length-3].toLowerCase() ==='c'){
      let tmp ='';
      for (var i = 0; i < nombre.length-2; ++i) {
        if(i == nombre.length-3){
           tmp += 'z';
        }
        else{

        tmp += nombre[i];
        }
      }
      return tmp; 
    }
    else if(nombre[nombre.length-1].toLowerCase() ==='s' && nombre[nombre.length-2].toLowerCase() ==='e'){ // si el determinante acaba en plural y es ES sy terminacion quitmos la 'es'
      let tmp ='';
      for (var i = 0; i < nombre.length-2; ++i) {
        tmp += nombre[i];
      }
      return tmp; 
    }
    else if(nombre[nombre.length-1].toLowerCase() ==='s'){
      let tmp ='';
      for (var i = 0; i < nombre.length-1; ++i) {
        tmp += nombre[i];
      }
      return tmp; 
    }
    else{
       return nombre;
    }
  }

  transformacionVerbo(verbo){
    let res = '';
    if(verbo[verbo.length-1].toLowerCase() == 'n'){
      for (var i = 0; i < verbo.length-1; ++i) {
        res += verbo[i];
      }
    }
    else
      res = verbo;
    return res;
  }
  tranformacionComplemento(complemento){

    
    if((complemento[complemento.length-1].toLowerCase() !=='s' && complemento[complemento.length-2].toLowerCase() !== 'e' && complemento[complemento.length-3].toLowerCase() !=='c') || (complemento[complemento.length-1].toLowerCase() !=='s' && complemento[complemento.length-2].toLowerCase() !=='e') )
      return complemento;
    else if(complemento[complemento.length-1].toLowerCase() ==='s' && complemento[complemento.length-2].toLowerCase() ==='e' && complemento[complemento.length-3].toLowerCase() ==='c'){
      let tmp ='';
      for (var i = 0; i < complemento.length-2; ++i) {
        if(i == complemento.length-3){
           tmp += 'z';
        }
        else{

        tmp += complemento[i];
        }
      }
      return tmp; 
    }
    else if(complemento[complemento.length-1].toLowerCase() ==='s' && complemento[complemento.length-2].toLowerCase() ==='e'){ // si el determinante acaba en plural y es ES sy terminacion quitmos la 'es'
      let tmp ='';
    console.log('por aqui 1')
      for (var i = 0; i < complemento.length-2; ++i) {
        tmp += complemento[i];
      }
      return tmp; 
    }
    else{
      let tmp ='';
      console.log('por aqui 2', complemento[complemento.length-1].toLowerCase() ==='s', complemento[complemento.length-2].toLowerCase() ==='e')
      for (var i = 0; i < complemento.length-1; ++i) {
        tmp += complemento[i];
      }
      return tmp; 
    }
  }

  tratantoSujeto(inputExample, tipoFigura ){
    let primerNodo;

    if(tipoFigura === "concepto"){
    //Conceptos generales rectangulo 
       primerNodo = this.capitalizeFirstLetter(this.conceptoItem(inputExample.Sujeto.Det, inputExample.Sujeto.N));
       this.createAndAddNode(primerNodo, undefined, 'rectangulo', '300 200');
    //si hay que añadir crear nodos que se unen con el sujeto como adjetovos hacerlo en esta zona
    
    return primerNodo;  
    }
    else{
      // Instancias/individuos elipse 
      primerNodo = inputExample.Sujeto.N;
      this.createAndAddNode(primerNodo, undefined, 'elipse', '300 200');
      //si hay que añadir crear nodos que se unen con el sujeto como adjetovos hacerlo en esta zona
      return primerNodo;  
    }  
  }

  tratandoPredicado(inputExample, tipoDeFigura){
    let preposicionesDeLugar=['delante de','detras de', 'al lado de', 'entre', 'enfrente de', 'sobre', 'debajo de', 'dentro de', 'encima de', 'en'];
    let parteQueRecibeAccion;
    let verboPredicado;

    if(inputExample.Predicado.V.toLowerCase() === 'son'){
      inputExample.Predicado.V = 'es'
    }
    else if(inputExample.Predicado.V.toLowerCase() === 'sois'){
      inputExample.Predicado.V = 'eres'
    }
     else if(inputExample.Predicado.V.toLowerCase() === 'somos'){
      inputExample.Predicado.V = 'soy'
    }
    if(inputExample.Predicado.CCL){ 
      if(preposicionesDeLugar.includes(inputExample.Predicado.CCL.E)){
        verboPredicado =  this.transformacionVerbo(inputExample.Predicado.V) + this.capitalizeFirstLetter(inputExample.Predicado.CCL.E); // pongo la preposicion en launion
        parteQueRecibeAccion = this.capitalizeFirstLetter(this.tranformacionComplemento(inputExample.Predicado.CCL.TSN.N));// mayuscula y tranformamos tambine Pasamos el nombre
        if(inputExample.Predicado.CCL.TSN.Adj){
          parteQueRecibeAccion+= " " + this.capitalizeFirstLetter(this.tranformacionComplemento(inputExample.Predicado.CCL.TSN.Adj))
        }
      }

    }
    else if(inputExample.Predicado.ATR){
          verboPredicado =  inputExample.Predicado.V
          parteQueRecibeAccion = this.capitalizeFirstLetter(this.tranformacionComplemento(inputExample.Predicado.ATR.N));// mayuscula y tranformamos tambine Pasamos el nombre
        if(inputExample.Predicado.ATR.Adj){
          parteQueRecibeAccion+= " " + this.capitalizeFirstLetter(this.tranformacionComplemento(inputExample.Predicado.ATR.Adj))
        }
    }
    else if(inputExample.Predicado.CD){
        verboPredicado =  inputExample.Predicado.V
        if(inputExample.Predicado.CD.SN)
           parteQueRecibeAccion = this.capitalizeFirstLetter(this.tranformacionComplemento(inputExample.Predicado.CD.SN.N));
        else if(inputExample.Predicado.CD.SP)
           verboPredicado =  this.transformacionVerbo(inputExample.Predicado.V) + this.capitalizeFirstLetter(inputExample.Predicado.CD.SP.E);
           parteQueRecibeAccion = this.capitalizeFirstLetter(this.tranformacionComplemento(inputExample.Predicado.CD.SP.TSN.N));
    }

    this.textJoin = verboPredicado;
    if(tipoDeFigura === 'concepto'){
      this.createAndAddNode(parteQueRecibeAccion, undefined, 'rectangulo', '500 200');
    }
    else{
      this.createAndAddNode(parteQueRecibeAccion, undefined, 'elipse', '500 200');
    }
    return parteQueRecibeAccion;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  devuelveParseo(texto){
    try{
      return JSON.parse(texto);
    }
    catch(e){
      return null;
    }
  }

  IsJsonString(str) {
      if(str==="")
        this.jsonIncorrecto=true;
        else{
           try {
            this.input = JSON.parse(str);
            this.jsonIncorrecto=true;
        } catch (e) {
          this.jsonIncorrecto=false;
           
        }
      }
  }
  showMore(){
    this.showText = this.show ? 'Ver menos': 'Ver más';
  }
}