import React, { useState } from "react";

const Comments = ({
  comments: commentsLoader,
}: {
  comments: Array<string>;
}) => {
  const [comments, setComments] = useState<Array<string>>(commentsLoader);
  return (
    <div>
      {comments?.map((comment) => (
        <li key={comment}>{comment}</li>
      ))}
    </div>
  );
};

export default Comments;
