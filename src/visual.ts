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
        private rasterLayer: ol.layer.Tile;
        private vectorLayer: ol.layer.Vector;

        constructor(options: VisualConstructorOptions) {
            this.counter = 0;
            let div = document.createElement("div");
            div.setAttribute("id", "map");
            options.element.appendChild(div);

            let popupDiv = document.createElement("div");
            popupDiv.setAttribute("id", "pop-up");
            div.appendChild(popupDiv);

            let ol = (<any>window).ol;

            let source = new ol.source.XYZ({ 
                url: 'http://wms.transas.com/XYZ/1.0.0/utt-1612/{z}/{x}/{y}.png?token=fcdbc534-affd-4926-9489-f7de80f649bc' 
                });

            this.osmLayer = new ol.layer.Tile({
                source: source
            });
            this.vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector()
            });


            // note that the target cannot be set here!
            this.map = new ol.Map({
                target: "map",
                layers: [this.osmLayer, this.vectorLayer],
                view: new ol.View({
                    center: [0, 0],
                    zoom: 3
                })
            });

            let popup = new ol.Overlay({
                element: popupDiv,
                positioning: 'top-center',
                stopEvent: false
            });
            this.map.addOverlay(popup);

            // display popup on click
            this.map.on('click', function (evt) {
                debugger
                var feature = this.forEachFeatureAtPixel(evt.pixel,
                    function (feature, layer) {
                        return feature;
                    });
                if (feature) {
                    var geometry = feature.getGeometry();
                    var coord = geometry.getCoordinates();
                    popup.setPosition(coord);
                    ($(popupDiv) as any).popover({
                        'placement': 'top',
                        'html': true,
                        'content': feature.get('name')
                    });
                    ($(popupDiv) as any).popover('show');
                } else {
                    ($(popupDiv) as any).popover('destroy');
                }
            });
        }

        @logExceptions()
        public update(options: VisualUpdateOptions) {
            debugger
            let ol = (<any>window).ol;

            this.counter++;

            let geom = new ol.geom.Polygon([[1600000 + this.counter, 2200000 + this.counter],
            [4400000 + this.counter, 5500000 + this.counter],
            [8800000 + this.counter, 9000000 + this.counter]]);


            let feature = new ol.Feature({
                name: "Feature_test",
                geometry: geom
            });

            //Icon
            let iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([11.6703, 43.1857], 'EPSG:4326', 'EPSG:3857')),
                name: 'Da qualche parte in Italia',
                population: 4000,
                rainfall: 500
            });

            let iconStyle = new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    anchor: [0.5, 22],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    opacity: 1,
                    src: 'http://oks.no/romerikskirken/wp-content/themes/oks/images/map-marker.png'
                }))
            });

            iconFeature.setStyle(iconStyle);

            this.vectorLayer.getSource().addFeature(iconFeature);
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