

function fillInfo(){

    var speciaes1 = {
        name: "Triceratops horridus",
        clados: [
            "Dinosauria", 
            "Ornithischia",
            "Neornithischia",
            "Ceratopsia",
            "Ceratopsidae",
            "Chasmosaurinae",
            "Triceratops",
            "Horridus"
        ]
    }

    var speciaes2 = {
        name: "Tyrannosaurus rex",
        clados: [
            "Dinosauria", 
            "Saurischia",
            "Theropoda",
            "Coelurosauria",
            "Tyrannosauroidea",
            "Tyrannosauridae",
            "Tyrannosaurinae",
            "Tyrannosaurini",
            "Tyrannosaurus",
            "Rex"
        ]
    }

    var speciaes3 = {
        name: "Plateosaurus trossingensis",
        clados: [
            "Dinosauria", 
            "Saurischia",
            "Sauropodomorpha",
            "Plateosauridae",
            "Plateosaurus",
            "Trossingensis"
        ]
    }

    var animalia = [speciaes1, speciaes2, speciaes3]

    var cladosOrdenados = new Array();

    animalia.forEach(item => {
        
        item.clados.forEach( (clado, cladoIndex) => {
            if(!cladosOrdenados.includes(clado)){
                cladosOrdenados.push(clado);
                $('#lista').append('<li>'+clado+cladoIndex+'</li>')
            }
        });
    });

}


fillInfo();