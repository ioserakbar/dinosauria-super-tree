import { Generic } from "./genericClass.js";

export class Species {
    constructor(id, commonName, binomialNomenglature, genus, description = "", angle){
        this.id = id;
        this.commonName = commonName;
        this.binomialNomenglature = binomialNomenglature;
        this.genus = genus;
        this.description = description;
        this.angle = angle;
    }
}

export class Clade{
    constructor(id, name, parentClade, taxonomyLevel, description = "", isFirst = false){
        this.id = id;
        this.name = name;
        this.parentClade = parentClade;
        this.taxonomyLevel = taxonomyLevel;
        this.description = description;
        this.isFirst = isFirst;
    }
}

export class Tree extends Generic{
    constructor(clades){
        super();
        this.#setClades(clades);
    }

    #setClades(clades){
        this.clades = clades;
    }

    getParentNameByName(clade){
        var parentId = this.clades.find(n => n.nombre == clade).parentClade;
        var parentName = this.clades.find(x => x.id == parentId).name;

        return parentName;
    }

    getParent(clade){
        var parentClade = this.clades.find(x => x.id == clade.parentClade);
        if(parentClade.isFirst){
            return parentClade;
        }
        return parentClade = this.getParent(parentClade)
    }

    getClade(species){
        return this.clades.find( x => x.id == species.genus)
    }

    getSpeciesFamily(species){
        var family = new Array();

        var currentCladeId = this.clades.find(x => x.id == species.genus).id;

        var searchFinished = false;
        do{
            var currentClade = this.clades.find(x=>x.id == currentCladeId);
            if(currentCladeId == currentClade.parentClade) {
                console.error('Clade has self reference parent', currentClade)
                searchFinished = true;
            }
            if(currentClade.isFirst){
                searchFinished = true;
            } else {
                family.push(currentClade);
                currentCladeId = currentClade.parentClade;
            }
        }while(!searchFinished)

        return family;
    }

    getTotalSonsOfClade(startingClade){
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

    getTotalParentsOfClade(startingClade, count = 0){
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