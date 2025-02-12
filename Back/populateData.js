import { supabase } from "./config/supabaseClient.js";
import { faker } from "@faker-js/faker";

// Helper function to split large datasets into smaller chunks
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {  // Removed misplaced semicolon
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Function to fetch existing EB values in bulk
const getExistingEBs = async () => {
  const { data, error } = await supabase.from("Site").select("EB");
  if (error) {
    console.error("❌ Error fetching Site EB values:", error.message);
    return new Set();
  }
  return new Set(data.map(site => site.EB));
};

// Insert data in chunks
const insertDataInChunks = async (table, data, chunkSize = 100) => {
  const chunks = chunkArray(data, chunkSize);
  for (const chunk of chunks) {
    console.log(`📌 Inserting into ${table} - ${chunk.length} rows`);
    const { error } = await supabase.from(table).insert(chunk);
    if (error) {
      console.error(`❌ Error inserting data into ${table}:`, error.message, error.details);
    } else {
      console.log(`✅ Successfully inserted ${chunk.length} rows into ${table}`);
    }
  }
};

const createDataForReport = async () => {
  try {
    console.log("🚀 Fetching existing Site EB values...");
    const existingEBs = await getExistingEBs();

    if (existingEBs.size === 0) {
      console.error("❌ No existing sites found. Ensure sites are inserted first.");
      return;
    }

    const preEtudes = [];
    const paiements = [];
    const travaux = [];
    const mes = [];

    let idCounter = 100000; // Starting unique ID counter for bigint values

    // Loop through existing EB values (Sites)
    for (const EB of existingEBs) {
      for (let j = 0; j < faker.number.int({ min: 1, max: 5 }); j++) {
        idCounter++; // Ensure unique IDs for bigint

        // Create PreEtude entry
        const preEtude = {
          PREid: idCounter, // bigint ID
          ADPDT: faker.number.float({ min: 1, max: 100, precision: 0.1 }),
          CRR: faker.number.float({ min: 1, max: 100, precision: 0.1 }),
          CRP_HTABT: faker.number.float({ min: 1, max: 100, precision: 0.1 }),
          CRRBTA: faker.number.float({ min: 1, max: 100, precision: 0.1 }),
          is_active: faker.datatype.boolean(),
          MM: faker.number.float({ min: 1, max: 100, precision: 0.1 }),
          type_rac: faker.helpers.arrayElement(["Simple", "Complexe"]),
          cout: faker.number.float({ min: 100, max: 1000, precision: 0.01 }),
          EB_fk: EB,
          ZFA: faker.datatype.boolean(),
          ZFB: faker.datatype.boolean(),
          Prid_fk: faker.number.int({ min: 101, max: 199 }),
        };
        preEtudes.push(preEtude);

        // Create Paiement entry
        const paiement = {
          Pid: idCounter, // bigint ID
          is_active: true,
          libelle_du_virement: faker.lorem.words(3),
          montant: faker.number.float({ min: 1000, max: 10000, precision: 0.01 }),
          no_devis: faker.number.int({ min: 101, max: 199 }),
          EB_fk: EB,
          reglement_date: faker.date.past(),
          no_virement: faker.string.alphanumeric(12), // Added no_virement (text)
        };
        paiements.push(paiement);

        // Create Travaux entry
        const travauxItem = {
          Tid: idCounter, // bigint ID
          is_active: true,
          EB_fk: EB,
        };
        travaux.push(travauxItem);

        // Create MES entry
        const mesItem = {
          MESid: idCounter, // bigint ID
          is_active: true,
          EB_fk: EB,
          no_PDL: faker.string.alphanumeric(10), // Added no_PDL (text)
        };
        mes.push(mesItem);
      }
    }

    // Bulk insert selected tables
    // await insertDataInChunks("PreEtude", preEtudes);
    // await insertDataInChunks("Paiements", paiements);
    // await insertDataInChunks("Traveaux", travaux);
    await insertDataInChunks("MES", mes);

    console.log("🎉 All data successfully inserted!");
  } catch (error) {
    console.error("❌ Error populating data:", error.message);
  }
};

createDataForReport();
