import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { LinksFunction, defer, json } from "@remix-run/node";
import styles from "./app.css";
import { getContacts } from "./data";
// import darkStylesUrl from "./styles/dark.css";

export let links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  // {
  //   rel: "stylesheet",
  //   href: darkStylesUrl,
  //   media: "(prefers-color-scheme: dark)",
  // },
  { rel: "stylesheet", href: "/settings.css" },
];

export async function loader() {
  const contacts = await getContacts();
  return defer({
    contacts,
  });
}

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <li>
            <Link to="/customize">Customize</Link>
          </li>
          <nav>
            {contacts.length > 0 ? (
              <ul>
                {contacts.slice(0, 10).map((contact) => (
                  <li key={contact.id}>
                    <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? <span>★</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No contacts</p>
            )}
          </nav>
        </div>
        <div id="detail">
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
