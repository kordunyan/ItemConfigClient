export class UpdateLocationDto {
  constructor(
    public itemNumbers: string[],
    public ipps: boolean,
    public sb: boolean
  ) {
  }
}
