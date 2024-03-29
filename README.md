# 42Pong
![intro](./readmeAssets/intro.png)
## 42서울 공통과정 최종과제 ft_transcendence
#### 참여인원 : seushin jaemjung jaewkim (프론트) / mishin toh (백엔드)
#### 프론트엔트 프로젝트 기간 : 2022. 11. 04. ~ 2022. 12. 16.
#### 사용 기술 : Typescript, React, React-router-dom, ReactQuery, Recoil, Tailwindcss, git
#### 주요 기능

* 유저
  * OAuth 로그인을 통해 계정을 생성할 수 있음.
  * 닉네임과 프로필 사진을 유저가 원하는대로 설정할 수 있음.
  * Google Authenticator를 이용한 2중인증.
  * 친구기능
    * 다른 유저를 친구로 추가할 수 있음.
    * 친구 간에는 현재 상태(온라인, 오프라인, 게임 중)를 실시간으로 확인할 수 있음.
  * 프로필 기능
    * 유저의 프로필을 조회하여 해당 유저의 랭크 점수, 게임전적 등을 확인할 수 있음.
  * 차단기능
    * 유저는 다른 유저를 차단할 수 있으며, 차단한 유저는 친구추가, 채팅, 게임 초대 등을 할 수 없음.
* 채팅
  * 채팅방
    * 유저는 채팅방을 생성하여 다른 유저들과 실시간 채팅을 할 수 있음.
    * 채팅방은 공개, 보호, 비공개 방으로 나뉨.
    * 공개방은 모든 유저의 참여 가능, 보호 방은 비밀번호를 입력해야 참여 가능, 비공개 방은 초대로만 참여 가능.
    * 채팅방의 생성자는 자동으로 방장으로 임명됨.
    * 방장은 다른 유저를 방의 관리자로 임명할 수 있음.
    * 방장과 관리자는 다른 유저를 일정 시간동안 강퇴하거나 뮤트시킬 수 있음.
    * 방장은 채팅방의 이름과 비밀번호를 변경할 수 있음.
    * 방장은 채팅방을 삭제할 수 있음.
    * 채팅방 인터페이스를 통해 다른 유저와 1:1 친선게임이 가능함.
  * DM
    * 유저는 다른 유저에게 DM을 보낼 수 있음.
* 게임
  * 유저는 별도의 게임방 생성 없이 매칭 큐 등록을 통해 다른 유저와 Pong을 플레이 할 수 있음.
  * 큐 등록을 통해서 진행하는 게임은 랭크게임으로, 게임의 결과에 따라 유저의 랭크 점수가 변동됨.
  * 랭크 점수에 따라 게임이 매칭됨.
  * 친선 게임은 초대를 통해서만 진행되며, 랭크 점수의 변동은 없음.
  * 유저는 다른 유저의 게임을 방해 없이 관전할 수 있음.
  * 게임의 난이도, 맵의 테마 등을 변경할 수 있음.

## 상세 이미지
메인화면
![main](./readmeAssets/main.png)
채팅방 입장
![main_chatroom](./readmeAssets/main_chatroom.png)
채팅방 수정
![main_chatroom_edit](./readmeAssets/main_chatroom_edit.png)
게임 큐 입장
![main_game_onmatching](./readmeAssets/main_game_onmatching.png)
게임 매치
![main_game_matched](./readmeAssets/main_game_matched.png)
게임 진행
![main_game_playing](./readmeAssets/main_game_playing.png)
게임 결과
![main_game_result](./readmeAssets/main_game_result.png)
유저 프로필
![user_profile](./readmeAssets/user_profile.png)
유저 정보 수정
![user_profile_edit](./readmeAssets/user_info_update.png)
