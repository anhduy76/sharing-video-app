import React from 'react'
import { useSubscription, gql } from '@apollo/client';
const NEW_MESSAGES_SUBSCRIPTION = gql`
  subscription notifyRealTime {
  notification_reads_aggregate{aggregate{count}}
}
`;

export default function Noti() {
  const { data, loading, error } = useSubscription(NEW_MESSAGES_SUBSCRIPTION);
  console.log(data, error)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <div>
      <h2>New Messages</h2>
      <ul>
        {data.map(message => (
          <li key={message.id}>
            <p>{message.text}</p>
            <p>{message.createdAt}</p>
          </li>
        ))}
      </ul>
    </div>
    </div>
  )
}
