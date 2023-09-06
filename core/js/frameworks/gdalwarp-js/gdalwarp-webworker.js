/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * This script is called as web worker from GDALWarp.reprojectAsync().
 */

onmessage = function(event) {
    var options = event.data;
    
    importScripts("gdalwarp.js");
    importScripts(options.proj4JSPath);
    
    // set additional Proj4JS projection definitions
    var definitions = options.proj4JDefinitions;
    for (var i = 0; i < definitions.length; i++) {
        Proj4js.defs[definitions[i].code] = definitions[i].definition;
    }
    
    // create new projection instances, because objects sent by
    // postMessage() loose their functions, so that we can't use the
    // original projection objects
    options.sourceCRS = new Proj4js.Proj(options.sourceSRSCode);
    options.targetCRS = new Proj4js.Proj(options.targetSRSCode);

    // start the warping
    warp(options);
    
    // send the result image data back to the main script
    var result = {
        status: "done",
        targetImageData: options.targetImageData        
    };
    postMessage(result);
    
    // important: now terminate the worker, because some browser (Chrome 6)
    // only allow a limited number of workers
    close();
};

var warp = function(options) {
    var handlerProgress = function(event) {
        postMessage({
            status: "progress",
            progress: event.progress
        });    
    };
    
    GDALWarp.warpImageData(options.sourceImageData, options.sourceCRS, options.sourceBounds, options.sourceSize, 
                        options.targetImageData, options.targetCRS, options.targetBounds, options.targetSize, 
                        handlerProgress);    
};
