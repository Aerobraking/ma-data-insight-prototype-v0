const { remote } = require('electron');
const mainProcess = remote.require('./main.js');
const path = require('path')
const drivelist = require('drivelist');
/**
 * pan / zoom / dragging
 */
const panzoom = require('panzoom');
//var plainDraggable = require("@phanmn/plain-draggable")


var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

var element = document.querySelector('#zoomPanel');

var panzoomInstance = panzoom(element, {
    maxZoom: 2,
    minZoom: 0.1,
    bounds: false,
    beforeWheel: function (e) {
        // allow wheel-zoom only if altKey is down. Otherwise - ignore
        var shouldIgnore = !e.altKey;
        return shouldIgnore;
    },
    beforeMouseDown: function (e) {
        // allow mouse-down panning only if altKey is down. Otherwise - ignore
        var shouldIgnore = !e.altKey;
        return shouldIgnore;
    }
})


 
draggable = new PlainDraggable(document.getElementsByClassName("mydiv")[0]);
draggable.containment = { left: -50000, top: -50000, width: '100000', height: '100000' };
draggable.onDragStart = function (pointerXY) {
    if (pointerXY.altKey) {
        return false;
    }
    return true;
};
let startPosition;
draggable.onMoveStart = function (position) {
    /**
     * speichere die start position beim draggen
     */
    startPosition = {
        left: position.left,
        top: position.top
    };
};
draggable.onDrag = function (position) {

    // Adjust moving length

    let scaling = panzoomInstance.getTransform().scale;
    console.log(scaling);
    console.log(position);

    if (startPosition) {
        // Adjust moving length
        position.left = startPosition.left + (position.left - startPosition.left) / scaling;
        position.top = startPosition.top + (position.top - startPosition.top) / scaling;
    }

};
draggable.onDragEnd = function () {
    // Adjust moving length
    startPosition = null;
};

 
//dragElement(document.getElementById("mydiv"));

// function dragElement(elmnt) {
//     var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//     if (document.getElementById(elmnt.id + "header")) {
//         // if present, the header is where you move the DIV from:
//         document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
//     } else {
//         // otherwise, move the DIV from anywhere inside the DIV:
//         elmnt.onmousedown = dragMouseDown;
//     }

//     function dragMouseDown(e) {

//         e = e || window.event;
//         e.preventDefault();
//         // get the mouse cursor position at startup:
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         document.onmouseup = closeDragElement;
//         // call a function whenever the cursor moves:
//         document.onmousemove = elementDrag;
//     }

//     function elementDrag(e) {
//         if (e.altKey) {
//             return;
//         }
//         e = e || window.event;
//         e.preventDefault();
//         // calculate the new cursor position:
//         pos1 = (pos3 - e.clientX) * (1/ panzoomInstance.getTransform().scale);
//         pos2 = (pos4 - e.clientY) * (1/ panzoomInstance.getTransform().scale);
//         console.log((1/ panzoomInstance.getTransform().scale));
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         // set the element's new position:
//         elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//         elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//     }

//     function closeDragElement() {
//         // stop moving when mouse button is released:
//         document.onmouseup = null;
//         document.onmousemove = null;
//     }
// }