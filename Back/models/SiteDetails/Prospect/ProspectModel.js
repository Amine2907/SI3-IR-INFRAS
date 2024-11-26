import { supabase } from "../../../config/supabaseClient.js";

const createProspect = async (data) => {
    try {
        const result = await supabase
        .from('Prospect')
        .insert([data]);
        if (result.error) { 
            throw result.error;
        } else {
            return { success: true, result };
        }
    }catch(error) {
        return { success: false, error: error.message };
    }
}
const fetchActiveProspect = async () => {
        try {
            const { data, error } = await supabase
            .from('Prospect')
            .select('*')
            .eq('is_active', true);
            if (error) {
                throw error;
            }
            return { success: true, data };
        }catch(error){
            return { success: false, error: error.message };
        }
}
const fetchinactiveProspect = async () => {
    try {
        const { data, error } = await supabase
        .from('Prospect')
        .select('*')
        .eq('is_active', false);
        if (error) {
            throw error;
        }
        return { success: true, data };
    }catch(error){
        return { success: false, error: error.message };
    }
}
const updateProspect = async (id, updates) => {
    try {
        const { data, error } = await supabase
        .from('Prospect')
        .update(updates)
        .eq('id', id);
        if (error) {
            throw error;
        }
        return { success: true, data }; 
    } catch(error) {
        return { success: false, error: error.message };
    }
}
const ProspectModel = {
    createProspect,
    fetchinactiveProspect,
    fetchActiveProspect,
    updateProspect,
}
export default ProspectModel; 