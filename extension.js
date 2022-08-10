// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const client = require('./grpc/client')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('nothing..');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	
	context.subscriptions.push(vscode.commands.registerCommand('klee-helper.kleeGo', () => {
		let uri = vscode.window.activeTextEditor.document.uri;
		// console.log(uri.fsPath);
		if(uri) {
			var filePath = {
				path: uri.fsPath
			};
			vscode.window.showInformationMessage("KLEE helper: test cases generating, please wait..");
			client.runKleeGo(filePath);
		}
		else {
			vscode.window.showErrorMessage("KLEE helper: please open a C/C++ file to be detected");
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('klee-helper.kleeShow', () => {
		/**
			打开输入框以询问用户输入。
			如果输入框被取消（例如按ESC），则返回undefined
			否则返回用户键入的字符串.
			如果用户没有输入任何内容，则返回值为空，但是单击"确定"将输入框解除。
		* */
		const result = vscode.window.showInputBox({
			prompt: "KLEE helper: please input a serial number of the test case",
			value: "000001",
			// placeHolder: "range: ",
			// valueSelection: [1, len]
		});
		result.then(num => {
			// vscode.window.showInformationMessage(num);

			// 按下ESC键(这行判断不对？咋退出了)
			// if (typeof _versionName === "undefined") return;
			// 按下enter键

			let path = vscode.window.activeTextEditor.document.uri.path;
			// 使用lastIndexOf（）查找最后一个斜杠的位置，并使用substring（）获取斜杠之前的部分
			let path2 = path.substring(0, path.lastIndexOf("/"));
			if(num) {
				var testCaseName = {
					name: `${path2}/klee-last/test${num}.ktest`
				};
				vscode.window.showInformationMessage(testCaseName);
				client.runKleeShow(testCaseName);
			}
			else {
				vscode.window.showErrorMessage("KLEE helper: please input serial number like 0000001");
			}
		});
	}));
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
