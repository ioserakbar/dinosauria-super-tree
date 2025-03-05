import { Species, Clade, Tree } from "./data/dataStructureTest.js";

function test(){


    //Taxonomy is in spanish, doesn't matter 
    var Dinosauria = new Clade(0, "Dinosauria", -1, "Superorden", "Dinosaurios que todos conocemos y amamos", true);
        var Ornithischia = new Clade(1, "Ornithischia", 0, "Orden");
            var Neornithischia = new Clade(2, "Neornithischia", 1, "Suborden");
                var Ceratopsia = new Clade(3, "Ceratopsia", 2, "Infraorden");
                    var Ceratopsidae = new Clade(4, "Ceratopsidae", 3, "Familia");
                        var Chasmosaurinae = new Clade(4, "Chasmosaurinae", 4, "Subfamilia");
                            var Triceratops = new Clade(5, "Triceratops", 5, "Género");
        var Saurischia = new Clade(6, "Saurischia", 0, "Orden");
            var Theropoda =  new Clade(7, "Theropoda", 6, "Suborden");
                var Megalosauroidea = new Clade(20, "Megalosauroidea", 7, "Superfamilia");
                    var Megalosauridae = new Clade(21, "Megalosauridae", 20, "Familia");
                        var Megalosaurinae = new Clade(22, "Megalosaurinae", 21, "Subfamilia");
                            var Megalosaurus = new Clade(23, "Megalosaurus", 22, "Género");
                var Coelurosauria = new Clade(8, "Coelurosauria", 7, "Infraorden");
                    var Tyrannosauroidea = new Clade(9, "Tyrannosauroidea", 8, "SuperFamilia");
                        var Tyrannosauridae = new Clade(10, "Tyrannosauridae", 9, "Familia");
                            var Tyrannosaurinae = new Clade (11, "Tyrannosaurinae", 10, "Subfamilia");
                                var Tyrannosaurini = new Clade (12, "Tyrannosaurini", 11, "Tribu");
                                    var	Tyrannosaurus = new Clade(13, "Tyrannosaurus", 12, "Género");        
            var Sauropodomorpha = new Clade(14, "Sauropodomorpha", 6, "Suborden");
                var Sauropoda = new Clade(15, "Sauropoda", 14, "Infraorden");
                    var Diplodocoidea = new Clade(16, "Diplodocoidea", 15, "Superfamilia");
                        var Diplodocidae = new Clade(17, "Diplodocidae", 16, "Familia");
                            var Diplodocinae = new Clade(18, "Diplodocinae", 17, "Subfamilia");
                                var Diplodocus = new Clade(19, "Diplodocus", 18, "Género");

    var clados = new Array(Dinosauria, Ornithischia, Neornithischia, Ceratopsia, Ceratopsidae, Chasmosaurinae, Triceratops
                        ,Saurischia, Theropoda, Megalosauroidea, Megalosauridae, Megalosaurinae, Megalosaurus, 
                        Coelurosauria, Tyrannosauroidea, Tyrannosauridae, Tyrannosaurinae, Tyrannosaurini, Tyrannosaurus,
                        Sauropodomorpha, Sauropoda, Diplodocoidea, Diplodocidae, Diplodocinae, Diplodocus);
    
    var tree = new Tree(clados);


                        

    var eTriceratops = new Species(0, "Triceratops", "Triceratops horridus", Triceratops.id);
    var eTRex = new Species(1, "T Rex", "Tyrannosaurus rex", Tyrannosaurus.id);
    var eCuelloLargo = new Species(2, "Diplodocus", "Diplodocus longus", Diplodocus.id);
    var eMegalosaurus = new Species(3, "Megalosaurus", "Megalosaurus bucklandii", Megalosaurus.id);

    console.log(tree.getClade(eCuelloLargo).taxonomyLevel);


}


test();