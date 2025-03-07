// import { json } from "@remix-run/node";
import { Form, Link, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";

// ---------- Create a Contact -----------
// Importing a function to create a contact --> from data
// Using ACTION from Remix to POST
import { createEmptyContact, getContacts } from "./data";
export const action = async () => {
  const contact = await createEmptyContact();
  return Response.json({ contact });
};

// ---------------- CSS and other links shoudl be like this -----------------
// Importing the link function to later link the CSS
import type { LinksFunction } from "@remix-run/node";
// importing the stylesheet / getting the url of it
import appStylesHref from "./app.css?url";
// Exporting the links function that contains the url of the CSS previously imported
export const links: LinksFunction = () => [{ rel: "stylesheet", href: appStylesHref }];

// ------------------ Importing Data -------------------
// 1) Import json / data / contacts from getContacts() from data.ts
// 2) import useLoaderData together with others from remix-run/react
// 3) Create and export a const variable for the loader = with an async arrow function as value to get the data
// 4) Declare and Use the data with the useLoaderData in App
// async arrow function to get the data and declare a variable for that
// import { getContacts } from "./data";
import { remixVitePlugin } from "@remix-run/dev/dist/vite/plugin";
// is Loader the function that fetch the data ?
export const loader = async () => {
  const contacts = await getContacts();
  return Response.json({ contacts });
};

export default function App() {
  // Here we use the declared variable with useLoaderData
  // Note the Type Inference
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
          <div>
            <Form id="search-form" role="search">
              <input id="q" aria-label="Search contacts" placeholder="Search" type="search" name="q" />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {/* Link uses to= instead of href=  */}
            {/* Client side routing allows our app to update the URL without requesting another document from the server. Instead, the app can immediately render new UI. */}
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
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
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        {/* In order for child routes to render inside of parent layouts, we need to import and render an Outlet in the parent.  */}
        <div id="detail">
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
