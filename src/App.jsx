import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';

import ConcertoNode from './ConcertoNode'; 
import './index.css';

const nodeTypes = {
  concerto: ConcertoNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'concerto',
    position: { x: 250, y: 100 },
    data: { 
      label: 'Person',
      fields: [
        { type: 'String', name: 'firstName' },
        { type: 'String', name: 'lastName' },
        { type: 'Integer', name: 'age' }
      ]
    },
  },
];

let id = 2;
const getId = () => `${id++}`;

const App = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode = {
        id: getId(),
        type: 'concerto', 
        position,
        data: { 
            label: `New ${type}`, 
            fields: [] 
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNodeId(newNode.id);
    },
    [reactFlowInstance],
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // --- NEW LOGIC: EDITING DATA ---

  // 1. Rename Node
  const onNameChange = (evt) => {
    const newName = evt.target.value;
    updateNodeData(selectedNodeId, { label: newName });
  };

  // 2. Add Field
  const onAddField = () => {
    if (!selectedNode) return;
    const newFields = [...(selectedNode.data.fields || []), { type: 'String', name: 'newProp' }];
    updateNodeData(selectedNodeId, { fields: newFields });
  };

  // 3. Update Field (Name or Type)
  const onUpdateField = (index, key, value) => {
    if (!selectedNode) return;
    const newFields = [...selectedNode.data.fields];
    newFields[index] = { ...newFields[index], [key]: value };
    updateNodeData(selectedNodeId, { fields: newFields });
  };

  // 4. Remove Field
  const onRemoveField = (index) => {
    if (!selectedNode) return;
    const newFields = selectedNode.data.fields.filter((_, i) => i !== index);
    updateNodeData(selectedNodeId, { fields: newFields });
  };

  // Helper to update node data immutably
  const updateNodeData = (nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...newData },
          };
        }
        return node;
      })
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <h3>Concerto Editor</h3>
        <p style={{ fontSize: '12px', color: '#666' }}>Drag these to the canvas:</p>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Concept')} draggable>Concept</div>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Asset')} draggable>Asset</div>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Enum')} draggable>Enum</div>
      </aside>

      {/* MAIN CANVAS */}
      <div style={{ flexGrow: 1, height: '100%' }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick} 
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>

      {/* RIGHT SIDEBAR (PROPERTIES) */}
      <aside className="right-sidebar">
        <div className="panel-title">Properties</div>
        {selectedNode ? (
          <div>
            <div className="panel-section">
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Concept Name</label>
              <input 
                type="text" 
                className="panel-input"
                value={selectedNode.data.label} 
                onChange={onNameChange} 
              />
            </div>

            <div className="panel-section">
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Fields</label>
              {selectedNode.data.fields && selectedNode.data.fields.map((field, index) => (
                <div key={index} className="field-row">
                  {/* Field Type Select */}
                  <select 
                    className="field-type-select"
                    value={field.type}
                    onChange={(e) => onUpdateField(index, 'type', e.target.value)}
                  >
                    <option value="String">String</option>
                    <option value="Integer">Integer</option>
                    <option value="Boolean">Boolean</option>
                    <option value="DateTime">Date</option>
                    <option value="Double">Double</option>
                  </select>

                  {/* Field Name Input */}
                  <input 
                    type="text" 
                    className="field-name-input"
                    value={field.name}
                    onChange={(e) => onUpdateField(index, 'name', e.target.value)}
                  />

                  {/* Delete Button */}
                  <button className="btn-delete" onClick={() => onRemoveField(index)}>×</button>
                </div>
              ))}

              <button className="btn-add" onClick={onAddField}>+ Add Field</button>
            </div>

            <div className="info-text">
              ID: {selectedNode.id} • Type: {selectedNode.type}
            </div>
          </div>
        ) : (
          <div className="info-text">Click a node to edit properties.</div>
        )}
      </aside>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);