import { Command, CommandExecutionContext, CommandReturn, IActionDispatcher, TYPES } from "sprotty";
import { Action } from "sprotty-protocol"
import { inject, injectable } from 'inversify';
import { CodeActionProvider } from "sprotty-vscode-webview/lib/lsp/editing";
import { CodeAction } from 'vscode-languageserver-protocol';
import { getRange } from 'sprotty-vscode-webview/lib/lsp/editing/traceable';
import { WorkspaceEditAction } from 'sprotty-vscode-protocol/lib/lsp/editing';

// TODO: Fix duplicate code (probably stop using codeActions)

export interface AddEntityAction extends Action { 
    kind: typeof AddEntityAction.KIND
}

export namespace AddEntityAction {
    export const KIND = 'addEntity';

    export function is(action: Action): action is AddEntityAction {
        return action.kind === KIND;
    }
}

export interface AddRelationshipAction extends Action { 
    kind: typeof AddRelationshipAction.KIND
}

export namespace AddRelationshipAction {
    export const KIND = 'addRelationship';

    export function is(action: Action): action is AddRelationshipAction {
        return action.kind === KIND;
    }
    
}

@injectable()
export class AddEntityCommand extends Command {
    static readonly KIND = AddEntityAction.KIND;

    @inject(TYPES.IActionDispatcher) actionDispatcher: IActionDispatcher;
    @inject(CodeActionProvider) codeActionProvider: CodeActionProvider;

    codeAction: CodeAction;

    constructor(@inject(TYPES.Action) readonly action: AddEntityAction) {
        super();
    }
    
    async getCodeAction(context: CommandExecutionContext) {
        const range = getRange(context.root);
        if (range) {
            const codeActions = await this.codeActionProvider.getCodeActions(range, 'sprotty.create.entity');
            if (codeActions) {
                if (CodeAction.is(codeActions[0])) {
                    this.codeAction = codeActions[0];
                }
            }
        }
    }
    
    execute(context: CommandExecutionContext): CommandReturn {
        this.getCodeAction(context).then(() => {
            this.actionDispatcher.dispatch(<WorkspaceEditAction> {
                kind: WorkspaceEditAction.KIND,
                workspaceEdit: this.codeAction.edit
            } as Action);
        });
        return context.root;
    }
    
    undo(context: CommandExecutionContext): CommandReturn {
        return context.root;
    }

    redo(context: CommandExecutionContext): CommandReturn {
        return context.root;
    }
}

@injectable()
export class AddRelationshipCommand extends Command {
    static readonly KIND = AddRelationshipAction.KIND;

    @inject(TYPES.IActionDispatcher) actionDispatcher: IActionDispatcher;
    @inject(CodeActionProvider) codeActionProvider: CodeActionProvider;

    codeAction: CodeAction;

    constructor(@inject(TYPES.Action) readonly action: AddRelationshipAction) {
        super();
    }
    
    async getCodeAction(context: CommandExecutionContext) {
        const range = getRange(context.root);
        if (range) {
            const codeActions = await this.codeActionProvider.getCodeActions(range, 'sprotty.create.relationship');
            if (codeActions) {
                if (CodeAction.is(codeActions[0])) {
                    this.codeAction = codeActions[0];
                }
            }
        }
    }
    
    execute(context: CommandExecutionContext): CommandReturn {
        this.getCodeAction(context).then(() => {
            this.actionDispatcher.dispatch(<WorkspaceEditAction> {
                kind: WorkspaceEditAction.KIND,
                workspaceEdit: this.codeAction.edit
            } as Action);
        });
        return context.root;
    }
    
    undo(context: CommandExecutionContext): CommandReturn {
        return context.root;
    }

    redo(context: CommandExecutionContext): CommandReturn {
        return context.root;
    }
}