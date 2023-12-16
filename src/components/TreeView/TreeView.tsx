import { useTreeViewDirs } from "../../store/selectors";

import { TreeViewItem } from "./TreeViewItem";

import "./TreeView.scss";

export const TreeView = () => {
  const dirs = useTreeViewDirs();

  return (
    <div className="tree-view">
      <ul>
        {dirs.map((dir) => (
          <TreeViewItem key={dir} dir={dir} />
        ))}
      </ul>
    </div>
  );
};
