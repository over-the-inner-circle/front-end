import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { useAutoScroll } from '@/hooks/chat';
import { useFetcher } from '@/hooks/fetcher';
import { useOptionMenu } from '@/hooks/optionMenu';
import { useRequestNormalGame } from '@/hooks/game';
import {
  useDirectMessages,
  useDirectMessageSocket,
  useUpdateDmHistory,
} from '@/hooks/dm';
import { profileUserState } from '@/states/user/profileUser';
import { type Friend } from '@/hooks/friends';
import { FloatingPortal } from '@floating-ui/react-dom-interactions';
import StatusIndicator from '@/molecule/StatusIndicator';
import OptionMenu, { Option } from '@/molecule/OptionMenu';

interface DirectmsgRoomProps {
  opponent: string;
  close(): void;
}

function useOpponent(nickname: string) {
  const fetcher = useFetcher();
  const data = useQuery<Friend>({
    queryKey: ['user', nickname],
    queryFn: async () => {
      const res = await fetcher(`/user/${nickname}`);
      if (res.ok) return res.json();
      throw res;
    },
  });
  return data;
}

function DirectmsgRoom({ opponent, close }: DirectmsgRoomProps) {
  const { socket } = useDirectMessageSocket(opponent);
  const { data: opponentInfo } = useOpponent(opponent);
  useUpdateDmHistory(opponentInfo);

  const handleSubmit = (content: string) => {
    content = content.trim();
    if (content) {
      socket.emit('publish', { opponent, payload: content });
    }
  };

  return (
    <>
      <div className="flex h-fit w-full items-center justify-between border-b border-inherit bg-neutral-800 p-2">
        {opponentInfo ? <OpponentProfile opponent={opponentInfo} /> : opponent}
        <button onClick={close} className="px-1">
          ⬅
        </button>
      </div>
      <MessageContainer opponent={opponent} />
      <TextInput onSubmit={handleSubmit} />
    </>
  );
}

interface OpponentProfileProps {
  opponent: Friend;
}

function OpponentProfile({ opponent }: OpponentProfileProps) {
  const {
    open,
    reference,
    floating,
    getReferenceProps,
    getFloatingProps,
    x,
    y,
    strategy,
  } = useOptionMenu();

  return (
    <div className="flex flex-row gap-2 p-2">
      <div className="m-1 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
        <img
          src={opponent.prof_img}
          alt="profile"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <p>{opponent.nickname}</p>
        <div className="flex flex-row items-center space-x-2">
          <StatusIndicator status={opponent.status} />
          <p className="min-w-0 truncate text-xs">
            {opponent.status ?? 'unknown'}
          </p>
        </div>
      </div>
      <button ref={reference} {...getReferenceProps()} className="px-3">
        :
      </button>
      <FloatingPortal>
        {open && (
          <div
            ref={floating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
            }}
            {...getFloatingProps()}
          >
            <OpponentOpionMenu opponent={opponent} />
          </div>
        )}
      </FloatingPortal>
    </div>
  );
}

interface OpponentOpionMenuProps {
  opponent: Friend;
}

function OpponentOpionMenu({opponent}: OpponentOpionMenuProps) {
  const requestNormalGame = useRequestNormalGame();
  const setProfileUser = useSetRecoilState(profileUserState);

  const options: Option[] = [
    {
      label: 'View Profile',
      onClick: () => {
        setProfileUser(opponent.nickname);
      },
    },
    {
      label: 'Invite Game',
      onClick: () => {
        requestNormalGame(opponent.nickname);
      },
    },
    {
      label: 'Block',
      color: 'text-red-700',
      onClick: () => {
        /**/
      }
    }
  ];
  return <OptionMenu options={options} />;
}

interface MessageContainerProps {
  opponent: string;
}

function MessageContainer({ opponent }: MessageContainerProps) {
  const { data: messages } = useDirectMessages(opponent);
  const autoScrollRef = useAutoScroll(messages);

  return (
    <div
      ref={autoScrollRef}
      className="h-full w-full grow overflow-y-auto border-b border-inherit"
    >
      <ul className="flex h-fit w-full flex-col items-start justify-start">
        {messages?.map((message, idx) => (
          <li
            key={idx}
            className="h-fit w-full break-words p-1 px-5 text-xs"
          >{`${message.sender.nickname}: ${message.payload}`}</li>
        ))}
      </ul>
    </div>
  );
}

interface TextInputProps {
  onSubmit(content: string): void;
}

function TextInput({ onSubmit }: TextInputProps) {
  const [content, setContent] = useState('');

  const sendMessage = () => {
    onSubmit(content);
    setContent('');
  };

  return (
    <div className="h-30 flex">
      <textarea
        placeholder="plase input here."
        className="h-20 w-full resize-none border-none bg-neutral-300 text-black"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        }}
      />
      <button
        className="h-full border-b border-inherit bg-neutral-800 px-3"
        onClick={() => {
          sendMessage();
        }}
      >
        send
      </button>
    </div>
  );
}

export default DirectmsgRoom;
