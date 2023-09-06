/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * Small, still experimental library to reproject raster images. 
 * The code is based on Klokan Petr Přidal's experiments:
 * http://blog.klokan.cz/2009/10/raster-map-reprojection-warping-with.html
 * 
 * It requires the library Proj4js (http://trac.osgeo.org/proj4js/).
 * 
 * Usage:
 *      var sourceImage = document.getElementById("inputImg");
 *      
 *      var sourceCRS = new Proj4js.Proj("EPSG:4326"); 
 *      var sourceBounds = {
 *          left: -180,
 *          bottom: -90,
 *          right: 180,
 *          top: 90    
 *      };
 *      var sourceSize = {
 *          w: 1024,
 *          h: 512  
 *      };
 *                                   
 *      var targetCRS = new Proj4js.Proj("900913"); 
 *      var wld = 20037508.342789244;
 *      var targetBounds = {
 *          left: -wld,
 *          bottom: -wld,
 *          right: wld,
 *          top: wld    
 *      };
 *      var targetSize = {
 *          w: 256,
 *          h: 256  
 *      }; 
 *      
 *      var warper = new GDALWarp(sourceImage, sourceCRS, sourceBounds, sourceSize, 
 *                                      targetCRS, targetBounds, targetSize)
 *                                      
 *      // blocking call
 *      var targetImage = warper.reproject(); 
 *      // ..
 *      
 *      // asynchronous call
 *      var handlerDone = function(resultCanvas) {
 *          var targetImage = resultCanvas; 
 *          // ..
 *      };
 *      
 *      // display the progress in a progress bar
 *      var handlerProgress = function(progress) {
 *          document.getElementById("progressBar").value = progress;  
 *      };
 *      
 *      var handlerError = function(error) {
 *          // ..
 *      };
 *      
 *      warper.reprojectAsync(
 *          "proj4js.js",
 *          handlerDone,
 *          handlerProgress,
 *          handlerError,
 *          [
 *              {
 *                  code: "EPSG:54009",
 *                  definition: "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"
 *              }   
 *          ]
 *      );
 * 
 * @param {Image} image - The image to reproject
 * @param {Proj4js.Proj} sourceCRS - The projection in which the source image was drawn
 * @param {Object} sourceBounds - The bounds of the source image in sourceCRS
 * @param {Object} sourceSize - The pixel size of the source image
 * @param {Proj4js.Proj} targetCRS - The projection in which the target image should be drawn
 * @param {Object} targetBounds - The bounds of the target image in targetCRS
 * @param {Object} targetSize - The pixel size of the target image
 */
var GDALWarp = function(image, sourceCRS, sourceBounds, sourceSize, 
                                        targetCRS, targetBounds, targetSize) {
    this.image = image;
    
    this.sourceCRS = sourceCRS;
    this.sourceBounds = sourceBounds;
    this.sourceSize = sourceSize;
    
    this.targetCRS = targetCRS;
    this.targetBounds = targetBounds;
    this.targetSize = targetSize;
    
    /**
     * Starts the reprojecting process.
     * 
     * @return {Canvas} The reprojected image
     */
    this.reproject = function() {
        this.createCanvasElements();
        
        // warp    
        return this.warp();
    };
    
    /**
     * Also starts the reprojecting process, but the 
     * reprojection is executed in a web worker.
     * 
     * @param {String} proj4JSPath - The path to the Proj4JS library
     * @param {Function} callbackDone - Called when the reprojection is finished. The
     *                                  function receives a single argument, the drawn canvas.
     * @param {Function} callbackStatus - Optional, called for progress updates
     * @param {Function} callbackError - Optional, called in case of an error
     * @param {Array} proj4JDefinitions - Optional, a list of additional projection definitions.
     * @param {String} webworkerPath - Optional, the path to the web worker script 
     *                                  (default: 'gdalwarp-webworker.js')
     */
    this.reprojectAsync = function(proj4JSPath, callbackDone, callbackStatus, callbackError,
                                    proj4JDefinitions, webworkerPath) {
        if (webworkerPath === undefined) {
            webworkerPath = "gdalwarp-webworker.js";
        }                                        
                                        
        // create the canvas element to get the ImageData objects
        this.createCanvasElements();   
        this.setImageData();
        
        // start the web worker
        var worker = new Worker(webworkerPath);
        
        var context = this;
        worker.onmessage = function(event) {
            if (event.data.status === "progress" && callbackStatus) {
                callbackStatus(event.data.progress);        
            } else if (event.data.status === "done") {
                // reprojection is finished, execute the callback function
                context.targetImageData = event.data.targetImageData;         
                context.writeImageDataToCanvas();
                
                callbackDone(context.targetCanvas);
            }  
        };
        
        worker.onerror = function(event) {
            if (callbackError) {
                callbackError(event); 
            }   
        };  
        
        var warpTask = {
            status: "start",
            proj4JSPath: proj4JSPath, 
            sourceImageData: this.sourceImageData, 
            sourceSRSCode: this.sourceCRS.srsCode, 
            sourceBounds: this.sourceBounds, 
            sourceSize: this.sourceSize,
            targetImageData: this.targetImageData, 
            targetSRSCode: this.targetCRS.srsCode, 
            targetBounds: this.targetBounds, 
            targetSize: this.targetSize,    
            proj4JDefinitions: (proj4JDefinitions) ? proj4JDefinitions : []
        };   
        
        worker.postMessage(warpTask);
    };    
    
    /**
     * Creates canvas elements for the source and
     * target image.
     */
    this.createCanvasElements = function() {
        // convert source image to canvas
        this.sourceCanvas = this.getSourceCanvas();
        
        // create target canvas
        this.targetCanvas = this.createCanvas(this.targetSize.w, this.targetSize.h);
    };
    
    /**
     * Draws the source image on a canvas element, so
     * that the pixel data of the source image can be accessed.
     * 
     * @return {Canvas} A canvas element showing the source image
     */
    this.getSourceCanvas = function() {
        var sourceCanvas = this.createCanvas(this.sourceSize.w, this.sourceSize.h);
        var context = sourceCanvas.getContext("2d");       
        context.drawImage(this.image, 0, 0);
        
        return sourceCanvas;
    };
    
    /**
     * Creates a canvas element and sets
     * the given size. 
     * 
     * @param {int} width
     * @param {int} height
     * @return {Canvas}
     */
    this.createCanvas = function(width, height) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        
        return canvas;    
    };
    
    /**
     * Start the warping.
     * 
     * @return {Canvas} The reprojected image
     */
    this.warp = function() {
        this.setImageData();
        
        // start the warping
        GDALWarp.warpImageData(this.sourceImageData, this.sourceCRS, this.sourceBounds, this.sourceSize, 
                        this.targetImageData, this.targetCRS, this.targetBounds, this.targetSize);
        
        this.writeImageDataToCanvas();
        
        return this.targetCanvas;
    };
    
    /**
     * Sets the ImageData objects of both canvas elements on
     * the instance.
     */
    this.setImageData = function() {
        // get the pixel data of the source and target canvas
        this.sourceImageData = this.sourceCanvas.getContext("2d").getImageData(0, 0, 
                                            this.sourceSize.w, this.sourceSize.h);
        this.targetImageData = this.targetCanvas.getContext("2d").getImageData(0, 0, 
                                            this.targetSize.w, this.targetSize.h);
    };
    
    /**
     * Writes the changed pixels back to the target canvas.
     */
    this.writeImageDataToCanvas = function() {
        this.targetCanvas.getContext("2d").putImageData(this.targetImageData, 0, 0);
    };
};

