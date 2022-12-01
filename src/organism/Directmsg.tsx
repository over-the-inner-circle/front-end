import { useRecoilState } from 'recoil';
import { currentDMOpponentState } from '@/states/currentDMOpponent';
import SideBarLayout from '@/molecule/SideBarLayout';
import DirectmsgRoom from './DirectmsgRoom';
import DirectmsgList from './DirectmsgList';

const Directmsg = () => {
  const [currentDMOpponent, setCurrentDMOpponent] = useRecoilState(
    currentDMOpponentState,
  );

  return (
    <SideBarLayout>
      {currentDMOpponent ? (
        <DirectmsgRoom
          opponent={currentDMOpponent}
          close={() => setCurrentDMOpponent(null)}
        />
      ) : (
        <DirectmsgList />
      )}
    </SideBarLayout>
  );
};

export default Directmsg;
