# TalkSee_Backend

run backend with npm start

In app.js
(add these two)
import Settings from './components/FrontendComponents/components/Settings';
<UserRoute exact path ="/my-account-settings/:id" component ={Settings} />

In app.css
Line # 1 && Line 309 to onward

In dashboard + SideBar
Only Return Part updated

New Frontend Component
Settings.js (just copy and paste)

In i)ProfileSetup && ii)UpdatePSetup
i) div added and line updated # 320-323
ii)div added and line updated # 304-307

In SingleFriend.js
add line 7-12, 15-16, line #19 (parameter "friend" added to "RemoveFriend" Function)
line 27-29 (handleClose Fun), line 39-44 (handleClickOpen Fun)
line 63 updated (onClick of Button),
line 68-89 added {show to null}
