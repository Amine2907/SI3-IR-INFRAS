import { supabase } from "../../config/supabaseClient.js";

// 1. Calculer Dr 
const countDr = async () => {
    try {
        const { data, error } = await supabase
            .from('Dr')
            .select('count(*)')
            .eq('is_active', true);
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 2. Calculer Devis Reçu
const countDevisRecu = async () => {
    try {
        const { data, error } = await supabase
            .from('Devis')
            .select('count(*)')
            .eq('is_active', true)
            .neq('reception_date', null);
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// 3. Calculer Devis En Attente
const countDevisEnAttente = async () => {
    try {
        const { data, error } = await supabase
            .from('Devis')
            .select('count(*)')
            .eq('is_active', true)
            .or('reception_date.is.null, reception_date.is.not.null');
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 4. Calculer Devis Signé
const countDevisSigne = async () => {
    try {
        const { data, error } = await supabase
            .from('Devis')
            .select('count(*)')
            .eq('is_active', true)
            .neq('date_envoi', null);
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 5. Devis en Attente Validation Opérateur
const countDevisValidationOpérateur = async () => {
    try {
        const { data, error } = await supabase
            .from('Devis')
            .select('count(*)')
            .eq('is_active', true)
            .neq('date_reception', null)
            .gt('Montant', 25000)
            .eq('validation_par_sfr', false);
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 6. Règlement OK
const countReglementOk = async () => {
    try {
        const { data, error } = await supabase
            .from('Paiements')
            .select('count(*)')
            .eq('is_active', true)
            .neq('reglement_date', null);
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 7. Règlement en Attente
const countReglementEnAttente = async () => {
    try {
        const { data, error } = await supabase
            .from('Paiements')
            .select('count(*)')
            .eq('is_active', true)
            .or('TDR_envoi_date.is.null, TDR_envoi_date.is.null');
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 8. Planification Extension
const countPlanificationExtension = async () => {
    try {
        const { data, error } = await supabase
            .from('Traveaux')
            .select('count(*)')
            .eq('is_active', true)
            .neq('extension_prev', null)
            .eq('extension_reel', null);
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 9. Extension OK
const countExtensionOk = async () => {
    try {
        const { data, error } = await supabase
            .from('Traveaux')
            .select('count(*)')
            .eq('is_active', true)
            .neq('extension_reel', null);
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 10. Planification Branchements
const countPlanificationBranchements = async () => {
    try {
        const { data, error } = await supabase
            .from('Traveaux')
            .select('count(*)')
            .eq('is_active', true)
            .neq('branchement_prev', null)
            .eq('branchement_reel', null);
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 11. Branchement OK
const countBranchementOk = async () => {
    try {
        const { data, error } = await supabase
            .from('Traveaux')
            .select('count(*)')
            .eq('is_active', true)
            .neq('branchement_reel', null);
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 12. Consuel Reçu
const countConsuelRecu = async () => {
    try {
        const { data, error } = await supabase
            .from('MES')
            .select('count(*)')
            .eq('is_active', true)
            .eq('status_consuel', 'ok');
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 13. Demande de MES Réalisée
const countDemandeMESRealisee = async () => {
    try {
        const { data, error } = await supabase
            .from('MES')
            .select('count(*)')
            .eq('is_active', true)
            .neq('MES_reel', null);
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 14. Consuel en Attente
const countConsuelEnAttente = async () => {
    try {
        const { data, error } = await supabase
            .from('MES')
            .select('count(*)')
            .eq('is_active', true)
            .eq('status_consuel', 'En attente')
            .join('Traveaux', 'MES.branchement_reel', 'Traveaux.branchement_reel');
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 15. Demande de MES en Attente
const countDemandeMESEnAttente = async () => {
    try {
        const { data, error } = await supabase
            .from('MES')
            .select('count(*)')
            .eq('is_active', true)
            .eq('status_consuel', 'ok')
            .neq('MES_reel', null);
        if (error) throw error;
        return { success: true, data: data[0].count };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
const dashboardModel = {
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

export default dashboardModel;
