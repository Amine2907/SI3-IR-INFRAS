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

        
        // Fetch MES records using the same logic as data retrieval
        const { data, error } = await supabase
            .from('MES')
            .select(`
                traveaux_id,
                no_PDL,
                MES_prev,
                MES_reel,
                status_consuel,
                Site:EB_fk (
                    EB,
                    G2R,
                    nom
                ),
                Traveaux:MES_traveaux_id_fkey (branchement_reel)
            `)
            .eq('is_active', true)
            .eq("status_consuel", "En attente");
        
        if (error) throw error;
        
        console.log("Supabase Response (Raw Data):", data);
        
        // Count the number of records returned
        const count = data.length;
        
        console.log("Count fetched successfully:", count);
        return { success: true, data: count };
    } catch (error) {
        console.error("Error in countConsuelEnAttente:", error);
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

