// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import simpleGit, { SimpleGitOptions, SimpleGit  } from 'simple-git';

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

		let remoteName = selectedRepository.state.HEAD?.upstream?.remote;
		let branchName = selectedRepository.state.HEAD?.name;

		const options: Partial<SimpleGitOptions> = {
			binary: 'git',
			maxConcurrentProcesses: 6,
			spawnOptions: { gid: 1000 },
		 };

		const git: SimpleGit = simpleGit(folderPath, options);

		const pushChanges = (remote = 'origin', branch: string) => {
			git.env({...process.env}).push(['-u', remote, branch]).then(()=> {
				vscode.commands.executeCommand('git.refresh');
				vscode.window.showInformationMessage('Changes pushed to origin without verification!');
			 }).catch(e=>{
				vscode.window.showErrorMessage(e);
			 });
		};

		if(remoteName){
			vscode.commands.executeCommand('git.pull').then(() => {		
				pushChanges(remoteName, branchName);
			});
		} else {
			pushChanges(remoteName, branchName);
		}
		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
