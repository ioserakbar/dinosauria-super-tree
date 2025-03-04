import { Especie, Clado, Arbol } from "./data/dataStructureTest.js";

function test(){

    var Dinosauria = new Clado(0, "Dinosauria", -1, "Superorden");
        var Ornithischia = new Clado(1, "Ornithischia", 0, "Orden");
            var Neornithischia = new Clado(2, "Neornithischia", 1, "Suborden");
                var Ceratopsia = new Clado(3, "Ceratopsia", 2, "Infraorden");
                    var Ceratopsidae = new Clado(4, "Ceratopsidae", 3, "Familia");
                        var Chasmosaurinae = new Clado(4, "Chasmosaurinae", 4, "Subfamilia");
                            var Triceratops = new Clado(5, "Triceratops", 5, "Género");
        var Saurischia = new Clado(6, "Saurischia", 0, "Orden");
            var Theropoda =  new Clado(7, "Theropoda", 6, "Suborden");
                var Megalosauroidea = new Clado(20, "Megalosauroidea", 7, "Superfamilia");
                    var Megalosauridae = new Clado(21, "Megalosauridae", 20, "Familia");
                        var Megalosaurinae = new Clado(22, "Megalosaurinae", 21, "Subfamilia");
                            var Megalosaurus = new Clado(23, "Megalosaurus", 22, "Género");
                var Coelurosauria = new Clado(8, "Coelurosauria", 7, "Infraorden");
                    var Tyrannosauroidea = new Clado(9, "Tyrannosauroidea", 8, "SuperFamilia");
                        var Tyrannosauridae = new Clado(10, "Tyrannosauridae", 9, "Familia");
                            var Tyrannosaurinae = new Clado (11, "Tyrannosaurinae", 10, "Subfamilia");
                                var Tyrannosaurini = new Clado (12, "Tyrannosaurini", 11, "Tribu");
                                    var	Tyrannosaurus = new Clado(13, "Tyrannosaurus", 12, "Género");        
            var Sauropodomorpha = new Clado(14, "Sauropodomorpha", 6, "Suborden");
                var Sauropoda = new Clado(15, "Sauropoda", 14, "Infraorden");
                    var Diplodocoidea = new Clado(16, "Diplodocoidea", 15, "Superfamilia");
                        var Diplodocidae = new Clado(17, "Diplodocidae", 16, "Familia");
                            var Diplodocinae = new Clado(18, "Diplodocinae", 17, "Subfamilia");
                                var Diplodocus = new Clado(19, "Diplodocus", 18, "Género");

    var clados = new Array(Dinosauria, Ornithischia, Neornithischia, Ceratopsia, Ceratopsidae, Chasmosaurinae, Triceratops
                        ,Saurischia, Theropoda, Megalosauroidea, Megalosauridae, Megalosaurinae, Megalosaurus, 
                        Coelurosauria, Tyrannosauroidea, Tyrannosauridae, Tyrannosaurinae, Tyrannosaurini, Tyrannosaurus,
                        Sauropodomorpha, Sauropoda, Diplodocoidea, Diplodocidae, Diplodocinae, Diplodocus);
    
    var arbol = new Arbol(clados);


                        

    var eTriceratops = new Especie(0, "Triceratops", "Triceratops horridus", Triceratops.id);
    var eTRex = new Especie(1, "T Rex", "Tyrannosaurus rex", Tyrannosaurus.id);
    var eCuelloLargo = new Especie(2, "Diplodocus", "Diplodocus longus", Diplodocus.id);
    var eMegalosaurus = new Especie(3, "Megalosaurus", "Megalosaurus bucklandii", Megalosaurus.id);

    var especies = new Array (eTriceratops, eTRex, eCuelloLargo, eMegalosaurus);

    console.log("Diplodocus family =", arbol.getFamiliaBySpeciesName(eCuelloLargo));
    console.log("rex family =", arbol.getFamiliaBySpeciesName(eTRex));


}


test();