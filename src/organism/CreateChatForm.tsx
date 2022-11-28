import { fetcher } from "@/hooks/fetcher";
import { useMutation } from "@tanstack/react-query";

function CreateChatForm() {
  const addChatRoom = useMutation({
    mutationFn: (event: React.FormEvent<HTMLFormElement>) => {
      const f = event.target;

      event.preventDefault();
      return fetcher('/chat/room', {
        method: 'POST',
        body: JSON.stringify({
          room_name: f.room_name.value,
          room_access: f.room_access.value,
          room_password: f.room_password.value,
        }),
      });
    },
  });

  return (
    <form
      className="flex h-fit w-full shrink-0 flex-row items-center border-b border-neutral-400 bg-neutral-800"
      onSubmit={addChatRoom.mutate}
    >
      <button className="px-2" type="submit">
        +
      </button>
      <div className="flex w-min flex-col items-center bg-neutral-800">
        <input
          className="w-min border-b-4 border-white bg-inherit"
          name="room_name"
          type="text"
          required
        />
        <div className="flex flex-row space-y-3 text-xs">
          <input
            className="w-min border-b-4 border-white bg-inherit"
            name="room_access"
            value="public"
            type="radio"
          />
          <label htmlFor="public">public</label>
          <input
            className="w-min border-b-4 border-white bg-inherit"
            name="room_access"
            value="protected"
            type="radio"
          />
          <label htmlFor="protected">protected</label>
          <input
            className="w-min border-b-4 border-white bg-inherit"
            name="room_access"
            value="private"
            type="radio"
          />
          <label htmlFor="private">private</label>
        </div>
        <input
          className="w-min border-b-4 border-white bg-inherit"
          name="room_password"
          type="password"
        />
      </div>
    </form>
  );
}

export default CreateChatForm;
