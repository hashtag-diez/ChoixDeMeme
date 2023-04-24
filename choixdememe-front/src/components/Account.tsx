import { useAtom } from 'jotai';
import React from 'react'
import userAtom from '../atoms/User';
import Avatar from './Avatar';

const Account = () => {
  const [user, _] = useAtom(userAtom);
  return (
    <section>
     <div className="comment">
        <Avatar {...user} />
        <div className="">
          Welcome&nbsp;
          {user.username}
        </div>
      </div>
    </section>
  )
}

export default Account