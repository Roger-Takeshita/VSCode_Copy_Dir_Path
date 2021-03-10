const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const ncp = require('copy-paste');

function activate(context) {
    const copyAbsolutePath = (e, touch = false) => {
        let absolute = '';
        let currentPath = e && e.path;

        if (!currentPath && vscode.window.activeTextEditor) {
            currentPath = vscode.window.activeTextEditor.document.fileName;
        }

        if (currentPath) {
            if (fs.lstatSync(currentPath).isDirectory()) {
                absolute = currentPath;
            } else {
                absolute = path.dirname(currentPath);
            }

            if (!touch) {
                ncp.copy(`${absolute.replace(':', '')}/`);
            } else {
                ncp.copy(`touch ${absolute.replace(':', '')}/`);
            }
        }
    };

    const copyRelativePath = (e, touch = false) => {
        let relative = '';
        const workspacePath = vscode.workspace.workspaceFolders[0].uri.path;
        let currentPath = e && e.path;

        if (!currentPath && vscode.window.activeTextEditor) {
            currentPath = vscode.window.activeTextEditor.document.fileName;
        }

        if (currentPath) {
            if (fs.lstatSync(currentPath).isDirectory()) {
                relative = path.relative(workspacePath, currentPath);
            } else {
                relative = path.relative(
                    workspacePath,
                    path.dirname(currentPath)
                );
            }

            if (!touch) {
                ncp.copy(`${relative.replace(':', '')}/`);
            } else {
                ncp.copy(`touch ${relative.replace(':', '')}/`);
            }
        }
    };

    let absolutePath = vscode.commands.registerCommand(
        'copy-dir-path.copyAbsolutePath',
        function (e) {
            copyAbsolutePath(e);
        }
    );

    let relativePath = vscode.commands.registerCommand(
        'copy-dir-path.copyRelativePath',
        function (e) {
            copyRelativePath(e);
        }
    );

    let absolutePathTouch = vscode.commands.registerCommand(
        'copy-dir-path.copyAbsolutePathTouch',
        function (e) {
            copyAbsolutePath(e, true);
        }
    );

    let relativePathTouch = vscode.commands.registerCommand(
        'copy-dir-path.copyRelativePathTouch',
        function (e) {
            copyRelativePath(e, true);
        }
    );

    context.subscriptions.push(absolutePath);
    context.subscriptions.push(relativePath);
    context.subscriptions.push(absolutePathTouch);
    context.subscriptions.push(relativePathTouch);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
