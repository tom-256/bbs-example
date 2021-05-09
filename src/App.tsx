import { useState, VFC } from "react";
import "./App.css";
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
} from "react-beautiful-dnd";

type Post = {
  id: string;
  content: string;
};

const postsMock: Post[] = [
  { id: "1", content: "task1" },
  { id: "2", content: "task2" },
  { id: "3", content: "task3" },
  { id: "4", content: "task4" },
  { id: "5", content: "task5" },
  { id: "6", content: "task6" },
  { id: "7", content: "task7" },
  { id: "8", content: "task8" },
  { id: "9", content: "task9" },
];

const reorderPosts = (
  posts: Post[],
  source: DraggableLocation,
  dest: DraggableLocation
): Post[] => {
  const result = Array.from(posts);
  const [removed] = result.splice(source.index, 1);
  result.splice(dest.index, 0, removed);
  return result;
};

const grid: number = 8;

const getTaskItemStyle = (draggableStyle: any, isDragging: boolean): {} => ({
  userSelect: "none",
  padding: 2 * grid,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
  width: "100px",
});

const getBoardStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  display: "flex",
  alignItems: "start",
  width: "1000px",
  minWidth: "1000px",
  minHeight: "100px",
});

type BoardProps = {
  posts: Post[];
};

const Board: VFC<BoardProps> = ({ posts: tasks }) => {
  return (
    <Droppable droppableId={"BSS"} direction="horizontal">
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={getBoardStyle(snapshot.isDraggingOver)}
        >
          {tasks.map((task, index) => (
            <Draggable draggableId={task.id} index={index} key={task.id}>
              {(
                provided: DraggableProvided,
                snapshot: DraggableStateSnapshot
              ) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getTaskItemStyle(
                    provided.draggableProps.style,
                    snapshot.isDragging
                  )}
                >
                  <div>{task.content}</div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

const App = () => {
  const [posts, setPosts] = useState<Post[]>(postsMock);

  function onDragEnd(result: DropResult) {
    const { source, destination: dest } = result;

    if (!dest) return;
    const { droppableId: sourceId } = source;
    const { droppableId: destinationId } = dest;

    if (sourceId !== destinationId) return;
    const ordered = reorderPosts(posts, source, dest);
    setPosts(ordered);
  }

  return (
    <div className="App">
      <div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Board posts={posts}></Board>
        </DragDropContext>
      </div>
    </div>
  );
};

export default App;
