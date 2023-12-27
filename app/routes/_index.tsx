import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import commentsStyles from "../styles/comments.css"
import { Suspense } from 'react';
import Comments from '../components/Comments';

let dataComments = ["Comments 1", "Comments 2", "Comments 3", "Comments 4"];

export const links = () => [
  {rel: "stylesheet", href: commentsStyles}
]

export let loader: LoaderFunction = async () => {
  try {
    let response = await fetch('http://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error("Oh no, we couldn't fetch the data!");

    let data = await response.json();
    const commentsArray = data.map((comment: any) => comment.name);

    // Return the data with caching headers
    return json(commentsArray, {
      headers: {
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (err) {
    console.log(err);
    // Return the default comments with caching headers
    return json(dataComments, {
      headers: {
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  }
};

export default function Index() {
  let comments = useLoaderData() as string[];

  return (
    <div>
      <h1>Comments</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Comments comments={comments} />
      </Suspense>
    </div>
  );
}
