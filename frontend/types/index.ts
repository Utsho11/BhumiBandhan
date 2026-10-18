export interface IOwnerShare {
  ownerId: string;
  nameBn: string;
  nameEn: string;
  fatherNameBn: string;
  nidMasked: string;
  shareAnna: string;
  shareDecimal: number;
  portionSatak: number;
}

export interface IBayaDeedNode {
  surveyType: "CS" | "SA" | "RS" | "BS";
  year: number;
  khatianNo: string;
  dagNo: string;
  recordedOwnerBn: string;
  recordedOwnerEn: string;
  transferredBy?: string;
  deedNo?: string;
  deedDate?: string;
  status: "verified" | "disputed" | "pending";
  notesBn: string;
}

export interface IBankLien {
  lienId: string;
  bankNameBn: string;
  bankNameEn: string;
  branchName: string;
  loanAccountNumber: string;
  mortgageAmountBdt: number;
  issueDate: string;
  status: "active" | "released";
  deedMortgagedNo: string;
}

export interface ILandParcel {
  ulpin: string;
  divisionBn: string;
  divisionEn: string;
  districtBn: string;
  districtEn: string;
  upazilaBn: string;
  upazilaEn: string;
  mouzaBn: string;
  mouzaEn: string;
  jlNo: string;
  dagNo: string;
  currentKhatianNo: string;
  khatianType: "BS" | "RS" | "SA" | "CS";
  landClassBn: string;
  landClassEn: string;
  totalAreaSatak: number;
  totalAreaKatha: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  owners: IOwnerShare[];
  bayaChain: IBayaDeedNode[];
  liens: IBankLien[];
  isKhas: boolean;
  isAcquiredByGovt: boolean;
  hasLitigation: boolean;
  transitLock: {
    isLocked: boolean;
    lockedUntil?: string;
    subRegistryOffice?: string;
    pendingDeedNo?: string;
    buyerNameBn?: string;
  };
  trustScore: number;
  riskLevel: "safe" | "moderate" | "critical";
  riskSummaryBn: string[];
  riskSummaryEn: string[];
}

export interface IMutationApplication {
  applicationId: string;
  token: string;
  ulpin: string;
  dagNo: string;
  khatianNo: string;
  applicantNameBn: string;
  applicantNidMasked: string;
  applicantPhoneMasked: string;
  deedNo: string;
  deedDate: string;
  transferredAreaSatak: number;
  appliedDate: string;
  currentStage: "submitted" | "tehsil_review" | "surveyor_inspection" | "hearing_scheduled" | "approved" | "rejected";
  hearingDate?: string;
  acLandOfficeBn: string;
  remarksBn: string;
}
