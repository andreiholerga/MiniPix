import { useMemo } from "react";

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

      current = current[part];
    });
  });

  return root;
}

// 🔥 IMPORTANT: folders first, then files
function sortNodes(node) {
  const entries = Object.entries(node);

  const folders = [];
  const files = [];

  for (const [key, value] of entries) {
    if (value.__file) {
      files.push([key, value]);
    } else {
      folders.push([key, value]);
    }
  }

  folders.sort((a, b) => a[0].localeCompare(b[0]));
  files.sort((a, b) => a[0].localeCompare(b[0]));

  return [...folders, ...files];
}

function formatPath(path = "") {
  const parts = path.split("/");

  if (parts.length <= 2) return path;

  return parts[0] + "/.../" + parts[parts.length - 1];
}

function TreeNode({ node, name, processed }) {
  const isFile = node.__file;

  if (isFile) {
    const file = node.__file;
    const result = processed[node.__index];
    const path = file.webkitRelativePath || file.name;

    return (
      <div style={styles.fileRow}>
        <span style={styles.left}>
          📄 {formatPath(path)}
        </span>

        <span style={styles.right}>
          {(file.size / 1024).toFixed(1)} KB

          {result && (
            <>
              {" → "}
              <span style={styles.green}>
                {(result.newSize / 1024).toFixed(1)} KB
              </span>
            </>
          )}
        </span>
      </div>
    );
  }

  return (
    <div style={styles.folder}>
      <div style={styles.folderName}>📁 {name}</div>

      <div style={styles.children}>
        {sortNodes(node).map(([childName, childNode]) => (
          <TreeNode
            key={childName}
            name={childName}
            node={childNode}
            processed={processed}
          />
        ))}
      </div>
    </div>
  );
}

export default function FileList({ files, processed }) {
  const tree = useMemo(() => buildTree(files), [files]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        File Tree ({files.length})
      </h3>

      <div>
        {sortNodes(tree).map(([name, node]) => (
          <TreeNode
            key={name}
            name={name}
            node={node}
            processed={processed}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: "20px",
    fontFamily: "sans-serif",
    fontSize: "13px",
    textAlign: "left",
  },

  title: {
    marginBottom: "10px",
  },

  folder: {
    marginTop: "6px",
  },

  folderName: {
    fontWeight: "bold",
    marginBottom: "4px",
  },

  children: {
    marginLeft: "18px",
    borderLeft: "1px solid #333",
    paddingLeft: "10px",
  },

  fileRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "2px 0",
    fontSize: "12px",
    width: "100%",
  },

  left: {
    maxWidth: "65%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  right: {
    opacity: 0.7,
    fontSize: "11px",
    whiteSpace: "nowrap",
  },

  green: {
    color: "#4ade80",
  },
};