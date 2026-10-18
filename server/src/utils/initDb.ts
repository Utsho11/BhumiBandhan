import { pool } from "./pg";
import { syntheticLandParcels, syntheticMutations } from "../data/land-records";

export async function initDatabase() {
  try {
    const client = await pool.connect();
    console.log("\x1b[34m[PostgreSQL] Connected to database: bhumibandhan\x1b[0m");

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name_bn VARCHAR(100) NOT NULL,
        name_en VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(30) NOT NULL,
        nid_masked VARCHAR(50),
        phone_masked VARCHAR(50),
        office_bn VARCHAR(150),
        designation_bn VARCHAR(150),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create land_parcels table
    await client.query(`
      CREATE TABLE IF NOT EXISTS land_parcels (
        ulpin VARCHAR(50) PRIMARY KEY,
        division_bn VARCHAR(50),
        district_bn VARCHAR(50),
        upazila_bn VARCHAR(50),
        mouza_bn VARCHAR(50),
        jl_no VARCHAR(20),
        dag_no VARCHAR(20),
        current_khatian_no VARCHAR(50),
        khatian_type VARCHAR(20),
        land_class_bn VARCHAR(50),
        total_area_satak NUMERIC(10, 2),
        total_area_katha NUMERIC(10, 2),
        is_khas BOOLEAN DEFAULT FALSE,
        is_acquired_by_govt BOOLEAN DEFAULT FALSE,
        has_litigation BOOLEAN DEFAULT FALSE,
        is_locked BOOLEAN DEFAULT FALSE,
        pending_deed_no VARCHAR(50),
        trust_score INT,
        risk_level VARCHAR(20),
        data_json JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create mutation_applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS mutation_applications (
        application_id VARCHAR(50) PRIMARY KEY,
        token VARCHAR(50) UNIQUE NOT NULL,
        ulpin VARCHAR(50),
        dag_no VARCHAR(20),
        khatian_no VARCHAR(50),
        applicant_name_bn VARCHAR(100),
        applicant_nid_masked VARCHAR(50),
        applicant_phone_masked VARCHAR(50),
        deed_no VARCHAR(50),
        deed_date VARCHAR(30),
        transferred_area_satak NUMERIC(10, 2),
        current_stage VARCHAR(50),
        hearing_date VARCHAR(30),
        ac_land_office_bn VARCHAR(150),
        remarks_bn TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create bank_liens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bank_liens (
        lien_id VARCHAR(50) PRIMARY KEY,
        dag_no VARCHAR(20),
        bank_name_bn VARCHAR(100),
        bank_name_en VARCHAR(100),
        branch_name VARCHAR(100),
        loan_account_number VARCHAR(100),
        mortgage_amount_bdt NUMERIC(15, 2),
        issue_date VARCHAR(30),
        status VARCHAR(20),
        deed_mortgaged_no VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create user_saved_parcels table for Citizen Panel
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_saved_parcels (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50),
        ulpin VARCHAR(50),
        dag_no VARCHAR(20),
        notes TEXT,
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if parcels need seeding
    const parcelCountRes = await client.query("SELECT COUNT(*) FROM land_parcels;");
    if (parseInt(parcelCountRes.rows[0].count, 10) === 0) {
      console.log("\x1b[33m[PostgreSQL] Seeding initial synthetic land parcels...\x1b[0m");
      for (const p of syntheticLandParcels) {
        await client.query(
          `INSERT INTO land_parcels (
            ulpin, division_bn, district_bn, upazila_bn, mouza_bn, jl_no, dag_no,
            current_khatian_no, khatian_type, land_class_bn, total_area_satak,
            total_area_katha, is_khas, is_acquired_by_govt, has_litigation,
            is_locked, pending_deed_no, trust_score, risk_level, data_json
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
          ON CONFLICT (ulpin) DO NOTHING;`,
          [
            p.ulpin,
            p.divisionBn,
            p.districtBn,
            p.upazilaBn,
            p.mouzaBn,
            p.jlNo,
            p.dagNo,
            p.currentKhatianNo,
            p.khatianType,
            p.landClassBn,
            p.totalAreaSatak,
            p.totalAreaKatha,
            p.isKhas,
            p.isAcquiredByGovt,
            p.hasLitigation,
            p.transitLock.isLocked,
            p.transitLock.pendingDeedNo || null,
            p.trustScore,
            p.riskLevel,
            JSON.stringify(p),
          ]
        );
      }
    }

    // Check if mutations need seeding
    const mutationCountRes = await client.query("SELECT COUNT(*) FROM mutation_applications;");
    if (parseInt(mutationCountRes.rows[0].count, 10) === 0) {
      console.log("\x1b[33m[PostgreSQL] Seeding initial mutation records...\x1b[0m");
      for (const m of syntheticMutations) {
        await client.query(
          `INSERT INTO mutation_applications (
            application_id, token, ulpin, dag_no, khatian_no, applicant_name_bn,
            applicant_nid_masked, applicant_phone_masked, deed_no, deed_date,
            transferred_area_satak, current_stage, hearing_date, ac_land_office_bn, remarks_bn
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (application_id) DO NOTHING;`,
          [
            m.applicationId,
            m.token,
            m.ulpin,
            m.dagNo,
            m.khatianNo,
            m.applicantNameBn,
            m.applicantNidMasked,
            m.applicantPhoneMasked,
            m.deedNo,
            m.deedDate,
            m.transferredAreaSatak,
            m.currentStage,
            m.hearingDate || null,
            m.acLandOfficeBn,
            m.remarksBn,
          ]
        );
      }
    }

    // Seed mock official users
    await client.query(`
      INSERT INTO users (id, name_bn, name_en, email, password, role, office_bn, designation_bn)
      VALUES 
        ('USR-001', 'তানভীর আহমেদ', 'Tanvir Ahmed', 'citizen@bhumibandhan.gov.bd', 'password123', 'citizen', NULL, 'সাধারণ নাগরিক (জমি ক্রেতা)'),
        ('USR-002', 'জনাব মাহমুদ হাসান', 'Mr. Mahmud Hasan', 'acland@bhumibandhan.gov.bd', 'password123', 'ac_land', 'সাভার উপজেলা ভূমি অফিস', 'সহকারী কমিশনার (ভূমি) / এসি ল্যান্ড'),
        ('USR-003', 'জনাব রফিকুল আলম', 'Mr. Rafiqul Alam', 'subreg@bhumibandhan.gov.bd', 'password123', 'sub_registrar', 'সাভার সাব-রেজিস্ট্রার কার্যালয়', 'সাব-রেজিস্ট্রার'),
        ('USR-004', 'ফারহানা ইয়াসমিন', 'Farhana Yasmin', 'bank@bhumibandhan.gov.bd', 'password123', 'bank_officer', 'সোনালী ব্যাংক পিএলসি, সাভার শাখা', 'সিনিয়র প্রিন্সিপাল অফিসার (ক্রেডিট)'),
        ('USR-005', 'সিস্টেম অ্যাডমিনিস্ট্রেটর', 'System Administrator', 'admin@bhumibandhan.gov.bd', 'password123', 'admin', 'ভূমি ব্যবস্থাপনা অটোমেশন সেল', 'প্রধান সিস্টেম অ্যানালিস্ট')
      ON CONFLICT (id) DO NOTHING;
    `);

    client.release();
    console.log("\x1b[32m✔ [PostgreSQL] Database schema initialized and seeded successfully!\x1b[0m");
  } catch (error: any) {
    console.warn("\x1b[33m[PostgreSQL] Connection warning (running with resilient storage fallback):\x1b[0m", error.message);
  }
}
