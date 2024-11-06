// Vue d'ensemble
// Ce fichier contient plusieurs fonctions utilisées pour interagir avec les contacts dans une application. Ces fonctions permettent de récupérer les contacts actifs et inactifs, d'effectuer des recherches, de sauvegarder un contact (ajouter ou mettre à jour), et de gérer les messages d'alerte ou d'erreur.

// 1. fetchActiveContacts
// Description
// Cette fonction récupère tous les contacts actifs depuis la base de données. Elle met à jour l'état des contacts et gère les messages d'alerte si aucun contact actif n'est trouvé.

// Paramètres
// setContacts: Fonction permettant de mettre à jour l'état des contacts avec les contacts récupérés.
// setNoResultsMessage: Fonction permettant de mettre à jour le message affiché lorsqu'aucun contact actif n'est trouvé.
// Retour
// Cette fonction met à jour l'état des contacts et le message d'alerte. Si la récupération des contacts échoue, un message d'erreur est affiché.
/**
 * 2. fetchInactiveContacts
Description
Cette fonction récupère tous les contacts inactifs depuis la base de données. Elle met à jour l'état des contacts et gère les messages d'alerte si aucun contact inactif n'est trouvé.

Paramètres
setContacts: Fonction permettant de mettre à jour l'état des contacts avec les contacts récupérés.
setNoResultsMessage: Fonction permettant de mettre à jour le message affiché lorsqu'aucun contact inactif n'est trouvé.
Retour
Cette fonction met à jour l'état des contacts et le message d'alerte. Si la récupération des contacts échoue, un message d'erreur est affiché. */
// handleSave
// Description
// Cette fonction gère l'enregistrement ou la mise à jour d'un contact dans la base de données. Si un contact est sélectionné, il sera mis à jour ; sinon, un nouveau contact sera créé. Après l'enregistrement, la liste des contacts est mise à jour.

// Paramètres
// data: Les données du contact à enregistrer ou mettre à jour.
// selectedContact: Le contact sélectionné pour la mise à jour ou null pour un nouveau contact.
// setAlert: Fonction permettant d'afficher les alertes de succès ou d'erreur.
// isActive: Booléen qui détermine si les contacts actifs ou inactifs doivent être affichés après l'enregistrement.
// setContacts: Fonction permettant de mettre à jour l'état des contacts après l'enregistrement.
// setNoResultsMessage: Fonction permettant de mettre à jour le message d'alerte en cas de non-récupération des contacts.
// handleModalClose: Fonction pour fermer le modal après l'enregistrement du contact.
// Retour
// Cette fonction affiche un message de succès ou d'erreur dans une alerte et met à jour la liste des contacts.
//
// handleSearchChange
// Description
// Cette fonction gère les changements dans les champs de recherche (nom, prénom, mission) et met à jour l'état de la recherche. Si le champ de recherche est vide, elle récupère tous les contacts actifs. Sinon, elle effectue une recherche sur les contacts en fonction des critères spécifiés.

// Paramètres
// e: L'événement déclenché par le changement dans les champs de recherche.
// searchQuery: L'objet contenant les valeurs des critères de recherche (nom, prénom, mission).
// setSearchQuery: Fonction permettant de mettre à jour l'état des critères de recherche.
// setContacts: Fonction permettant de mettre à jour l'état des contacts après la recherche.
// setNoResultsMessage: Fonction permettant d'afficher un message d'alerte en cas de non-récupération de contacts.
// handleSearchContacts: Fonction qui effectue la recherche en fonction des critères spécifiés.
// Retour
// Met à jour la recherche et affiche les résultats correspondants.
/**
 * handleSearchContacts
Description
Cette fonction effectue une recherche de contacts en fonction des critères spécifiés (nom, prénom, mission). Elle met à jour l'état des contacts avec les résultats et affiche un message si aucun contact correspondant n'est trouvé.

Paramètres
searchQuery: L'objet contenant les valeurs des critères de recherche (nom, prénom, mission).
setContacts: Fonction permettant de mettre à jour l'état des contacts avec les résultats de la recherche.
setNoResultsMessage: Fonction permettant d'afficher un message d'alerte en cas de non-récupération de contacts.
Retour
Cette fonction met à jour l'état des contacts avec les résultats de la recherche et affiche un message si aucun contact correspondant n'est trouvé.
 */
import contactService from 'services/contactsService';

export const fetchActiveContacts = async (setContacts, setNoResultsMessage) => {
  setNoResultsMessage('');
  const result = await contactService.getActiveContacts();
  if (result.success) {
    setContacts(result.data);
    if (result.data.length === 0) {
      setNoResultsMessage('Aucun contact actif trouvé.');
    }
  } else {
    console.error(result.error);
    setNoResultsMessage(
      'Erreur lors de la récupération des contacts. Veuillez réessayer plus tard.'
    );
  }
};

export const fetchInactiveContacts = async (setContacts, setNoResultsMessage) => {
  const result = await contactService.getInactiveContacts();
  if (result.success) {
    setContacts(result.data);
    if (result.data.length === 0) {
      setNoResultsMessage('Aucun contact inactif trouvé.');
    }
  } else {
    console.error(result.error);
    setNoResultsMessage(
      'Erreur lors de la récupération des contacts. Veuillez réessayer plus tard.'
    );
  }
};

export const handleSave = async (
  data,
  selectedContact,
  setAlert,
  isActive,
  setContacts,
  setNoResultsMessage,
  handleModalClose
) => {
  let result;
  let successMessage = '';

  if (selectedContact) {
    result = await contactService.updateContact(selectedContact.Cid, data);
    successMessage = 'Contact mis à jour avec succès !';
  } else {
    result = await contactService.createContact(data);
    successMessage = 'Contact enregistré avec succès !';
  }

  if (result.success) {
    setAlert({ show: true, message: successMessage, type: 'success' });
    handleModalClose();
  } else {
    setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
  }

  if (isActive) {
    fetchActiveContacts(setContacts, setNoResultsMessage);
  } else {
    fetchInactiveContacts(setContacts, setNoResultsMessage);
  }
  fetchActiveContacts(setContacts, setNoResultsMessage);
};

export const handleSearchChange = (
  e,
  searchQuery,
  setSearchQuery,
  setContacts,
  setNoResultsMessage,
  handleSearchContacts
) => {
  const { name, value } = e.target;
  setSearchQuery(prev => ({ ...prev, [name]: value }));

  if (value === '') {
    fetchActiveContacts(setContacts, setNoResultsMessage); // If search input is cleared, fetch active entities
  } else {
    handleSearchContacts(searchQuery, setContacts, setNoResultsMessage);
  }
};

export const handleSearchContacts = async (searchQuery, setContacts, setNoResultsMessage) => {
  const result = await contactService.searchContacts(searchQuery);
  if (result.success) {
    setContacts(result.data);
    if (result.data.length === 0) {
      setNoResultsMessage('Aucun contact trouvé pour les critères de recherche spécifiés.');
    } else {
      setNoResultsMessage('');
    }
  } else {
    console.error(result.error);
  }
};
