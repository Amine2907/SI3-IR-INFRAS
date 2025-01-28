import { supabase } from "./config/supabaseClient.js";
import { faker } from "@faker-js/faker";

// Helper function to split large datasets into smaller chunks
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};
// Convert a JavaScript array to a PostgreSQL-compatible array literal
const toPostgresArray = (array) => `{${array.join(",")}}`;

// Insert data in chunks to avoid memory issues
const insertDataInChunks = async (table, data, chunkSize = 100) => {
  const chunks = chunkArray(data, chunkSize);
  for (const chunk of chunks) {
    const { error } = await supabase.from(table).insert(chunk);
    if (error) {
      console.error(`Error inserting data into ${table}:`, error.message, error.details, chunk);
    } else {
      console.log(`Successfully inserted ${chunk.length} rows into ${table}`);
    }
  }
};

const createDataForReport = async () => {
  try {
    const sites = [];
    const prospects = [];
    const dps = [];
    const preEtudes = [];
    const drs = [];
    const devis = [];
    const paiements = [];
    const travaux = [];
    const mes = [];
    const factures = [];

    const statusSiteSFValues = [
      "0.Bloquée/Suspendu MAD", "0.Bloquée/Suspendu Conv", "0.Bloquée/Suspendu DP",
      "1.En Recherche", "2.En validation", "3.Validé", "3.En Conception",
      "4.En cours conception", "4.GO Constr. Anticipé", "5.En attente visées FH",
      "5.GO Constructibilité", "6.GO Constructibilité", "6.Mad Infra",
      "7.GO Constructibilité Anticipé", "7.MES", "8.Annulé", "8.PEM", "En service",
    ];
    const typeRacValues = ["Simple", "Complexe", "A Renseigner"];
    const ops = ["SFR", "ORANGE", "FREE", "Bouygues Telecom"];

    // Generate Sites
    for (let i = 0; i < 1000; i++) {
      const siteId = i + 1;
      const site = {
        EB: siteId,
        G2R: faker.number.int({ min: 10000, max: 99999 }).toString(),
        nom: faker.company.name(),
        Ville: faker.location.city(),
        priorite_fk: faker.number.int({ min: 1, max: 4 }),
        lot: faker.word.noun(),
        programme_fk: faker.number.int({ min: 1, max: 14 }),
        status_site_fk: faker.number.int({ min: 1, max: 3 }),
        is_active: true,
        code_postal: faker.location.zipCode("#####"),
        zone: faker.location.street(),
        region: faker.location.state(),
        Acteur_ENEDIS_id: faker.number.int({ min: 1, max: 6 }),
        Operateurs: toPostgresArray(
          faker.helpers.arrayElements(ops, faker.number.int({ min: 1, max: 4 }))
        ),
        status_site_SFR: faker.helpers.arrayElement(statusSiteSFValues),
        contact_fk: faker.number.int({ min: 1, max: 56 }),
      };
      sites.push(site);

      // Generate related data for each Site
      for (let j = 0; j < faker.number.int({ min: 1, max: 5 }); j++) {
        const prospectId = i * 10 + j + 1;

        const prospect = {
          Proid: prospectId,
          nom: faker.person.fullName(),
          status_validation_fk: faker.number.int({ min: 1, max: 26 }),
          retenu: faker.datatype.boolean(),
          is_active: true,
          commentaires: faker.lorem.sentence(),
          cout_estime: faker.number.float({ min: 1000, max: 10000, precision: 0.01 }),
          EB_fk: siteId,
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
          parcelle: faker.word.noun(),
          section: faker.word.noun(),
          status_site_sfr: faker.helpers.arrayElement(statusSiteSFValues),
        };
        prospects.push(prospect);

        const dp = {
          DPid: i * 10 + j + 1,
          PRid_fk: prospectId,
          ANO_certificat_tacite: faker.date.past(),
          arrete_opposition: faker.date.past(),
          commentaires: faker.lorem.sentence(),
          derniere_verification: faker.date.past(),
          etat_prerequis: faker.number.int({ min: 1, max: 2 }),
          is_active: true,
          MJS: faker.date.past(),
          numero_DP: faker.number.int({ min: 1000, max: 9999 }).toString(),
          plans: faker.word.noun(),
          production_DP_PC: faker.date.past(),
          recipisse_depot_DP: faker.date.past(),
          relance: faker.datatype.boolean(),
          status_go_traveauxP: faker.date.past(),
          status_go_traveauxR: faker.date.past(),
          EB_fk: siteId,
        };
        dps.push(dp);

        const preEtude = {
          PREid: i * 10 + j + 1,
          ADPDT: faker.number.float({ min: 1, max: 100, precision: 0.1 }),
          CRR: faker.number.float({ min: 1, max: 100, precision: 0.1 }),
          CRP_HTABT: faker.number.float({ min: 1, max: 100, precision: 0.1 }),
          CRRBTA: faker.number.float({ min: 1, max: 100, precision: 0.1 }),
          is_active: true,
          MM: faker.number.float({ min: 1, max: 100, precision: 0.1 }),
          type_rac: faker.helpers.arrayElement(typeRacValues),
          pdf_url: faker.internet.url(),
          cout: faker.number.float({ min: 100, max: 1000, precision: 0.01 }),
          EB_fk: siteId,
          ZFA: faker.datatype.boolean(),
          ZFB: faker.datatype.boolean(),
          Prid_fk: prospectId,
          commentaires: faker.lorem.sentence(),
        };
        preEtudes.push(preEtude);

        const dr = {
          NDRid: i * 10 + j + 1,
          Pro_fk: prospectId,
          SPRid_FK: faker.number.int({ min: 1, max: 2 }),
          date_dr: faker.date.past(),
          Ko_Dp: faker.date.past(),
          drdc: faker.date.past(),
          relance_complexite: faker.word.noun(),
          extension_reseau_syndicat: faker.word.noun(),
          date_dr_syndicat: faker.date.past(),
          is_active: true,
          commentaires: faker.lorem.sentence(),
          gestionnaire_de_reseau: faker.number.int({ min: 1, max: 56 }),
          type_rac: faker.helpers.arrayElement(typeRacValues),
          operators: faker.helpers.arrayElement(ops),
          EB_fk: siteId,
          fin_trav_prev: faker.date.future(),
        };
        drs.push(dr);

        const devisItem = {
          ND: i * 10 + j + 1,
          devis_date: faker.date.past(),
          montant: faker.number.float({ min: 1000, max: 50000, precision: 0.01 }),
          code_paiement: faker.string.alphanumeric(10),
          reception_date: faker.date.past(),
          expiration_date: faker.date.past(),
          conformite: faker.datatype.boolean(),
          validation_date: faker.date.past(),
          envoi_date: faker.date.past(),
          is_active: true,
          EB_fk: siteId,
          type_devis: faker.helpers.arrayElement([
            "Extension ENEDIS",
            "Branchement",
            "Estimatif SYNDICAT",
            "Definitif SYNDICAT",
          ]),
          fournisseur: faker.number.int({ min: 1, max: 56 }),
          derniere_relance_date: faker.date.past(),
        };
        devis.push(devisItem);

        const paiement = {
          Pid: i * 10 + j + 1,
          is_active: true,
          libelle_du_virement: faker.lorem.words(3),
          montant: faker.number.float({ min: 1000, max: 10000, precision: 0.01 }),
          no_commande: faker.number.int({ min: 1000, max: 9999 }).toString(),
          no_devis: devisItem.ND,
          EB_fk: siteId,
          reglement_date: faker.date.past(),
          commentaires: faker.lorem.sentence(),
        };
        paiements.push(paiement);

        const travauxItem = {
          Tid: i * 10 + j + 1,
          levee_pylone_prev: faker.date.future(),
          levee_pylone_reel: faker.date.future(),
          extension_prev: faker.date.future(),
          extension_reel: faker.date.future(),
          branchement_prev: faker.date.future(),
          branchement_reel: faker.date.future(),
          raccordement_prev: faker.date.future(),
          raccordement_reel: faker.date.future(),
          is_active: true,
          commentaires: faker.lorem.sentence(),
          EB_fk: siteId,
        };
        travaux.push(travauxItem);

        const mesItem = {
          MESid: i * 10 + j + 1,
          consuel_remise: faker.date.future(),
          MES_demande: faker.date.future(),
          MES_prev: faker.date.future(),
          MES_reel: faker.date.future(),
          is_active: true,
          commentaires: faker.lorem.sentence(),
          EB_fk: siteId,
        };
        mes.push(mesItem);

        const facture = {
          Fid: i * 10 + j + 1,
          facture_date: faker.date.past(),
          is_active: true,
          montant_ht: faker.number.float({ min: 1000, max: 10000, precision: 0.01 }),
          montant_ttc: faker.number.float({ min: 1200, max: 12000, precision: 0.01 }),
          tva: faker.number.float({ min: 5, max: 25, precision: 0.01 }),
          EB_fk: siteId,
        };
        factures.push(facture);
      }
    }

    await insertDataInChunks("Site", sites);
    await insertDataInChunks("Prospect", prospects);
    await insertDataInChunks("DP", dps);
    await insertDataInChunks("PreEtude", preEtudes);
    await insertDataInChunks("DR", drs);
    await insertDataInChunks("Devis", devis);
    await insertDataInChunks("Paiements", paiements);
    await insertDataInChunks("Traveaux", travaux);
    await insertDataInChunks("MES", mes);
    await insertDataInChunks("Facture", factures);

    console.log("Data population completed successfully!");
  } catch (error) {
    console.error("Error populating data:", error.message, error.stack);
  }
};

createDataForReport();
