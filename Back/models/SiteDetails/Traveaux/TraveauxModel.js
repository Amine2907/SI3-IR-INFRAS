import { supabase } from "../../../config/supabaseClient.js";
// create Traveaux Model
const createTraveaux = async (Sid, traveauxData) => {
    try {
        console.log('Incoming data for create Traveaux :', traveauxData);
        // Fetch the active Paiements and map the `paie_id` based on `libelle_du_virement`
        const { data: activePaiements, error: fetchError } = await supabase
            .from('Paiements')
            .select('Pid, libelle_du_virement');
        if (fetchError) {
            throw new Error(`Failed to fetch Paiements: ${fetchError.message}`);
        }

        if (!Array.isArray(activePaiements)) {
            throw new Error('Paiements data is not an array.');
        }
        // Map `libelle_du_virement` to `Pid`
        if (traveauxData.paie_id && typeof traveauxData.paie_id === 'string') {
            const mappedPaiement = activePaiements.find(
                (paiement) => paiement.libelle_du_virement === traveauxData.paie_id
            );
            if (!mappedPaiement) {
                throw new Error(`No Paiement found with libelle_du_virement: ${traveauxData.paie_id}`);
            }
            traveauxData.paie_id = mappedPaiement.Pid; // Assign the mapped ID
        }
        console.log('Transformed Traveaux data ready for insertion:', traveauxData);
        // Insert the new Traveau into the 'Traveaux' table
        const { data: Traveau, error: contactError } = await supabase
            .from('Traveaux')
            .insert([{ EB_fk: Sid, ...traveauxData }])
            .select();

        if (contactError) {
            throw contactError;
        }
        // Extract the newly created Traveau ID (Tid)
        const Tid = Traveau[0].Tid;

        // Associate the Traveau with the Site by inserting into 'Site-Traveaux' association table
        const { data: siteTraveau, error: siteTraveauxError } = await supabase
            .from('Site-Traveaux')
            .insert([{ Sid, Tid }]);

        if (siteTraveauxError) {
            throw siteTraveauxError;
        }
        // Return the successfully created Traveau and the association details
        return { success: true, data: { Traveau: Traveau[0], siteTraveau } };
    } catch (error) {
        console.error('Error in createTraveaux:', error.message);
        return { success: false, error: error.message }; // Return the error message
    }
};
//   get active libelle de virments
  const getActiveLibelle = async (Sid) => {
    try {
        const { data, error } = await supabase
        .from('Paiements')
        .select('libelle_du_virement')
        .eq('is_active',true)
        .eq('EB_fk',Sid);
        if (error) {
            throw error;
        }
        return { success: true, data };
    }catch(error){
        return { success: false, error: error.message };
    }
}
// get all Traveaus
const getAllTraveaux = async (Sid) => {
    try {
        const { data, error } = await supabase
        .from('Traveaux')
        .select('*')
        .eq('EB_fk',Sid);
        if (error) {
            throw error;
        }
        return { success: true, data };
    }catch(error){
        return { success: false, error: error.message };
    }
}
// get Traveau by id
const getTraveauxById = async (id) => {
        try {
            const { data, error } = await supabase 
            .from('Traveaux')
            .select('*')
            .eq('Tid', id);
            if (error) {
                throw error;    
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
// get active Traveaus
const getActiveTraveaux = async (Sid) => {
        try {
            const { data, error } = await supabase
            .from('Traveaux')
            .select('*')
            .eq('is_active', true)
            .eq('EB_fk',Sid);
            ;
            if (error) {
                throw error;
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
// get inactive Traveaus
const getInactiveTraveaux = async (Sid) => {
    try {
        const { data, error } = await supabase
        .from('Traveaux')
        .select('*')
        .eq('is_active', false)
        .eq('EB_fk',Sid);
        if (error) {
            throw error;
        }
        return { success: true, data };
    }catch(error){
        return { success: false, error: error.message };
    }
}
// update Traveau Model 
const updateTraveaux = async (Tid, updates) => {
    try {
        // Fetch the active Paiements and map the `paie_id` if present in updates
        if (updates.paie_id && typeof updates.paie_id === 'string') {
            const { data: activePaiements, error: fetchError } = await supabase
                .from('Paiements')
                .select('Pid, libelle_du_virement');

            if (fetchError) {
                throw new Error(`Failed to fetch Paiements: ${fetchError.message}`);
            }

            if (!Array.isArray(activePaiements)) {
                throw new Error('Paiements data is not an array.');
            }

            // Map `libelle_du_virement` to `Pid`
            const mappedPaiement = activePaiements.find(
                (paiement) => paiement.libelle_du_virement === updates.paie_id
            );

            if (!mappedPaiement) {
                throw new Error(`No Paiement found with libelle_du_virement: ${updates.paie_id}`);
            }

            updates.paie_id = mappedPaiement.Pid; // Assign the mapped ID
        }
        console.log('Transformed updates ready for update operation:', updates);
        // Update the Traveaux record
        const { data, error } = await supabase
            .from('Traveaux')
            .update(updates)
            .eq('Tid', Tid);

        if (error) {
            throw error;
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in updateTraveaux:', error.message);
        return { success: false, error: error.message };
    }
};
// activate Traveau Model 
const activateTraveaux = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Traveaux')
        .update({is_active:true})
        .eq('Tid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// Desactivate Traveau Model 
const desactivateTraveaux = async(id) => {
    try {
        const {data,error} = await supabase
        .from('Traveaux')
        .update({is_active:false})
        .eq('Tid',id);
        if(error){
            throw error ; 
        }
        return {success:true , data };
    }catch(error){
        return {success:false , error:error.messsage};
    }
};
// exporting all model's functions 
const traveauxModel = {
    createTraveaux,
    getInactiveTraveaux,
    getActiveTraveaux,
    updateTraveaux,
    getAllTraveaux,
    activateTraveaux,
    desactivateTraveaux,
    getTraveauxById,
    getActiveLibelle,
}
export default traveauxModel;