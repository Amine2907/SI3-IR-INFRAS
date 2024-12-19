import { supabase } from "../../../config/supabaseClient.js";
// Validate Prospect 
const getValidatePropsect = async (selectedNoDr) => {
    try {
        const { data, error } = await supabase
            .from('Devis')
            .select(`
                no_dr,
                DR (Prospect!inner (section, parcelle)),
                DP (numero_DP, Prospect!inner (section, parcelle))
            `)
            .eq('no_dr', selectedNoDr);  // Filter by the selected 'no_dr'

        if (error) {
            throw new Error('Error fetching devis details: ' + error.message);
        }
        if (!data || data.length === 0) {
            throw new Error('No details found for the selected no_dr.');
        }

        return data[0];  // Return the first match (or adjust as needed)
    } catch (err) {
        console.error(err.message);
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
                const selectedNoDr = devisData.no_dr;
                const fetchedDetails = await getValidatePropsect(selectedNoDr);
        
                if (!fetchedDetails) {
                    throw new Error('No details found for the selected no_dr.');
                }
        
                const { section, parcelle, numero_DP } = fetchedDetails;
        
                if (
                    devisData.section !== section ||
                    devisData.parcelle !== parcelle ||
                    devisData.numero_DP !== numero_DP
                ) {
                    throw new Error(
                        'Validation failed: The provided section, parcelle, or numero_DP does not match the database records.'
                    );
                }
        // Fetch active fournisseurs
        const activeFournResponse = await getActiveFournisseurs();
        if (!activeFournResponse.success || !Array.isArray(activeFournResponse.data)) {
            throw new Error('Failed to fetch active fournisseurs.');
        }
        const activeEntities = activeFournResponse.data;

        // Map fournisseur.nom -> Eid
        if (devisData.fournisseur?.nom) {
            const frns = activeEntities.find(e => e.nom === devisData.fournisseur.nom);
            if (!frns) {
                throw new Error(`Fournisseur not found for name: ${devisData.fournisseur.nom}`);
            }
            devisData.fournisseur = frns.Eid; // Ensure Eid is a number
        }

        // Fetch active paiements
        const activePaisResponse = await getActivePais(EB);
        if (!activePaisResponse.success || !Array.isArray(activePaisResponse.data)) {
            throw new Error('Failed to fetch active paiements.');
        }
        const activePaies = activePaisResponse.data;

        // Map no_paie.Pid -> Pid
        if (devisData.no_paie?.Pid) {
            const paiement = activePaies.find(p => p.Pid === parseInt(devisData.no_paie.Pid, 10));
            if (!paiement) {
                throw new Error(`Paiement not found for Pid: ${devisData.no_paie.Pid}`);
            }
            devisData.no_paie = paiement.Pid; // Ensure Pid is numeric
        }

        // Fetch active factures
        const activefactureResponse = await getActiveFacture(EB);
        if (!activefactureResponse.success || !Array.isArray(activefactureResponse.data)) {
            throw new Error('Failed to fetch active factures.');
        }
        const activeFacture = activefactureResponse.data;

        // Map no_devis.no_fac -> ID
        if (devisData.factures?.no_fac) {
            const facture = activeFacture.find(d => d.no_fac === devisData.no_devis.no_fac);
            if (!facture) {
                throw new Error(`Facture not found for ND: ${devisData.no_devis.no_fac}`);
            }
            devisData.no_devis = facture.no_fac;
        }

        // Remove invalid fields if necessary
        if (!devisData.factures || !devisData.factures.no_fac) {
            delete devisData.factures;
        }
        if (!devisData.no_paie || !devisData.no_paie.Pid) {
            delete devisData.no_paie;
        }

        // Insert into Devis table
        const { data: devis, error: contactError } = await supabase
            .from('Devis')
            .insert([{ EB_fk: EB, ...devisData }])
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
          updates.fournisseur = entite.Eid;
        } else {
          throw new Error(`No entite found with name: ${frnsName}`);
        }
      }
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
    getValidatePropsect,
}
export default devisModel ; 