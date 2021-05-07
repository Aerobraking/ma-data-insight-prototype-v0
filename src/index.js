const { ipcRenderer } = require('electron')

const path = require('path')
const drivelist = require('drivelist');


let selection;
/**
 * pan / zoom / dragging
 */
const panzoom = require('panzoom');
//var plainDraggable = require("@phanmn/plain-draggable")

// used for dragging
let startPosition;
let startPositionRel;



/**
 * Create pan/zoom instance
 */
var element = document.querySelector('#zoomPanel');
var panzoomInstance = panzoom(element, {
    maxZoom: 6,
    minZoom: 0.02,
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

var objects = new Array();


/**
 * File drop. Erstellt div container, die direkt auch draggable sind.
 */
document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();

    let offset = 0;

    for (const f of event.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        console.log('File Path of dragged files: ', f.size)

        const div = document.createElement('div');
        let scaling = panzoomInstance.getTransform().scale;


        // get drop position
        var rect = document.getElementById('zoomPanel').getBoundingClientRect();
        // correct coordinates by using the scaling factor of the zooming.
        var x = (event.clientX - rect.left) / scaling; //x position within the element.
        var y = (event.clientY - rect.top) / scaling;  //y position within the element.
        console.log("xOrig: " + (event.clientX - rect.left) + " yOrig: " + (event.clientY - rect.top));
        console.log("scaling: " + scaling);
        console.log("x: " + x + " y: " + y);
        div.className = 'mydiv select';

        div.innerHTML = f.path;

        document.getElementById('zoomPanel').appendChild(div);

        let dragg = new PlainDraggable(div, { left: 0, top: 0 });
        dragg.containment = { left: -50000, top: -50000, width: '100000', height: '100000' };
        dragg.onDragStart = function (pointerXY) {

            console.log("onDragStart");
            if (pointerXY.altKey) {
                return false;
            }
            /**
             * Triggers the selection event for the dragged object
             */
            selection.trigger(pointerXY);
            return true;
        };
        dragg.onTouch = function (e) {
            return false;
        };
        dragg.onMoveStart = function (position) {
            /**
             * The dragged object was added in the "onDragStart" event. Now when the dragging
             * starts for real, we cancel the selection. Otherwise the rectangle would appear.
             */
            selection.cancel();
            console.log("onMoveStart position: ");
            console.log(position);
            console.log();
            startPosition = {
                left: position.left,
                top: position.top
            };

            for (const dragEntry of objects) {
                dragEntry.startPositionRel = {
                    left: position.left,
                    top: position.top
                };
            }

        };
        dragg.onDrag = function (position) {
            // Adjust moving length
            console.log("onDrag");
            let scaling = panzoomInstance.getTransform().scale;

            if (startPosition) {
                // Adjust moving length
                let addLeft = (position.left - startPosition.left) / scaling;
                let addTop = (position.top - startPosition.top) / scaling;

                position.left = startPosition.left + addLeft;
                position.top = startPosition.top + addTop;

                console.log("dateien: " + objects.length);
                for (const dragEntry of objects) {
                    console.log("move instance: left: " + addLeft);
                    //dragEntry.left = dragEntry.startPositionRel.left + addLeft;
                  //  dragEntry.top = dragEntry.startPositionRel.top + addTop;
                }



            }

        };
        dragg.onDragEnd = function () {
            console.log("onDragEnd");
            // Adjust moving length
            startPosition = null;
            startPositionRel = null;
        };


        dragg.left += x + offset;
        dragg.top += y;
        offset += 150;
        objects.push(dragg);
    }

});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

document.addEventListener('dragenter', (event) => {
    console.log('File is in the Drop Space');
});

document.addEventListener('dragleave', (event) => {
    console.log('File has left the Drop Space');
});

/**
 * File Drop end
 */



var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);




draggable = new PlainDraggable(document.getElementsByClassName("mydiv")[0]);
draggable.containment = { left: -50000, top: -50000, width: '100000', height: '100000' };
draggable.onDragStart = function (pointerXY) {

    console.log("onDragStart");
    if (pointerXY.altKey || pointerXY.ctrlKey) {
        return false;
    }
    /**
     * Triggers the selection event for the dragged object
     */
    selection.trigger(pointerXY);
    return true;
};
draggable.onTouch = function (e) {
    return false;
};

draggable.onMoveStart = function (position) {
    /**
     * The dragged object was added in the "onDragStart" event. Now when the dragging
     * starts for real, we cancel the selection. Otherwise the rectangle would appear.
     */
    selection.cancel();
    console.log("onMoveStart");
    startPosition = {
        left: position.left,
        top: position.top
    };
};
draggable.onDrag = function (position) {
    // Adjust moving length
    console.log("onDrag");
    let scaling = panzoomInstance.getTransform().scale;

    if (startPosition) {
        // Adjust moving length
        position.left = startPosition.left + (position.left - startPosition.left) / scaling;
        position.top = startPosition.top + (position.top - startPosition.top) / scaling;
    }

};
draggable.onDragEnd = function () {
    console.log("onDragEnd");
    // Adjust moving length
    startPosition = null;
};

document.getElementsByClassName("mydiv")[0].addEventListener("mousedown", function (evt) {
    console.log("mein listener!");
});




selection = new SelectionArea({
    overlap: 'drop',
    // All elements in this container can be selected
    selectables: ['.select'],
    singleTap: {

        // Enable single-click selection (Also disables range-selection via shift + ctrl).
        allow: true,

        // 'native' (element was mouse-event target) or 'touch' (element visually touched).
        intersect: 'native'
    },

    // The container is also the boundary in this case
    boundaries: ['#wrapper']
}).on('beforestart', ({ store, event }) => {

    let cX = event.clientX;
    let sX = event.screenX;
    let cY = event.clientY;
    let sY = event.screenY;






    console.log("beforestart!!");

    // Remove class if the user isn't pressing the control key or ⌘ key
    if (event.altKey || event.ctrlKey) {
        return false;
    }
    if (event.button == 2) {
        return false;
    }

    // deaktiviert text selektion, damit wir nur die objekte selektieren
    document.body.style.userSelect = 'none'
    return true;
}).on('start', ({ store, event }) => {
    console.log("start");
    if (event.button == 2) {
        return false;
    }
    // Remove class if the user isn't pressing the control key or ⌘ key
    if (!event.altKey && !event.ctrlKey && !event.metaKey) {

        console.log(store);
        // Unselect all elements
        for (const el of store.stored) {
            el.classList.remove('selected');
            console.log("remove by start");
        }


        // Clear previous selection
        selection.clearSelection();
    }

}).on('move', ({ store: { changed: { added, removed } } }) => {
    console.log("move");

    // Add a custom class to the elements that where selected.
    for (const el of added) {
        el.classList.add('selected');
    }

    // Remove the class from elements that where removed
    // since the last selection
    for (const el of removed) {
        el.classList.remove('selected');
    }

}).on('stop', () => {
    selection.keepSelection();
    // aktiviert text selektion
    document.body.style.userSelect = 'unset'
});


/**
 * Drag from Window to Desktop
 */
document.getElementById("drag").ondragstart = (event) => {


    console.log("DESKTOP DRAG START ");
    console.log(event.target.getAttribute("filepath"));
    event.preventDefault();
    ipcRenderer.invoke('ondragstart', event.target.getAttribute("filepath"));
};
