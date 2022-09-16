import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { redis } from '~/utils/redis.server';

export const loader: LoaderFunction = async () => {
// Get the messages.
  const messageValue = await redis.get('messages');
  const messages = messageValue ? JSON.parse(messageValue) : [];

  // Return the data.
  return {
    messages,
  };
};

export const action: ActionFunction = async ({ request }) => {
  // Get the messages.
  const messageValue = await redis.get('messages');
  const messages = messageValue ? JSON.parse(messageValue) : [];

  // Get the form data.
  const formData = await request.formData();

  // Get the message.
  const message = formData.get('message');

  // Push the message onto the messages.
  messages.push(message);

  // Save the messages.
  await redis.set('messages', JSON.stringify(messages));

  return null;
};

export default function Redis() {
  const { messages } = useLoaderData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix Redis</h1>
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