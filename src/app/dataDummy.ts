import {v4 as uuidv4} from 'uuid';

export class Species {

    id: string
    binomialNomenclature: string
    genus: string
    description: string

    constructor(id: string, binomialNomenclature: string, genus: string, description = ""){
        this.id = id
        this.binomialNomenclature = binomialNomenclature
        this.genus = genus
        this.description = description
    }
}

export class Clade{

    id: string
    name: string
    parentClade: string
    taxonomyLevel: string
    description: string
    isFirst: boolean
    drawHelper: DrawHelper

    constructor(id: string, name: string, parentClade: string, taxonomyLevel: string, drawHelper: DrawHelper,  description = "", isFirst = false )
    {
        this.id = id
        this.name = name
        this.parentClade = parentClade
        this.taxonomyLevel = taxonomyLevel
        this.description = description
        this.isFirst = isFirst
        this.drawHelper = drawHelper
    }
}


class DrawHelper{
    coords:{
        angle: number,
        distance: number
    }
    totalSons: number
    arcOrientation: boolean

    constructor(coords : {angle: number, distance: number},totalSons: number, arcOrientation = false, ){
        this.coords = coords
        this.totalSons = totalSons
        this.arcOrientation = arcOrientation
    }
}

export class Tree{

    clades: Clade[];

    constructor(clades: Clade[]){
        this.clades = clades
    }


    getParentNameByName(clade :string){
        var parentId = this.clades.find(n => n.name == clade)?.parentClade;
        var parentName = this.clades.find(x => x.id == parentId)?.name;

        return parentName;
    }

    getParent(clade: Clade) : Clade{
        var parentClade = this.clades.find(x => x.id == clade?.parentClade);
        if(parentClade?.isFirst){
            return parentClade;
        }
        return parentClade = this.getParent(parentClade!);
    }

    getClade(species: Species){
        return this.clades.find( x => x.id == species.genus)
    }

    getSpeciesFamily(species: Species){
        var family = new Array();

        var currentCladeId = this.clades.find(x => x.id == species.genus)?.id;

        var searchFinished = false;
        do{
            var currentClade = this.clades.find(x=>x.id == currentCladeId);
            if(currentCladeId == currentClade?.parentClade) {
                console.error('Clade has self reference parent', currentClade)
                searchFinished = true;
            }
            if(currentClade?.isFirst){
                family.push(currentClade);
                searchFinished = true;
            } else {
                family.push(currentClade);
                currentCladeId = currentClade?.parentClade;
            }
        }while(!searchFinished)

        return family.reverse();
    }

    getCladeSons(clade: Clade){
        return this.clades.filter(x => x.parentClade == clade.id)
    }

    getTotalSonsOfClade(startingClade: Clade){
        var sons = this.clades.filter(x => x.parentClade == startingClade.id)
        var total = sons.length;
        if(sons.length == 0){
            return total;
        }
        else{
            sons.forEach(clade => {
               total = total + this.getTotalSonsOfClade(clade);
            });
            return total;
        }
    }

    getMaxDivisionsOfClades(){
        var maxDivisions = 0;
        this.clades.forEach(clade => {
            var divisions = this.getTotalParentsOfClade(clade);
            maxDivisions = divisions > maxDivisions ? divisions : maxDivisions;       
        });
        return maxDivisions
    }

    getTotalParentsOfClade(startingClade: Clade, count = 0) : number{
        var parent = this.clades.find(x => x.id == startingClade.parentClade);
        if(parent)
        {
            var total = count + 1;
            if(parent.isFirst){ 
                return total;
            }
            else{
                return this.getTotalParentsOfClade(parent, total);
            }
        }
        return 0;
    }
}

export function dummyCladeData(){
    var Dinosauria = new Clade(uuidv4(), "Dinosauria", uuidv4(), "Superorden", new DrawHelper({angle: 0, distance: 0}, 10, false), "Dinosaurios que todos conocemos y amamos", true);
        var Ornithischia = new Clade(uuidv4(), "Ornithischia", Dinosauria.id, "Orden",  new DrawHelper({angle: 90, distance: 100}, 1, true));
            var Triceratops = new Clade(uuidv4(), "Triceratops", Ornithischia.id, "Género",  new DrawHelper({angle: 90, distance: 400}, 0));
        var Saurischia = new Clade(uuidv4(), "Saurischia", Dinosauria.id, "Orden",  new DrawHelper({angle: -90, distance: 100}, 7, false));
            var Theropoda =  new Clade(uuidv4(), "Theropoda", Saurischia.id, "Suborden",  new DrawHelper({angle: 315-90, distance: 200}, 4, false));
                var Megalosauroidea = new Clade(uuidv4(), "Megalosauroidea", Theropoda.id, "Superfamilia",  new DrawHelper({angle: 270-90, distance: 300}, 1, false));
                    var Megalosaurus = new Clade(uuidv4(), "Megalosaurus", Megalosauroidea.id, "Género",  new DrawHelper({angle: 270-90, distance: 400}, 0));
                var Coelurosauria = new Clade(uuidv4(), "Coelurosauria", Theropoda.id, "Infraorden",  new DrawHelper({angle: 270, distance: 300}, 1, true));
                    var	Tyrannosaurus = new Clade(uuidv4(), "Tyrannosaurus", Coelurosauria.id, "Género",  new DrawHelper({angle: 270, distance: 400}, 0));        
            var Sauropodomorpha = new Clade(uuidv4(), "Sauropodomorpha", Saurischia.id, "Suborden",  new DrawHelper({angle: 90-90, distance: 200}, 1, true));
                var Diplodocus = new Clade(uuidv4(), "Diplodocus", Sauropodomorpha.id, "Género",  new DrawHelper({angle: 90-90, distance: 400}, 0));

    var clados = new Array(Dinosauria, Ornithischia, Triceratops ,Saurischia, Theropoda, Megalosauroidea, Megalosaurus, Coelurosauria, Tyrannosaurus, Sauropodomorpha, Diplodocus);

    return clados;
}

export function dummySpeciesData(tricerId: string, trexId: string, diplodocusId: string, megaloId: string){
    var eTriceratops = new Species(uuidv4(), "Triceratops horridus", tricerId, "");
    var eTRex = new Species(uuidv4(), "Tyrannosaurus rex", trexId, "");
    var eCuelloLargo = new Species(uuidv4(),  "Diplodocus longus", diplodocusId, "");
    var eMegalosaurus = new Species(uuidv4(),  "Megalosaurus bucklandii", megaloId, "");

    return new Array(eTriceratops, eTRex, eCuelloLargo, eMegalosaurus);
}