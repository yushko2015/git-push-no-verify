// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const git  = require('gift')

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('git-push-no-verify.gitPushNoVerify', () => {
		const repo = git(vscode.workspace.rootPath);
		vscode.commands.executeCommand('git.pull').then(() => {
			repo.remote_push('origin', (e) => {
				if(!e) {
					vscode.commands.executeCommand('git.refresh');
					vscode.window.showInformationMessage('Changes pushed to origin without verification!');
				}
			})
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
