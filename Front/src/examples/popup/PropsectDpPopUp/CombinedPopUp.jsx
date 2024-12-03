/* eslint-disable */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { Button } from 'components/ui/button';
import DpModal from './DpPopUp';
import ProsUModal from './ProsPopUp';

const CombinedModal = ({ prospect, dp, onSaveProspect, onSaveDp, onClose, open }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <Tabs defaultValue="prospect" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prospect">Modifier Prospect</TabsTrigger>
              <TabsTrigger value="dp">Ajouter DP</TabsTrigger>
            </TabsList>
            <TabsContent value="prospect" className="mt-4">
              <DialogTitle>Modifier Prospect</DialogTitle>
              <div className="mt-4">
                <ProsUModal prospect={prospect} onSave={onSaveProspect} onClose={onClose} />
              </div>
            </TabsContent>
            <TabsContent value="dp" className="mt-4">
              <DialogTitle>Ajouter DP</DialogTitle>
              <div className="mt-4">
                <DpModal dp={dp} onSave={onSaveDp} onClose={onClose} />
              </div>
            </TabsContent>
          </Tabs>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
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
