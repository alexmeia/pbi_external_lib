/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {

    declare var ol: any;

    export class Visual implements IVisual {

        //private updateCountContainer: JQuery;
        
        private updateCount: number = 0;
        public map: ol.Map;
        private counter: number;

        private osmLayer: ol.layer.Tile;
        private vectorLayer: ol.layer.Vector;
        private vectorSource: ol.source.Vector;
       
        constructor(options: VisualConstructorOptions) {
            this.counter = 0;
            let div = document.createElement("div");
            div.setAttribute("id", "map");
            options.element.appendChild(div);

            let ol = (<any>window).ol;

            this.vectorSource = new ol.source.Vector();
            this.osmLayer = new ol.layer.Tile({
                source: new ol.source.OSM()
            });
            this.vectorLayer = new ol.layer.Vector({
                source: this.vectorSource
            });
            
            // note that the target cannot be set here!
            this.map = new ol.Map({
                target: "map",
                layers: [this.osmLayer, this.vectorLayer],
                view: new ol.View({
                    center: ol.proj.transform([0,0], 'EPSG:4326', 'EPSG:3857'),
                    zoom: 2
                })
            });
        }

        @logExceptions()
        public update(options: VisualUpdateOptions) {
            debugger
            let ol = (<any>window).ol;
            this.counter ++;
            let geom = new ol.geom.Polygon( [ [1600000 + this.counter,2200000 + this.counter],
                                              [4400000 + this.counter,5500000 + this.counter],
                                              [8800000 + this.counter,9000000 + this.counter] ] );
            let feature = new ol.Feature({
                name: "Feature_test",
                geometry: geom
            });
            
            this.vectorSource.addFeature(feature);
            //Display update count
            //OpenLayers
            //this.map.setTarget(document.getElementById("map"));                      
        }
    }

    // Logger --------------------------------------------------------------------------------- //

     export function logExceptions(): MethodDecorator {
        return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>)
            : TypedPropertyDescriptor<Function> {

            return {
                value: function () {
                    try {
                        return descriptor.value.apply(this, arguments);
                    } catch (e) {
                        console.error(e);
                        throw e;
                    }
                }
            }
        }
    }
}