export class Species {
    constructor(id, commonName, binomialNomenglature, genus, description = "", coords){
        this.id = id;
        this.commonName = commonName;
        this.binomialNomenglature = binomialNomenglature;
        this.genus = genus;
        this.description = description;
        this.coords = coords;
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

export class Tree{
    constructor(clades){
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
        return this.clades.find( x => x.id == species.genus);
    }


}