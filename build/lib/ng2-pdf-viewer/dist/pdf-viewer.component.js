"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
require("pdfjs-dist/build/pdf.combined");
var PdfViewerComponent = (function () {
    function PdfViewerComponent(element) {
        this.element = element;
        this._showAll = false;
        this._renderText = true;
        this._originalSize = true;
        this._page = 1;
        this._zoom = 1;
        this._rotation = 0;
        this.afterLoadComplete = new core_1.EventEmitter();
        this.pageChange = new core_1.EventEmitter(true);
    }
    Object.defineProperty(PdfViewerComponent.prototype, "page", {
        set: function (_page) {
            _page = parseInt(_page, 10);
            if (this._pdf && !this.isValidPageNumber(_page)) {
                _page = 1;
            }
            if (this._page !== _page) {
                this._page = _page;
                this.pageChange.emit(_page);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "renderText", {
        set: function (renderText) {
            this._renderText = renderText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "originalSize", {
        set: function (originalSize) {
            this._originalSize = originalSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "showAll", {
        set: function (value) {
            this._showAll = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "zoom", {
        get: function () {
            return this._zoom;
        },
        set: function (value) {
            if (value <= 0) {
                return;
            }
            this._zoom = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "rotation", {
        set: function (value) {
            if (!(typeof value === 'number' && value % 90 === 0)) {
                console.warn('Invalid pages rotation angle.');
                return;
            }
            this._rotation = value;
        },
        enumerable: true,
        configurable: true
    });
    PdfViewerComponent.prototype.ngOnChanges = function (changes) {
        if ('src' in changes) {
            this.loadPDF();
        }
        else if (this._pdf) {
            this.update();
        }
    };
    PdfViewerComponent.prototype.loadPDF = function () {
        var _this = this;
        if (!this.src) {
            return;
        }
        PDFJS.getDocument(this.src).then(function (pdf) {
            _this._pdf = pdf;
            _this.afterLoadComplete.emit(pdf);
            _this.update();
        });
    };
    PdfViewerComponent.prototype.update = function () {
        this.page = this._page;
        if (!this._showAll) {
            this.renderPage(this._page);
        }
        else {
            this.renderMultiplePages();
        }
    };
    PdfViewerComponent.prototype.renderMultiplePages = function () {
        var container = this.element.nativeElement.querySelector('div');
        this.removeAllChildNodes(container);
        for (var page = 1; page <= this._pdf.numPages; page++) {
            this.renderPage(page);
        }
    };
    PdfViewerComponent.prototype.isValidPageNumber = function (page) {
        return this._pdf.numPages >= page && page >= 1;
    };
    PdfViewerComponent.prototype.buildSVG = function (viewport, textContent) {
        var SVG_NS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(SVG_NS, 'svg:svg');
        svg.setAttribute('width', viewport.width + 'px');
        svg.setAttribute('height', viewport.height + 'px');
        svg.setAttribute('font-size', '1');
        svg.setAttribute('class', 'textLayer');
        textContent.items.forEach(function (textItem) {
            var tx = window.PDFJS.Util.transform(window.PDFJS.Util.transform(viewport.transform, textItem.transform), [1, 0, 0, -1, 0, 0]);
            var style = textContent.styles[textItem.fontName];
            var text = document.createElementNS(SVG_NS, 'svg:text');
            text.setAttribute('transform', 'matrix(' + tx.join(' ') + ')');
            text.setAttribute('style', "\n      position: absolute;\n      fill: transparent;\n      line-height: 1;\n      white-space: pre;\n      cursor: text;\n      font-family: " + textItem.fontName + ", " + style.fontFamily + ";\n      ");
            text.textContent = textItem.str;
            svg.appendChild(text);
        });
        return svg;
    };
    PdfViewerComponent.prototype.renderPageOverlay = function (page, viewport, container) {
        var _this = this;
        page.getTextContent().then(function (textContent) {
            var index = _this._showAll ? page.pageIndex : 0;
            var canvas = container.querySelectorAll('canvas')[index];
            canvas.parentNode.insertBefore(_this.buildSVG(viewport, textContent), canvas);
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.zIndex = '-1';
        });
    };
    PdfViewerComponent.prototype.renderPage = function (pageNumber) {
        var _this = this;
        return this._pdf.getPage(pageNumber).then(function (page) {
            var viewport = page.getViewport(_this._zoom, _this._rotation);
            var container = _this.element.nativeElement.querySelector('div');
            var canvas = document.createElement('canvas');
            var div = document.createElement('div');
            if (!_this._originalSize) {
                viewport = page.getViewport(_this.element.nativeElement.offsetWidth / viewport.width, _this._rotation);
            }
            if (!_this._showAll) {
                _this.removeAllChildNodes(container);
            }
            div.appendChild(canvas);
            container.appendChild(div);
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            page.render({
                canvasContext: canvas.getContext('2d'),
                viewport: viewport
            });
            if (_this._renderText) {
                _this.renderPageOverlay(page, viewport, container);
            }
        });
    };
    PdfViewerComponent.prototype.removeAllChildNodes = function (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    };
    return PdfViewerComponent;
}());
__decorate([
    core_1.Output('after-load-complete'),
    __metadata("design:type", Object)
], PdfViewerComponent.prototype, "afterLoadComplete", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], PdfViewerComponent.prototype, "src", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PdfViewerComponent.prototype, "page", null);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], PdfViewerComponent.prototype, "pageChange", void 0);
__decorate([
    core_1.Input('render-text'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PdfViewerComponent.prototype, "renderText", null);
__decorate([
    core_1.Input('original-size'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PdfViewerComponent.prototype, "originalSize", null);
__decorate([
    core_1.Input('show-all'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PdfViewerComponent.prototype, "showAll", null);
__decorate([
    core_1.Input('zoom'),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], PdfViewerComponent.prototype, "zoom", null);
__decorate([
    core_1.Input('rotation'),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], PdfViewerComponent.prototype, "rotation", null);
PdfViewerComponent = __decorate([
    core_1.Component({
        selector: 'pdf-viewer',
        template: "<div class=\"ng2-pdf-viewer-container\" [ngClass]=\"{'ng2-pdf-viewer--zoom': zoom < 1}\"></div>",
        styles: ["\n.ng2-pdf-viewer--zoom {\n  overflow-x: scroll;\n}\n\n:host >>> .ng2-pdf-viewer-container > div {\n  position: relative;\n  z-index: 0;\n}\n\n:host >>> .textLayer {\n  font-family: sans-serif;\n  overflow: hidden;\n}\n  "]
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], PdfViewerComponent);
exports.PdfViewerComponent = PdfViewerComponent;
//# sourceMappingURL=pdf-viewer.component.js.map