import { supabase } from "../../config/supabaseClient.js";
// 1. Calculer DR 
const countDr = async () => {
    try {
        const { count, error } = await supabase
            .from('DR')
            .select('*', { count: 'exact' })
            .eq('is_active', true);

        if (error) throw error;
        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 2. Calculer Devis Reçu
const countDevisRecu = async () => {
    try {
        const { count, error } = await supabase
            .from('Devis')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .not('reception_date', 'is', null);

        if (error) throw error;
        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 3. Calculer Devis En Attente
const countDevisEnAttente = async () => {
    try {
        const { count, error } = await supabase
            .from('Devis')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .is('reception_date', null);

        if (error) throw error;
        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 4. Calculer Devis Signé
const countDevisSigne = async () => {
    try {
        const { count, error } = await supabase
            .from('Devis')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .not('envoi_date', 'is', null);

        if (error) throw error;
        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 5. Devis en Attente Validation Opérateur
const countDevisValidationOpérateur = async () => {
    try {
        const { count, error } = await supabase
            .from('Devis')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .not('reception_date', 'is', null)
            .gt('montant', 25000)
            .eq('validation_par_sfr', false);

        if (error) throw error;
        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 6. Règlement OK
const countReglementOk = async () => {
    try {
        const { count, error } = await supabase
            .from('Paiements')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .not('reglement_date', 'is', null);

        if (error) throw error;
        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 7. Règlement en Attente
const countReglementEnAttente = async () => {
    try {
        const { count, error } = await supabase
            .from('Paiements')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .is('TDR_envoi_date', null);

        if (error) throw error;
        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 8. Planification Extension
const countPlanificationExtension = async () => {
    try {
        const { count, error } = await supabase
            .from('Traveaux')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .not('extension_prev', 'is', null)
            .is('extension_reel', null);

        if (error) throw error;
        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 9. Extension OK
const countExtensionOk = async () => {
    try {
        const { count, error } = await supabase
            .from('Traveaux')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .not('extension_reel', 'is', null);

        if (error) throw error;
        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 10. Planification Branchements
const countPlanificationBranchements = async () => {
    try {
        const { count, error } = await supabase
            .from('Traveaux')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .not('branchement_prev', 'is', null)
            .is('branchement_reel', null);

        if (error) throw error;
        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// 11. Branchement OK
const countBranchementOk = async () => {
    try {
        const { count, error } = await supabase
            .from('Traveaux')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .not('branchement_reel', 'is', null);

        if (error) throw error;
        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 12. Consuel Reçu
const countConsuelRecu = async () => {
    try {
        const { count, error } = await supabase
            .from('MES')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .eq('status_consuel', 'ok');

        if (error) throw error;
        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 13. Demande de MES Réalisée
const countDemandeMESRealisee = async () => {
    try {
        const { count, error } = await supabase
            .from('MES')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .not('MES_reel', 'is', null);

        if (error) throw error;
        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 14. Consuel en Attente
const countConsuelEnAttente = async () => {
    try {
        // First, get the ids of valid Traveaux
        const { data: validTraveauxIds, error: traveauxError } = await supabase
            .from('Traveaux')
            .select('Tid')
            .eq('is_active', true)
            .not('branchement_reel', 'is', null);
        if (traveauxError) throw traveauxError;
        // If no valid Traveaux found, return 0
        if (!validTraveauxIds || validTraveauxIds.length === 0) {
            return { success: true, data: 0 };
        }
        // Extract Tid values from the result
        const validTids = validTraveauxIds.map(t => t.Tid);
        console.log('Valid Traveaux IDs:', validTids);
        // Now, count MES records
        const { count, error: mesError } = await supabase
            .from('MES')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .eq('status_consuel', 'En attente')
            .in('traveaux_id', validTids);

        if (mesError) throw mesError;

        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// 15. Demande de MES en Attente
const countDemandeMESEnAttente = async () => {
    try {
        const { count, error } = await supabase
            .from('MES')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .eq('status_consuel', 'ok')
            .is('MES_reel', null);

        if (error) throw error;
        return { success: true, data: count || 0 };
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

