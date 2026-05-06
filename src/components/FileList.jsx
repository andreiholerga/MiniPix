import { useMemo, useState } from "react";

// -----------------------------
// BUILD TREE
// -----------------------------
function buildTree(files) {
  const root = {};

  files.forEach((file, index) => {
    const path = file.webkitRelativePath || file.name;
    const parts = path.split("/");

    let current = root;

    parts.forEach((part, i) => {
      const isFile = i === parts.length - 1;

      if (!current[part]) {
        current[part] = isFile
          ? { __file: file, __index: index }
          : {};
      }

      if (!isFile && current[part].__file) {
        current[part] = {};
      }

      current = current[part];
    });
  });

  return root;
}

// -----------------------------
// SORT
// -----------------------------
function sortNodes(node) {
  const entries = Object.entries(node);

  const folders = [];
  const files = [];

  for (const [key, value] of entries) {
    if (value.__file) files.push([key, value]);
    else folders.push([key, value]);
  }

  folders.sort((a, b) => a[0].localeCompare(b[0]));
  files.sort((a, b) => a[0].localeCompare(b[0]));

  return [...folders, ...files];
}

// -----------------------------
// TREE NODE
// -----------------------------
function TreeNode({ node, name, processed, depth = 0 }) {
  const isFile = node.__file;

  const [open, setOpen] = useState(depth === 0);

  // FILE
  if (isFile) {
    const file = node.__file;
    const result = processed[node.__index];

    return (
      <div className="file-row">
        <span className="file-left">📄 {file.name}</span>

        <span className="file-right">
          {(file.size / 1024).toFixed(1)} KB

          {result && (
            <>
              {" → "}
              <span className="file-green">
                {(result.newSize / 1024).toFixed(1)} KB
              </span>
            </>
          )}
        </span>
      </div>
    );
  }

  // FOLDER
  return (
    <div className="folder">
      <div
        className="folder-name"
        onClick={() => setOpen(!open)}
      >
        {open ? "📂" : "📁"} {name}
      </div>

      {open && (
        <div className="folder-children">
          {sortNodes(node).map(([childName, childNode]) => (
            <TreeNode
              key={childName}
              name={childName}
              node={childNode}
              processed={processed}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// -----------------------------
// MAIN
// -----------------------------
export default function FileList({ files, processed }) {
  const tree = useMemo(() => buildTree(files), [files]);

  return (
    <div className="filelist">
      <h3 className="filelist-title">
        File Tree ({files.length})
      </h3>

      {sortNodes(tree).map(([name, node]) => (
        <TreeNode
          key={name}
          name={name}
          node={node}
          processed={processed}
          depth={0}
        />
      ))}
    </div>
  );
}