import { LinksFunction, defer } from "@remix-run/node";
import { useLoaderData, Await } from "@remix-run/react";
import React, { Suspense } from "react";
import Comments from "~/components/Comments";
import commentsStyles from "../styles/comments.css"

let dataComments = ["Comments 1", "Comments 2", "Comments 3", "Comments 4"];

export const links:LinksFunction= ()=>[
  {rel: "stylesheet", href: commentsStyles}
]

const fetchComments = async () => {
  return new Promise<Array<string>>((resolve) =>
    setTimeout(() => {
      fetch("http://jsonplaceholder.typicode.com/users")
        .then((res) => res.json())
        .then((data) => {
          const commentsArray = data.map((comment: any) => comment.name);
          resolve(commentsArray);
        })
        .catch((err) => {
          resolve(dataComments);
          console.log(err);
        });
    }, 2000)
  );
};
export async function loader() {
  const comments = fetchComments() as Promise<Array<string>>;
  return defer({
    comments,
  });
}
const InitialRender = () => {
  return (
    <ul>
      <li>Loading...</li>
      <li>Loading...</li>
    </ul>
  );
};

const Index: React.FC = () => {
  const { comments } = useLoaderData<typeof loader>();

  return (
    <>
      <Comments comments={["1", "2", "3"]} />
      <Suspense fallback={<InitialRender />}>
        <Await resolve={comments}>
          {(comments) => <Comments comments={comments} />}
        </Await>
      </Suspense>
    </>
  );
};

export default Index;
