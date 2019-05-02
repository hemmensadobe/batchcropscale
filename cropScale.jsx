// Settings
 var doc = "",
     docWidth       = 0,
     docHeight      = 0,
     ratio          = 0,
     currentFileRef = "",
     inputFolder    = Folder.selectDialog("Please select the folder with Files to process"),
     hotFolder      = new Folder(inputFolder),
     exportFolder   = inputFolder+"/output/";

function checkForFiles() {
    filesArray = [];
    var aChildren = hotFolder.getFiles();
    // No files processing
    if (aChildren.length === 0) {
        $.writeln ( "No files to process");
    } 
    else {
        var child = '';
        // Process files
        for (var i = 0; i < aChildren.length; i++) {
            child = aChildren[i];
            filesArray.push(child);
        }
    }
    if(filesArray.length > 0) {
        processFiles();
    }
 }

function processFiles() {
    $.writeln ( "Process files: files array is + : " + filesArray);
    var currentImage = '';
    for(var i = 0; i < filesArray.length; i++) {
        currentImage = filesArray[i];
        processImage(currentImage, i);
    }
}

function processImage(image, count) {
    $.writeln ( "Process Image");
    openImage(image, 'ee');
    openImage(image, 'bt');
}

function openImage(image, cropType) {
    $.writeln ( "Open image");
    cropSize = cropType;
 
     // Sizing
     if (cropType == "ee" ) {
            resizeHeight = resizeWidth = 433;
            padding = 4;
    }
    else {
          resizeHeight = 800;
          resizeWidth = 460;
          padding = 2;
    }
    
    var fileRef = new File(image);
    currentFileRef = fileRef;
    app.open(fileRef);
    resizeAndCrop();
}

function resizeAndCrop() {
    doc =  activeDocument;
    docWidth = doc.width;
    docHeight = doc.height;
    ratio = docHeight/docWidth;
    //createSmartObject();
    selectSubject ();
    crop();
    resize();
    exportImage();
};

function normalize() {
    var white = new SolidColor(); 
    white.rgb.hexValue = "FFFFFF";
    app.backgroundColor = white;
}

function createSmartObject() {
    var idnewPlacedLayer = stringIDToTypeID( "newPlacedLayer" );
    executeAction( idnewPlacedLayer, undefined, DialogModes.NO );
}

function selectSubject() {
    var idautoCutout = stringIDToTypeID( "autoCutout" );
    var desc63 = new ActionDescriptor();
    var idsampleAllLayers = stringIDToTypeID( "sampleAllLayers" );
    desc63.putBoolean( idsampleAllLayers, false );
    executeAction( idautoCutout, desc63, DialogModes.NO );
}

function maskSelection() {
    var idMk = charIDToTypeID( "Mk  " );
    var desc545 = new ActionDescriptor();
    var idNw = charIDToTypeID( "Nw  " );
    var idChnl = charIDToTypeID( "Chnl" );
    desc545.putClass( idNw, idChnl );
    var idAt = charIDToTypeID( "At  " );
    var ref65 = new ActionReference();
    var idChnl = charIDToTypeID( "Chnl" );
    var idChnl = charIDToTypeID( "Chnl" );
    var idMsk = charIDToTypeID( "Msk " );
    ref65.putEnumerated( idChnl, idChnl, idMsk );
    desc545.putReference( idAt, ref65 );
    var idUsng = charIDToTypeID( "Usng" );
    var idUsrM = charIDToTypeID( "UsrM" );
    var idRvlS = charIDToTypeID( "RvlS" );
    desc545.putEnumerated( idUsng, idUsrM, idRvlS );
    executeAction( idMk, desc545, DialogModes.NO );
}

function crop() {
    var idCrop = charIDToTypeID( "Crop" );
    var desc88 = new ActionDescriptor();
    var idDlt = charIDToTypeID( "Dlt " );
    desc88.putBoolean( idDlt, true );
    executeAction( idCrop, desc88, DialogModes.NO );
}

function magicWandSelect() {

}

function resize() {
    var docWidth = doc.width;
    var docHeight = doc.height;
    var ratio = docHeight/docWidth;
    var tempWidth = (resizeHeight - padding)/ratio;
    doc.resizeImage(UnitValue(tempWidth,"px"),UnitValue((resizeHeight - padding),"px"));
    doc.resizeCanvas(UnitValue(resizeWidth,"px"),UnitValue(resizeHeight,"px"));
}

function exportImage() {
        // Document name
	    var docName = doc.name; 

	    // Document path
	    var docPath = doc.path;

	    // Gets rid of the extension
	    var docName  = docName.substring( 0, docName.indexOf('.') );

	    // Construct the Auto Save folder path
	    var savePath = exportFolder;

	    // If Auto Save folder doesn't exist, make one.
	    var saveFolder1       = new Folder( exportFolder+'/'+cropSize );
        var saveFolder2       = new Folder( exportFolder+'/'+cropSize+'/psd' );
	    if( !saveFolder1.exists ) { saveFolder2.create(); }
        if( !saveFolder2.exists ) { saveFolder2.create(); }

	    // Options for saving psd
        var psdFile = new File(savePath + '/' +cropSize+'/psd/'+ docName+ '.psd');
	    var psd_Opt = new PhotoshopSaveOptions();
	    psd_Opt.layers = true; // Preserve layers.
	    psd_Opt.embedColorProfile = true; // Preserve color profile.
	    psd_Opt.annotations  = true; // Preserve annonations.
	    psd_Opt.alphaChannels = true; // Preserve alpha channels.
	    psd_Opt.spotColors = true; // Preserve spot colors.
         app.activeDocument.saveAs(psdFile, psd_Opt, true, Extension.LOWERCASE);
        
        var jpgFile = new File(savePath + '/' +cropSize+'/'+ docName+ '.jpeg');
        var jpgSaveOptions = new JPEGSaveOptions();
        jpgSaveOptions.embedColorProfile = true;
        jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
        jpgSaveOptions.matte = MatteType.NONE;
        jpgSaveOptions.quality = 12;
        app.activeDocument.saveAs(jpgFile, jpgSaveOptions, true, Extension.LOWERCASE);

	    // Close the current document without saving
	    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES); 
}
checkForFiles();

