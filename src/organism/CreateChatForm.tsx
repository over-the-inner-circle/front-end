import Button from '@/atom/Button';
import { fetcher } from '@/hooks/fetcher';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

type ChatAccessType = 'public' | 'protected' | 'private';

function CreateChatForm() {
  const [name, setName] = useState('');
  const [accessType, setAccessType] = useState<ChatAccessType>('public');
  const [password, setPassword] = useState('');

  const addChatRoom = useMutation({
    mutationFn: (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      return fetcher('/chat/room', {
        method: 'POST',
        body: JSON.stringify({
          room_name: name,
          room_access: accessType,
          room_password: password,
        }),
      });
    },
  });

  return (
    <form
      className="flex h-fit w-full shrink-0 flex-col items-center
                 gap-3 border-b border-neutral-400 bg-neutral-800 p-3"
      onSubmit={addChatRoom.mutate}
      method="POST"
    >
      <div className="flex w-full flex-row items-center justify-start">
        <label htmlFor="room_name">name: </label>
        <input
          className="w-full border-b-4 border-white bg-inherit"
          name="room_name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex w-full flex-row items-center justify-start">
        <label htmlFor="room_access">type: </label>
        <select
          name="room_access"
          className="w-full bg-neutral-500 p-1"
          value={accessType}
          onChange={(e) => setAccessType(e.target.value as ChatAccessType)}
        >
          <option value="public">Public</option>
          <option value="protected">Protected</option>
          <option value="private">Private</option>
        </select>
      </div>
      {accessType === 'protected' ? (
        <div className="flex w-full flex-row items-center justify-start">
          <label htmlFor="room_password">password: </label>
          <input
            className="w-full border-b-4 border-white bg-inherit"
            name="room_password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      ) : null}
      <Button className="w-full bg-green-600" type="submit">
        Create Room
      </Button>
    </form>
  );
}

export default CreateChatForm;
