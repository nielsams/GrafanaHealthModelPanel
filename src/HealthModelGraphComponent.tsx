import { GrafanaTheme } from '@grafana/data/types/theme';
import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

interface GraphOptions {
  data: any;
  yellowThreshold: number;
  redThreshold: number;
  width: number;
  height: number;
  theme: GrafanaTheme;
}

interface HealthModelNode {
  HealthScore: number;
  ComponentName: string;
  Dependencies: string;
}

export class HealthModelGraphComponent extends React.Component<GraphOptions> {
  graphElements: cytoscape.ElementDefinition[];
  graphControl: any;

  constructor(props: GraphOptions) {
    super(props);

    this.graphElements = [];
    this.graphControl = null;

    props.data.map((item: HealthModelNode) => {
      console.log('item: ' + JSON.stringify(item));
      const node = {
        data: { id: item.ComponentName.toLowerCase(), label: item.ComponentName },
      };
      this.graphElements.push(node);

      if (item.Dependencies !== '') {
        item.Dependencies.split(',').forEach(dep => {
          console.log('item: ' + item.ComponentName + ', dep: ' + dep);
          const edge = {
            data: {
              source: item.ComponentName.toLowerCase(),
              target: dep.toLowerCase(),
            },
          };
          this.graphElements.push(edge);
        });
      }
    });
  }

  render() {
    // const getFillColor = (score: number) => {
    //   if (score <= this.props.redThreshold) {
    //     return theme.palette.redBase;
    //   }
    //   if (score <= this.props.yellowThreshold) {
    //     return theme.palette.yellow;
    //   }

    //   return theme.palette.greenBase;
    // };
    // const elements = [
    //   { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
    //   { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
    //   {
    //     data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' },
    //   },
    // ];

    let layout = {
      name: 'breadthfirst',

      fit: true, // whether to fit the viewport to the graph
      directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
      padding: 30, // padding on fit
      circle: false, // put depths in concentric circles if true, put depths top down if false
      grid: false, // whether to create an even grid into which the DAG is placed (circle:false only)
      spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
      roots: undefined, // the roots of the trees
      maximal: false, // whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled,
      ready: undefined, // callback on layoutready
      stop: undefined, // callback on layoutstop
    };

    return (
      <CytoscapeComponent
        elements={CytoscapeComponent.normalizeElements(this.graphElements)}
        style={{ width: this.props.width, height: this.props.height }}
        cy={cy => {
          if (this.graphControl !== cy) {
            this.graphControl = cy;
          }
        }}
        layout={layout}
      />
    );
  }
}
