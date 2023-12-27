import { Form, useLoaderData } from "@remix-run/react";
import type { FunctionComponent } from "react";

import contactStyles from "../styles/contacts.css";
import { getContact, type ContactRecord } from "../data";
import { LinksFunction, json } from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: contactStyles },
];

export const loader = async ({ params }: any) => {
  const contact = await getContact(params.contactId);
  return json({ contact });
};

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();
  if (contact)
    return (
      <div id="contact">
        <div>
          <img
            alt={`${contact.first} ${contact.last} avatar`}
            key={contact.avatar}
            src={contact.avatar}
          />
        </div>

        <div>
          <h1>
            {contact.first || contact.last ? (
              <>
                {contact.first} {contact.last}
              </>
            ) : (
              <i>No Name</i>
            )}{" "}
            <Favorite contact={contact} />
          </h1>

          {contact.twitter ? (
            <p>
              <a href={`https://twitter.com/${contact.twitter}`}>
                {contact.twitter}
              </a>
            </p>
          ) : null}

          {contact.notes ? <p>{contact.notes}</p> : null}

          <div>
            <Form action="edit">
              <button type="submit">Edit</button>
            </Form>

            <Form
              action="destroy"
              method="post"
              onSubmit={(event) => {
                const response = confirm(
                  "Please confirm you want to delete this record."
                );
                if (!response) {
                  event.preventDefault();
                }
              }}
            >
              <button type="submit">Delete</button>
            </Form>
          </div>
        </div>
      </div>
    );
  else {
    return <div>No contact Found</div>;
  }
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const favorite = contact.favorite;

  return (
    <Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
};
