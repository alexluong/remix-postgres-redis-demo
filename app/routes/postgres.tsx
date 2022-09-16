import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/postgres.server';

export const loader: LoaderFunction = async () => {
  // Create the table if it does not already exist.
  await db.query('CREATE TABLE IF NOT EXISTS messages (message TEXT)');

  // Get the messages.
  const messageQuery = await db.query('SELECT message FROM messages');
  const messages = messageQuery.rows.map((r) => r.message);

  // Return the data.
  return {
    messages,
  };
};

export const action: ActionFunction = async ({ request }) => {
  // Get the form data.
  const formData = await request.formData();

  // Get the message.
  const message = formData.get('message');

  // Create the table if it does not already exist.
  await db.query('CREATE TABLE IF NOT EXISTS messages (message TEXT)');

  // Save the message to the database.
  await db.query('INSERT INTO messages (message) VALUES ($1)', [message]);

  return null;
};

export default function Postgres() {
  const { messages } = useLoaderData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix Postgres</h1>
      <ul>
        <li>
          <Link to="/">
            Back
          </Link>
        </li>
      </ul>

      <h4>Add Message</h4>
      <form method="POST">
        <input name="message" type="text" style={{ marginRight: '5px' }} />
        <button>Add</button>
      </form>

      <h4>View Messages</h4>
      <ul>
        {messages.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}