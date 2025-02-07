import { supabase } from "./config/supabaseClient.js"
import { faker } from "@faker-js/faker"


const CHUNK_SIZE = 10

const validateAndCleanData = (item) => ({
  EB: String(item.EB),
  G2R: String(item.G2R),
  nom: String(item.nom),
  Ville: String(item.Ville),
  priorite_fk: Number(item.priorite_fk),
  lot: String(item.lot),
  programme_fk: Number(item.programme_fk),
  status_site_fk: Number(item.status_site_fk),
  is_active: Boolean(item.is_active),
  code_postal: String(item.code_postal),
  zone: String(item.zone),
  region: String(item.region),
  Acteur_ENEDIS_id: Number(item.Acteur_ENEDIS_id),
  status_site_SFR: String(item.status_site_SFR),
  contact_fk: Number(item.contact_fk),
  Operateurs: Array.isArray(item.Operateurs) ? item.Operateurs : ["SFR"],
  commentaires: item.commentaires === undefined ? null : String(item.commentaires),
  entreprise: item.entreprise === undefined ? null : String(item.entreprise),
})

const insertSingleRecord = async (table, record) => {
  try {
    const { data, error } = await supabase.from(table).insert([record])

    if (error) {
      console.error(`❌ Error inserting record:`, error.message)
      console.error("Error details:", error.details)
      console.error("Problematic record:", JSON.stringify(record, null, 2))
      return false
    }

    return true
  } catch (err) {
    console.error("🚨 Unexpected error during insertion:", err)
    return false
  }
}

const verifyInsertion = async (table) => {
  try {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })

    if (error) {
      console.error("❌ Error verifying insertion:", error.message)
      return 0
    }

    return count
  } catch (err) {
    console.error("🚨 Unexpected error during verification:", err)
    return 0
  }
}

const createDataForReport = async () => {
  try {
    const initialCount = await verifyInsertion("Site")
    console.log(`Initial record count: ${initialCount}`)

    let successCount = 0

    for (let i = 0; i < 1000; i++) {
      const siteId = i + 1
      const site = validateAndCleanData({
        EB: `EB${siteId}`,
        G2R: `G2R${faker.number.int({ min: 100000, max: 999999 })}`,
        nom: faker.company.name(),
        Ville: faker.location.city(),
        priorite_fk: faker.number.int({ min: 1, max: 4 }),
        lot: faker.word.noun(),
        programme_fk: faker.number.int({ min: 1, max: 14 }),
        status_site_fk: faker.number.int({ min: 1, max: 3 }),
        is_active: true,
        code_postal: faker.location.zipCode("#####"),
        zone: faker.location.state(),
        region: faker.location.state(),
        Acteur_ENEDIS_id: faker.number.int({ min: 1, max: 6 }),
        status_site_SFR: faker.helpers.arrayElement([
          "0.Bloquée/Suspendu MAD",
          "0.Bloquée/Suspendu Conv",
          "0.Bloquée/Suspendu DP",
          "1.En Recherche",
          "2.En validation",
          "3.Validé",
          "3.En Conception",
          "4.En cours conception",
          "4.GO Constr. Anticipé",
          "5.En attente visées FH",
          "5.GO Constructibilité",
          "6.GO Constructibilité",
          "6.Mad Infra",
          "7.GO Constructibilité Anticipé",
          "7.MES",
          "8.Annulé",
          "8.PEM",
          "En service",
        ]),
        contact_fk: faker.number.int({ min: 1, max: 56 }),
        Operateurs: ["SFR"],
      })

      const success = await insertSingleRecord("Site", site)
      if (success) {
        successCount++
        if (successCount % CHUNK_SIZE === 0) {
          console.log(`✅ Inserted ${successCount} records`)
        }
      }

      // Add a small delay between insertions to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log(`✅ Insertion completed. ${successCount} records inserted.`)

    const finalCount = await verifyInsertion("Site")
    console.log(`Final record count: ${finalCount}`)
    console.log(`Net new records: ${finalCount - initialCount}`)

    // Get a sample of recently inserted records
    const { data: sampleData, error: sampleError } = await supabase
      .from("Site")
      .select("*")
      .order("EB", { ascending: false })
      .limit(1)

    if (!sampleError && sampleData?.length > 0) {
      console.log("📊 Sample of recently inserted record:", JSON.stringify(sampleData[0], null, 2))
    } else if (sampleError) {
      console.error("Error fetching sample:", sampleError)
    }
  } catch (error) {
    console.error("❌ Error populating data:", error.message, error.stack)
  }
}

// Execute the main function
;(async () => {
  console.log("🚀 Starting data insertion process...")
  await createDataForReport()
  console.log("✅ Process completed")
})()