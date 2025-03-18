import { Clade } from "./Clade";
import { Species } from "./Species";


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
        if(currentCladeId === undefined){
            console.error(species.binomialNomenclature + " genus (id: " + species.genus + ") not found")
        }

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