/**
 * This method does the actual reprojection. It loops over the pixels
 * of the target image and for each pixel it finds the corresponding pixel 
 * of the source image.
 * 
 * @param {ImageData} sourceImageData - Pixel data of the source image
 * @param {Proj4js.Proj} sourceCRS - The projection in which the source image was drawn
 * @param {Object} sourceBounds - The bounds of the source image in sourceCRS
 * @param {Object} sourceSize - The pixel size of the source image
 * @param {ImageData} targetImageData - Pixel data of the target image
 * @param {Proj4js.Proj} targetCRS - The projection in which the target image should be drawn
 * @param {Object} targetBounds - The bounds of the target image in targetCRS
 * @param {Object} targetSize - The pixel size of the target image
 * @param {Function} callbackProgress - Optional, Calllback progress function
 */
GDALWarp.warpImageData = function(sourceImageData, sourceCRS, sourceBounds, sourceSize,
                                targetImageData, targetCRS, targetBounds, targetSize,
                                callbackProgress) {
    if (callbackProgress) {
        var numPixels = targetImageData.width * targetImageData.height;
        var lastProgress = 0;
    }
    
    // loop over the pixels of the target image (row by row)   
    for (var y = 0; y < targetImageData.height; y++) {                
        for (var x = 0; x < targetImageData.width; x++) {  
            if (callbackProgress) {
                // report progress
                var progress = Math.round((((y * targetImageData.width) + x) / numPixels) * 100);
                
                if (progress > lastProgress) {
                    // only report if the progress changed
                    lastProgress = progress;
                    callbackProgress({progress: progress})
                }
            }    
            
            var targetPixel = {
                x: x,
                y: y    
            };
            
            // calculate the real-world coordinate in targetCRS for this pixel
            // on the target image
            var targetLonLat = GDALWarp.getLonLatFromPixel(targetPixel, 
                                        targetBounds, targetSize);   
            
            // transform the real-world coordinate to sourceCRS
            var sourceLonLat = GDALWarp.transform(targetLonLat, targetCRS, sourceCRS);
            
            // calculate the pixel position for the real-world coordinate in sourceCRS
            // on the source image               
            var sourcePixel = GDALWarp.getPixelFromLonLat(sourceLonLat, 
                                        sourceBounds, sourceSize);
            
            // then copy the pixel value from source to target                          
            GDALWarp.copyPixelData(sourcePixel, sourceImageData, 
                                targetPixel, targetImageData);
        }
    }    
};
    
