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
       
        constructor(options: VisualConstructorOptions) {
            
            let div = document.createElement("div");
            div.setAttribute("id", "map");
            options.element.appendChild(div);

            let ol = (<any>window).ol;
            debugger
            var osm_layer: ol.layer.Tile = new ol.layer.Tile({
                source: new ol.source.OSM()
            });
            
            // note that the target cannot be set here!
            this.map = new ol.Map({
                target: "map",
                layers: [osm_layer],
                view: new ol.View({
                    center: ol.proj.transform([0,0], 'EPSG:4326', 'EPSG:3857'),
                    zoom: 2
                })
            });
        }

        @logExceptions()
        public update(options: VisualUpdateOptions) {

            
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