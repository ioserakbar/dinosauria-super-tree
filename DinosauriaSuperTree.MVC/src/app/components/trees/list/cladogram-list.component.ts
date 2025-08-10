import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { RenderLineComponent } from './list-component/render-line/render-line.component';
import { Clade } from '../../../shared/models/Clade';
import { Species } from '../../../shared/models/Species';
import { CladeListElement } from '../../../shared/models/cladeListElement';
import { CladeService } from '../../../services/clade.service';
import { SpeciesService } from '../../../services/species/species.service';
import { forkJoin, Observable } from 'rxjs';
import { NgFor, NgSwitch, NgSwitchDefault, NgSwitchCase } from '@angular/common';
import { CladeListGenerationOptions } from '../../../shared/models/cladeListGenerationOptions';
import { create } from 'domain';
import { WIDTH_FOR_LIST } from '../../../shared/constants/cssVariables';
import { timeEnd } from 'console';
import { VerticalLineEndComponent } from './list-components/vertical-line-end/vertical-line-end.component';
import { isFloat32Array } from 'util/types';

@Component({
    selector: 'pt-cladogram-list',
    imports: [NgbAccordionModule, RenderLineComponent, NgFor, NgSwitch, NgSwitchDefault, NgSwitchCase],
    templateUrl: './cladogram-list.component.html',
    styleUrl: './cladogram-list.component.css'
})
export class CladogramListComponent {
    //data variables
    allClades: Clade[] = [];
    dummySpecies: Species[] = [];

    family: any[] = [];

    tileSize = WIDTH_FOR_LIST;

    constructor(private cladeService: CladeService, private speciesService: SpeciesService) {
        const $species = this.speciesService.getAll();
        const $clades = this.cladeService.getAll();

        forkJoin([$species, $clades]).subscribe((results) => {
            this.dummySpecies = results[0];
            this.allClades = results[1];

            this.getFamilyStringArray();
        });
    }

    getFamilyStringArray() {
        var cladeID = this.allClades.find((c) => c.name == 'Dinosauria')?.id;
        if (typeof cladeID === undefined) {
            return;
        }
        this.generateLine(cladeID!);
    }

    createLineElement(pElement: { type: string; tiles: number; content?: string; lineType?: string; labelClass?: string }) {
        var element = new CladeListElement();

        element.type = pElement.type;
        element.tiles = pElement.tiles;
        element.lineType = pElement.lineType;
        element.content = pElement.content;
        element.labelClass = pElement.labelClass;

        return element;
    }

    createOptions(pOptions: {
        isFirstChild?: boolean;
        isLastChild?: boolean;
        previousContent?: any[];
        isUniqueChild?: boolean;
        sizeOfPreviousContent?: number;
        verticalLinesPositions?: any[];
        isGenus?: boolean;
    }) {
        var options = new CladeListGenerationOptions();

        options.isFirstChild = pOptions.isFirstChild;
        options.isLastChild = pOptions.isLastChild;
        options.previousContent = pOptions.previousContent;
        options.isUniqueChild = pOptions.isUniqueChild;
        options.sizeOfPreviousContent = pOptions.sizeOfPreviousContent;
        options.verticalLinesPositions = pOptions.verticalLinesPositions;
        options.isGenus = pOptions.isGenus;

        return options;
    }

