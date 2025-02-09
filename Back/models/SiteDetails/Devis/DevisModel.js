import { supabase } from "../../../config/supabaseClient.js";
// // Validate Prospect 
const getValidatePropsect = async (selectedNoDr) => {
    try {
        console.log('Fetching data for no_dr:', selectedNoDr);

        const { data, error } = await supabase
            .from('Devis')
            .select(`
                no_dr,
                DR (
                    Pro_fk,
                    Prospect (
                        section,
                        parcelle
                    )
                )
            `)
            .eq('no_dr', selectedNoDr);

        if (error) {
            console.error('Supabase error:', error.message);
            throw new Error('Error fetching devis details: ' + error.message);
        }

        console.log('Raw fetched data:', data); // Log raw data

        if (!data || data.length === 0) {
            console.log('No data found for no_dr:', selectedNoDr);
            return [];
        }

        const row = data[0];
        const section = row.DR?.Prospect?.section || null;
        const parcelle = row.DR?.Prospect?.parcelle || null;
        const Pro_fk = row.DR?.Pro_fk || null;

        console.log(`Fetched details: Section: ${section}, Parcelle: ${parcelle}, Pro_fk: ${Pro_fk}`);

        if (!Pro_fk) {
            console.warn(`Missing Pro_fk for no_dr: ${selectedNoDr}`);
            return { no_dr: selectedNoDr, section, parcelle, numero_DP: null };
        }

        const { data: dpData, error: dpError } = await supabase
            .from('DP')
            .select('numero_DP')
            .eq('PRid_fk', Pro_fk)
            .single();

        if (dpError) {
            console.error('Error fetching DP data:', dpError.message);
            throw new Error('Error fetching DP data: ' + dpError.message);
        }

        const numero_DP = dpData?.numero_DP || null;

        console.log('Fetched DP details:', { numero_DP });

        return { no_dr: selectedNoDr, section, parcelle, numero_DP };
    } catch (err) {
        console.error('Error in getValidatePropsect:', err.message);
        throw err;
    }
};
// get Active fournisseurs
const getActiveFournisseurs = async () => {
    try {
        const { data, error } = await supabase
            .from('Entite')
            .select('Eid, nom')
            .eq('is_active', true)
            .eq('role','Fournisseur');
        if (error) {
            throw new Error(`Error fetching active fournisseurs : ${error.message}`);
        }
        return {success:true , data}; 
    } catch (error) {
        console.error(error);
        return [];
    }
};
// get Active Paiements in that site 
const getActivePais = async (Sid) => {
    try {
        const { data, error } = await supabase
        .from('Paiements')
        .select('Pid, no_devis')
        .eq('is_active', true)
        .eq('EB_fk', Sid);
    if (error) {
        throw new Error(`Error fetching active Paiements : ${error.message}`);
    }
    return {success:true , data}; 
} catch (error) {
    console.error(error);
    return [];
}  
};
// get Active Factures in that site 
const getActiveFacture = async (Sid) => {
    try {
        const { data, error } = await supabase
        .from('Facture')
        .select('Fid, no_fac')
        .eq('is_active', true)
        .eq('EB_fk', Sid);
    if (error) {
        throw new Error(`Error fetching active Paiements : ${error.message}`);
    }
    return {success:true , data}; 
} catch (error) {
    console.error(error);
    return [];
    }
};
//Create Devis
const createDevis = async (EB, devisData) => {
    try {
        console.log('Creating Devis with data:', devisData);

        // Check if the ND already exists in the Devis table
        const { data: existingDevis, error: fetchError, count } = await supabase
            .from('Devis')
            .select('ND', { count: 'exact' })
            .eq('ND', devisData.ND);

        if (fetchError) throw fetchError;

        if (count > 1) {
            throw new Error(`Multiple Devis found with ND ${devisData.ND}, expected only one.`);
        }

        if (count === 0) {
            console.log(`No Devis found with ND ${devisData.ND}, proceeding with insert.`);
        }

        // Check for related data
        const selectedNoDr = devisData.no_dr;
        const fetchedDetails = await getValidatePropsect(selectedNoDr);

        // Skip validation if this is the first Devis
        if (!fetchedDetails || Object.keys(fetchedDetails).length === 0) {
            console.warn('No related data found for the first Devis. Skipping validation.');
        } else {
            // Validation logic
            const { section, parcelle, numero_DP } = fetchedDetails;

            if (
                section?.toString() !== devisData.section ||
                parcelle?.toString() !== devisData.parcelle ||
                numero_DP?.toString() !== devisData.numero_DP
            ) {
                console.error(
                    'Validation failed. Mismatch detected:',
                    '\nFetched:', { section, parcelle, numero_DP },
                    '\nProvided:', { section: devisData.section, parcelle: devisData.parcelle, numero_DP: devisData.numero_DP }
                );
                throw new Error(
                    'Validation failed: Fetched data does not match provided data. See logs for details.'
                );
            }
        }
        // Insert the new Devis
        const newDevisData = {
            no_dr: devisData.no_dr,
            ND: devisData.ND,
            type_devis: devisData.type_devis,
            devis_date: devisData.devis_date,
            montant: devisData.montant,
            code_postal_lieu: devisData.code_postal_lieu,
            code_paiement: devisData.code_paiement,
            expiration_date: devisData.expiration_date,
            reception_date: devisData.reception_date,
            etat_ralance: devisData.etat_ralance,
            fournisseur : devisData.fournisseur,
            derniere_relance_date: devisData.derniere_relance_date,
            is_active: devisData.is_active,
            conformite: devisData.conformite,
            valide_par_SFR: devisData.valide_par_SFR,
            numero_DP: devisData.numero_DP,
            section: devisData.section,
            parcelle: devisData.parcelle
        };

        const { data: devis, error: insertError } = await supabase
            .from('Devis')
            .insert([{ EB_fk: EB, ...newDevisData }])
            .select();

        if (insertError) throw insertError;
        console.log('Devis created successfully:', devis[0]);
        // Link DR with the site
        const Did = devis[0].ND;
        const { error: siteDevisError } = await supabase
            .from('Site-Devis')
            .insert([{ Sid: EB, Did }]);
        if (siteDevisError) throw siteDevisError;
        return { success: true, data: devis[0] };
    } catch (error) {
        console.error('Error in createDevis:', error.message);
        throw error;
    }
};
//getAllDevis
const getAllDevis = async(EB) => {
    try {
        const {data,error} = await supabase
        .from('Devis')
            .select('*')
            .eq('EB_fk',EB);
        if(error){
            throw error;
        }
        return {success:true , data};
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Get all active Drs
const getAllActiveDevis = async(EB) => {
    try {
        const {data,error} = await supabase
        .from('Devis')
        .select('*')
        .eq('is_active',true)
        .eq('EB_fk',EB);

        if(error){
            throw error;
        }
        return {success:true , data};
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
const getAllInactiveDevis = async(EB) => {
    try {
        const {data,error} = await supabase
        .from('Devis')
        .select('*')
        .eq('is_active',false)
        .eq('EB_fk',EB);

        if(error){
            throw error;
        }
        return {success:true , data};
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
//getDevisById 
const getDevisById = async(ND) => {
    try {
        const {data,error} = await supabase
        .from('Devis')
        .select('*')
        .eq('ND',ND);
        if(error){
            throw error ;
        }
        return {success:true , data };
    }catch(error){
        return {success:false ,error:error.messsage};
    }
};
//Update Drs 
const updateDevis = async (ND, updates) => {
    try {
        //Active Fournisseurs
      // Fetch active entites list (if necessary for mapping)
      const activeentitesResponse = await getActiveFournisseurs();
      console.log('Active entites Response:', activeentitesResponse);
      if (!activeentitesResponse.success) {
        throw new Error('Failed to fetch active fournisseurs');
      }
      const activeentites = activeentitesResponse.data;
      if (!Array.isArray(activeentites)) {
        throw new Error('Active fournisseurs data is not an array.');
      }
    console.log('Transformed updates ready for database operation:', updates);
    //   Active Paiements 
     // Fetch active prospects list (if necessary for mapping)
     const activepropsectsResponse = await getActivePais();
     console.log('Active paiement Response:', activepropsectsResponse);
     if (!activepropsectsResponse.success) {
       throw new Error('Failed to fetch active paiement');
     }
     const activePais = activepropsectsResponse.data;
     if (!Array.isArray(activePais)) {
       throw new Error('Active paiement data is not an array.');
     }
     console.log('Incoming updates for updateDevis:', updates);
     // Handle no_paie conversion (if provided as a name)
     if (updates.no_paie && typeof updates.no_paie === 'string') {
       const prospectName = updates.no_paie;
       const paiement = activePais.find(paiement => paiement.nom === prospectName);
       if (paiement) {
         updates.no_paie = paiement.Proid;
       } else {
         throw new Error(`No paiements found with name: ${prospectName}`);
       }
     }
        //Active Fcatures
      // Fetch active devis list (if necessary for mapping)
      const activefactureResponse = await getActiveFacture();
      console.log('Active devis Response:', activefactureResponse);
      if (!activefactureResponse.success) {
        throw new Error('Failed to fetch active devis');
      }
      const activedevis = activefactureResponse.data;
      if (!Array.isArray(activedevis)) {
        throw new Error('Active facture data is not an array.');
      }
      console.log('Incoming updates for updateDevis:', updates);
      // Handle no_devis conversion (if provided as a name)
      if (updates.factures && typeof updates.factures === 'string') {
        const devisName = updates.factures;
        const facture = activedevis.find(facture => facture.no_fac === devisName);
        if (facture) {
          updates.no_devis = facture.no_fac;
        } else {
          throw new Error(`No devis found with name: ${devisName}`);
        }
      }
      if (!updates.factures || !updates.factures.no_fac) {
        delete updates.factures;
    }
      console.log('Transformed updates ready for database operation:', updates);
      // Perform the update operation in the database
      const { data, error } = await supabase
        .from('Devis')
        .update(updates)
        .eq('ND', ND);
      if (error) {
        console.error('Supabase Error:', error); // Log the error
        return { success: false, error: error.message }; // Return the error message
      }
      return { success: true, data }; // Return success with updated data
    } catch (err) {
      console.error('Catch Block Error:', err); // Log unexpected errors
      return { success: false, error: err.message }; // Return the error message
    }
  };
// Activate Drs 
const activateDevis = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Devis')
        .update({is_active:true})
        .eq('ND',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Desactivate Drs
const desactivateDevis = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Devis')
        .update({is_active:false})
        .eq('ND',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
const getfactureDetails = async(ND) => {
    try {
        const {data,error} = await supabase
        .from('Facture')
        .select('Fid, no_fac,montant_ht,montant_ttc')
        .eq('Dfk',ND);
        if(error){
            throw error;
        }
        return {success:true , data}
    }catch(error){
        return {success:false , error:error.messsage}
    }    
};
const devisModel = {
    createDevis,
    getAllDevis,
    getDevisById,
    updateDevis,
    activateDevis,
    desactivateDevis,
    getAllActiveDevis,
    getAllInactiveDevis,
    getActiveFournisseurs,
    getActiveFacture,
    getActivePais,
    getfactureDetails
}
export default devisModel ; 