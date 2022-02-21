// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const git  = require('gift');

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('git-push-no-verify.gitPushNoVerify', () => {
		const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
		const gitApi = gitExtension.getAPI(1);

		if (!gitApi) {
			return;
		}

		const folders = vscode.workspace.workspaceFolders;
		if(!folders) {
			return;
		}
		const folderPath = folders[0].uri.path;
		let selectedRepository = gitApi.repositories.find((repository: any) => {
			return repository.rootUri.path === folderPath;
		});

		if(!selectedRepository) {
			return;
		}

		const repo = git(vscode.workspace.rootPath);
		let remoteName = selectedRepository.state.HEAD?.upstream?.remote;

		vscode.commands.executeCommand('git.pull').then(() => {
			repo.remote_push(remoteName, ['-u --no-verify'], (e: string | any) => {
				if(!e) {
					vscode.commands.executeCommand('git.refresh');
					vscode.window.showInformationMessage('Changes pushed to origin without verification!');
				} else {
					vscode.window.showErrorMessage(e);
				}
			});
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
