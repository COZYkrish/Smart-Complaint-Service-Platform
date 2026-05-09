import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../stores/authStore';
import useComplaintStore from '../stores/complaintStore';

let socket = null;

export const useSocket = () => {
  const { user, token } = useAuthStore();
  const { addComplaintFromSocket, updateComplaintFromSocket } = useComplaintStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!token || !user || initialized.current) return;

    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('🔌 Socket connected');
      if (user.role === 'admin') {
        socket.emit('join_admin');
      } else {
        socket.emit('join_user', user._id);
      }
    });

    socket.on('complaint_created', (complaint) => {
      addComplaintFromSocket(complaint);
    });

    socket.on('complaint_updated', (complaint) => {
      updateComplaintFromSocket(complaint);
    });

    socket.on('complaint_status_changed', (complaint) => {
      updateComplaintFromSocket(complaint);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });

    initialized.current = true;

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
        initialized.current = false;
      }
    };
  }, [token, user]);

  return socket;
};

export default socket;
