import { supabase } from "../../../config/supabaseClient.js";
// // Validate Prospect 
const getValidatePropsect = async (selectedNoDr) => {
    try {
        console.log('Fetching data for no_dr:', selectedNoDr);
        const { data, error } = await supabase
            .from('Devis')
            .select(`
                no_dr,
                DR!inner (
                    Pro_fk,
                    Prospect!inner (
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

        if (!data || data.length === 0) {
            console.log('No data found for no_dr:', selectedNoDr);
            return [];
        }

        console.log('Fetched data:', data);

        // Extract details for each row
        const results = await Promise.all(data.map(async (row) => {
            const section = row.DR?.Prospect?.section;
            const parcelle = row.DR?.Prospect?.parcelle;
            const Pro_fk = row.DR?.Pro_fk;

            if (!Pro_fk) {
                console.warn(`Missing Pro_fk for row:`, row);
                return { no_dr: row.no_dr, section, parcelle, numero_DP: null };
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

            const numero_DP = dpData?.numero_DP;

            return { no_dr: row.no_dr, section, parcelle, numero_DP };
        }));

        console.log('Extracted data:', results);

        return results;
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

        const selectedNoDr = devisData.no_dr;
        const fetchedDetails = await getValidatePropsect(selectedNoDr);
        
        if (!fetchedDetails) {
            throw new Error('No details found for the selected no_dr.');
        }
        
        const { section, parcelle, numero_DP } = fetchedDetails;
        
        console.log('Fetched details:', fetchedDetails);
        console.log('Provided data:', { section: devisData.section, parcelle: devisData.parcelle, numero_DP: devisData.numero_DP });
        
        console.log('Validation check:');
        console.log('Fetched:', { section, parcelle, numero_DP });
        console.log('Provided:', { section: devisData.section, parcelle: devisData.parcelle, numero_DP: devisData.numero_DP });

        if (
            section?.toString() !== devisData.section ||
            parcelle?.toString() !== devisData.parcelle ||
            numero_DP?.toString() !== devisData.numero_DP
        ) {
            console.log('Validation failed. Fetched:', { section, parcelle, numero_DP });
            console.log('Provided:', { section: devisData.section, parcelle: devisData.parcelle, numero_DP: devisData.numero_DP });
            throw new Error(
                'Validation failed: The provided section, parcelle, or numero_DP does not match the database records.'
            );
        }

        // Prepare the data for insertion
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
            derniere_relance_date: devisData.derniere_relance_date,
            is_active: devisData.is_active,
            conformite: devisData.conformite,
            valide_par_SFR: devisData.valide_par_SFR,
            numero_DP: devisData.numero_DP,
            section: devisData.section,
            parcelle: devisData.parcelle
        };
        // user can only add one and only Devis where is_active = true
       if (newDevisData.is_active === true)  {
        const { data: exisitngDevis, error: checkError } = await supabase
          .from('Devis')
          .select('*')
          .eq('EB_fk', EB)  // Match using EB_fk  (the site identifier)
          .eq('is_active', true);  // Ensure we have only one mise en service which have is_active = True 
        if (checkError) {
          throw new Error(`Error fetching existing Dps: ${checkError.message}`);
        }
        if (exisitngDevis && exisitngDevis.length > 0) {
          throw new Error("This Site have already one mise en service  with active status already exists for this site.");
        }
      }
        // Insert into Devis table
        const { data: devis, error: contactError } = await supabase
            .from('Devis')
            .insert([{ EB_fk: EB, ...newDevisData }])
            .select();

        if (contactError) throw contactError;

        // Link Devis with the site
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
            // Check if `is_active` is being updated to `true`
    if (updates.is_active === true) {
        const { data: activeDevis, error: fetchError } = await supabase
          .from('Devis')
          .select('ND')
          .eq('is_active', true);
  
        if (fetchError) {
          throw new Error(`Failed to fetch active Devis: ${fetchError.message}`);
        }
  
        if (Array.isArray(activeDevis) && activeDevis.length > 0) {
          // If there is already an active `Devis`, prevent the update
          throw new Error(
            `Cannot update is_active to True. There is already an active Devis with ND: ${activeDevis[0].ND}`
          );
        }
      }
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
      console.log('Incoming updates for updateDevis:', updates);
      // Handle fournisseur conversion (if provided as a name)
      if (updates.fournisseur && typeof updates.fournisseur === 'string') {
        const frnsName = updates.fournisseur;
        const entite = activeentites.find(entite => entite.nom === frnsName);
        if (entite) {
            updates.fournisseur = entite.Eid; // Ensure it's a bigint
        } else {
            throw new Error(`No entite found with name: ${frnsName}`);
        }
    } else if (!updates.fournisseur || typeof updates.fournisseur !== 'number') {
        updates.fournisseur = null; // Default to null if invalid
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
    // getValidatePropsect,
}
export default devisModel ; 