/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import DpModal from './DpPopUp';
import ProsUModal from './ProsPopUp';

const CombinedModal = ({ prospect, Proid, dp, onSaveProspect, onSaveDp, onClose, open }) => {
  return (
    <Dialog open={open} onOpenChange={onClose} focusLock={false}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <Tabs defaultValue="prospect" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prospect">Prospect</TabsTrigger>
              <TabsTrigger value="dp">Déclaration préalable</TabsTrigger>
            </TabsList>
            <TabsContent value="prospect" className="mt-4">
              <DialogTitle>Modifier Prospect</DialogTitle>
              <ProsUModal prospect={prospect} onSave={onSaveProspect} onClose={onClose} />
            </TabsContent>
            <TabsContent value="dp" className="mt-4">
              <DialogTitle>Ajouter Déclaration préalable</DialogTitle>
              <DpModal Proid={Proid} dp={dp} onSave={onSaveDp} onClose={onClose} />
            </TabsContent>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
CombinedModal.propTypes = {
  prospect: PropTypes.object,
  dp: PropTypes.object,
  onSaveProspect: PropTypes.func.isRequired,
  onSaveDp: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
export default CombinedModal;
