import { LspLabelEditActionHandler, SprottyLspEditVscodeExtension, WorkspaceEditActionHandler } from "sprotty-vscode/lib/lsp/editing";
import { LanguageClient, ServerOptions, LanguageClientOptions } from "vscode-languageclient";
// import { SprottyDiagramIdentifier } from "../../webview/node_modules/sprotty-vscode-webview/lib";
import { SprottyWebview } from "sprotty-vscode/lib/sprotty-webview";
import { SprottyDiagramIdentifier, SprottyLspWebview } from "sprotty-vscode/lib/lsp";

import * as path from 'path';
import * as vscode from 'vscode';

export class ERDiagramLspVscodeExtension extends SprottyLspEditVscodeExtension {

    constructor(context: vscode.ExtensionContext) {
        super('erdiagram', context);
    }

    protected getDiagramType(commandArgs: any[]): string | undefined {
        if (commandArgs.length === 0 || 
            // Check the file extension if the view is created for a source file
            commandArgs[0] instanceof vscode.Uri && commandArgs[0].path.endsWith('.erd')) {
                // Return a Sprotty diagram type (this info is passed to the Sprotty model source)
                return 'erdiagram-diagram';
        }
        
       // return 'erdiagram-diagram'
    }
    
    createWebView(identifier: SprottyDiagramIdentifier): SprottyWebview {
        const webview = new SprottyLspWebview({
            extension: this,
            identifier,
            // Root paths from which the webview can load local resources using URIs
            localResourceRoots: [this.getExtensionFileUri('pack')],
            // Path to the bundled webview implementation
            scriptUri: this.getExtensionFileUri('pack', 'webview.js'),
            singleton: false // Change this to `true` to enable a singleton view
        });
        webview.addActionHandler(WorkspaceEditActionHandler);
        webview.addActionHandler(LspLabelEditActionHandler);
        
        return webview;
    }
    
    protected activateLanguageClient(context: vscode.ExtensionContext): LanguageClient {
        const executable = process.platform === 'win32' ? 'erdiagram-language-server.bat' : 'erdiagram-language-server';
        const languageServerPath =  path.join('server', 'erdiagram-language-server', 'bin', executable);
        const serverLauncher = context.asAbsolutePath(languageServerPath);
        
        const serverOptions: ServerOptions = {
            run: {
                command: serverLauncher,
                args: ['-trace']
            },
            debug: {
                command: serverLauncher,
                args: ['-trace']
            }
        };
        
        const clientOptions: LanguageClientOptions = {
            documentSelector: [{ scheme: 'file', language: 'erdiagram' }]
        };
        
        const languageClient = new LanguageClient('erdiagramLanguageClient', 'ERDiagram Language Server', serverOptions, clientOptions);
        languageClient.start();
        
        return languageClient;
    }
    
}