    generateLine(cladeId: string, options?: CladeListGenerationOptions) {
        var clade = this.allClades.find((c) => c.id == cladeId)!;
        var line: any[] = [];
        var tilesPassed = options?.sizeOfPreviousContent ?? 0;

        //Continues line
        if (options?.isFirstChild) {
            line = options.previousContent ?? [];

            if (options?.isUniqueChild) {
                //Creates horizontal line before the name
                line.push(
                    this.createLineElement({
                        type: 'line',
                        tiles: 1,
                        lineType: 'horizontal-line'
                    })
                );
                tilesPassed++;
            } else {
                //Creates vertical line with a bottom conection before the name
                line.push(
                    this.createLineElement({
                        type: 'line',
                        tiles: 1,
                        lineType: 'vertical-line-bottom'
                    })
                );
                tilesPassed++;
            }
        }

        //Begins a new line
        else {
            for (let i = 1; i <= tilesPassed; i++) {
                if (options?.verticalLinesPositions?.find((c) => c == i)) {
                    line.push(
                        this.createLineElement({
                            type: 'line',
                            tiles: 1,
                            lineType: 'vertical-line'
                        })
                    );
                } else {
                    line.push(
                        this.createLineElement({
                            type: 'filler',
                            tiles: 1,
                            lineType: 'no-line'
                        })
                    );
                }
            }

            if (clade.tier != 0) {
                line.push(
                    this.createLineElement({
                        type: 'line',
                        tiles: 1,
                        lineType: options?.isLastChild ? 'vertical-line-end' : 'vertical-line-middle'
                    })
                );
                tilesPassed++;
            }
        }

        // Prints the name (this is always the case for now)
        var contentTiles = 0;

        if (options?.isGenus) {
            var name = this.dummySpecies.find((f) => f.genus == cladeId)?.binomialNomenclature ?? '';
            contentTiles = this.getContentTileSize(name);
            line.push(
                this.createLineElement({
                    type: 'content',
                    tiles: contentTiles,
                    content: name,
                    labelClass: 'last'
                })
            );
        } else {
            contentTiles = this.getContentTileSize(clade.name);
            line.push(
                this.createLineElement({
                    type: 'content',
                    tiles: contentTiles,
                    content: clade.name
                })
            );
        }

        tilesPassed = tilesPassed + contentTiles;

        //End of line
        if (!options?.isFirstChild) {
            this.family.push(line);
        }

        var verticalLineTiles: any[];
        verticalLineTiles = options?.verticalLinesPositions ?? [];
        verticalLineTiles.push(tilesPassed + 1);

        //If line continues (calde has sons)
        if (clade.directSons.length > 0) {
            clade.directSons.forEach((son, index) => {
                var grandChildren = this.allClades.find((c) => c.id == son)?.directSons.length;

                //This is for coininuing line
                if (clade.tier != 0) {
                    if (index == 0) {
                        if (clade.directSons.length > 1) {
                            this.generateLine(
                                son,
                                this.createOptions({
                                    isFirstChild: true,
                                    previousContent: line,
                                    sizeOfPreviousContent: tilesPassed,
                                    verticalLinesPositions: verticalLineTiles
                                })
                            );
                        } else if (grandChildren == 0) {
                            this.generateLine(
                                son,
                                this.createOptions({
                                    isFirstChild: true,
                                    previousContent: line,
                                    isUniqueChild: true,
                                    sizeOfPreviousContent: tilesPassed,
                                    verticalLinesPositions: verticalLineTiles,
                                    isGenus: clade.directSons.length == 1
                                })
                            );
                        } else {
                            this.generateLine(
                                son,
                                this.createOptions({
                                    isFirstChild: true,
                                    previousContent: line,
                                    isUniqueChild: true,
                                    sizeOfPreviousContent: tilesPassed,
                                    verticalLinesPositions: verticalLineTiles
                                })
                            );
                        }
                    } else if (index + 1 == clade.directSons.length) {
                        this.generateLine(
                            son,
                            this.createOptions({
                                isLastChild: true,
                                sizeOfPreviousContent: tilesPassed,
                                verticalLinesPositions: verticalLineTiles
                            })
                        );
                    } else {
                        console.error('????');
                    }

                    //This is to break line, but  specifing that it's the last chaild so the vertical line can be closed
                } else if (index + 1 == clade.directSons.length) {
                    this.generateLine(
                        son,
                        this.createOptions({
                            isLastChild: true
                        })
                    );
                }

                //This is to break line but it's not the first child
                else {
                    this.generateLine(
                        son,
                        this.createOptions({
                            verticalLinesPositions: [1]
                        })
                    );
                }
            });
        }
    }

    getContentTileSize(content: string) {
        return Math.ceil((content.length * 18) / this.tileSize);
    }
}
