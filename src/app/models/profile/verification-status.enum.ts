import { Injectable } from "@angular/core";
export enum VerificationStateEnum {
  PENDING,
  VERIFIED,
  NOT_VERIFIED,
  REJECT,
  BLOCKED,
}

@Injectable({
  providedIn: "root",
})
export class VerificationStateEnumFormatter {
  public format(verificationStateEnum: VerificationStateEnum): string {
    switch (verificationStateEnum as VerificationStateEnum) {
      case VerificationStateEnum.BLOCKED:
        return "Blocked";
      case VerificationStateEnum.NOT_VERIFIED:
        return "Not Verified";
      case VerificationStateEnum.PENDING:
        return "Pending";
      case VerificationStateEnum.REJECT:
        return "Rejected";
      case VerificationStateEnum.VERIFIED:
        return "Verified";
      default:
        return "UNKNOWN";
    }
  }

  public formatVerificationState(verificationStateEnum: any): string {
    switch (verificationStateEnum) {
      case "BLOCKED":
        return "Blocked";
      case "NOT_VERIFIED":
        return "Not Verified";
      case "PENDING":
        return "Pending";
      case "REJECT":
        return "Rejected";
      case "VERIFIED":
        return "Verified";
      default:
        return "UNKNOWN";
    }
  }
}
