// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const { Configuration, OpenAIApi } = require("openai");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
const openaiApiKey = "your_api_key";
const modelId = "text-davinci-003";
const configuration = new Configuration({
  apiKey: openaiApiKey,
});
const openai = new OpenAIApi(configuration);
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "Code Helper" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "codehelper.codeHelper",
    async function () {
      // The code you place here will be executed every time your command is executed
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);

      const refactoredCode = await getRefactoredCode(text);

      if (refactoredCode) {
        editor.edit((editBuilder) => {
          editBuilder.replace(selection, refactoredCode);
        });
      }
      // Display a message box to the user
      // vscode.window.showInformationMessage("Hello World from Vyn!");
    }
  );

  context.subscriptions.push(disposable);
}

async function getRefactoredCode(code) {
  try {
    const prompt = `Refactor the following code:\n\n${code}\n\nNew code:`;
    const maxTokens = 1024;
    const temperature = 0.5;

    const response = await openai.createCompletion({
      model: modelId,
      prompt: prompt,
      max_tokens: maxTokens,
      temperature: temperature,
      stop: ["\n"],
    });

    const refactoredCode = response.data.choices[0].text.trim();
    return refactoredCode;
  } catch (err) {
    console.log(err);
  }
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
