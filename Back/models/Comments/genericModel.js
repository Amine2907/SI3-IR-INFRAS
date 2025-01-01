import { supabase } from "../../config/supabaseClient.js";
class GenericModel {
    constructor(tableName) {
      this.tableName = tableName;
    }
  
    async findAll() {
      const { data, error } = await supabase.from(this.tableName).select('*');
      if (error) throw new Error(error.message);
      return data;
    }
  
    async findById(id) {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
  
    async create(payload) {
      const { data, error } = await supabase.from(this.tableName).insert([payload]);
      if (error) throw new Error(error.message);
      return data;
    }
  
    async update(id, payload) {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(payload)
        .eq('id', id);
      if (error) throw new Error(error.message);
      return data;
    }
  
    async delete(id) {
      const { data, error } = await supabase.from(this.tableName).delete().eq('id', id);
      if (error) throw new Error(error.message);
      return data;
    }
  }
  
  export default GenericModel;