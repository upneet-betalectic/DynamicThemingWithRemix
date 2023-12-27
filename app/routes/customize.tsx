import React from "react";
import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "~/sessions";
import { Theme, darkTheme, defaultTheme } from "~/theme";

export let loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));

  let theme = session.get("theme");
  console.log(theme);
  return theme || defaultTheme;
};

export let action: ActionFunction = async ({ request }) => {
  let [session, formData] = await Promise.all([
    getSession(request.headers.get("Cookie")),
    request.formData(),
  ]);
  let action = formData.get("_action");

  let newTheme: Partial<Theme>;

  if (action === "reset") {
    newTheme = defaultTheme;
  } else if (action === "dark") {
    newTheme = darkTheme;
  } else {
    newTheme = {};
    for (let key of Object.keys(defaultTheme) as Array<keyof Theme>) {
      let color = formData.get(key);
      if (typeof color !== "string" || !color) {
        return json(`missing color ${key} in input`);
      }
      newTheme[key] = color;
    }
  }
  session.set("theme", newTheme);

  return redirect("/customize", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Customize() {
  let theme = useLoaderData<Theme>();
  let actionMessage = useActionData<string>();

  return (
    <div>
      <p>We will be using session storage to generate a custom CSS file.</p>
      <Form reloadDocument method="post" className="remix__form">
        <h3>Colors</h3>
        <p>
          <i>Choose the colors to theme the website to your liking.</i>
        </p>
        <p>Default themes</p>
        <div>
          <button name="_action" value="reset">
            Light
          </button>
          <button name="_action" value="dark">
            Dark
          </button>
        </div>
        <label>
          <div>Background color</div>
          <input
            name="background"
            type="color"
            defaultValue={theme.background}
            key={theme.background}
          />
        </label>
        <label>
          <div>Links color</div>
          <input name="links" type="color" defaultValue={theme.links} />
        </label>
        <label>
          <div>Links hover color</div>
          <input
            name="links-hover"
            type="color"
            defaultValue={theme["links-hover"]}
            key={theme["links-hover"]}
          />
        </label>
        <label>
          <div>Border color</div>
          <input
            name="border"
            type="color"
            defaultValue={theme.border}
            key={theme.border}
          />
        </label>
        <div>
          <button>Save</button>
        </div>
        {actionMessage ? (
          <p>
            <b>{actionMessage}</b>
          </p>
        ) : null}
      </Form>
    </div>
  );
}
