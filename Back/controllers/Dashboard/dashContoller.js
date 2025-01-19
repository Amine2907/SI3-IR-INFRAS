/**
 ** @author: Mohamed Amine EL BAH
 * This file contains the controller for the dashboard feature.
 * It provides functions to interact with the model for dashboard metrics.
 * The functions include:
 * - countDr: counts the active entries in the Dr table
 * - countDevisRecu: counts the received quotes
 * - countDevisEnAttente: counts the pending quotes
 * - countDevisSigne: counts the signed quotes
 * - countDevisValidationOpérateur: counts the quotes awaiting operator validation
 * - countReglementOk: counts the payments with a valid payment date
 * - countReglementEnAttente: counts the payments awaiting a payment date
 * - countPlanificationExtension: counts the planned extensions
 * - countExtensionOk: counts the extensions marked as OK
 * - countPlanificationBranchements: counts the planned connections
 * - countBranchementOk: counts the connections marked as OK
 * - countConsuelRecu: counts the received consuel status OK
 * - countDemandeMESRealisee: counts the MES requests realized
 * - countConsuelEnAttente: counts the consuel statuses awaiting validation
 * - countDemandeMESEnAttente: counts the MES requests pending validation
 */
import dashboardModel from "../../models/Dashboard/dashModel.js";

 // Count Dr
 const countDr = async (req, res) => {
     const result = await dashboardModel.countDr();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 
 // Count Devis Recu
 const countDevisRecu = async (req, res) => {
     const result = await dashboardModel.countDevisRecu();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 
 // Count Devis En Attente
 const countDevisEnAttente = async (req, res) => {
     const result = await dashboardModel.countDevisEnAttente();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 
 // Count Devis Signé
 const countDevisSigne = async (req, res) => {
     const result = await dashboardModel.countDevisSigne();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 
 // Count Devis Validation Operateur
 const countDevisValidationOpérateur = async (req, res) => {
     const result = await dashboardModel.countDevisValidationOpérateur();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 
 // Count Reglement OK
 const countReglementOk = async (req, res) => {
     const result = await dashboardModel.countReglementOk();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 
 // Count Reglement En Attente
 const countReglementEnAttente = async (req, res) => {
     const result = await dashboardModel.countReglementEnAttente();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 
 // Count Planification Extension
 const countPlanificationExtension = async (req, res) => {
     const result = await dashboardModel.countPlanificationExtension();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 
 // Count Extension OK
 const countExtensionOk = async (req, res) => {
     const result = await dashboardModel.countExtensionOk();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 
 // Count Planification Branchements
 const countPlanificationBranchements = async (req, res) => {
     const result = await dashboardModel.countPlanificationBranchements();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 
 // Count Branchement OK
 const countBranchementOk = async (req, res) => {
     const result = await dashboardModel.countBranchementOk();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 
 // Count Consuel Recu
 const countConsuelRecu = async (req, res) => {
     const result = await dashboardModel.countConsuelRecu();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 
 // Count Demande MES Realisee
 const countDemandeMESRealisee = async (req, res) => {
     const result = await dashboardModel.countDemandeMESRealisee();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 
 // Count Consuel En Attente
 const countConsuelEnAttente = async (req, res) => {
     const result = await dashboardModel.countConsuelEnAttente();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 
 // Count Demande MES En Attente
 const countDemandeMESEnAttente = async (req, res) => {
     const result = await dashboardModel.countDemandeMESEnAttente();
     if (!result.success) {
         return res.status(400).json({ error: result.error });
     }
     res.status(200).json(result.data);
 };
 // Dashboard Controller
 const dashboardController = {
     countDr,
     countDevisRecu,
     countDevisEnAttente,
     countDevisSigne,
     countDevisValidationOpérateur,
     countReglementOk,
     countReglementEnAttente,
     countPlanificationExtension,
     countExtensionOk,
     countPlanificationBranchements,
     countBranchementOk,
     countConsuelRecu,
     countDemandeMESRealisee,
     countConsuelEnAttente,
     countDemandeMESEnAttente
 };
 export default dashboardController;
 