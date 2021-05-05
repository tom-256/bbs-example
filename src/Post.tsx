import { VFC } from "react";

type Tag = {
  name: string;
};

export type PostProps = {
  title: string;
  description: string;
  author: string;
  image: string;
  tags: Tag[];
};

export const Post: VFC<PostProps> = ({
  title,
  description,
  author,
  tags,
  image,
}) => {
  return (
    <div>
      <div>{title}</div>
      <div>{description}</div>
      <div>{author}</div>
      {tags.map((tag) => (
        <div>{tag.name}</div>
      ))}
      <img src={image} alt="test" height="20%" width="20%"></img>
    </div>
  );
};