/**
 * Transforms a pixel position into real-world coordinates.
 * 
 * @param {Object} px - Pixel position on the canvas
 * @param {Object} bounds - The real-world bounds of the canvas
 * @param {Object} pixelSize - The size of the canvas in pixels
 * @return {Object} The real-world coordinates of the pixel
 */
GDALWarp.getLonLatFromPixel = function(px, bounds, pixelSize) {
    var ratioX = px.x / pixelSize.w;
    var lon = bounds.left + ratioX * (bounds.right - bounds.left);
    
    // for canvas, pixel (0,0) is at the upper-left corner,
    // but for the transformation we need it to be bottom-left
    var y = pixelSize.h - px.y -1;
    var ratioY = y / pixelSize.h;
    var lat = bounds.bottom + ratioY * (bounds.top - bounds.bottom);      
    
    return {
        lon: lon,
        lat: lat    
    };
};

/**
 * Uses Proj4js to reproject a coordinate from sourceCRS 
 * to targetCRS.
 * 
 * @param {Object} sourceLonLat
 * @param {Proj4js.Proj} sourceCRS
 * @param {Proj4js.Proj} targetCRS
 */
GDALWarp.transform = function(sourceLonLat, sourceCRS, targetCRS) {
    var point = new Proj4js.Point(sourceLonLat.lon, sourceLonLat.lat);
    Proj4js.transform(sourceCRS, targetCRS, point);   
    
    return {
        lon: point.x,
        lat: point.y    
    }; 
};

/**
 * Opposite to getLonLatFromPixel(..), transforms a real-world coordinate 
 * in to a pixel position.
 * 
 * @param {Object} lonLat - Real-world coordinate
 * @param {Object} bounds - The real-world bounds of the canvas
 * @param {Object} pixelSize - The size of the canvas in pixels
 * @returns {Object} The pixel position of the coordinate on the canvas
 */
GDALWarp.getPixelFromLonLat = function(lonLat, bounds, pixelSize) {
    var ratioX = Math.abs(lonLat.lon - bounds.left) / (bounds.right - bounds.left);
    var x = Math.floor(ratioX * pixelSize.w);
    
    var ratioY = Math.abs(lonLat.lat - bounds.bottom) / (bounds.top - bounds.bottom);
    var y = Math.floor(ratioY * pixelSize.h); 
    // and again transform the y-coordinate for canvas 
    // from bottom-left to upper-left  
    y = pixelSize.h - y -1;
    
    return {
        x: x,
        y: y    
    };
};

/**
 * Copies the values of a pixel on the source image to the
 * target image.
 * 
 * @param {Object} sourcePixel - Pixel position on the source image
 * @param {ImageData} sourceImageData - Pixel data of the source image
 * @param {Object} targetPixel - Pixel position on the target image
 * @param {ImageData} targetImageData - Pixel data of the target image
 */
GDALWarp.copyPixelData = function(sourcePixel, sourceImageData, 
                                 targetPixel, targetImageData) {
    var sourceOffset = (sourcePixel.y * (sourceImageData.width * 4)) + (sourcePixel.x * 4);
    var targetOffset = (targetPixel.y * (targetImageData.width * 4)) + (targetPixel.x * 4);
    
    // copy ARGB values
    targetImageData.data[targetOffset + 0] = sourceImageData.data[sourceOffset + 0];
    targetImageData.data[targetOffset + 1] = sourceImageData.data[sourceOffset + 1];
    targetImageData.data[targetOffset + 2] = sourceImageData.data[sourceOffset + 2];
    targetImageData.data[targetOffset + 3] = sourceImageData.data[sourceOffset + 3];
};

