import { supabase } from '../../config/supabaseClient.js';
import XLSX from 'xlsx';

const getDrDataWithSite = async () => {
    try {
        // Fetch DR data and Site-related fields
        const { data, error } = await supabase
            .from('DR')
            .select(`
                NDRid,
                Ko_Dp,
                date_dr,
                type_rac,
                gestionnaire_de_reseau,
                SPRid_FK,
                Site:EB_fk (
                    EB,
                    G2R,
                    nom
                )
            `)
            .eq('is_active', true);

        if (error) throw error;

        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const drDataWithMappedValues = await Promise.all(data.map(async (item) => {
            // Fetch the corresponding 'nom' from 'Entite' where Eid matches gestionnaire_de_reseau
            const { data: entiteData, error: entiteError } = await supabase
                .from('Entite')
                .select('nom')
                .eq('Eid', item.gestionnaire_de_reseau)
                .single(); // We expect only one result for each gestionnaire_de_reseau value

            if (entiteError) {
                console.error('Error fetching Entite:', entiteError);
            }

            // Fetch the corresponding 'SPR_desc' from 'SPR' table where SPRid matches SPRid_FK
            const { data: sprData, error: sprError } = await supabase
                .from('SPR')
                .select('SPR_desc')
                .eq('SPRid', item.SPRid_FK)
                .single();

            if (sprError) {
                console.error('Error fetching SPR:', sprError);
            }
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro Demande Raccordement': item.NDRid,
                'Ko Dp': item.Ko_Dp || "",
                'Date Demande Raccordement': item.date_dr || "",
                'Type Raccordement': item.type_rac || "",
                'Gestionnaire de reseau': entiteData ? entiteData.nom : "",
                'Status Proposition ': sprData ? sprData.SPR_desc : "",
            };
        }));
        return { success: true, data: drDataWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
const getDeviRecuWithSite = async () => {
    try {
        // Fetch DR data and Site-related fields
        const { data, error } = await supabase
            .from('Devis')
            .select(`
                ND,
                fournisseur,
                type_devis,
                devis_date,
                montant,
                expiration_date,
                reception_date,
                Site:EB_fk (
                    EB,
                    G2R,
                    nom
                )
            `)
            .eq('is_active', true)
            .not('reception_date', 'is', null);

        if (error) throw error;

        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const devisRecuWithMappedValues = await Promise.all(data.map(async (item) => {
            // Fetch the corresponding 'nom' from 'Entite' where Eid matches gestionnaire_de_reseau
            const { data: entiteData, error: entiteError } = await supabase
                .from('Entite')
                .select('nom')
                .eq('Eid', item.fournisseur)
                .single(); // We expect only one result for each gestionnaire_de_reseau value

            if (entiteError) {
                console.error('Error fetching Entite:', entiteError);
            }
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro de Devis': item.ND,
                'Fournisseur': entiteData ? entiteData.nom : "",
                'Type de devis': item.type_devis || "",
                'Date de devis': item.devis_date || "",
                'Montant': item.montant || "",
                'Date Expiration devis': item.expiration_date || "",
                'Date Reception devis': item.reception_date || "",
            };
        }));
        return { success: true, data: devisRecuWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// get Devis en attente with Site 
const getDevisEnAttenteWithSite = async () => {
    try {
        // Fetch DR data and Site-related fields
        const { data, error } = await supabase
            .from('Devis')
            .select(`
                ND,
                fournisseur,
                type_devis,
                devis_date,
                montant,
                expiration_date,
                reception_date,
                Site:EB_fk (
                    EB,
                    G2R,
                    nom
                )
            `)
            .eq('is_active', true)
            .is('reception_date', null);

        if (error) throw error;

        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const devisRecuWithMappedValues = await Promise.all(data.map(async (item) => {
            // Fetch the corresponding 'nom' from 'Entite' where Eid matches gestionnaire_de_reseau
            const { data: entiteData, error: entiteError } = await supabase
                .from('Entite')
                .select('nom')
                .eq('Eid', item.fournisseur)
                .single(); // We expect only one result for each gestionnaire_de_reseau value

            if (entiteError) {
                console.error('Error fetching Entite:', entiteError);
            }
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro de Devis': item.ND,
                'Fournisseur': entiteData ? entiteData.nom : "",
                'Type de devis': item.type_devis || "",
                'Date de devis': item.devis_date || "",
                'Montant': item.montant || "",
                'Date Expiration devis': item.expiration_date || "",
                'Date Reception devis': item.reception_date || "",
            };
        }));
        return { success: true, data: devisRecuWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// get devis en attente sans validation Operateur 
const getDevisEnAttenteOpWithSite = async () => {
    try {
        // Fetch DR data and Site-related fields
        const { data, error } = await supabase
            .from('Devis')
            .select(`
                ND,
                fournisseur,
                type_devis,
                devis_date,
                montant,
                expiration_date,
                reception_date,
                Site:EB_fk (
                    EB,
                    G2R,
                    nom
                )
            `)
            .eq('is_active', true)
            .not('reception_date', 'is', null)
            .gt('montant', 25000)
            .eq('validation_par_sfr', false);

        if (error) throw error;

        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const devisRecuWithMappedValues = await Promise.all(data.map(async (item) => {
            // Fetch the corresponding 'nom' from 'Entite' where Eid matches gestionnaire_de_reseau
            const { data: entiteData, error: entiteError } = await supabase
                .from('Entite')
                .select('nom')
                .eq('Eid', item.fournisseur)
                .single(); // We expect only one result for each gestionnaire_de_reseau value

            if (entiteError) {
                console.error('Error fetching Entite:', entiteError);
            }
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro de Devis': item.ND,
                'Fournisseur': entiteData ? entiteData.nom : "",
                'Type de devis': item.type_devis || "",
                'Date de devis': item.devis_date || "",
                'Montant': item.montant || "",
                'Date Expiration devis': item.expiration_date || "",
                'Date Reception devis': item.reception_date || "",
            };
        }));
        return { success: true, data: devisRecuWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// get devis signe 
const getDevisSigneWithSite = async () => {
    try {
        // Fetch DR data and Site-related fields
        const { data, error } = await supabase
            .from('Devis')
            .select(`
                ND,
                fournisseur,
                type_devis,
                devis_date,
                montant,
                expiration_date,
                reception_date,
                Site:EB_fk (
                    EB,
                    G2R,
                    nom
                )
            `)
            .eq('is_active', true)
            .not('envoi_date', 'is', null);

        if (error) throw error;

        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const devisRecuWithMappedValues = await Promise.all(data.map(async (item) => {
            // Fetch the corresponding 'nom' from 'Entite' where Eid matches gestionnaire_de_reseau
            const { data: entiteData, error: entiteError } = await supabase
                .from('Entite')
                .select('nom')
                .eq('Eid', item.fournisseur)
                .single(); // We expect only one result for each gestionnaire_de_reseau value

            if (entiteError) {
                console.error('Error fetching Entite:', entiteError);
            }
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro de Devis': item.ND,
                'Fournisseur': entiteData ? entiteData.nom : "",
                'Type de devis': item.type_devis || "",
                'Date de devis': item.devis_date || "",
                'Montant': item.montant || "",
                'Date Expiration devis': item.expiration_date || "",
                'Date Reception devis': item.reception_date || "",
            };
        }));
        return { success: true, data: devisRecuWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// get reglement Ok
const getReglementOkWithSite  = async () => {
    try {
        // Fetch DR data and Site-related fields
        const { data, error } = await supabase
            .from('Paiements')
            .select(`
                no_commande,
                no_devis,
                montant,
                reglement_date,
                Site:EB_fk (
                    EB,
                    G2R,
                    nom
                )
            `)
            .eq('is_active', true)
            .not('reglement_date', 'is', null);

        if (error) throw error;
        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const reglementOkWithMappedValues = await Promise.all(data.map(async (item) => {
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro de commande': item.no_commande,
                'Numéro de devis': item.no_devis || "",
                'Montant': item.montant || "",
                'Date de reglement': item.reglement_date || "",
            };
        }));
        return { success: true, data: reglementOkWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// get reglement En attente 
const getReglementEnAttenteWithSite = async () => {
    try {
        // Fetch DR data and Site-related fields
        const { data, error } = await supabase
            .from('Paiements')
            .select(`
                no_commande,
                no_devis,
                montant,
                reglement_date,
                Site:EB_fk (
                    EB,
                    G2R,
                    nom
                )
            `)
            .eq('is_active', true)
            .is('TDR_envoi_date', null);

        if (error) throw error;
        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const reglementOkWithMappedValues = await Promise.all(data.map(async (item) => {
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro de commande': item.no_commande,
                'Numéro de devis': item.no_devis || "",
                'Montant': item.montant || "",
                'Date de reglement': item.reglement_date || "",
            };
        }));
        return { success: true, data: reglementOkWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// get Planification Extension 
const getPlanificationExtension = async () => {
    try {
        // Fetch DR data and Site-related fields
        const { data, error } = await supabase
            .from('Traveaux')
            .select(`
                Tid,
                extension_prev,
                extension_reel,
                Site:EB_fk (
                    EB,
                    G2R,
                    nom
                )
            `)
            .eq('is_active', true)
            .not('extension_prev', 'is', null)
            .is('extension_reel', null);

        if (error) throw error;
        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const reglementOkWithMappedValues = await Promise.all(data.map(async (item) => {
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro de travaux': item.Tid,
                'Extension prévisionnelle': item.extension_prev || "",
                'Extension reele': item.extension_reel || "",
            };
        }));
        return { success: true, data: reglementOkWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// get Extension Ok 
const getExtensionOk = async () => {
    try {
        // Fetch DR data and Site-related fields
        const { data, error } = await supabase
            .from('Traveaux')
            .select(`
                Tid,
                extension_prev,
                extension_reel,
                Site:EB_fk (
                    EB,
                    G2R,
                    nom
                )
            `)
            .eq('is_active', true)
            .not('extension_reel', 'is', null);

        if (error) throw error;
        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const reglementOkWithMappedValues = await Promise.all(data.map(async (item) => {
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro de travaux': item.Tid,
                'Extension prévisionnelle': item.extension_prev || "",
                'Extension reele': item.extension_reel || "",
            };
        }));
        return { success: true, data: reglementOkWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// get Planification branchement 
const getPlanificationBranchement  = async () => {
    try {
        // Fetch DR data and Site-related fields
        const { data, error } = await supabase
            .from('Traveaux')
            .select(`
                Tid,
                extension_prev,
                extension_reel,
                Site:EB_fk (
                    EB,
                    G2R,
                    nom
                )
            `)
            .eq('is_active', true)
            .not('branchement_prev', 'is', null)
            .is('branchement_reel', null);

        if (error) throw error;
        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const reglementOkWithMappedValues = await Promise.all(data.map(async (item) => {
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro de travaux': item.Tid,
                'Extension prévisionnelle': item.extension_prev || "",
                'Extension reele': item.extension_reel || "",
            };
        }));
        return { success: true, data: reglementOkWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// get Branchement OK
const getBranchementOk  = async () => {
    try {
        // Fetch DR data and Site-related fields
        const { data, error } = await supabase
            .from('Traveaux')
            .select(`
                Tid,
                extension_prev,
                extension_reel,
                Site:EB_fk (
                    EB,
                    G2R,
                    nom
                )
            `)
            .eq('is_active', true)
            .not('branchement_reel', 'is', null);

        if (error) throw error;
        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const reglementOkWithMappedValues = await Promise.all(data.map(async (item) => {
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro de travaux': item.Tid,
                'Extension prévisionnelle': item.extension_prev || "",
                'Extension reele': item.extension_reel || "",
            };
        }));
        return { success: true, data: reglementOkWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// get Consuel recu 
const getConsuelRecu  = async () => {
    try {
        // Fetch DR data and Site-related fields
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
                )
            `)
            .eq('is_active', true)
            .eq('status_consuel', 'ok');

        if (error) throw error;
        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const reglementOkWithMappedValues = await Promise.all(data.map(async (item) => {
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro de travaux': item.traveaux_id,
                'Numéro de PDL': item.no_PDL || "",
                'MES prévisionnelle': item.MES_prev || "",
                'MES reel': item.MES_reel || "",
                'status consuel': item.status_consuel || "",
            };
        }));
        return { success: true, data: reglementOkWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// Get Demande de MES realisee
const getDemMesRealisee  = async () => {
    try {
        // Fetch DR data and Site-related fields
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
                )
            `)
            .eq('is_active', true)
            .not('MES_reel', 'is', null);

        if (error) throw error;
        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const reglementOkWithMappedValues = await Promise.all(data.map(async (item) => {
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro de travaux': item.traveaux_id,
                'Numéro de PDL': item.no_PDL || "",
                'MES prévisionnelle': item.MES_prev || "",
                'MES reel': item.MES_reel || "",
                'status consuel': item.status_consuel || "",
            };
        }));
        return { success: true, data: reglementOkWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// get consuel en attente 
const getConsuelEnAttente  = async () => {
    try {
        // Fetch DR data and Site-related fields
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
                )
            `)
            .eq('is_active', true)
            .not('branchement_reel', 'is', null);

        if (error) throw error;
        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const reglementOkWithMappedValues = await Promise.all(data.map(async (item) => {
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro de travaux': item.traveaux_id,
                'Numéro de PDL': item.no_PDL || "",
                'MES prévisionnelle': item.MES_prev || "",
                'MES reel': item.MES_reel || "",
                'status consuel': item.status_consuel || "",
            };
        }));
        return { success: true, data: reglementOkWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// get demande MES en attente 
const getDemMesEnAttante  = async () => {
    try {
        // Fetch DR data and Site-related fields
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
                )
            `)
            .eq('is_active', true)
            .eq('status_consuel', 'ok')
            .is('MES_reel', null);

        if (error) throw error;
        // Map the gestionnaire_de_reseau to the Entite table (Eid to nom)
        const reglementOkWithMappedValues = await Promise.all(data.map(async (item) => {
            // Return the mapped data, with NULL handling
            return {
                'EB': item.Site ? item.Site.EB : "", 
                'G2R': item.Site ? item.Site.G2R : "",
                'Nom site': item.Site ? item.Site.nom : "",
                'Numéro de travaux': item.traveaux_id,
                'Numéro de PDL': item.no_PDL || "",
                'MES prévisionnelle': item.MES_prev || "",
                'MES reel': item.MES_reel || "",
                'status consuel': item.status_consuel || "",
            };
        }));
        return { success: true, data: reglementOkWithMappedValues };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
// Function to generate an Excel file from the data
const generateExcelFile = (data) => {
    // Generate a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(data);
    // Create a new workbook and append the worksheet to it
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DR Data');
    // Generate an Excel file buffer
    const fileBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return fileBuffer;
};
const DashFiles = {
    getDrDataWithSite,
    getDeviRecuWithSite,
    getDevisEnAttenteOpWithSite,
    getDevisSigneWithSite,
    getDevisEnAttenteWithSite,
    getReglementOkWithSite,
    getReglementEnAttenteWithSite,
    getPlanificationExtension,
    getExtensionOk,
    getPlanificationBranchement,
    getBranchementOk,
    getConsuelRecu,
    getDemMesRealisee,
    getConsuelEnAttente,
    getDemMesEnAttante,
    generateExcelFile,
}
export default DashFiles;
