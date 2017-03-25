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

    export class Visual implements IVisual {

        private updateCountContainer: JQuery;
        
        private updateCount: number = 0;

        constructor(options: VisualConstructorOptions) {
            this.updateCountContainer = $('<div>');
            $(options.element)
                //Display jquery version in visual
                .append(`<p>JQuery Version: <em>${$.fn.jquery}</em></p>`)
                //Add container for update count
                .append(this.updateCountContainer)

            $(options.element).append("<div id=\"map\"></div>");

            //OpenLayers
            debugger
            var map = new ol.Map({
                //target: "map"
            });
            debugger
            var osmSource = new ol.source.OSM();
            var osmLayer = new ol.layer.Tile({source: osmSource});
            map.addLayer(osmLayer);

            map.setView(new ol.View({
                center: [0, 0],
                zoom: 2
            }));
        }

        public update(options: VisualUpdateOptions) {
            //Display update count
            this.updateCountContainer.html(`<p>Update count: <em>${(this.updateCount++)}</em></p>`)           
        }
    }
}