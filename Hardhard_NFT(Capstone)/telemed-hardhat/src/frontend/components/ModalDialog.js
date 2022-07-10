import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Registration from './Registration';

const ModalDialog = ({ open, handleClose, account }) => {
  return (
    // props received from App.js
    <Dialog open={open} onClose={handleClose}>
      <Registration account={account} handleClose={handleClose} />
    </Dialog>
  );
};

export default ModalDialog;