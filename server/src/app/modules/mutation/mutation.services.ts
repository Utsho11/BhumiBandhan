import { pool } from "../../../utils/pg";
import { IMutationApplication, syntheticMutations } from "../../../data/land-records";

let mutationsStore = [...syntheticMutations];

export const getMutations = async (status?: string) => {
  try {
    let sql = "SELECT * FROM mutation_applications";
    const params: any[] = [];
    if (status) {
      params.push(status);
      sql += " WHERE current_stage = $1";
    }
    sql += " ORDER BY created_at DESC;";
    const res = await pool.query(sql, params);
    if (res.rows.length > 0) {
      return res.rows.map((r) => ({
        applicationId: r.application_id,
        token: r.token,
        ulpin: r.ulpin,
        dagNo: r.dag_no,
        khatianNo: r.khatian_no,
        applicantNameBn: r.applicant_name_bn,
        applicantNidMasked: r.applicant_nid_masked,
        applicantPhoneMasked: r.applicant_phone_masked,
        deedNo: r.deed_no,
        deedDate: r.deed_date,
        transferredAreaSatak: parseFloat(r.transferred_area_satak),
        currentStage: r.current_stage,
        hearingDate: r.hearing_date,
        acLandOfficeBn: r.ac_land_office_bn,
        remarksBn: r.remarks_bn,
        appliedDate: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : "2026-10-18",
      })) as IMutationApplication[];
    }
  } catch (error) {
    console.warn("DB query failed, fallback:", error);
  }

  if (status) {
    return mutationsStore.filter((m) => m.currentStage === status);
  }
  return mutationsStore;
};

export const getMutationByTokenOrId = async (token: string) => {
  try {
    const res = await pool.query(
      "SELECT * FROM mutation_applications WHERE token = $1 OR application_id = $1 LIMIT 1;",
      [token]
    );
    if (res.rows.length > 0) {
      const r = res.rows[0];
      return {
        applicationId: r.application_id,
        token: r.token,
        ulpin: r.ulpin,
        dagNo: r.dag_no,
        khatianNo: r.khatian_no,
        applicantNameBn: r.applicant_name_bn,
        applicantNidMasked: r.applicant_nid_masked,
        applicantPhoneMasked: r.applicant_phone_masked,
        deedNo: r.deed_no,
        deedDate: r.deed_date,
        transferredAreaSatak: parseFloat(r.transferred_area_satak),
        currentStage: r.current_stage,
        hearingDate: r.hearing_date,
        acLandOfficeBn: r.ac_land_office_bn,
        remarksBn: r.remarks_bn,
        appliedDate: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : "2026-10-18",
      } as IMutationApplication;
    }
  } catch (error) {
    console.warn("DB query fallback:", error);
  }

  return mutationsStore.find((m) => m.token === token || m.applicationId === token) || null;
};

export const createMutation = async (payload: {
  ulpin: string;
  dagNo: string;
  khatianNo: string;
  applicantNameBn: string;
  applicantNidMasked: string;
  applicantPhoneMasked: string;
  deedNo: string;
  deedDate: string;
  transferredAreaSatak: number;
  acLandOfficeBn: string;
}) => {
  const newId = `MUT-APP-2026-${String(mutationsStore.length + 1).padStart(3, "0")}`;
  const newToken = `MUT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    await pool.query(
      `INSERT INTO mutation_applications (
        application_id, token, ulpin, dag_no, khatian_no, applicant_name_bn,
        applicant_nid_masked, applicant_phone_masked, deed_no, deed_date,
        transferred_area_satak, current_stage, ac_land_office_bn, remarks_bn
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'submitted', $12, 'আবেদন সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে।');`,
      [
        newId,
        newToken,
        payload.ulpin,
        payload.dagNo,
        payload.khatianNo,
        payload.applicantNameBn,
        payload.applicantNidMasked,
        payload.applicantPhoneMasked,
        payload.deedNo,
        payload.deedDate,
        payload.transferredAreaSatak,
        payload.acLandOfficeBn,
      ]
    );
  } catch (error) {
    console.warn("DB insert fallback:", error);
  }

  const newApp: IMutationApplication = {
    applicationId: newId,
    token: newToken,
    ulpin: payload.ulpin,
    dagNo: payload.dagNo,
    khatianNo: payload.khatianNo,
    applicantNameBn: payload.applicantNameBn,
    applicantNidMasked: payload.applicantNidMasked,
    applicantPhoneMasked: payload.applicantPhoneMasked,
    deedNo: payload.deedNo,
    deedDate: payload.deedDate,
    transferredAreaSatak: payload.transferredAreaSatak,
    appliedDate: new Date().toISOString().split("T")[0],
    currentStage: "submitted",
    acLandOfficeBn: payload.acLandOfficeBn,
    remarksBn: "আবেদন গৃহীত হয়েছে। প্রাথমিক পর্যালোচনার জন্য তহশিল অফিসে প্রেরণ করা হচ্ছে।",
  };

  mutationsStore.unshift(newApp);
  return newApp;
};

export const updateMutationStage = async (
  applicationId: string,
  updateData: {
    stage: IMutationApplication["currentStage"];
    hearingDate?: string;
    remarksBn?: string;
  }
) => {
  try {
    await pool.query(
      `UPDATE mutation_applications 
       SET current_stage = $1, hearing_date = COALESCE($2, hearing_date), remarks_bn = COALESCE($3, remarks_bn)
       WHERE application_id = $4 OR token = $4;`,
      [updateData.stage, updateData.hearingDate || null, updateData.remarksBn || null, applicationId]
    );
  } catch (error) {
    console.warn("DB update fallback:", error);
  }

  const index = mutationsStore.findIndex((m) => m.applicationId === applicationId || m.token === applicationId);
  if (index !== -1) {
    mutationsStore[index] = {
      ...mutationsStore[index],
      currentStage: updateData.stage,
      hearingDate: updateData.hearingDate || mutationsStore[index].hearingDate,
      remarksBn: updateData.remarksBn || mutationsStore[index].remarksBn,
    };
    return mutationsStore[index];
  }
  return null;
};
