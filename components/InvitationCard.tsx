import React from 'react';
import { Group, Invitation } from '@/types';
import CenteredImage from '@/components/CenteredImage';
import { apiCalls } from '@/utils/apiCalls';
import { useToast } from '@/context/toastContext';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setInvitations } from '@/redux/slices/invitationsSlice';



interface Props {
  invitation: Invitation;
  onAccept: (group: Group) => void;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}



const InvitationCard = ({ className, style, id, invitation, onAccept }: Props) => {
  const { showToast } = useToast();
  const invitations = useAppSelector(state => state.invitations);
  const dispatch = useAppDispatch();

  async function accept() {
    const res = await apiCalls.put(`/groups/${invitation.groupId}`, {invitationId: invitation.id});
    if (res.error) return showToast('Failed to accept invitation');
    showToast('Invitation accepted');
    onAccept(res as Group);
    const newInvitations = invitations.filter(inv => inv.id !== invitation.id);
    dispatch(setInvitations(newInvitations));
  }

  async function decline() {
    const res = await apiCalls.del(`/invitations/${invitation.id}`); console.log(res);
    const newInvitations = invitations.filter(inv => inv.id !== invitation.id);
    dispatch(setInvitations(newInvitations));
  }


  return (
    <section 
      className={`w-[100%] px-4 py-4 rounded-xl bg-gradient-to-l from-gray-200 to-white ` + className}
      style={{boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)' , ...style}}
      id={id}
    >
      <CenteredImage src={invitation.invitedByImage || '/images/user.png'} width={50} height={50} className='rounded-full min-w-[50px] mr-4 float-left' />
      <div className="text-wrapper w-[100%]">
        <h3 className='font-semibold text-xl text-textorange mb-1'>Invitation to: {invitation.groupName}</h3>
        <p className='text-sm'>Invited by: {invitation.invitedByNickname}</p>
        <div className='w-[100%] text-sm xs:flex xs:justify-end mt-2'> 
          <span className='mr-4 cursor-pointer font-semibold' onClick={accept}>Accept</span>
          <span className='cursor-pointer font-semibold' onClick={decline}>Decline</span> </div>
      </div>    
    </section>
  )
}

export default InvitationCard