
async function menuCommand(selection, root) {
    // Get and show the dialog
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
}

function updateArtBoardTitle(selection, root, writeMode) {

    root.children.forEach((childNode) => {
        if (childNode.constructor.name === "Artboard") {
            let w = childNode.width;
            let h = childNode.height;
            let n = childNode.name;

            if (writeMode === 0) {
                childNode.name = `${n}${w}x${h}`;
            } else {
                childNode.name = `${w}x${h}`;
            }

        }
    });
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
            <h1>Please choose write mode:</h1>
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

    // [...input].map(i => console.log(i.value));

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





//------------------------





// const { confirm, prompt } = require("./lib/dialogs.js");

// async function addSizeToArtboardTitleHandler(selection, root) {
//     const feedback = await confirm("Choose a mode:",
//         "Would you like to add to your current Artboard names or overwrite them?",
//         ["Add", "Overwrite"]);
//     switch (feedback.which) {
//         case 0:
//             updateArtBoardTitle(selection, root, 0);
//             break;
//         case 1:
//             updateArtBoardTitle(selection, root, 1);
//             break;
//     }
// }

// function updateArtBoardTitle(selection, root, writeMode) {

//     root.children.forEach((childNode) => {
//         if (childNode.constructor.name === "Artboard") {
//             let w = childNode.width;
//             let h = childNode.height;
//             let n = childNode.name;

//             if (writeMode === 0) {
//                 childNode.name = `${n}${w}x${h}`;
//             } else {
//                 childNode.name = `${w}x${h}`;
//             }

//         }
//     });
// }

// module.exports = {
//     commands: {
//         addSizeToArtboardTitle: createDialog
//     }
// };

