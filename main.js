
const { alert } = require("./lib/dialogs.js");

async function menuCommand(selection, root) {

    let rootChildren = [];
    root.children.forEach((childNode) => {
        (childNode.constructor.name === "Artboard" ? rootChildren.push(true) : rootChildren.push(false));
    });
    
    if (rootChildren.some ((element) => {return element === true})) {
        //if there's at least one artboard
        const dialog = getDialog();
        const result = await dialog.showModal();

        // Exit if the user cancels the modal
        if (result === "reasonCanceled") {
            return console.log("User clicked cancel or escape.");
        } else {
            switch (result) {
                case "add":
                    updateArtBoardTitle(selection, root, 0);
                    break;
                case "overwrite":
                    updateArtBoardTitle(selection, root, 1);
                    break;
            }
        }
    } else {
        //if no artboards present, throw and alert and abort
        showAlert("No Artboards found", "This plugin requires at least one artboard to be present in your document. Please create one and try again." )
        return;
    }
}

async function showAlert(title, message) {
    await alert(title, message);
};

function updateArtBoardTitle(selection, root, writeMode) {
    
    //if we have a selection, apply to the selected artboards only
    if (selection.items.length > 0) {
        selection.items.map(item => applyArtboardDimensionsToSelection(item, writeMode));
    }  else {
        //if nothing is selected, apply to the whole document
        root.children.forEach((childNode) => {
            if (childNode.constructor.name === "Artboard") {
                applyArtboardDimensionsToSelection(childNode);
            }
        });
    }
}

function applyArtboardDimensionsToSelection(node, writeMode) {

    let w = node.width;
    let h = node.height;
    let n = node.name;

    if (writeMode === 0) {
        node.name = `${n}${w}x${h}`;
    } else {
         node.name = `${w}x${h}`;
    }
}

function getDialog() {
    // Get the dialog if it already exists
    let dialog = document.querySelector("dialog");
    if (dialog) {
        return dialog;
    }
    // Otherwise, create and return a new dialog
    return createDialog();
}

function createDialog() {
    //// Add your HTML to the DOM
    document.body.innerHTML = `
    <style>
        form {
            width: 400px;
        }

        input > * {
           display: inline;
        }
    </style>
    <dialog>
        <form method="dialog">
            <h1>Add Artboard Dimensions</h1>
            <p>If you have an active selection, the plugin will only change the selected artboards. Otherwise, it will apply to the whole document.</p>
            <p><strong>Please select a write mode:</strong></p>
            <label >
                <input type="radio" name="writemode" id="writemode-add" value="add" checked>Add to current title<br>
                <input type="radio" name="writemode" value="overwrite">Overwrite<br>
            </label>
            <footer>
                <button id="cancel">Cancel</button>
                <button type="submit" id="ok" uxp-variant="cta">Add</button>
            </footer>
        </form>
    </dialog>
  `;

    //// Get references to DOM elements
    // Each of these will be used in event handlers below
    const dialog = document.querySelector('dialog');
    const form = document.querySelector('form');
    const btnCancel = document.querySelector('#cancel');
    const btnOk = document.querySelector('#ok');
    const input = document.querySelectorAll('input');

    btnCancel.addEventListener("click", () => {
        dialog.close("reasonCanceled");
    });

    btnOk.addEventListener("click", (e) => {
        let value;
        [...input].map(i => {
            if (i.checked) {
                value = i.value;
                handleSubmit(e, dialog, value);
            }
        });
    });

    form.onsubmit = (e) => {
        let value;
        [...input].map(i => {
            if (i.checked) {
                value = i.value;
                handleSubmit(e, dialog, value);
            }
        });
    };

    return dialog;
}

function handleSubmit(e, dialog, value) {
    // Close the dialog, passing back data
    dialog.close(value);
    // Prevent further automatic close handlers
    e.preventDefault();
}

module.exports = {
    commands: {
        addSizeToArtboardTitle: menuCommand
    }
};