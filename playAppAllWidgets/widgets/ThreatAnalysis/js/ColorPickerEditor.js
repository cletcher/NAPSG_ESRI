///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dojo/_base/array',
    "dojo/_base/lang",
    'dojo/_base/Color',
    'dojo/on',
    'dojo/dom-class',
    "dojo/query",
    "dojo/_base/html",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!../templates/ColorPickerEditor.html',
    "dijit/form/HorizontalSlider",
    'jimu/dijit/ColorPickerPopup',
    "dijit/form/NumberSpinner"
  ],
  function (declare, array, lang, Color, on, domClass, query, html,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
    HorizontalSlider, ColorPicker) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      _defaultColor: '#485566',
      templateString: template,
      nls: null,

      postCreate: function () {
        this.colorPicker = new ColorPicker({
          color: this._defaultColor
        }, this.colorPicker);
        this.colorPicker.startup();
        this.own(this.colorPicker.on("change", lang.hitch(this, function () {
          this.onColorPickerEditorChanged();
        })));

        this.slider = new HorizontalSlider({
          name: "slider",
          value: 100,
          minimum: 0,
          maximum: 100,
          discreteValues: 101,
          intermediateChanges: true,
          showButtons: false,
          style: "display: inline-block;"
        }, this.sliderBar);
        this.slider.startup();

        var options = [],
          option;
        var lineStyles = [
          "esriSLSDash",
          "esriSLSDashDot",
          "esriSLSDashDotDot",
          "esriSLSDot",
          "esriSLSLongDash",
          "esriSLSLongDashDot",
          "esriSLSNull",
          "esriSLSShortDash",
          "esriSLSShortDashDot",
          "esriSLSShortDashDotDot",
          "esriSLSShortDot",
          "esriSLSSolid"
        ];
        var fillStyles = [
          "esriSFSBackwardDiagonal",
          "esriSFSCross",
          "esriSFSDiagonalCross",
          "esriSFSForwardDiagonal",
          "esriSFSHorizontal",
          "esriSFSNull",
          "esriSFSSolid",
          "esriSFSVertical"
        ];
        if (this.type === 'line') {
          array.forEach(lineStyles, lang.hitch(this, function (style) {
            option = {
              value: style,
              label: this.nls.lineStyles[style]
            };
            options.push(option);
          }));
        } else {
          array.forEach(fillStyles, lang.hitch(this, function (style) {
            option = {
              value: style,
              label: this.nls.fillStyles[style]
            };
            options.push(option);
          }));
        }
        this.dropdown.addOption(options);

        this.inherited(arguments);
      },
      startup: function () {
        this.own(on(this.slider, 'change', lang.hitch(this, function (val) {
          if (!isNaN(val)) {
            if (false === this._isSameVal()) {
              if (val > this.spinner.maximum) {
                this.spinner.setValue(0);
                this.spinner.setValue(this.spinner.maximum);
              } else {
                this.spinner.setValue(val);
              }
            }
          }
        })));

        this.own(on(this.spinner, 'change', lang.hitch(this, function (val) {
          if (!isNaN(val)) {
            if (false === this._isSameVal()) {
              if (val > this.slider.maximum) {
                this.slider.setValue(0);
                this.slider.setValue(this.slider.maximum);
              } else {
                this.slider.setValue(val);
              }
            }
          }
        })));

        this.own(on(this.dropdown, 'change', lang.hitch(this, function () {
          this.onColorPickerEditorChanged();
        })));

        this._stylePolyfill();
        this.inherited(arguments);
      },
      _isSameVal: function () {
        return this.slider.getValue() === this.spinner.getValue();
      },
      getValues: function () {
        var rgb = null,
          a = null;
        var bgColor = this.colorPicker.getColor();
        if (bgColor && bgColor.toHex) {
          rgb = bgColor.toHex();
        }
        a = this.spinner.getValue() / 100;

        return {
          color: rgb,
          transparency: a
        };
      },
      setValues: function (obj) {
        if (typeof obj === "object" || typeof obj === "string") {
          this.colorPicker.setColor(new Color(obj.color));

          if (typeof obj.transparency === "undefined") {
            obj.transparency = 0;
          } else {
            obj.transparency = obj.transparency * 100;
          }
          this.slider.setValue(obj.transparency);
          this.spinner.setValue(obj.transparency);
        }
      },
      _stylePolyfill: function () {
        var leftBumper = query('.dijitSliderLeftBumper', this.domNode)[0];
        if (leftBumper && leftBumper.parentNode) {
          html.setStyle(leftBumper.parentNode, 'background-color', "#24b5cc");
        }
      },
      onColorPickerEditorChanged: function () {

      }
    });
  });