import { IBankLien, syntheticLandParcels } from "../../../data/land-records";

export const getPlotLiens = async (dagNo: string) => {
  const parcel = syntheticLandParcels.find((p) => p.dagNo === dagNo);
  if (!parcel) return [];
  return parcel.liens;
};

export const registerBankLien = async (payload: {
  dagNo: string;
  bankNameBn: string;
  bankNameEn: string;
  branchName: string;
  loanAccountNumber: string;
  mortgageAmountBdt: number;
  deedMortgagedNo: string;
}) => {
  const parcel = syntheticLandParcels.find((p) => p.dagNo === payload.dagNo);
  if (!parcel) {
    return {
      success: false,
      messageBn: "উক্ত দাগ নম্বর ডাটাবেজে খুঁজে পাওয়া যায়নি।",
    };
  }

  const newLien: IBankLien = {
    lienId: `LIEN-${Date.now().toString().slice(-6)}`,
    bankNameBn: payload.bankNameBn,
    bankNameEn: payload.bankNameEn,
    branchName: payload.branchName,
    loanAccountNumber: payload.loanAccountNumber,
    mortgageAmountBdt: payload.mortgageAmountBdt,
    issueDate: new Date().toISOString().split("T")[0],
    status: "active",
    deedMortgagedNo: payload.deedMortgagedNo,
  };

  parcel.liens.push(newLien);
  parcel.riskLevel = "moderate";
  parcel.trustScore = Math.max(10, parcel.trustScore - 30);

  return {
    success: true,
    lien: newLien,
    updatedParcel: parcel,
  };
};

export const releaseBankLien = async (dagNo: string, lienId: string) => {
  const parcel = syntheticLandParcels.find((p) => p.dagNo === dagNo);
  if (!parcel) return null;

  const lien = parcel.liens.find((l) => l.lienId === lienId);
  if (!lien) return null;

  lien.status = "released";
  // Recalculate
  const hasOtherActiveLiens = parcel.liens.some((l) => l.status === "active");
  if (!hasOtherActiveLiens) {
    parcel.trustScore = Math.min(100, parcel.trustScore + 30);
  }

  return { lien, parcel };
};
