
const { confirm } = require("./lib/dialogs.js");

async function addSizeToArtboardTitleHandler(selection, root) {
    const feedback = await confirm("Choose a mode:",
        "Would you like to add to your current Artboard names or overwrite them?", 
        ["Add", "Overwrite"]);
    switch (feedback.which) {
        case 0:
            updateArtBoardTitle(selection, root, 0);
            break;
        case 1:
            updateArtBoardTitle(selection, root, 1);
            break;
    }
}

function updateArtBoardTitle(selection, root, writeMode) { 

    root.children.forEach((childNode) => {
        if (childNode.constructor.name === "Artboard"){
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

module.exports = {
    commands: {
        addSizeToArtboardTitle: addSizeToArtboardTitleHandler
    }
};
