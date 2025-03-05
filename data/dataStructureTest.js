export class Especie {
    constructor(id, nombreComun, nombreCientifico, genero, descripcion = ""){
        this.id = id;
        this.nombreComun = nombreComun;
        this.nombreCientifico = nombreCientifico;
        this.genero = genero;
        this.descripcion = descripcion;
    }
}

export class Clado{
    constructor(id, nombre, cladoPadre, nivelTaxonomico, descripcion = ""){
        this.id = id;
        this.nombre = nombre;
        this.cladoPadre = cladoPadre;
        this.nivelTaxonomico = nivelTaxonomico;
        this.descripcion = descripcion;
    }
}

export class Arbol{
    constructor(clados){
        this.clados = clados;
    }

    getParentNameByName(clado){
        var parentId = this.clados.find(n => n.nombre == clado).cladoPadre;
        var parentName = this.clados.find(x => x.id == parentId).nombre;

        return parentName;
    }

    getParentId(clado){
        this.clados.find(x => x.id == clado.cladoPadre).cladoPadre;
    }

    getFamiliaBySpeciesName(species){
        var Familia = new Array();
        var BreakException = {};
        var hasReachedParent = false;

        var cladoPerteneciente = this.clados.find(x => x.id == species.genero);
        var test = this.getParentId(cladoPerteneciente);
        console.log(test)
        do {
            var cladoActual  = this.clados.find(x => x.id == parentIdTmp);

            if(cladoActual){
                Familia.push(cladoActual);
                parentIdTmp = cladoActual.cladoPadre;
            } else{
                hasReachedParent = true
            }
        } while (!hasReachedParent);

        return Familia;
    }
}