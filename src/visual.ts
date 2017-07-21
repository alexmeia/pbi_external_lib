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

        private boatIconStyle: ol.style.Style;

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
                    center: ol.proj.transform([11.6703, 43.1857], 'EPSG:4326', 'EPSG:3857'),
                    zoom: 9
                })
            });

            // Styles
            this.boatIconStyle = new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    anchor: [0.5, 16],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    opacity: 1,
                    src: 'https://www2.phoops.it/powerbi/icons/arrow_up.png'
                }))
            });

            let popup = new ol.Overlay({
                element: popupDiv,
                positioning: 'top-center',
                stopEvent: false
            });

            this.map.addOverlay(popup);

            // display popup on click
            this.map.on('click', function (evt) {
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

            let ol = (<any>window).ol;

            this.counter++;

            let geom = new ol.geom.Polygon([[11.1857 + this.counter, 43.6703 + this.counter],
            [12.18 + this.counter, 44.2 + this.counter],
            [13.25 + this.counter, 15.25 + this.counter]]);


            let feature = new ol.Feature({
                name: "Feature_test",
                geometry: geom.transform('EPSG:4326', 'EPSG:3857')
            });

            //Icon
            let iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([11.6703, 43.1857], 'EPSG:4326', 'EPSG:3857')),
                name: 'Da qualche parte in Italia',
                population: 4000,
                rainfall: 500
            });

            let markerIconStyle = new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    anchor: [0.5, 22],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    opacity: 1,
                    src: 'http://oks.no/romerikskirken/wp-content/themes/oks/images/map-marker.png'
                }))
            });

            iconFeature.setStyle(markerIconStyle);



            this.vectorLayer.getSource().addFeature(iconFeature);
            this.vectorLayer.getSource().addFeature(feature);
            //Display update count
            //OpenLayers
            //this.map.setTarget(document.getElementById("map")); 

            var wkt: ol.format.WKT = new ol.format.WKT();

            // add wkt geometry (only for debugging)
            var polygon = wkt.readFeature(
                'POLYGON((10.689697265625 -25.0927734375, 34.595947265625 ' +
                '-20.1708984375, 38.814697265625 -35.6396484375, 13.502197265625 ' +
                '-39.1552734375, 10.689697265625 -25.0927734375))');
            polygon.getGeometry().transform('EPSG:4326', 'EPSG:3857');

            this.vectorLayer.getSource().addFeature(polygon);

            // Read table from dataView
            let rows: DataViewTableRow[] = options.dataViews[0].table.rows;

            rows.forEach((row, index) => {
                debugger
                let point = wkt.readGeometry(row[2]);
                point.transform("EPSG:4326", "EPSG:3857");
                let ship = row[0];

                let pointIcon = new ol.Feature({
                    geometry: point,
                    name: "Ship " + ship
                })

                pointIcon.setStyle(this.boatIconStyle);

                // if there is a value for heading
                if (row[3] != null) {
                    pointIcon.getStyle().getImage().setRotation(row[3]);
                }
                else {
                    // only for debug
                    pointIcon.getStyle().getImage().setRotation(14);
                }

                this.vectorLayer.getSource().addFeature(pointIcon);
            });
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