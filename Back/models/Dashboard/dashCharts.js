import { supabase } from "../../config/supabaseClient.js";

// Helper function to group data by programme description and count
const groupByProgramme = (data, getProgrammeDesc) => {
  const programmeCount = data.reduce((acc, item) => {
    const programmeDesc = getProgrammeDesc(item) || "Unknown";
    acc[programmeDesc] = (acc[programmeDesc] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(programmeCount).map(([programme, count]) => ({
    programme,
    count,
  }));
};

// 1. DR Count by Programme
const getDRCountByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("DR")
      .select(`
        NDRid,
        Site:DR_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true);
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching DR count by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// 2. Devis Reçu by Programme
const getDevisRecuByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("Devis")
      .select(`
        ND,
        Site:Devis_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true)
      .not("reception_date", "is", null);
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching Devis Reçu by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// 3. Devis En Attente by Programme
const getDevisEnAttenteByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("Devis")
      .select(`
        ND,
        Site:Devis_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true)
      .is("reception_date", null);
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching Devis En Attente by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// 4. Devis Signé by Programme
const getDevisSigneByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("Devis")
      .select(`
        ND,
        Site:Devis_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true)
      .not("envoi_date", "is", null);
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching Devis Signé by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// 5. Devis Validation Opérateur by Programme
const getDevisValidationOperateurByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("Devis")
      .select(`
        ND,
        Site:Devis_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true)
      .not("reception_date", "is", null)
      .gt("montant", 25000)
      .eq("validation_par_sfr", false);
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching Devis Validation Opérateur by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// 6. Règlement OK by Programme
const getReglementOkByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("Paiements")
      .select(`
        no_commande,
        Site:Paiements_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true)
      .not("reglement_date", "is", null);
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching Règlement OK by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// 7. Règlement En Attente by Programme
const getReglementEnAttenteByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("Paiements")
      .select(`
        no_commande,
        Site:Paiements_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true)
      .is("TDR_envoi_date", null);
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching Règlement En Attente by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// 8. Planification Extension by Programme
const getPlanificationExtensionByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("Traveaux")
      .select(`
        Tid,
        Site:Travaux_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true)
      .not("extension_prev", "is", null)
      .is("extension_reel", null);
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching Planification Extension by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// 9. Extension OK by Programme
const getExtensionOkByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("Traveaux")
      .select(`
        Tid,
        Site:Travaux_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true)
      .not("extension_reel", "is", null);
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching Extension OK by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// 10. Planification Branchements by Programme
const getPlanificationBranchementsByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("Traveaux")
      .select(`
        Tid,
        Site:Travaux_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true)
      .not("branchement_prev", "is", null)
      .is("branchement_reel", null);
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching Planification Branchements by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// 11. Branchement OK by Programme
const getBranchementOkByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("Traveaux")
      .select(`
        Tid,
        Site:Travaux_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true)
      .not("branchement_reel", "is", null);
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching Branchement OK by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// 12. Consuel Reçu by Programme
const getConsuelRecuByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("MES")
      .select(`
        no_PDL,
        Site:MES_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true)
      .eq("status_consuel", "ok");
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching Consuel Reçu by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// 13. Demande de MES Réalisée by Programme
const getDemandeMESRealiseeByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("MES")
      .select(`
        no_PDL,
        Site:MES_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true)
      .not("MES_reel", "is", null);
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching Demande MES Réalisée by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// 14. Consuel En Attente by Programme
const getConsuelEnAttenteByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("MES")
      .select(`
        no_PDL,
        Site:MES_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true)
      .eq("status_consuel", "En attente");
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching Consuel En Attente by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// 15. Demande de MES En Attente by Programme
const getDemandeMESEnAttenteByProgramme = async () => {
  try {
    const { data, error } = await supabase
      .from("MES")
      .select(`
        no_PDL,
        Site:MES_EB_fk_fkey (
          programme_fk,
          Programme:programme_fk (PRid, PR_desc)
        )
      `)
      .eq("is_active", true)
      .eq("status_consuel", "ok")
      .is("MES_reel", null);
    if (error) throw error;
    return {
      success: true,
      data: groupByProgramme(data, (item) => item.Site?.Programme?.PR_desc),
    };
  } catch (error) {
    console.error("Error fetching Demande MES En Attente by programme:", error.message);
    return { success: false, error: error.message };
  }
};

// Export all functions
const dashChartsModel = {
  getDRCountByProgramme,
  getDevisRecuByProgramme,
  getDevisEnAttenteByProgramme,
  getDevisSigneByProgramme,
  getDevisValidationOperateurByProgramme,
  getReglementOkByProgramme,
  getReglementEnAttenteByProgramme,
  getPlanificationExtensionByProgramme,
  getExtensionOkByProgramme,
  getPlanificationBranchementsByProgramme,
  getBranchementOkByProgramme,
  getConsuelRecuByProgramme,
  getDemandeMESRealiseeByProgramme,
  getConsuelEnAttenteByProgramme,
  getDemandeMESEnAttenteByProgramme,
};

export default dashChartsModel;

