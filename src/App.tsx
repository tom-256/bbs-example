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

type PostProps = {
  id: string;
  title: string;
  author: string;
  description: string;
  image: string;
  tags: string[];
};

const postsMock: PostProps[] = [
  {
    id: "1",
    title: "title1",
    description: "test description",
    author: "bob",
    image:
      "https://cdn.shibe.online/shibes/5464189a1ded1107e6579b8f39e82937acd37554.jpg",
    tags: ["tag1", "tag2"],
  },
  {
    id: "2",
    title: "title2",
    description: "test description",
    author: "john",
    image:
      "https://cdn.shibe.online/shibes/f516c9b186ea3997cf42b0257a9e2dc031af90cd.jpg",
    tags: ["tag3", "tag4"],
  },
  {
    id: "3",
    title: "title3",
    description: "test description",
    author: "bob",
    image:
      "https://cdn.shibe.online/shibes/9e77314c58f019b3c845dbb4c92f329114595def.jpg",
    tags: ["tag5", "tag6"],
  },
  {
    id: "4",
    title: "title4",
    description: "test description",
    author: "john",
    image:
      "https://cdn.shibe.online/shibes/bb3dc550e82c9803caec7d3378b775baa18f5e9a.jpg",
    tags: ["tag7", "tag8"],
  },
  {
    id: "5",
    title: "title5",
    description: "test description",
    author: "john",
    image:
      "https://cdn.shibe.online/shibes/c608636ae06a2a6123f76e4497fe7503593cd52a.jpg",
    tags: ["tag9", "tag10"],
  },
];

const reorderPosts = (
  posts: PostProps[],
  source: DraggableLocation,
  dest: DraggableLocation
): PostProps[] => {
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
  posts: PostProps[];
};

const Board: VFC<BoardProps> = ({ posts }) => {
  return (
    <Droppable droppableId={"BSS"} direction="horizontal">
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={getBoardStyle(snapshot.isDraggingOver)}
        >
          {posts.map((post, index) => (
            <Draggable draggableId={post.id} index={index} key={post.id}>
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
                  <div>{post.title}</div>
                  <div>{post.description}</div>
                  <img
                    src={post.image}
                    alt="test"
                    height="50px"
                    width="50px"
                  ></img>
                  <div>{post.author}</div>
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
  const [posts, setPosts] = useState<PostProps[]>(postsMock);
  const [searchQuery, setQuery] = useState<string>("");

  function onDragEnd(result: DropResult) {
    const { source, destination: dest } = result;

    if (!dest) return;
    const { droppableId: sourceId } = source;
    const { droppableId: destinationId } = dest;

    if (sourceId !== destinationId) return;
    const ordered = reorderPosts(posts, source, dest);
    setPosts(ordered);
  }

  const filterPosts = (query: string): PostProps[] => {
    if (query === "") return postsMock;
    return postsMock.filter((post) => {
      return post.tags.some((tag) => tag.includes(query));
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQuery(query);
    console.log(query);
    const newPosts = filterPosts(query);
    console.log("newposts", newPosts);
    setPosts(newPosts);
  };

  return (
    <div className="App">
      <div>
        <input
          value={searchQuery}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleInputChange(event);
          }}
          placeholder={`search`}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          <Board posts={searchQuery ? filterPosts(searchQuery) : posts}></Board>
        </DragDropContext>
      </div>
    </div>
  );
};

export default App;
