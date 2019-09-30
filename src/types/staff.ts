export type Position = string;

export class StaffMember {
  public id?: string;

  // Display fields
  public firstName: string = "";
  public lastName: string = "";
  public email: string = "";
  public phoneNumber: string = "";
  public avatarUrl: string = "";

  public positions: Position[] = [];

  public notes: string = "";

  // Location fields
  public latlng: number[] = [];
  public displayLocation: string = "";

  public constructor(copy?: StaffMember) {
    if (copy) {
      this.id = copy.id;
      this.firstName = copy.firstName;
      this.lastName = copy.lastName;
      this.email = copy.email;
      this.phoneNumber = copy.phoneNumber;
      this.avatarUrl = copy.avatarUrl;
      this.positions = copy.positions;
      this.notes = copy.notes;
      this.latlng = copy.latlng;
      this.displayLocation = copy.displayLocation;
    }
  }
}
