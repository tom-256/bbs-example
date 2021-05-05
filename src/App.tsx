import React, { useState } from "react";
import "./App.css";
import { Post, PostProps } from "./Post";

const postsMock: PostProps[] = [
  {
    title: "test",
    description: "test description",
    author: "bob",
    image:
      "https://cdn.shibe.online/shibes/5464189a1ded1107e6579b8f39e82937acd37554.jpg",
    tags: [{ name: "tag1" }, { name: "tag2" }],
  },
  {
    title: "test2",
    description: "test description",
    author: "john",
    image:
      "https://cdn.shibe.online/shibes/f516c9b186ea3997cf42b0257a9e2dc031af90cd.jpg",
    tags: [{ name: "tag1" }, { name: "tag2" }],
  },
];

function App() {
  const [posts] = useState<PostProps[]>(postsMock);

  return (
    <div className="App">
      <div>
        {posts.map((p) => (
          <Post {...p}></Post>
        ))}
      </div>
    </div>
  );
}

export default App;
