import { Request, Response, NextFunction } from 'express';
import { HttpResponses } from '../library/HttpResponses.enum';
import { CladeModel as CladeDBO, Clade } from '../models/clade';

export function GetCladogramData() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                var rootId = req.params.id;
                var response = await CalculateCladeDynamicData(rootId);

                if (!response) {
                    return res.status(HttpResponses.NotFound).json({ error: 'Not found' });
                }

                req.cladogramData = response;
            } catch (error) {
                logging.error(error);

                return res.status(HttpResponses.InternalServerError).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };
        return descriptor;
    };
}

async function CalculateCladeDynamicData(rootId: string) {
    let genusId = 0;
    const firstClade = CladeDBO.findById(rootId);

    if (!firstClade) {
        return null;
    }
    //First, this function asumes that every data is empty. So we first get how many total sons the clade has and it's tier. Tier meaning just how many "steps" from the center it is
    ProcessTierAndSonData(firstClade);

    //With this info now we can order them.
    var allClades = await OrderFamilyClades(firstClade);
    return allClades;
}

function ProcessTierAndSonData(clade: Clade, cladeTier = 0) {
    var cladea = clade;
    var test = cladea.directSons;
    //Here we get how many direct sons has in the array.
    var totalSons = clade.directSons!.length;

    //We cycle through each son to get their total sons, and so on. Once we finish the "branch" we add the total "grandchildren" to the total sons.
    //Since the tier is just how many clades are before, we just add 1 for each set of sons we encounter.
    clade.directSons!.forEach((son: any) => {
        totalSons = totalSons + ProcessTierAndSonData(son, cladeTier + 1);
    });

    clade.drawHelper!.totalSons = totalSons;
    clade.tier = cladeTier;

    return totalSons;
}

async function OrderFamilyClades(clade: any, sortedClades: any[] = []) {
    //TODO: change this, we should not be calling the database for every clade
    const allClades = await CladeDBO.find();
    sortedClades.push(clade);
    //We create an array with the number of the children of the clades children, in other words the grandchildren
    // So for Dinosauria, that has as children Ornisquia and Saurisqia, the array would be this: [1, 2]. Since Ornisquia has 1 son and Saurisquia has 2 sons
    var grandChildrenArray: number[] = [];
    clade.directSons?.forEach((directSon: any) => {
        grandChildrenArray.push(allClades.find((c) => c.id == directSon)!.drawHelper!.totalSons as number);
    });

    // Now we bubble sort it, the reason why we do this manyally instead of calling the .sort() function is that we need to apply the changes made to the directSons array of the clade.
    // So for Dinosauria the arrays would start as this: directSons = [ OrnisquiaId, SaurisqiaId ] and grandChildrenArray = [ 1, 2 ]. Sorting grandChildrenArray will send the 2 to the first place of the array, so we need
    // to apply this to directSons as well. The end result is that the order of directSons is dictated by the number of total children of each. The one with the bigger number goes first.
    // End result grandChildrenArray = [ 2, 1 ] , directSons = [ SaurisqiaId, OrnisquiaId ]

    var temp, temp2;
    var swapped;

    for (var i = 0; i < grandChildrenArray.length - 1; i++) {
        swapped = false;

        for (var j = 0; j < grandChildrenArray.length - i - 1; j++) {
            if (grandChildrenArray[j] < grandChildrenArray[j + 1]) {
                //Swap operation for grandChildrenArray
                temp = grandChildrenArray[j];
                grandChildrenArray[j] = grandChildrenArray[j + 1];
                grandChildrenArray[j + 1] = temp;

                //Swap operation for directSons
                temp2 = clade.directSons![j];
                clade.directSons![j] = clade.directSons![j + 1];
                clade.directSons![j + 1] = temp2;

                swapped = true;
            }
        }

        // IF no two elements were swapped by inner loop, then break
        if (swapped == false) break;
    }

    //Now we do this again for the direct sons
    clade.directSons?.forEach((son: any) => {
        OrderFamilyClades(son, sortedClades);
    });
    return sortedClades;
}
