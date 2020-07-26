if (figma.currentPage.selection.length <= 0) {
  figma.closePlugin('Please select a Rectangle, Ellipse, Polygon, Frame or Group before running this plugin')
}

let ignoredCounter = 0
let ref = []
let selection = figma.currentPage.selection

selection.forEach(c => {
  ref.push(c)
})

ref.sort(function (a, b) {
  return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
});
// TODO: turn this into an dropdown option
// ref.reverse()

ref.forEach((layer: any) => {

  // make sure it's a vector
  if (layer.type === "RECTANGLE" || layer.type === "ELLIPSE" || layer.type === "POLYGON" || layer.type === "VECTOR") {

    if (!layer.fillStyleId) {

      //creating the paint style
      var newStyle = figma.createPaintStyle()
      var hex = findTheHEX(layer.fills[0].color.r, layer.fills[0].color.g, layer.fills[0].color.b)

      //naming the paint style with the layer name
      newStyle.name = layer.name
      newStyle.description = hex.toUpperCase()

      //assigning the color
      newStyle.paints = [{
        type: layer.fills[0].type,
        color: {
          r: layer.fills[0].color.r,
          g: layer.fills[0].color.g,
          b: layer.fills[0].color.b
        },
        opacity: layer.fills[0].opacity
      }]

      //applying the style to the selected layer
      layer.fillStyleId = newStyle.id

      // console log the output
      console.log('🎉 Created style ' + layer.name)

    } else {
      ignoredCounter++
    }

  } else if (layer.type === "GROUP" || layer.type === "FRAME") {
    // console.log(layer.children);
    // find child layers that are not another group or frame
    const colorlayers = layer.findAll(child => child.type === "RECTANGLE" || child.type === "ELLIPSE" || child.type === "POLYGON" || child.type === "VECTOR")
    console.log(colorlayers);
    if (colorlayers.length <= 0) {
      figma.closePlugin('Please select a Group or Frame that has a Rectangle, Ellipse, Polygon, or Vector.')
    } else {
      //needs to be for each color in selected
      colorlayers.forEach(function (child) {
        //console.log(child);
        //now add colors from those layers if they don't already have a color style applied
        if (!child.fillStyleId) {
          //creating the paint style
          var newStyle = figma.createPaintStyle()
          var hex = findTheHEX(child.fills[0].color.r, child.fills[0].color.g, child.fills[0].color.b)

          //naming the paint style with the layer name
          newStyle.name = child.name
          newStyle.description = hex.toUpperCase()

          //assigning the color
          newStyle.paints = [{
            type: child.fills[0].type,
            color: {
              r: child.fills[0].color.r,
              g: child.fills[0].color.g,
              b: child.fills[0].color.b
            },
            opacity: child.fills[0].opacity
          }]

          //applying the style to the selected layer
          child.fillStyleId = newStyle.id

          // console log the output
          console.log('🎉 Created style ' + child.name)


        } else {
          ignoredCounter++
        }
      })
    }



  } else {
    figma.closePlugin('Please select a Rectangle, Ellipse, Polygon, Vector, Frame, or Group before running this plugin')
  }
});

figma.currentPage.selection = []

if (ignoredCounter > 0) {
  figma.closePlugin('⚠️ Warning: ' + ignoredCounter + ' color style(s) already exist and can\'t be added')
} else {
  figma.closePlugin();
}

function findTheHEX(red: any, green: any, blue: any) {
  var redHEX = rgbToHex(red)
  var greenHEX = rgbToHex(green)
  var blueHEX = rgbToHex(blue)

  return redHEX + greenHEX + blueHEX
}

function rgbToHex(rgb: any) {
  rgb = Math.floor(rgb * 255)
  var hex = Number(rgb).toString(16)
  if (hex.length < 2) {
    hex = '0' + hex
  }
  return hex
}