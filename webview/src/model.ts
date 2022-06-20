import { injectable } from "inversify";
import { DiamondNode, EdgeLayoutable, EdgePlacement, PreRenderedElement, RectangularNode, SGraph,  SLabel, SRoutableElement } from 'sprotty';
import { LibavoidRouter, LibavoidEdge, RouteType } from 'sprotty-routing-libavoid';


export class ERModel extends SGraph {
    name: string
    generateType: string
    notation: string
}

export class EntityNode extends RectangularNode {
    expanded: boolean
    weak: boolean
    
    canConnect(routable: SRoutableElement, role: string) {
        return true;
    }
}

export class RelationshipNode extends DiamondNode {
    weak: boolean
}

export class NotationEdge extends LibavoidEdge {
    public readonly routerKind = LibavoidRouter.KIND;
    isSource: boolean
    showRelationship: boolean
    notation: String
    relationshipCardinality: String
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
export class InheritanceEdge extends LibavoidEdge {
    public readonly targetAnchorCorrection = Math.sqrt(5);
    public readonly routerKind = LibavoidRouter.KIND;
    public readonly routeType = RouteType.Orthogonal;
}

export class PopupButton extends PreRenderedElement {
    target: string;
	kind: string;
}
