import { IMutationApplication, syntheticMutations } from "../../../data/land-records";

let mutationsStore = [...syntheticMutations];

export const getMutations = async (status?: string) => {
  if (status) {
    return mutationsStore.filter((m) => m.currentStage === status);
  }
  return mutationsStore;
};

export const getMutationByTokenOrId = async (token: string) => {
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
  const index = mutationsStore.findIndex((m) => m.applicationId === applicationId || m.token === applicationId);
  if (index === -1) return null;

  mutationsStore[index] = {
    ...mutationsStore[index],
    currentStage: updateData.stage,
    hearingDate: updateData.hearingDate || mutationsStore[index].hearingDate,
    remarksBn: updateData.remarksBn || mutationsStore[index].remarksBn,
  };

  return mutationsStore[index];
};
