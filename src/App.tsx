import { useReducer, VFC } from "react";
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

type Task = {
  id: string;
  content: string;
};

type Boards = {
  [status in TaskStatus]: Task[];
};

type TaskStatus = "TODO" | "DOING" | "DONE";

const boardMock: Boards = {
  TODO: [
    { id: "1", content: "task1" },
    { id: "2", content: "task2" },
    { id: "3", content: "task3" },
    { id: "4", content: "task4" },
    { id: "5", content: "task5" },
    { id: "6", content: "task6" },
    { id: "7", content: "task7" },
    { id: "8", content: "task8" },
    { id: "9", content: "task9" },
  ],
  DOING: [],
  DONE: [],
};

const reorderTasks = (
  boards: Boards,
  source: DraggableLocation,
  dest: DraggableLocation
): Boards => {
  const id = droppableIdToTaskStatus(source.droppableId);
  const tasks = boards[id];
  const result = Array.from(tasks);
  const [removed] = result.splice(source.index, 1);
  result.splice(dest.index, 0, removed);
  const newBoads = { ...boards };
  newBoads[id] = result;
  return newBoads;
};

const moveBoards = (
  boards: Boards,
  source: DraggableLocation,
  dest: DraggableLocation
): Boards => {
  const sourceId = droppableIdToTaskStatus(source.droppableId);
  const destId = droppableIdToTaskStatus(dest.droppableId);
  const sourceTasks = boards[sourceId];
  const destTasks = boards[destId];
  const sourceClone = [...sourceTasks];
  const destClone = [...destTasks];
  const [removed] = sourceClone.splice(source.index, 1);
  destClone.splice(dest.index, 0, removed);
  const newBoads = { ...boards };
  newBoads[sourceId] = sourceClone;
  newBoads[destId] = destClone;
  return newBoads;
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

const droppableIdToTaskStatus = (id: string): TaskStatus => {
  return id as TaskStatus;
};

type BoardProps = {
  name: TaskStatus;
  tasks: Task[];
};

const Board: VFC<BoardProps> = ({ name, tasks }) => {
  return (
    <Droppable droppableId={name} direction="horizontal">
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

type BoardAction = {
  type: "move" | "reorder";
  source: DraggableLocation;
  dest: DraggableLocation;
};

const boardReducer = (boards: Boards, action: BoardAction): Boards => {
  const { type, source, dest } = action;
  switch (type) {
    case "reorder":
      return reorderTasks(boards, source, dest);
    case "move":
      return moveBoards(boards, source, dest);
    default:
      return boards;
  }
};

const App = () => {
  const [boards, boardsDispatch] = useReducer(boardReducer, boardMock);

  function onDragEnd(result: DropResult) {
    const { source, destination: dest } = result;

    if (!dest) return;
    const { droppableId: sourceId } = source;
    const { droppableId: destinationId } = dest;

    if (sourceId === destinationId) {
      boardsDispatch({ type: "reorder", source, dest });
    } else {
      boardsDispatch({ type: "move", source, dest });
    }
  }

  return (
    <div className="App">
      <div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Board name={"TODO"} tasks={boards.TODO}></Board>
        </DragDropContext>
      </div>
    </div>
  );
};

export default App;
