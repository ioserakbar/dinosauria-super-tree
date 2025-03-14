import { Clade } from "./app/shared/models/Clade";
import { Species } from "./app/shared/models/Species";
import {v4 as uuidv4} from 'uuid';

var tricerId = uuidv4()
var trexId = uuidv4()
var diplodocusId = uuidv4()
var megaloId = uuidv4()

export const sample_Species: Species[] = [
    {
        id: uuidv4(), 
        binomialNomenclature:  "Triceratops horridus", 
        genus: tricerId
    },
    {
        id: uuidv4(), 
        binomialNomenclature:  "Tyrannosaurus rex", 
        genus: trexId
    },
    {
        id: uuidv4(), 
        binomialNomenclature:  "Diplodocus longus", 
        genus: diplodocusId
    },
    {
        id: uuidv4(), 
        binomialNomenclature:  "Megalosaurus bucklandii", 
        genus: megaloId
    },
]

var DinosauriaId = uuidv4()
var OrnithischiaId = uuidv4()
var SaurischiaId = uuidv4()
var TheropodaId = uuidv4()
var MegalosauroideaId = uuidv4()
var CoelurosauriaId = uuidv4()
var SauropodomorphaId = uuidv4()
var DinosauriaId = uuidv4()

export const sapmle_Clades: Clade[] = [
    {
        id: DinosauriaId,
        name: "Dinosauria", 
        parentClade: uuidv4(),
        isFirst: true, 
        drawHelper:{
            coords:{
                angle: 0, 
                distance: 0
            }, 
            totalSons: 10, 
            arcOrientation: false
        }
    },
    {
        id: OrnithischiaId,
        name: "Ornithischia", 
        parentClade: DinosauriaId,
        isFirst: false, 
        drawHelper:{
            coords:{
                angle: 90, 
                distance: 100
            }, 
            totalSons: 1, 
            arcOrientation: true
        }
    },
    {
        id: tricerId,
        name: "Triceratops", 
        parentClade: OrnithischiaId,
        isFirst: false, 
        drawHelper:{
            coords:{
                angle: 90, 
                distance: 400
            }, 
            totalSons: 0, 
            arcOrientation: false
        }
    },
    {
        id: SaurischiaId,
        name: "Saurischia", 
        parentClade: DinosauriaId,
        isFirst: false, 
        drawHelper:{
            coords:{
                angle: 270, 
                distance: 100
            }, 
            totalSons: 7, 
            arcOrientation: false
        }
    },
    {
        id: TheropodaId,
        name: "Theropoda", 
        parentClade: SaurischiaId,
        isFirst: false, drawHelper:{
            coords:{
                angle: 225, 
                distance: 200
            }, 
            totalSons: 4, 
            arcOrientation: false
        }
    },
    {
        id: MegalosauroideaId,
        name: "Megalosauroidea", 
        parentClade: TheropodaId,
        isFirst: false, 
        drawHelper:{
            coords:{
                angle: 180, 
                distance: 300
            }, 
            totalSons: 1, 
            arcOrientation: false
        }
    },
    {
        id: megaloId,
        name: "Megalosaurus", 
        parentClade: MegalosauroideaId,
        isFirst: false, 
        drawHelper:{
            coords:{
                angle: 180, 
                distance: 400
            }, 
            totalSons: 0, 
            arcOrientation: true
        }
    },
    {
        id: CoelurosauriaId,
        name: "Coelurosauria", 
        parentClade: TheropodaId,
        isFirst: false, 
        drawHelper:{
            coords:{
                angle: 270, 
                distance: 300
            }, 
            totalSons: 1, 
            arcOrientation: true
        }
    },
    {
        id: trexId,
        name: "Tyrannosaurus", 
        parentClade: CoelurosauriaId,
        isFirst: false, 
        drawHelper:{
            coords:{
                angle: 270, 
                distance: 400
            }, 
            totalSons: 0, 
            arcOrientation: false
        }
    },
    {
        id: SauropodomorphaId,
        name: "Sauropodomorpha", 
        parentClade: SaurischiaId,
        isFirst: false, 
        drawHelper:{
            coords:{
                angle: 0, 
                distance: 200
            }, 
            totalSons: 1, 
            arcOrientation: true
        }
    },
    {
        id: diplodocusId,
        name: "Diplodocus", 
        parentClade: SauropodomorphaId,
        isFirst: false, 
        drawHelper:{
            coords:{
                angle: 0, 
                distance: 400
            }, 
            totalSons: 0, 
            arcOrientation: false
        }
    }
    
]