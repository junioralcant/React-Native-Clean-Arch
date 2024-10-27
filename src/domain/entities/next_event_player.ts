type CreateParams = {
  id: string;
  name: string;
  isConfirmed: boolean;
  photo?: string;
  position?: string;
  confirmationDate?: Date;
};

export class NextEventPlayerEntity {
  id: string;
  name: string;
  initials: string;
  photo?: string;
  position?: string;
  isConfirmed: boolean;
  confirmationDate?: Date;

  private constructor({
    id,
    name,
    isConfirmed,
    initials,
    photo,
    position,
    confirmationDate,
  }: {
    id: string;
    name: string;
    isConfirmed: boolean;
    initials: string;
    photo?: string;
    position?: string;
    confirmationDate?: Date;
  }) {
    this.id = id;
    this.name = name;
    this.initials = initials;
    this.photo = photo;
    this.position = position;
    this.isConfirmed = isConfirmed;
    this.confirmationDate = confirmationDate;
  }

  static create({
    id,
    name,
    isConfirmed,
    photo,
    position,
    confirmationDate,
  }: CreateParams): NextEventPlayerEntity {
    const initials = NextEventPlayerEntity.getInitials(name);
    return new NextEventPlayerEntity({
      id,
      name,
      isConfirmed,
      initials,
      photo,
      position,
      confirmationDate,
    });
  }

  private static getInitials(name: string): string {
    const names = name.toUpperCase().trim().split(' ');
    const firstChar = names[0]?.charAt(0) || '-';
    const secondChar = names[0]?.charAt(1) || '';
    const lastChar =
      names.length > 1 ? names[names.length - 1]?.charAt(0) : secondChar;
    return `${firstChar}${lastChar}`;
  }
}
