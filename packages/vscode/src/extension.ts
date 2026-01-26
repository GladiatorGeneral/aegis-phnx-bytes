import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Client Stub
  const client = {
      orchestrate: async (params: any) => {
          return {
              code: '// Generated code',
              contextSources: ['source1', 'source2']
          };
      }
  };

  // Register RAG-powered CodeLens (Stub)
  const codeLensProvider = new class implements vscode.CodeLensProvider {
      provideCodeLenses(document: vscode.TextDocument): vscode.ProviderResult<vscode.CodeLens[]> {
          return [];
      }
  };
  vscode.languages.registerCodeLensProvider(
    { scheme: 'file', language: 'typescript' },
    codeLensProvider
  );

  // Security Audit Panel (Stub)
  const securityProvider = new class implements vscode.TreeDataProvider<any> {
      getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
          return new vscode.TreeItem('Security Item');
      }
      getChildren(element?: any): vscode.ProviderResult<any[]> {
          return [];
      }
  };
  vscode.window.registerTreeDataProvider('phnxauraSecurity', securityProvider);

  // Command: Generate with Context
  const disposable = vscode.commands.registerCommand('phnxaura.generate', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const prompt = await vscode.window.showInputBox({
      prompt: 'Describe what you want to generate'
    });

    if (prompt) {
      // Get current file context for RAG
      const currentFile = editor.document.fileName;
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
      
      const result = await client.orchestrate({
        prompt,
        namespace: workspaceFolder ? Buffer.from(workspaceFolder).toString('base64') : 'default',
        agents: ['architect', 'coder', 'reviewer'],
        contextWindow: 10, // Retrieve top 10 relevant chunks
        currentFile
      });

      // Insert generated code
      editor.edit(editBuilder => {
        editBuilder.insert(editor.selection.active, result.code);
      });

      // Show context sources
      vscode.window.showInformationMessage(
        `Generated using context from: ${result.contextSources.slice(0, 3).join(', ')}...`
      );
    }
  });

  context.subscriptions.push(disposable);
}
