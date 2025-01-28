import { supabase } from "./config/supabaseClient.js";
import { faker } from "@faker-js/faker";

// Helper to chunk data for bulk insertion
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Insert data in chunks to avoid memory issues
const insertDataInChunks = async (table, data, chunkSize = 100) => {
  const chunks = chunkArray(data, chunkSize);
  for (const chunk of chunks) {
    const { error } = await supabase.from(table).insert(chunk);
    if (error) {
      console.error(`Error inserting data into ${table}:`, error.message, error.details);
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
      const EB = faker.string.uuid();
      const site = {
        EB,
        G2R: faker.string.uuid(),
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
        Operateurs: `{${faker.helpers.arrayElements(ops).join(",")}}`,
        status_site_SFR: faker.helpers.arrayElement(statusSiteSFValues),
        contact_fk: faker.number.int({ min: 1, max: 56 }),
      };
      sites.push(site);

      // Generate related data for each Site
      for (let j = 0; j < faker.number.int({ min: 1, max: 5 }); j++) {
        const Proid = faker.string.uuid();
        const prospect = {
          Proid,
          nom: faker.person.fullName(),
          status_validation_fk: faker.number.int({ min: 1, max: 26 }),
          retenu: faker.datatype.boolean(),
          is_active: true,
          commentaires: faker.lorem.sentence(),
          cout_estime: faker.finance.amount(1000, 10000, 2),
          EB_fk: EB,
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
          parcelle: faker.word.noun(),
          section: faker.word.noun(),
          status_site_sfr: faker.helpers.arrayElement(statusSiteSFValues),
        };
        prospects.push(prospect);

        // Generate DPs
        const dp = {
          DPid: faker.string.uuid(),
          PRid_fk: Proid,
          ANO_certificat_tacite: faker.date.past(),
          arrete_opposition: faker.date.past(),
          commentaires: faker.lorem.sentence(),
          derniere_verification: faker.date.past(),
          etat_prerequis: faker.number.int({ min: 1, max: 2 }),
          is_active: true,
          MJS: faker.date.past(),
          numero_DP: faker.string.uuid(),
          plans: faker.word.noun(),
          production_DP_PC: faker.date.past(),
          recipisse_depot_DP: faker.date.past(),
          relance: faker.datatype.boolean(),
          status_go_traveauxP: faker.date.past(),
          status_go_traveauxR: faker.date.past(),
          EB_fk: EB,
        };
        dps.push(dp);

        // Generate PreEtudes
        const preEtude = {
          PREid: faker.string.uuid(),
          ADPDT: faker.number.float({ min: 1, max: 100 }),
          CRR: faker.number.float({ min: 1, max: 100 }),
          CRP_HTABT: faker.number.float({ min: 1, max: 100 }),
          CRRBTA: faker.number.float({ min: 1, max: 100 }),
          is_active: true,
          MM: faker.number.float({ min: 1, max: 100 }),
          type_rac: faker.helpers.arrayElement(typeRacValues),
          pdf_url: faker.internet.url(),
          cout: faker.number.float({ min: 100, max: 1000 }),
          EB_fk: EB,
          ZFA: faker.datatype.boolean(),
          ZFB: faker.datatype.boolean(),
          Prid_fk: Proid,
          commentaires: faker.lorem.sentence(),
        };
        preEtudes.push(preEtude);

        // Generate DRs
        const dr = {
          NDRid: faker.string.uuid(),
          Pro_fk: Proid,
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
          EB_fk: EB,
          fin_trav_prev: faker.date.future(),
        };
        drs.push(dr);

        // Generate Devis
        const devisItem = {
          ND: faker.string.uuid(),
          devis_date: faker.date.past(),
          montant: faker.finance.amount(1000, 50000, 2),
          code_paiement: faker.string.alphanumeric(10),
          reception_date: faker.date.past(),
          expiration_date: faker.date.past(),
          conformite: faker.datatype.boolean(),
          validation_date: faker.date.past(),
          envoi_date: faker.date.past(),
          is_active: true,
          EB_fk: EB,
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

        // Generate Paiements
        const paiement = {
          Pid: faker.number.int({ min: 1, max: 1000000 }),
          is_active: true,
          libelle_du_virement: faker.lorem.words(3),
          montant: faker.finance.amount(1000, 10000, 2),
          no_commande: faker.string.uuid(),
          no_devis: devisItem.ND,
          EB_fk: EB,
          reglement_date: faker.date.past(),
          commentaires: faker.lorem.sentence(),
        };
        paiements.push(paiement);

        // Generate Travaux
        const travauxItem = {
          Tid: faker.string.uuid(),
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
          EB_fk: EB,
        };
        travaux.push(travauxItem);

        // Generate MES
        const mesData = {
          MESid: faker.string.uuid(),
          consuel_remise: faker.date.future(),
          MES_demande: faker.date.future(),
          MES_prev: faker.date.future(),
          MES_reel: faker.date.future(),
          is_active: true,
          commentaires: faker.lorem.sentence(),
          EB_fk: EB,
        };
        mes.push(mesData);

        // Generate Factures
        const facture = {
          Fid: faker.string.uuid(),
          facture_date: faker.date.past(),
          is_active: true,
          montant_ht: faker.finance.amount(1000, 10000, 2),
          montant_ttc: faker.finance.amount(1200, 12000, 2),
          tva: faker.finance.amount(5, 25, 2),
          EB_fk: EB,
        };
        factures.push(facture);
      }
    }

    // Insert data into tables
    await insertDataInChunks("Site", sites, 100);
    await insertDataInChunks("Prospect", prospects, 100);
    await insertDataInChunks("DP", dps, 100);
    await insertDataInChunks("PreEtude", preEtudes, 100);
    await insertDataInChunks("DR", drs, 100);
    await insertDataInChunks("Devis", devis, 100);
    await insertDataInChunks("Paiements", paiements, 100);
    await insertDataInChunks("Travaux", travaux, 100);
    await insertDataInChunks("MES", mes, 100);
    await insertDataInChunks("Facture", factures, 100);

    console.log("Data population completed successfully!");
  } catch (error) {
    console.error("Error populating data:", error.message);
  }
};

createDataForReport();
