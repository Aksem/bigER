import { injectable } from "inversify";
import { CreateElementAction, CreatingOnDrag, EdgeLayoutable, EdgePlacement, ManhattanEdgeRouter, PolylineEdgeRouter, RectangularNode, RectangularPort,  SEdge,  SLabel, SRoutableElement } from 'sprotty';
import { Action, SEdge as SEdgeSchema } from 'sprotty-protocol'

export class RelationEdge extends SEdge {
    routerKind = PolylineEdgeRouter.KIND;
    targetAnchorCorrection = Math.sqrt(5);
}

export class EntityNode extends RectangularNode {
    expanded: boolean
    
    canConnect(routable: SRoutableElement, role: string) {
        return true;
    }
}

/*
export class RelationshipNode extends DiamondNode {
    canConnect(routable: SRoutableElement, role: string) {
        return true;
    }
}
*/

export class CreateRelationPort extends RectangularPort implements CreatingOnDrag {
    createAction(id: string): Action {
        const edge: SEdgeSchema = {
            id,
            type: 'edge',
            sourceId: this.parent.id,
            targetId: this.id
        };
        return CreateElementAction.create(edge, { containerId: this.root.id });
    }
}

@injectable()
export class MultiplicityLabel extends SLabel implements EdgeLayoutable {
    edgePlacement = <EdgePlacement> {
        position: 0.5,
        side: 'top',
        rotate: false,
        offset: 5
    };
}

@injectable()
export class InheritanceEdge extends SEdge {
    public readonly targetAnchorCorrection = Math.sqrt(5);
    public readonly routerKind = ManhattanEdgeRouter.KIND;
}
