const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const ncp = require('copy-paste');

function activate(context) {
    let absolutePath = vscode.commands.registerCommand(
        'copy-dir-path.copyAbsolutePath',
        function (e) {
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

                ncp.copy(`${absolute.replace(':', '')}/`);
            }
        }
    );

    let relativePath = vscode.commands.registerCommand(
        'copy-dir-path.copyRelativePath',
        function (e) {
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

                ncp.copy(`${relative.replace(':', '')}/`);
            }
        }
    );

    context.subscriptions.push(absolutePath);
    context.subscriptions.push(relativePath);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
