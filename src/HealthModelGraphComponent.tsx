import { DataFrameView } from '@grafana/data';
import { GrafanaTheme } from '@grafana/data/types/theme';
import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

interface GraphOptions {
  data: DataFrameView;
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

interface GraphState {
  graphElements: cytoscape.ElementDefinition[];
}

export class HealthModelGraphComponent extends React.Component<GraphOptions, GraphState> {
  graphControl: any;

  constructor(props: GraphOptions) {
    super(props);

    this.graphControl = null;
    this.state = { graphElements: HealthModelGraphComponent.loadGraphFromData(props.data) };
  }

  static getDerivedStateFromProps(props: GraphOptions, state: GraphState) {
    return { graphElements: HealthModelGraphComponent.loadGraphFromData(props.data) };
  }

  static loadGraphFromData(data: DataFrameView): cytoscape.ElementDefinition[] {
    const result: cytoscape.ElementDefinition[] = [];
    data.map((item: HealthModelNode) => {
      const node = {
        data: {
          id: item.ComponentName.toLowerCase(),
          label: item.ComponentName,
          score: item.HealthScore,
        },
      };
      result.push(node);

      if (item.Dependencies !== '') {
        item.Dependencies.split(',').forEach(dep => {
          const edge = {
            data: {
              source: item.ComponentName.toLowerCase(),
              target: dep.toLowerCase(),
            },
          };
          result.push(edge);
        });
      }
    });

    return result;
  }

  render() {
    const getFillColor = (score: number) => {
      if (score == null) {
        return this.props.theme.palette.gray1;
      }
      if (score <= this.props.redThreshold) {
        return this.props.theme.palette.redBase;
      }
      if (score <= this.props.yellowThreshold) {
        return this.props.theme.palette.yellow;
      }
      return this.props.theme.palette.greenBase;
    };

    let layout = {
      name: 'breadthfirst',

      fit: true, // whether to fit the viewport to the graph
      directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
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
        elements={CytoscapeComponent.normalizeElements(this.state.graphElements)}
        style={{ width: this.props.width, height: this.props.height }}
        cy={cy => {
          if (this.graphControl !== cy) {
            this.graphControl = cy;
          }
        }}
        layout={layout}
        stylesheet={[
          {
            selector: 'node',
            style: {
              width: '50px',
              height: '50px',
              'background-color': function(e) {
                return getFillColor(e.data('score'));
              },
              'border-color': '#ccc',
              'border-width': 2,
              label: 'data(label)',
            },
          },
          {
            selector: 'edge',
            style: {
              width: 3,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle',
              'arrow-scale': 1.0,
              color: '#777',
            },
          },
        ]}
      />
    );
  }
}
