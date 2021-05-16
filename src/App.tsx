import { useState, VFC } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

import "./App.css";

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
    title: "タイトル1",
    description: "説明",
    author: "bob",
    image:
      "https://cdn.shibe.online/shibes/5464189a1ded1107e6579b8f39e82937acd37554.jpg",
    tags: ["タグ1", "タグ2"],
  },
  {
    id: "2",
    title: "タイトル2",
    description: "説明",
    author: "john",
    image:
      "https://cdn.shibe.online/shibes/f516c9b186ea3997cf42b0257a9e2dc031af90cd.jpg",
    tags: ["タグ3", "タグ4"],
  },
  {
    id: "3",
    title: "タイトル3",
    description: "説明",
    author: "bob",
    image:
      "https://cdn.shibe.online/shibes/9e77314c58f019b3c845dbb4c92f329114595def.jpg",
    tags: ["タグ5", "タグ6"],
  },
  {
    id: "4",
    title: "タイトル4",
    description: "説明",
    author: "john",
    image:
      "https://cdn.shibe.online/shibes/bb3dc550e82c9803caec7d3378b775baa18f5e9a.jpg",
    tags: ["タグ7", "タグ8"],
  },
  {
    id: "5",
    title: "タイトル5",
    description: "説明",
    author: "john",
    image:
      "https://cdn.shibe.online/shibes/c608636ae06a2a6123f76e4497fe7503593cd52a.jpg",
    tags: ["タグ9", "タグ10"],
  },
];

type BoardProps = {
  posts: PostProps[];
};

const Board: VFC<BoardProps> = ({ posts }) => {
  return (
    <div>
      {posts.map((post, index) => (
        <div
          key={index}
          style={{
            backgroundColor: "gray",
            border: "solid",
            display: "inline-block",
          }}
        >
          <p>{post.title}</p>
          <p>{post.description}</p>
          <Document file="sample.pdf" onLoadError={console.error}>
            <Page pageNumber={1} width={500} className="page" />
          </Document>
          <p>{`作成者:${post.author}`}</p>
          <p>{post.tags.join(",")}</p>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [posts, setPosts] = useState<PostProps[]>(postsMock);
  const [searchQuery, setQuery] = useState<string>("");

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
        <Board posts={searchQuery ? filterPosts(searchQuery) : posts}></Board>
      </div>
    </div>
  );
};

export default App;
