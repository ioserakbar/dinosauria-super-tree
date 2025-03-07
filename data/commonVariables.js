const DEFAULT_ZOOM = 1;
const DEFAULT_WIDTH = 3;
const DEFAULT_TREE_RADIO = 1500;

export class CommonVariables {
    constructor(){
        this.canvas = null;
        this.zoom = DEFAULT_ZOOM;
        this.center = {x:0 , y:0}
        this.width = DEFAULT_WIDTH;
        this.context = null;
        this.treeRadio = DEFAULT_TREE_RADIO;
        this.divisions = 10;

        if(typeof CommonVariables.instance === "object")
            return CommonVariables.instance;

        CommonVariables.instance = this;
        return this;
    }
}